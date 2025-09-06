import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { User, Medal, Shield, Star } from "lucide-react";
import { type Farmer } from "@shared/schema";

export default function FarmerProfile() {
  const { data: farmer, isLoading } = useQuery<Farmer>({
    queryKey: ['/api/farmers'],
  });

  if (isLoading) {
    return (
      <Card data-testid="card-profile-loading">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded mb-3 w-3/4"></div>
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2 w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case 'early_adopter':
        return <Medal className="text-chart-4" size={16} />;
      case 'crop_protector':
        return <Shield className="text-primary" size={16} />;
      case 'pest_defender':
        return <Star className="text-accent" size={16} />;
      default:
        return <Medal className="text-muted-foreground" size={16} />;
    }
  };

  const getAchievementColor = (achievement: string) => {
    switch (achievement) {
      case 'early_adopter':
        return 'bg-chart-4/20';
      case 'crop_protector':
        return 'bg-primary/20';
      case 'pest_defender':
        return 'bg-accent/20';
      default:
        return 'bg-muted/20';
    }
  };

  return (
    <Card data-testid="card-farmer-profile">
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <User className="text-primary mr-2" size={20} />
          Farmer Profile
        </h3>
        
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <User className="text-primary" size={24} />
          </div>
          <div>
            <h4 className="font-medium text-foreground" data-testid="text-farmer-name">
              {farmer?.name || "Farmer"}
            </h4>
            <p className="text-sm text-muted-foreground" data-testid="text-farmer-location">
              {farmer?.location || "Location"}
            </p>
          </div>
        </div>
        
        {/* Health Score */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Health Score</span>
            <span className="text-sm font-medium text-primary" data-testid="text-health-score">
              {farmer?.healthScore || 0}/100
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${farmer?.healthScore || 0}%` }}
              data-testid="progress-health-score"
            ></div>
          </div>
        </div>
        
        {/* Achievements */}
        {farmer?.achievements && farmer.achievements.length > 0 && (
          <div className="mt-4" data-testid="section-achievements">
            <p className="text-sm font-medium text-foreground mb-2">Achievements</p>
            <div className="flex space-x-2">
              {farmer.achievements.map((achievement, index) => (
                <div 
                  key={index} 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getAchievementColor(achievement)}`}
                  title={achievement.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  data-testid={`badge-${achievement}`}
                >
                  {getAchievementIcon(achievement)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
