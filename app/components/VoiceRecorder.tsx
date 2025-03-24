import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Send } from 'lucide-react';

interface VoiceRecorderProps {
  onSendVoice: (blob: Blob) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendVoice }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioContextRef.current?.close();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context and analyser
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Configure analyser
      analyserRef.current.fftSize = 128;
      const bufferLength = analyserRef.current.frequencyBinCount;
      
      // Start recording
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      
      // Start waveform visualization
      const updateWaveform = () => {
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current?.getByteFrequencyData(dataArray);
        
        // Convert to percentage values for visualization
        const waveform = Array.from(dataArray).map(value => value / 255);
        setWaveformData(waveform);
        
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      
      updateWaveform();
      
      // Start duration counter
      const startTime = Date.now();
      const updateDuration = () => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      };
      const durationInterval = setInterval(updateDuration, 1000);
      
      return () => clearInterval(durationInterval);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      onSendVoice(audioBlob);
      
      setIsRecording(false);
      setDuration(0);
      setWaveformData([]);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
      {isRecording ? (
        <>
          <button
            onClick={stopRecording}
            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
          >
            <Square className="w-5 h-5" />
          </button>
          
          <div className="flex-1 h-8 flex items-center gap-0.5">
            {waveformData.map((value, index) => (
              <div
                key={index}
                className="w-0.5 bg-primary"
                style={{
                  height: `${Math.max(value * 100, 15)}%`,
                  opacity: value,
                }}
              />
            ))}
          </div>
          
          <div className="text-sm font-medium text-muted-foreground">
            {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
          </div>
          
          <button
            onClick={stopRecording}
            className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </>
      ) : (
        <button
          onClick={startRecording}
          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}; 