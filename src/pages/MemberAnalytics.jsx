import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { Search, Filter, Mail, Tag, UserCheck, ShieldAlert, X, Phone, Calendar, Target, Activity, MapPin, Clock, AlertTriangle, ChevronRight, Contact, Dumbbell, PlaySquare } from 'lucide-react';

const usersData = [
  { 
    id: 1, name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+91 98765 43210', dob: '15 Aug 1994 (Age 32)', joinDate: '10 Jan 2023', emergencyContact: 'Priya Sharma (Wife) • +91 98765 00000',
    status: 'Active', formScore: '9.2 / 10', visits30d: 18, lifetimeVisits: 450, lastVisit: 'Today, 8:45 AM', consistency: 'High', preferredTrainer: 'Arjun V.', goal: 'Hypertrophy / Strength',
    biomechanics: [{ issue: 'Mild Lumbar Flexion', severity: 'Low', freq: '12% of sets' }],
    recentWorkouts: [
      { date: 'Today', time: '8:45 AM', duration: '65 min', type: 'Pull / Back', zone: 'Free Weights' },
      { date: '2 days ago', time: '7:30 AM', duration: '55 min', type: 'Push / Chest', zone: 'Free Weights' }
    ]
  },
  { 
    id: 2, name: 'Priya Patel', email: 'priya.p@example.com', phone: '+91 98222 33344', dob: '22 Nov 1998 (Age 27)', joinDate: '05 Mar 2025', emergencyContact: 'Rahul Patel (Brother) • +91 98222 11111',
    status: 'At Risk', formScore: '8.5 / 10', visits30d: 4, lifetimeVisits: 82, lastVisit: '12 days ago', consistency: 'Low', preferredTrainer: 'Unassigned', goal: 'Weight Loss',
    biomechanics: [{ issue: 'Knee Valgus (Squat)', severity: 'High', freq: '80% of reps' }],
    recentWorkouts: [
      { date: '12 days ago', time: '6:15 PM', duration: '40 min', type: 'Cardio', zone: 'Cardio Area' },
      { date: '15 days ago', time: '6:30 PM', duration: '45 min', type: 'Lower Body', zone: 'Functional Zone' }
    ]
  },
  { 
    id: 3, name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+91 99111 22233', dob: '03 Feb 1988 (Age 38)', joinDate: '12 Jul 2022', emergencyContact: 'Ritu Kumar (Wife) • +91 99111 00000',
    status: 'Active', formScore: '7.8 / 10', visits30d: 22, lifetimeVisits: 620, lastVisit: 'Yesterday, 6:30 PM', consistency: 'High', preferredTrainer: 'Sanjay M.', goal: 'General Fitness',
    biomechanics: [{ issue: 'Shoulder Impingement Risk', severity: 'Medium', freq: '45% of OH Press' }],
    recentWorkouts: [
      { date: 'Yesterday', time: '6:30 PM', duration: '75 min', type: 'Full Body', zone: 'Free Weights' },
      { date: '3 days ago', time: '6:45 PM', duration: '60 min', type: 'Cardio & Core', zone: 'Cardio Area' }
    ]
  },
  { 
    id: 4, name: 'Anjali Gupta', email: 'anjali.g@example.com', phone: '+91 98333 44455', dob: '10 May 2001 (Age 25)', joinDate: '20 Sep 2025', emergencyContact: 'Raj Gupta (Father) • +91 98333 00000',
    status: 'Inactive', formScore: 'N/A', visits30d: 0, lifetimeVisits: 14, lastVisit: '45 days ago', consistency: 'None', preferredTrainer: 'Neha S.', goal: 'Flexibility / Core',
    biomechanics: [{ issue: 'Insufficient Range of Motion', severity: 'High', freq: '100% of sets' }],
    recentWorkouts: [
      { date: '45 days ago', time: '7:00 AM', duration: '30 min', type: 'Yoga Focus', zone: 'Studio A' }
    ]
  },
  { 
    id: 5, name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 98444 55566', dob: '28 Oct 1992 (Age 33)', joinDate: '01 Apr 2024', emergencyContact: 'Anita Singh (Mother) • +91 98444 00000',
    status: 'Active', formScore: '8.9 / 10', visits30d: 14, lifetimeVisits: 310, lastVisit: '2 days ago', consistency: 'Medium', preferredTrainer: 'Sanjay M.', goal: 'Strength',
    biomechanics: [],
    recentWorkouts: [
      { date: '2 days ago', time: '6:15 AM', duration: '82 min', type: 'Leg Day', zone: 'Free Weights' },
      { date: '4 days ago', time: '6:20 AM', duration: '75 min', type: 'Push Day', zone: 'Free Weights' }
    ]
  },
  { id: 6, name: 'Sneha Reddy', email: 'sneha.r@example.com', phone: '+91 98555 66677', dob: '14 Dec 1996 (Age 29)', joinDate: '15 Aug 2023', emergencyContact: 'Karan Reddy (Husband) • +91 98555 00000', status: 'Active', formScore: '9.5 / 10', visits30d: 26, lifetimeVisits: 405, lastVisit: 'Today, 6:15 AM', consistency: 'Very High', preferredTrainer: 'Unassigned', goal: 'Endurance', biomechanics: [], recentWorkouts: [{ date: 'Today', time: '6:15 AM', duration: '45 min', type: 'HIIT', zone: 'Functional Zone' }] },
  { id: 7, name: 'Rohan Desai', email: 'rohan.d@example.com', phone: '+91 98666 77788', dob: '09 Jan 1990 (Age 36)', joinDate: '22 Feb 2025', emergencyContact: 'Meera Desai (Wife) • +91 98666 00000', status: 'At Risk', formScore: '6.5 / 10', visits30d: 6, lifetimeVisits: 45, lastVisit: '8 days ago', consistency: 'Low', preferredTrainer: 'Arjun V.', goal: 'Weight Loss', biomechanics: [{ issue: 'Rounding Back (Deadlift)', severity: 'Critical', freq: '60% of reps' }], recentWorkouts: [{ date: '8 days ago', time: '7:45 PM', duration: '50 min', type: 'Mixed', zone: 'Free Weights' }] },
  { id: 8, name: 'Pooja Joshi', email: 'pooja.j@example.com', phone: '+91 98777 88899', dob: '30 Sep 1999 (Age 26)', joinDate: '05 Nov 2024', emergencyContact: 'Suresh Joshi (Father) • +91 98777 00000', status: 'Active', formScore: '8.2 / 10', visits30d: 12, lifetimeVisits: 110, lastVisit: 'Yesterday, 8:00 AM', consistency: 'Medium', preferredTrainer: 'Neha S.', goal: 'General Fitness', biomechanics: [], recentWorkouts: [{ date: 'Yesterday', time: '8:00 AM', duration: '60 min', type: 'Cardio', zone: 'Cardio Area' }] },
];

