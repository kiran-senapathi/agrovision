import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, Volume2, MicOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState<Array<{user: string, ai: string, language: string}>>([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      console.warn('Web Speech API not supported');
    }
  }, []);

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
      // Use text-to-speech to read the response
      speakResponse(data.response, data.language);
    },
    onError: () => {
      toast({
        title: "Voice Processing Failed", 
        description: "Unable to process voice input. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Text-to-speech function
  const speakResponse = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'or' ? 'or-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startRecording = async () => {
    if (!isSupported || !recognitionRef.current) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser doesn't support speech recognition. Please type your question instead.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsRecording(true);
      const recognition = recognitionRef.current;
      
      // Set language for recognition
      recognition.lang = selectedLanguage === 'or' ? 'or-IN' : 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Speech recognized:', transcript);
        
        // Process the recognized speech
        voiceMutation.mutate({
          text: transcript,
          language: selectedLanguage
        });
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        let errorMessage = "Speech recognition failed. Please try again.";
        if (event.error === 'not-allowed') {
          errorMessage = "Microphone access denied. Please allow microphone access and try again.";
        } else if (event.error === 'no-speech') {
          errorMessage = "No speech detected. Please try speaking clearly.";
        }
        
        toast({
          title: "Recording Error",
          description: errorMessage,
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
      
    } catch (error) {
      setIsRecording(false);
      toast({
        title: "Recording Failed",
        description: "Unable to start voice recognition. Please check microphone permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  return (
    <Card data-testid="card-voice-assistant">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground flex items-center">
            <Mic className="text-accent mr-3" size={24} />
            Voice Assistant
          </h3>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage} data-testid="select-voice-language">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="or">ଓଡ଼ିଆ (Odia)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="text-center space-y-4">
          <div 
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto cursor-pointer transition-colors ${
              isRecording 
                ? 'bg-destructive/20 animate-pulse' 
                : 'bg-accent/10 hover:bg-accent/20'
            }`}
            onClick={isRecording ? stopRecording : startRecording}
            data-testid="button-voice-record"
          >
            {isRecording ? (
              <MicOff className="text-destructive" size={36} />
            ) : (
              <Mic className="text-accent" size={36} />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              {!isSupported ? "Speech recognition not supported" :
               isRecording ? "Listening... (Click to stop)" : 
               voiceMutation.isPending ? "Processing your question..." :
               `Tap to speak in ${selectedLanguage === 'or' ? 'Odia' : 'English'}`}
            </p>
            <div className="flex gap-2 justify-center">
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isSupported || voiceMutation.isPending}
                data-testid="button-start-conversation"
              >
                {isRecording ? "Stop Recording" : "Start Speaking"}
              </Button>
              {conversation.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={() => setConversation([])}
                  data-testid="button-clear-conversation"
                >
                  Clear
                </Button>
              )}
            </div>
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
