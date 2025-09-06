import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Folder } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type CropDiagnosis } from "@shared/schema";

interface ImageUploadProps {
  onDiagnosis: (diagnosis: CropDiagnosis | null) => void;
}

export default function ImageUpload({ onDiagnosis }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get farmer data for diagnosis
  const { data: farmer } = useQuery({
    queryKey: ['/api/farmers'],
  });

  const diagnoseMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      if (farmer?.id) {
        formData.append('farmerId', farmer.id);
      }
      
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to diagnose crop');
      }
      
      return response.json();
    },
    onSuccess: (diagnosis) => {
      onDiagnosis(diagnosis);
      toast({
        title: "Diagnosis Complete",
        description: `${diagnosis.disease} detected with ${Math.round(diagnosis.confidence * 100)}% confidence`,
      });
      // Invalidate farmer data to refresh profile
      queryClient.invalidateQueries({ queryKey: ['/api/farmers'] });
    },
    onError: () => {
      toast({
        title: "Diagnosis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      diagnoseMutation.mutate(file);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card data-testid="card-image-upload" id="image-upload-section">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Upload className="text-primary mr-3" size={24} />
          Crop Disease Detection
        </h3>
        
        <div
          className={`upload-zone rounded-lg p-8 text-center ${
            dragOver ? 'bg-primary/5' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          data-testid="zone-upload"
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="text-primary" size={32} />
            </div>
            <div>
              <h4 className="text-lg font-medium text-foreground">Upload Crop Image</h4>
              <p className="text-muted-foreground">Drag and drop or click to select</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement camera capture
                  toast({
                    title: "Camera Feature",
                    description: "Camera capture will be available soon. Please use file upload.",
                  });
                }}
                disabled={diagnoseMutation.isPending}
                data-testid="button-take-photo"
              >
                <Camera className="mr-2" size={16} />
                Take Photo
              </Button>
              <Button 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                onClick={openFileDialog}
                disabled={diagnoseMutation.isPending}
                data-testid="button-choose-file"
              >
                <Folder className="mr-2" size={16} />
                Choose File
              </Button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          data-testid="input-file"
        />

        {diagnoseMutation.isPending && (
          <div className="mt-4 text-center" data-testid="status-processing">
            <p className="text-primary">Analyzing your crop image...</p>
          </div>
        )}

        {selectedFile && !diagnoseMutation.isPending && (
          <div className="mt-4 p-3 bg-muted rounded-lg" data-testid="info-file-selected">
            <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
