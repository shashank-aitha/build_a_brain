import { useRef, useState, useCallback } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CameraViewProps {
  onDetection: (result: { objects: Array<{ name: string; confidence: number }>; explanation: string }) => void;
}

export const CameraView = ({ onDetection }: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  }, []);

  const captureImage = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    await processImage(imageData);
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      await processImage(imageData);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('detect-objects', {
        body: { imageData }
      });

      if (error) throw error;

      if (data) {
        onDetection(data);
        toast({
          title: "Detection Complete",
          description: `Found ${data.objects?.length || 0} objects`,
        });
      }
    } catch (error: any) {
      console.error('Detection error:', error);
      toast({
        title: "Detection Failed",
        description: error.message || "Could not process image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="relative w-full max-w-2xl aspect-video bg-card rounded-xl overflow-hidden border-2 border-primary/20 neural-glow">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {!isStreaming && !isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <Camera className="w-16 h-16 mx-auto text-primary neural-pulse" />
              <p className="text-muted-foreground">Start camera to begin detection</p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-neural-deep/90 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
              <p className="text-foreground font-display">Processing Visual Input...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {!isStreaming ? (
          <Button
            onClick={startCamera}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground neural-glow"
          >
            <Camera className="mr-2 h-5 w-5" />
            Start Camera
          </Button>
        ) : (
          <>
            <Button
              onClick={captureImage}
              disabled={isProcessing}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground neural-glow"
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Camera className="mr-2 h-5 w-5" />
              )}
              Capture & Detect
            </Button>
            <Button
              onClick={stopCamera}
              variant="secondary"
              size="lg"
            >
              Stop Camera
            </Button>
          </>
        )}
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          variant="outline"
          size="lg"
          className="border-primary/50 hover:bg-primary/10"
        >
          <Upload className="mr-2 h-5 w-5" />
          Upload Image
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
