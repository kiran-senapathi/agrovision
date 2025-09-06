import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Phone } from "lucide-react";
import { type AgriStore } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function MarketplaceGrid() {
  const { data: stores = [], isLoading } = useQuery<AgriStore[]>({
    queryKey: ['/api/stores/Odisha'],
  });

  const { toast } = useToast();

  const handleContact = (store: AgriStore) => {
    if (store.contact) {
      toast({
        title: `Contact ${store.name}`,
        description: `Phone: ${store.contact}`,
      });
    } else {
      toast({
        title: "Contact Information",
        description: "Contact details not available",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="fill-chart-4 text-chart-4" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} className="text-chart-4" />);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="text-muted-foreground" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-marketplace-loading">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="w-full h-32 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-3/4"></div>
                <div className="h-3 bg-muted rounded mb-4 w-1/2"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="text-center py-12" data-testid="message-no-stores">
        <p className="text-muted-foreground">No agricultural stores found in your area</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-marketplace">
      {stores.map((store) => (
        <Card 
          key={store.id} 
          className="hover:shadow-md transition-shadow"
          data-testid={`card-store-${store.name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <CardContent className="p-6">
            {/* Placeholder for store image */}
            <div className="w-full h-32 bg-muted/30 rounded-lg mb-4 flex items-center justify-center">
              <Store className="text-muted-foreground" size={48} />
            </div>
            
            <h3 className="font-semibold text-foreground mb-2" data-testid={`text-store-name-${store.id}`}>
              {store.name}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-2" data-testid={`text-store-description-${store.id}`}>
              {store.description}
            </p>
            
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPin className="mr-2 text-primary" size={14} />
              <span data-testid={`text-store-distance-${store.id}`}>
                {store.distance} km away
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center" data-testid={`rating-${store.id}`}>
                {renderStars(store.rating || 0)}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({store.rating?.toFixed(1) || '0.0'})
                </span>
              </div>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
                onClick={() => handleContact(store)}
                data-testid={`button-contact-${store.id}`}
              >
                <Phone className="mr-1" size={14} />
                Contact
              </Button>
            </div>
            
            {store.services && store.services.length > 0 && (
              <div className="mt-3" data-testid={`services-${store.id}`}>
                <div className="flex flex-wrap gap-1">
                  {store.services.slice(0, 3).map((service, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                    >
                      {service}
                    </span>
                  ))}
                  {store.services.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                      +{store.services.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper component for store icon when no image available
const Store = ({ className, size }: { className?: string, size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.18 2.18 0 0 1-1.2-.36l-.8-.53a2 2 0 0 0-2.4 0l-.8.53a2.18 2.18 0 0 1-2.4 0l-.8-.53a2 2 0 0 0-2.4 0l-.8.53a2.18 2.18 0 0 1-2.4 0l-.8-.53a2 2 0 0 0-2.4 0l-.8.53A2.18 2.18 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
  </svg>
);
