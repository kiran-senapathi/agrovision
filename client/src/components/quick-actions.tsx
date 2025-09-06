import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, History, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QuickActions() {
  const { toast } = useToast();

  const handleStoresClick = () => {
    toast({
      title: "Nearby Stores",
      description: "Store locator feature coming soon!",
    });
  };

  const handleHistoryClick = () => {
    toast({
      title: "Scan History",
      description: "Diagnosis history feature coming soon!",
    });
  };

  const handleHelpClick = () => {
    toast({
      title: "Help & Support",
      description: "Support center will be available soon!",
    });
  };

  return (
    <Card data-testid="card-quick-actions">
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <Button 
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-muted/80 p-3"
            onClick={handleStoresClick}
            data-testid="button-nearby-stores"
          >
            <Store className="text-secondary mr-3" size={20} />
            Find Nearby Stores
          </Button>
          <Button 
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-muted/80 p-3"
            onClick={handleHistoryClick}
            data-testid="button-scan-history"
          >
            <History className="text-accent mr-3" size={20} />
            View Scan History
          </Button>
          <Button 
            variant="ghost"
            className="w-full justify-start text-foreground hover:bg-muted/80 p-3"
            onClick={handleHelpClick}
            data-testid="button-help"
          >
            <HelpCircle className="text-chart-4 mr-3" size={20} />
            Help & Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
