import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Volume2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState<Array<{user: string, ai: string, language: string}>>([]);
  const { toast } = useToast();

  const voiceMutation = useMutation({
    mutationFn: async ({ text, language }: { text: string, language: string }) => {
      const response = await apiRequest('POST', '/api/voice/process', { text, language });
      return response.json();
    },
    onSuccess: (data) => {
      setConversation(prev => [...prev, {
        user: data.processedText,
        ai: data.response,
        language: data.language
      }]);
    },
    onError: () => {
      toast({
        title: "Voice Processing Failed", 
        description: "Unable to process voice input. Please try again.",
        variant: "destructive"
      });
    }
  });

  const startRecording = async () => {
    try {
      // Mock voice recording - in real implementation, use Web Speech API
      setIsRecording(true);
      
      // Simulate recording delay
      setTimeout(() => {
        setIsRecording(false);
        // Simulate different voice inputs
        const mockInputs = [
          { text: "What's wrong with my tomato plant?", language: "en" },
          { text: "ମୋର ଟମାଟୋ ଗଛରେ କଣ ସମସ୍ୟା?", language: "or" },
          { text: "How do I treat early blight?", language: "en" },
          { text: "What's the weather forecast?", language: "en" }
        ];
        
        const randomInput = mockInputs[Math.floor(Math.random() * mockInputs.length)];
        voiceMutation.mutate(randomInput);
      }, 2000);
      
    } catch (error) {
      setIsRecording(false);
      toast({
        title: "Recording Failed",
        description: "Unable to access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card data-testid="card-voice-assistant">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <Mic className="text-accent mr-3" size={24} />
          Voice Assistant
        </h3>
        
        <div className="text-center space-y-4">
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto cursor-pointer transition-colors ${
              isRecording 
                ? 'bg-destructive/20 animate-pulse' 
                : 'bg-accent/10 hover:bg-accent/20'
            }`}
            onClick={startRecording}
            data-testid="button-voice-record"
          >
            <Mic className="text-accent" size={36} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {isRecording ? "Listening..." : "Tap to speak in Odia or English"}
            </p>
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={startRecording}
              disabled={isRecording || voiceMutation.isPending}
              data-testid="button-start-conversation"
            >
              {isRecording ? "Recording..." : "Start Conversation"}
            </Button>
          </div>
        </div>
        
        {/* Conversation History */}
        {conversation.length > 0 && (
          <div className="mt-6 space-y-3 max-h-60 overflow-y-auto" data-testid="section-conversation">
            {conversation.map((exchange, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Mic className="text-accent mr-2" size={14} />
                    <span className="text-xs text-muted-foreground">
                      {exchange.language === 'or' ? 'Odia' : 'English'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{exchange.user}</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Volume2 className="text-primary mr-2" size={14} />
                    <span className="text-xs text-muted-foreground">AgroVision AI</span>
                  </div>
                  <p className="text-sm text-foreground">{exchange.ai}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
