import { useEffect, useMemo, useRef, useState } from 'react';
import { X, ChevronDown, ChevronUp, ChevronsUpDown, Settings as SettingsIcon, Plus, Save, Trash2 } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

const OPERATORS = [
  { id: 'is', label: 'is' },
  { id: 'is_not', label: 'is not' },
  { id: 'contains', label: 'contains' },
  { id: 'gt', label: 'greater than' },
  { id: 'lt', label: 'less than' },
  { id: 'is_empty', label: 'is empty' },
];

function safeLower(v) {
  return (v ?? '').toString().toLowerCase();
}

function tryNumber(v) {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function applyFilter(rowValue, op, raw) {
  if (op === 'is_empty') return rowValue == null || String(rowValue).trim() === '';

  const filterVal = raw ?? '';
  const a = rowValue ?? '';

  if (op === 'contains') return safeLower(a).includes(safeLower(filterVal));
  if (op === 'is') return safeLower(a) === safeLower(filterVal);
  if (op === 'is_not') return safeLower(a) !== safeLower(filterVal);

  const an = tryNumber(a);
  const bn = tryNumber(filterVal);
  if (an == null || bn == null) return false;
  if (op === 'gt') return an > bn;
  if (op === 'lt') return an < bn;
  return true;
}

function cycleSort(dir) {
  if (!dir) return 'asc';
  if (dir === 'asc') return 'desc';
  return null;
}

function SortIcon({ dir }) {
  if (dir === 'asc') return <ChevronUp className="w-3.5 h-3.5" />;
  if (dir === 'desc') return <ChevronDown className="w-3.5 h-3.5" />;
  return <ChevronsUpDown className="w-3.5 h-3.5 opacity-60" />;
}

function localKey(tableId, suffix) {
  return `genyx.table.${tableId}.${suffix}`;
}

export function DataTable({
  tableId,
  title,
  subtitle,
  data,
  columns,
  getRowId,
  bulkActions = [],
  renderDetailPanel,
  defaultViews = [],
  initialPageSize = 25,
  className,
}) {
  // columns: { id, header, accessor(row)->value, cell?(row)->node, sortable?, filterable?, width?, defaultVisible? }
  const colById = useMemo(() => Object.fromEntries(columns.map(c => [c.id, c])), [columns]);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState([]);

  // sorting: array of { id, dir }
  const [sorts, setSorts] = useState([]);

  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem(localKey(tableId, 'pageSize'));
    return saved ? Number(saved) : initialPageSize;
  });
  const [page, setPage] = useState(1);

  const [detailRow, setDetailRow] = useState(null);
  const [selected, setSelected] = useState(() => new Set());

  // column visibility + ordering
  const [colOrder, setColOrder] = useState(() => {
    const saved = localStorage.getItem(localKey(tableId, 'colOrder'));
    if (saved) return JSON.parse(saved);
    return columns.map(c => c.id);
  });
  const [hiddenCols, setHiddenCols] = useState(() => {
    const saved = localStorage.getItem(localKey(tableId, 'hiddenCols'));
    if (saved) return new Set(JSON.parse(saved));
    return new Set(columns.filter(c => c.defaultVisible === false).map(c => c.id));
  });

  const [showColMenu, setShowColMenu] = useState(false);
  const colMenuRef = useRef(null);

  // saved views (tabs)
  const [views, setViews] = useState(() => {
    const saved = localStorage.getItem(localKey(tableId, 'views'));
    if (saved) return JSON.parse(saved);
    return defaultViews;
  });
  const [activeViewId, setActiveViewId] = useState(() => {
    const saved = localStorage.getItem(localKey(tableId, 'activeView'));
    return saved || (defaultViews[0]?.id ?? 'default');
  });
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  useEffect(() => {
    localStorage.setItem(localKey(tableId, 'hiddenCols'), JSON.stringify(Array.from(hiddenCols)));
  }, [hiddenCols, tableId]);

  useEffect(() => {
    localStorage.setItem(localKey(tableId, 'colOrder'), JSON.stringify(colOrder));
  }, [colOrder, tableId]);

  useEffect(() => {
    localStorage.setItem(localKey(tableId, 'pageSize'), String(pageSize));
  }, [pageSize, tableId]);

  useEffect(() => {
    localStorage.setItem(localKey(tableId, 'views'), JSON.stringify(views));
    localStorage.setItem(localKey(tableId, 'activeView'), activeViewId);
  }, [activeViewId, tableId, views]);

  useEffect(() => {
    function onDoc(e) {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target)) setShowColMenu(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // apply active view
  useEffect(() => {
    const v = views.find(x => x.id === activeViewId);
    if (!v) return;
    if (v.state?.filters) setFilters(v.state.filters);
    if (v.state?.sorts) setSorts(v.state.sorts);
    if (v.state?.hiddenCols) setHiddenCols(new Set(v.state.hiddenCols));
    if (v.state?.colOrder) setColOrder(v.state.colOrder);
    if (v.state?.pageSize) setPageSize(v.state.pageSize);
    setPage(1);
    setSelected(new Set());
  }, [activeViewId]); // intentional

  const orderedCols = useMemo(() => {
    const ids = colOrder.filter(id => colById[id]);
    const rest = columns.map(c => c.id).filter(id => !ids.includes(id));
    return [...ids, ...rest].map(id => colById[id]).filter(Boolean).filter(c => !hiddenCols.has(c.id));
  }, [colById, colOrder, columns, hiddenCols]);

  const filtered = useMemo(() => {
    if (!filters.length) return data;
    return data.filter(row => {
      return filters.every(f => {
        const col = colById[f.columnId];
        if (!col) return true;
        const v = col.accessor(row);
        return applyFilter(v, f.op, f.value);
      });
    });
  }, [colById, data, filters]);

  const sorted = useMemo(() => {
    if (!sorts.length) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      for (const s of sorts) {
        const col = colById[s.id];
        if (!col) continue;
        const av = col.sortValue ? col.sortValue(a) : col.accessor(a);
        const bv = col.sortValue ? col.sortValue(b) : col.accessor(b);
        const dir = s.dir === 'asc' ? 1 : -1;

        // handle dates/numbers/strings
        const ad = av instanceof Date ? av.getTime() : null;
        const bd = bv instanceof Date ? bv.getTime() : null;
        if (ad != null && bd != null && ad !== bd) return (ad - bd) * dir;

        const an = typeof av === 'number' ? av : tryNumber(av);
        const bn = typeof bv === 'number' ? bv : tryNumber(bv);
        if (an != null && bn != null && an !== bn) return (an - bn) * dir;

        const as = safeLower(av);
        const bs = safeLower(bv);
        if (as !== bs) return as.localeCompare(bs) * dir;
      }
      return 0;
    });
    return arr;
  }, [colById, filtered, sorts]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const pageRows = sorted.slice(startIdx, endIdx);

  useEffect(() => {
    setPage(1);
  }, [pageSize, filters, sorts]);

  const allVisibleRowIds = useMemo(() => pageRows.map(r => getRowId(r)), [getRowId, pageRows]);
  const allChecked = allVisibleRowIds.length > 0 && allVisibleRowIds.every(id => selected.has(id));
  const someChecked = allVisibleRowIds.some(id => selected.has(id)) && !allChecked;

  const toggleAll = () => {
    setSelected(prev => {
      const next = new Set(prev);
      if (allChecked) {
        allVisibleRowIds.forEach(id => next.delete(id));
      } else {
        allVisibleRowIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onHeaderSort = (e, colId) => {
    const isShift = e.shiftKey;
    setSorts(prev => {
      const existingIdx = prev.findIndex(s => s.id === colId);
      const nextDir = cycleSort(existingIdx >= 0 ? prev[existingIdx].dir : null);
      let next = [...prev];

      if (!isShift) next = [];

      if (existingIdx >= 0) {
        next.splice(existingIdx, 1);
      }
      if (nextDir) {
        next.push({ id: colId, dir: nextDir });
      }
      return next;
    });
  };

  const addFilter = () => {
    const first = columns.find(c => c.filterable !== false) || columns[0];
    setFilters(prev => [...prev, { id: crypto.randomUUID(), columnId: first.id, op: 'contains', value: '' }]);
    setShowFilters(true);
  };

  const removeFilter = (id) => setFilters(prev => prev.filter(f => f.id !== id));

  const activeFilterChips = useMemo(() => {
    return filters.map(f => {
      const col = colById[f.columnId];
      const op = OPERATORS.find(o => o.id === f.op)?.label || f.op;
      const val = f.op === 'is_empty' ? '' : (f.value ?? '');
      return { id: f.id, label: `${col?.header ?? f.columnId} ${op}${val ? ` "${val}"` : ''}` };
    });
  }, [colById, filters]);

  const saveCurrentView = () => {
    const name = saveName.trim();
    if (!name) return;
    const id = `view-${Date.now()}`;
    const next = [
      ...views,
      {
        id,
        name,
        state: {
          filters,
          sorts,
          hiddenCols: Array.from(hiddenCols),
          colOrder,
          pageSize,
        },
      },
    ];
    setViews(next);
    setActiveViewId(id);
    setShowSaveModal(false);
    setSaveName('');
  };

  const deleteView = (id) => {
    setViews(prev => prev.filter(v => v.id !== id));
    if (activeViewId === id) setActiveViewId(views[0]?.id ?? 'default');
  };

  const startDrag = (e, colId) => {
    e.dataTransfer.setData('text/plain', colId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (e, targetId) => {
    e.preventDefault();
    const fromId = e.dataTransfer.getData('text/plain');
    if (!fromId || fromId === targetId) return;
    setColOrder(prev => {
      const arr = prev.filter(id => id !== fromId);
      const idx = arr.indexOf(targetId);
      arr.splice(idx < 0 ? arr.length : idx, 0, fromId);
      return arr;
    });
  };

  const bulkBar = selected.size > 0;

  return (
    <div className={className}>
      <Card className="overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-dark-border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <p className="text-sm font-black text-gray-900 dark:text-dark-text uppercase tracking-tight">{title}</p>}
            {subtitle && <p className="text-[10px] font-bold text-gray-400 dark:text-dark-text-secondary uppercase tracking-widest mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              className="h-10 text-[10px] font-black uppercase tracking-widest gap-2"
              onClick={() => setShowFilters(v => !v)}
            >
              Filter
              {filters.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black px-1.5">
                  {filters.length}
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-10 text-[10px] font-black uppercase tracking-widest gap-2"
              onClick={() => setShowSaveModal(true)}
            >
              <Save className="w-4 h-4" />
              Save View
            </Button>

            <div className="relative" ref={colMenuRef}>
              <Button
                variant="outline"
                size="sm"
                className="h-10 text-[10px] font-black uppercase tracking-widest gap-2"
                onClick={() => setShowColMenu(v => !v)}
              >
                <SettingsIcon className="w-4 h-4" />
                Columns
              </Button>
              {showColMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-xl overflow-hidden z-20">
                  <div className="p-3 border-b border-gray-100 dark:border-dark-border text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-secondary">
                    Show / hide columns
                  </div>
                  <div className="p-3 max-h-64 overflow-y-auto space-y-2">
                    {columns.map(c => {
                      const checked = !hiddenCols.has(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-dark-text-secondary">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setHiddenCols(prev => {
                                const next = new Set(prev);
                                if (next.has(c.id)) next.delete(c.id);
                                else next.add(c.id);
                                return next;
                              });
                            }}
                          />
                          {c.header}
                        </label>
                      );
                    })}
                    <p className="pt-2 text-[10px] font-bold text-gray-400 dark:text-dark-text-muted">
                      Drag column headers to reorder.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Saved views tabs */}
        <div className="px-6 py-3 border-b border-gray-50 dark:border-dark-border flex items-center gap-2 overflow-x-auto">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => setActiveViewId(v.id)}
              className={`h-8 rounded-full border px-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${
                activeViewId === v.id
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-dark-text-secondary border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-elevated'
              }`}
            >
              <span className="flex items-center gap-2">
                {v.name}
                {v.deletable !== false && (
                  <span
                    role="button"
                    onClick={(e) => { e.stopPropagation(); deleteView(v.id); }}
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 hover:bg-white/30"
                    title="Delete view"
                  >
                    <X className="w-3 h-3" />
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Filter chips */}
        {activeFilterChips.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-50 dark:border-dark-border flex flex-wrap gap-2">
            {activeFilterChips.map(ch => (
              <span key={ch.id} className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-dark-text-secondary">
                {ch.label}
                <button onClick={() => removeFilter(ch.id)} className="text-gray-400 hover:text-gray-700 dark:hover:text-dark-text">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Filter builder */}
        {showFilters && (
          <div className="px-6 py-4 border-b border-gray-50 dark:border-dark-border space-y-3 bg-gray-50/40 dark:bg-dark-bg/40">
            {filters.map(f => (
              <div key={f.id} className="flex flex-col sm:flex-row gap-2 items-stretch">
                <select
                  value={f.columnId}
                  onChange={(e) => setFilters(prev => prev.map(x => x.id === f.id ? { ...x, columnId: e.target.value } : x))}
                  className="h-10 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-dark-text"
                >
                  {columns.filter(c => c.filterable !== false).map(c => (
                    <option key={c.id} value={c.id}>{c.header}</option>
                  ))}
                </select>
                <select
                  value={f.op}
                  onChange={(e) => setFilters(prev => prev.map(x => x.id === f.id ? { ...x, op: e.target.value } : x))}
                  className="h-10 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-dark-text"
                >
                  {OPERATORS.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                <input
                  value={f.value}
                  disabled={f.op === 'is_empty'}
                  onChange={(e) => setFilters(prev => prev.map(x => x.id === f.id ? { ...x, value: e.target.value } : x))}
                  className="flex-1 h-10 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 text-sm font-bold text-gray-900 dark:text-dark-text disabled:opacity-50"
                  placeholder="Value…"
                />
                <Button variant="outline" size="sm" className="h-10 px-3" onClick={() => removeFilter(f.id)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2" onClick={addFilter}>
              <Plus className="w-4 h-4" />
              Add Filter
            </Button>
          </div>
        )}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 dark:text-dark-text-secondary uppercase bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
                <tr>
                  <th className="px-4 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={(el) => { if (el) el.indeterminate = someChecked; }}
                      onChange={toggleAll}
                    />
                  </th>
                  {orderedCols.map((c) => {
                    const sort = sorts.find(s => s.id === c.id);
                    return (
                      <th
                        key={c.id}
                        draggable
                        onDragStart={(e) => startDrag(e, c.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => onDrop(e, c.id)}
                        className={`px-4 py-4 font-black tracking-[2px] whitespace-nowrap ${c.sortable === false ? '' : 'cursor-pointer select-none'}`}
                        style={c.width ? { width: c.width } : undefined}
                        onClick={(e) => {
                          if (c.sortable === false) return;
                          onHeaderSort(e, c.id);
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          {c.header}
                          {c.sortable === false ? null : <SortIcon dir={sort?.dir ?? null} />}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {pageRows.map((row) => {
                  const rid = getRowId(row);
                  const checked = selected.has(rid);
                  return (
                    <tr
                      key={rid}
                      className="bg-white dark:bg-dark-card hover:bg-gray-50/80 dark:hover:bg-dark-elevated/50 transition-colors cursor-pointer"
                      onClick={() => {
                        if (renderDetailPanel) setDetailRow(row);
                      }}
                    >
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" checked={checked} onChange={() => toggleOne(rid)} />
                      </td>
                      {orderedCols.map((c) => (
                        <td key={c.id} className="px-4 py-4">
                          {c.cell ? c.cell(row) : String(c.accessor(row) ?? '—')}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-secondary">
              Rows per page
            </span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-9 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 text-xs font-black uppercase tracking-widest text-gray-700 dark:text-dark-text"
            >
              {[25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-dark-text-secondary">
              Showing {total === 0 ? 0 : startIdx + 1}–{endIdx} of {total} results
            </span>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest" onClick={() => setPage(1)} disabled={currentPage === 1}>First</Button>
            <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹ Prev</Button>

            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const base = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
              const n = base + i;
              if (n > totalPages) return null;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`h-9 w-9 rounded-xl border text-[10px] font-black uppercase tracking-widest ${
                    n === currentPage
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-dark-surface text-gray-600 dark:text-dark-text-secondary border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-elevated'
                  }`}
                >
                  {n}
                </button>
              );
            })}

            <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next ›</Button>
            <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>Last</Button>
          </div>
        </div>
      </Card>

      {/* Bulk actions bar */}
      {bulkBar && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(900px,calc(100%-2rem))] rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface shadow-2xl dark:shadow-black/40 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-none text-[10px] font-black uppercase tracking-widest px-3 py-1">
              {selected.size} rows selected
            </Badge>
            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-700 dark:hover:text-dark-text" onClick={() => setSelected(new Set())}>
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            {bulkActions.map((a) => (
              <Button
                key={a.label}
                size="sm"
                className="h-9 text-[10px] font-black uppercase tracking-widest gap-2"
                onClick={() => a.onClick(Array.from(selected))}
              >
                {a.icon ? <a.icon className="w-4 h-4" /> : null}
                {a.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Save view modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4" onClick={() => setShowSaveModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-border shadow-2xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-dark-text">Save View</p>
              <button onClick={() => setShowSaveModal(false)} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-elevated text-gray-400 dark:text-dark-text-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full h-11 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-input px-4 text-sm font-bold text-gray-900 dark:text-dark-text"
              placeholder="View name…"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>Cancel</Button>
              <Button onClick={saveCurrentView} className="gap-2"><Save className="w-4 h-4" /> Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Detail panel */}
      {detailRow && renderDetailPanel && (
        <div className="fixed inset-0 z-[55] flex justify-end bg-gray-900/50 backdrop-blur-sm" onClick={() => setDetailRow(null)}>
          <div
            className="bg-white dark:bg-dark-surface shadow-2xl dark:shadow-black/50 w-full max-w-md h-full overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 dark:border-dark-border flex items-center justify-between sticky top-0 bg-white/95 dark:bg-dark-surface/95 backdrop-blur z-10">
              <p className="text-[11px] font-black uppercase tracking-[3px] text-gray-900 dark:text-dark-text">Details</p>
              <button onClick={() => setDetailRow(null)} className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-elevated text-gray-400 dark:text-dark-text-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              {renderDetailPanel(detailRow)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

