import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { type DiseaseAlert } from "@shared/schema";

export default function DiseaseAlerts() {
  const { data: alerts = [], isLoading } = useQuery<DiseaseAlert[]>({
    queryKey: ['/api/alerts/Odisha'],
  });

  if (isLoading) {
    return (
      <Card data-testid="card-alerts-loading">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded mb-3 w-3/4"></div>
            <div className="space-y-3">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'bg-destructive/10 border-destructive/20 text-destructive';
      case 'medium':
        return 'bg-chart-4/10 border-chart-4/20 text-chart-4';
      case 'low':
        return 'bg-accent/10 border-accent/20 text-accent';
      default:
        return 'bg-muted/10 border-border text-muted-foreground';
    }
  };

  return (
    <Card data-testid="card-disease-alerts">
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <AlertTriangle className="text-chart-4 mr-2" size={20} />
          Disease Alerts
        </h3>
        
        {alerts.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">No active disease alerts in your area</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`rounded-lg p-3 border ${getRiskColor(alert.riskLevel)}`}
                data-testid={`alert-${alert.disease.toLowerCase().replace(' ', '-')}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm text-foreground">{alert.disease}</h4>
                  <span className={`text-xs capitalize ${getRiskColor(alert.riskLevel)}`}>
                    {alert.riskLevel} Risk
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
                {alert.reportCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.reportCount} report{alert.reportCount > 1 ? 's' : ''} nearby
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
