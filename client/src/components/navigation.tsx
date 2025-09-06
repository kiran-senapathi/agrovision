import { useState } from "react";
import { Leaf, Bell } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Navigation() {
  const [language, setLanguage] = useState("en");

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3" data-testid="logo-container">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="text-primary-foreground" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">AgroVision</h1>
              <p className="text-xs text-muted-foreground">AI Crop Doctor</p>
            </div>
          </div>

          {/* Language Toggle and Notifications */}
          <div className="flex items-center space-x-3">
            <Select value={language} onValueChange={setLanguage} data-testid="select-language">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <button className="text-muted-foreground hover:text-foreground" data-testid="button-notifications">
                <Bell size={20} />
              </button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full notification-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
