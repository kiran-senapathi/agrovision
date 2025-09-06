import { useState } from "react";
import Navigation from "@/components/navigation";
import ScanButton from "@/components/scan-button";
import ImageUpload from "@/components/image-upload";
import TreatmentRecommendations from "@/components/treatment-recommendations";
import VoiceAssistant from "@/components/voice-assistant";
import WeatherCard from "@/components/weather-card";
import DiseaseAlerts from "@/components/disease-alerts";
import FarmerProfile from "@/components/farmer-profile";
import QuickActions from "@/components/quick-actions";
import MarketplaceGrid from "@/components/marketplace-grid";
import { Leaf, Search, FlaskConical, Shield } from "lucide-react";

export default function Home() {
  const [currentDiagnosis, setCurrentDiagnosis] = useState(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Protect Your Crops with AI
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Instantly identify crop diseases, get treatment recommendations, and connect with local agricultural experts.
            </p>
          </div>

          <ScanButton />

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="text-primary" size={20} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Instant Diagnosis</h3>
              <p className="text-sm text-muted-foreground">Get disease identification in seconds</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FlaskConical className="text-secondary" size={20} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Treatment Plans</h3>
              <p className="text-sm text-muted-foreground">Organic & chemical solutions</p>
            </div>
            
            <div className="bg-card rounded-xl p-6 text-center shadow-sm border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="text-accent" size={20} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Voice Support</h3>
              <p className="text-sm text-muted-foreground">Available in Odia & English</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              <ImageUpload onDiagnosis={setCurrentDiagnosis} />
              <TreatmentRecommendations diagnosis={currentDiagnosis} />
              <VoiceAssistant />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <WeatherCard />
              <DiseaseAlerts />
              <FarmerProfile />
              <QuickActions />
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Agricultural Marketplace</h2>
            <p className="text-muted-foreground">Find trusted suppliers and agricultural stores near you</p>
          </div>
          <MarketplaceGrid />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="text-primary-foreground" size={16} />
              </div>
              <span className="text-lg font-bold text-foreground">AgroVision</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Empowering farmers with AI-powered crop disease detection</p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-privacy">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-terms">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-support">Support</a>
              <a href="#" className="hover:text-primary transition-colors" data-testid="link-about">About</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
