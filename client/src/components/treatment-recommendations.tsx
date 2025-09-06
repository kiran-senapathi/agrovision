import { Card, CardContent } from "@/components/ui/card";
import { Leaf, FlaskConical, Shield } from "lucide-react";
import { type CropDiagnosis } from "@shared/schema";

interface TreatmentRecommendationsProps {
  diagnosis: CropDiagnosis | null;
}

export default function TreatmentRecommendations({ diagnosis }: TreatmentRecommendationsProps) {
  if (!diagnosis) {
    return (
      <Card data-testid="card-treatment-empty">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <FlaskConical className="text-secondary mr-3" size={24} />
            Treatment Recommendations
          </h3>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Upload a crop image to get treatment recommendations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const organicTreatments = diagnosis.treatments.filter((_, index) => index < 3);
  const chemicalTreatments = diagnosis.treatments.filter((_, index) => index >= 3 && index < 6);
  const preventionTips = [
    "Maintain proper spacing between plants",
    "Water at soil level, avoid wetting leaves", 
    "Regular field monitoring"
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'mild':
      case 'low':
        return 'text-chart-4 bg-chart-4/10 border-chart-4/20';
      case 'moderate':
      case 'medium':
        return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'severe':
      case 'high':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  return (
    <Card data-testid="card-treatment-recommendations">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <FlaskConical className="text-secondary mr-3" size={24} />
          Treatment Recommendations
        </h3>

        {/* Disease Info */}
        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-foreground" data-testid="text-disease-name">{diagnosis.disease}</h4>
              <p className="text-sm text-muted-foreground">
                Confidence: {Math.round((diagnosis.confidence || 0) * 100)}%
              </p>
            </div>
            <div className={`px-3 py-1 rounded text-sm font-medium ${getSeverityColor(diagnosis.severity)}`} data-testid="badge-severity">
              {diagnosis.severity}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Organic Treatment */}
          {organicTreatments.length > 0 && (
            <div className="bg-chart-4/10 border border-chart-4/20 rounded-lg p-4" data-testid="section-organic">
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <Leaf className="text-chart-4 mr-2" size={16} />
                Organic Treatment
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {organicTreatments.map((treatment, index) => (
                  <li key={index}>• {treatment}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Chemical Treatment */}
          {chemicalTreatments.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4" data-testid="section-chemical">
              <h4 className="font-medium text-foreground mb-2 flex items-center">
                <FlaskConical className="text-destructive mr-2" size={16} />
                Chemical Treatment
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {chemicalTreatments.map((treatment, index) => (
                  <li key={index}>• {treatment}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Prevention */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4" data-testid="section-prevention">
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              <Shield className="text-accent mr-2" size={16} />
              Prevention Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {preventionTips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
