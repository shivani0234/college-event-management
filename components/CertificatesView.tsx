import { Award, Download, Star, CheckCircle2 } from 'lucide-react';
import { Registration } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface CertificatesViewProps {
  registrations: Registration[];
}

export function CertificatesView({ registrations }: CertificatesViewProps) {
  const certificates = registrations.slice(0, Math.floor(registrations.length * 0.3));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Certificates</h2>
          <p className="text-muted-foreground mt-1">Achievement Recognition</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-100 px-6 py-3 rounded-lg border border-amber-200">
          <p className="text-sm text-muted-foreground">Certificates Earned</p>
          <p className="text-3xl font-bold text-amber-600">{certificates.length}</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="p-12 text-center">
            <Award size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No certificates earned yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert, idx) => (
            <Card key={cert.id} className="hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-yellow-50">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full -mr-12 -mt-12 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-100 to-amber-100 rounded-full -ml-16 -mb-16 opacity-20"></div>
              
              <CardContent className="p-8 relative z-10">
                {/* Certificate Badge */}
                <div className="text-center mb-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center mb-4 shadow-lg">
                    <Award className="text-white" size={32} />
                  </div>
                  <Badge className="bg-amber-600 hover:bg-amber-700 mb-3">Certificate #{1000 + idx}</Badge>
                </div>

                {/* Certificate Details */}
                <div className="text-center space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">This is to certify that</p>
                  
                  <h3 className="text-xl font-bold text-foreground border-b-2 border-amber-300 pb-2">
                    {cert.studentName}
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">with Student ID</p>
                    <p className="font-mono font-bold text-foreground">{cert.studentId}</p>
                  </div>

                  <div className="bg-white/50 rounded-lg p-3 my-4 border border-amber-200">
                    <p className="text-xs text-muted-foreground mb-1">Has successfully participated in</p>
                    <p className="font-semibold text-foreground text-sm">College Event Management</p>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-amber-600 text-xs">
                    <CheckCircle2 size={14} />
                    <span>Issued: {new Date(cert.registeredAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Download Button */}
                <Button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold">
                  <Download className="mr-2 h-4 w-4" />
                  Download Certificate
                </Button>

                {/* Star Rating */}
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