export function MemberAnalytics() {
  const [selectedUser, setSelectedUser] = useState(null);

  const StatusBadge = ({ status }) => {
    const variants = {
      'Active': 'success',
      'At Risk': 'warning',
      'Inactive': 'secondary',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl sm:tracking-tight">
            Gym Users Directory
          </h2>
          <p className="mt-2 text-sm leading-normal text-gray-500">
            Complete list of your facility's members and their AI-tracked metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          <Button>Export List</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-start lg:items-center justify-between gap-4">
          <div>
            <CardTitle>All Members</CardTitle>
            <CardDescription>Click a member row to view full profile and actions</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
             <input type="text" placeholder="Search members..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Member Name</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Form Score</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Visits (30d)</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Last Visit</th>
                  <th className="px-6 py-4 font-medium whitespace-nowrap">Consistency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersData.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => setSelectedUser(user)}
                    className="bg-white hover:bg-gray-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#059669]/10 flex items-center justify-center text-[#059669] font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-[#059669] transition-colors whitespace-nowrap">{user.name}</p>
                          <p className="text-xs text-gray-500 whitespace-nowrap">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                    <td className="px-6 py-4 font-medium">{user.formScore}</td>
                    <td className="px-6 py-4">{user.visits30d}</td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{user.lastVisit}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${
                        user.consistency === 'High' || user.consistency === 'Very High' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 
                        user.consistency === 'Low' || user.consistency === 'None' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                        'bg-gray-50 text-gray-600 ring-gray-500/10'
                      }`}>
                        {user.consistency}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Member Details Slide-out Drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedUser(null)}>
          <div 
            className="bg-white shadow-2xl w-full max-w-md h-full overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-300" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white/95 backdrop-blur z-10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-[#059669]/10 flex items-center justify-center text-[#059669] text-xl font-bold">
                  {selectedUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500 leading-normal">{selectedUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)} 
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
               
               {/* Contact & Personal Info */}
               <div>
                  <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Contact className="w-4 h-4" /> Personal Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <span className="font-medium">{selectedUser.phone}</span></div>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> <span>{selectedUser.dob}</span></div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> <span>Joined {selectedUser.joinDate}</span></div>
                    <div className="flex items-center gap-2"><UserCheck className="w-4 h-4 text-gray-400" /> <span>Trainer: <span className="font-medium text-emerald-700">{selectedUser.preferredTrainer}</span></span></div>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-900 block">Emergency Contact</span>
                      <span className="text-gray-600">{selectedUser.emergencyContact}</span>
                    </div>
                  </div>
               </div>

               {/* Performance Stats */}
               <div>
                  <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Performance Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Form Score</p>
                      <p className="font-bold text-gray-900 text-lg">{selectedUser.formScore}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center text-center">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Lifetime Visits</p>
                      <p className="font-bold text-gray-900 text-lg">{selectedUser.lifetimeVisits}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center text-center col-span-2 sm:col-span-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Goal</p>
                      <p className="font-bold text-emerald-700 text-sm whitespace-nowrap">{selectedUser.goal}</p>
                    </div>
                  </div>
               </div>

               {/* Biomechanics Alerts */}
               {selectedUser.biomechanics && selectedUser.biomechanics.length > 0 && (
                 <div>
                    <h4 className="text-xs font-bold text-red-600 mb-3 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Biomechanics Flags
                    </h4>
                    <div className="space-y-2">
                      {selectedUser.biomechanics.map((bio, idx) => (
                        <div key={idx} className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-bold text-red-900">{bio.issue}</span>
                          <span className="text-red-700 bg-white px-2 py-0.5 rounded text-xs border border-red-200">Severity: {bio.severity} • {bio.freq}</span>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {/* Recent Workouts */}
               <div>
                  <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Dumbbell className="w-4 h-4" /> Recent Workouts
                  </h4>
                  <div className="space-y-3">
                    {selectedUser.recentWorkouts.map((workout, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-gray-100 bg-white rounded-lg shadow-sm">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{workout.type}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {workout.zone}
                          </p>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <p className="text-sm font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">{workout.duration}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{workout.date} at {workout.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Quick Actions */}
               <div className="pt-4 border-t border-gray-100">
                 <div className="grid grid-cols-2 gap-3">
                   <Button className="gap-2 justify-center w-full"><Mail className="h-4 w-4" /> Message</Button>
                   <Button variant="outline" className="gap-2 justify-center w-full"><UserCheck className="h-4 w-4" /> Follow-up</Button>
                   <Button variant="outline" className="gap-2 justify-center w-full"><Tag className="h-4 w-4" /> Tag</Button>
                   <Button variant="outline" className="gap-2 justify-center w-full text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"><ShieldAlert className="h-4 w-4" /> Flag</Button>
                 </div>
               </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
