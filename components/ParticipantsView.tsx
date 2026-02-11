import { Registration } from '../types';
import { Users, Mail, Building2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ParticipantsViewProps {
  registrations: Registration[];
}

const departmentColors: { [key: string]: string } = {
  'Computer Science': 'bg-blue-100 text-blue-800',
  'Information Technology': 'bg-purple-100 text-purple-800',
  'Electronics': 'bg-green-100 text-green-800',
  'Mechanical': 'bg-orange-100 text-orange-800',
  'Civil': 'bg-red-100 text-red-800',
};

export function ParticipantsView({ registrations }: ParticipantsViewProps) {
  const getDeptColor = (dept: string) => departmentColors[dept] || 'bg-gray-100 text-gray-800';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Participants</h2>
          <p className="text-muted-foreground mt-1">Manage all event registrations</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-6 py-3 rounded-lg border border-blue-200">
          <p className="text-sm text-muted-foreground">Total Registrations</p>
          <p className="text-3xl font-bold text-blue-600">{registrations.length}</p>
        </div>
      </div>

      {registrations.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Users size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No registrations yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {registrations.map((reg, idx) => (
            <Card key={reg.id} className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {reg.studentName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-lg">{reg.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{reg.studentId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-start gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium text-foreground">{reg.email}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Department</p>
                          <Badge className={getDeptColor(reg.department)}>{reg.department}</Badge>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Registered</p>
                          <p className="text-sm font-medium text-foreground">{new Date(reg.registeredAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 text-sm">
                      <Badge variant="outline" className="text-xs">{reg.year}</Badge>
                      <Badge variant="outline" className="text-xs">{reg.phone}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
