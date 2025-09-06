import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera, Folder, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner, LoadingDots, ProcessingBar } from "@/components/loading-spinner";
import { type CropDiagnosis } from "@shared/schema";

interface ImageUploadProps {
  onDiagnosis: (diagnosis: CropDiagnosis | null) => void;
}

export default function ImageUpload({ onDiagnosis }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
      // Clear preview after successful diagnosis
      setTimeout(() => {
        setPreviewUrl(null);
        setSelectedFile(null);
      }, 3000);
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
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Start diagnosis after a brief delay to show preview
      setTimeout(() => {
        diagnoseMutation.mutate(file);
      }, 500);
    } else {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use rear camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to take photos of your crops.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'crop-photo.jpg', { type: 'image/jpeg' });
            handleFileSelect(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const clearPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setSelectedFile(null);
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
        
        {isCameraActive ? (
          <div className="camera-interface rounded-lg p-4 bg-black relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-64 object-cover rounded"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <Button
                onClick={capturePhoto}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-16 h-16"
                data-testid="button-capture"
              >
                <Camera size={24} />
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="rounded-full w-16 h-16"
                data-testid="button-cancel-camera"
              >
                <X size={24} />
              </Button>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="preview-section rounded-lg p-4 bg-muted/30 relative">
            <img 
              src={previewUrl} 
              alt="Crop preview" 
              className="w-full h-64 object-cover rounded mb-4"
            />
            {diagnoseMutation.isPending ? (
              <div className="text-center py-4">
                <LoadingSpinner size="lg" text="Analyzing your crop image..." />
                <ProcessingBar text="AI is examining the plant for diseases" />
              </div>
            ) : (
              <div className="flex justify-center gap-2">
                <Button
                  onClick={clearPreview}
                  variant="outline"
                  size="sm"
                  data-testid="button-clear-preview"
                >
                  <X className="mr-2" size={16} />
                  Clear
                </Button>
              </div>
            )}
          </div>
        ) : (
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
                  startCamera();
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
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          data-testid="input-file"
        />

        {!isCameraActive && !previewUrl && selectedFile && !diagnoseMutation.isPending && (
          <div className="mt-4 p-3 bg-muted rounded-lg fade-in" data-testid="info-file-selected">
            <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
