import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScanButtonProps {
  onClick?: () => void;
}

export default function ScanButton({ onClick }: ScanButtonProps) {
  const handleScanClick = () => {
    const uploadSection = document.getElementById('image-upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
      // Add a subtle highlight effect
      uploadSection.classList.add('ring-2', 'ring-primary', 'ring-opacity-50');
      setTimeout(() => {
        uploadSection.classList.remove('ring-2', 'ring-primary', 'ring-opacity-50');
      }, 2000);
    }
    onClick?.();
  };

  return (
    <div className="flex justify-center mb-8">
      <Button 
        className="scan-button-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 px-12 rounded-2xl text-xl flex items-center space-x-4 transition-all duration-300"
        size="lg"
        onClick={handleScanClick}
        data-testid="button-scan"
      >
        <Camera size={28} />
        <span>Scan Your Crop</span>
      </Button>
    </div>
  );
}
