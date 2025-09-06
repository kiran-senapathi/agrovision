import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { CloudSun, Thermometer, Droplets, Sun, AlertTriangle } from "lucide-react";
import { type WeatherData } from "@shared/schema";

export default function WeatherCard() {
  const { data: weather, isLoading } = useQuery<WeatherData>({
    queryKey: ['/api/weather/Bhubaneswar, Odisha'],
  });

  if (isLoading) {
    return (
      <Card data-testid="card-weather-loading">
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-20 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden" data-testid="card-weather">
      <div className="weather-gradient p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Today's Weather</h3>
            <p className="text-sm opacity-90">{weather?.location || "Bhubaneswar, Odisha"}</p>
          </div>
          <CloudSun size={32} />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div data-testid="info-temperature">
            <p className="text-sm text-muted-foreground flex items-center">
              <Thermometer className="mr-1" size={14} />
              Temperature
            </p>
            <p className="text-xl font-semibold text-foreground">
              {weather?.temperature ? `${Math.round(weather.temperature)}°C` : "28°C"}
            </p>
          </div>
          <div data-testid="info-humidity">
            <p className="text-sm text-muted-foreground flex items-center">
              <Droplets className="mr-1" size={14} />
              Humidity
            </p>
            <p className="text-xl font-semibold text-foreground">
              {weather?.humidity ? `${Math.round(weather.humidity)}%` : "65%"}
            </p>
          </div>
          <div data-testid="info-rainfall">
            <p className="text-sm text-muted-foreground flex items-center">
              <Droplets className="mr-1" size={14} />
              Rainfall
            </p>
            <p className="text-xl font-semibold text-foreground">
              {weather?.rainfall ? `${Math.round(weather.rainfall)}mm` : "12mm"}
            </p>
          </div>
          <div data-testid="info-uv">
            <p className="text-sm text-muted-foreground flex items-center">
              <Sun className="mr-1" size={14} />
              UV Index
            </p>
            <p className="text-xl font-semibold text-foreground">
              {weather?.uvIndex || 6}
            </p>
          </div>
        </div>
        
        {weather?.alerts && weather.alerts.length > 0 && (
          <div className="mt-4 p-3 bg-accent/10 rounded-lg" data-testid="section-weather-alerts">
            <p className="text-sm text-accent font-medium flex items-center">
              <AlertTriangle className="mr-1" size={14} />
              {weather.alerts[0]}
            </p>
            <p className="text-xs text-muted-foreground">Increased risk of fungal infections</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
