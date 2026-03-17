import React, { createContext, useContext, useMemo, useState } from 'react';
import { rolePermissions } from '../config/rolePermissions';
import type { Role, RolePermissions } from '../config/rolePermissions';

export type CurrentUser = {
  id: string;
  name: string;
  role: Role;
  facilityId: string;
  assignedMemberIds: number[];
  email?: string;
};

export type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Inactive';
};

type AuthContextValue = {
  currentUser: CurrentUser;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser>>;
  setRole: (role: Role) => void;
  staff: StaffUser[];
  setStaffRole: (staffId: string, role: Role) => void;
  permissionsByRole: Record<Role, RolePermissions>;
  setPermissionsByRole: React.Dispatch<React.SetStateAction<Record<Role, RolePermissions>>>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_STAFF: StaffUser[] = [
  { id: 'u-exec', name: 'Aarav Mehta', email: 'aarav@genyx.ai', role: 'executive', status: 'Active' },
  { id: 'u-fm', name: 'Sarah Miller', email: 'sarah@genyx.ai', role: 'facility_manager', status: 'Active' },
  { id: 'u-hc', name: 'Coach Priya', email: 'priya@genyx.ai', role: 'head_coach', status: 'Active' },
  { id: 'u-tr', name: 'Coach Raj', email: 'raj@genyx.ai', role: 'trainer', status: 'Active' },
  { id: 'u-fd', name: 'Front Desk', email: 'frontdesk@genyx.ai', role: 'front_desk', status: 'Active' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<StaffUser[]>(DEMO_STAFF);
  const [permissionsByRole, setPermissionsByRole] = useState<Record<Role, RolePermissions>>(rolePermissions);

  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    id: 'u-fm',
    name: 'Sarah Miller',
    email: 'sarah@genyx.ai',
    role: 'facility_manager',
    facilityId: 'loc-n1',
    assignedMemberIds: [2, 7],
  });

  const setRole = (role: Role) => {
    const match = staff.find((s) => s.role === role) || staff[0];
    setCurrentUser((u) => ({
      ...u,
      role,
      name: match?.name || u.name,
      email: match?.email || u.email,
      id: match?.id || u.id,
    }));
  };

  const setStaffRole = (staffId: string, role: Role) => {
    setStaff((prev) => prev.map((s) => (s.id === staffId ? { ...s, role } : s)));
    setCurrentUser((u) => (u.id === staffId ? { ...u, role } : u));
  };

  const value = useMemo<AuthContextValue>(
    () => ({ currentUser, setCurrentUser, setRole, staff, setStaffRole, permissionsByRole, setPermissionsByRole }),
    [currentUser, permissionsByRole, staff]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

