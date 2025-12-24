import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, VolumeX, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceConciergeProps {
  text: string;
  autoSpeak?: boolean;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

const LANGUAGE_VOICE_MAP: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-BR',
  ar: 'ar-SA',
  it: 'it-IT',
  nl: 'nl-NL',
  ja: 'ja-JP',
};

export function VoiceConcierge({ text, autoSpeak = false, onSpeakStart, onSpeakEnd }: VoiceConciergeProps) {
  const { i18n, t } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getVoiceForLanguage = useCallback((lang: string): SpeechSynthesisVoice | null => {
    const targetLang = LANGUAGE_VOICE_MAP[lang] || lang;
    
    let voice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith('en'));
    }
    
    return voice || null;
  }, [voices]);

  const speak = useCallback(() => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoiceForLanguage(i18n.language);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = LANGUAGE_VOICE_MAP[i18n.language] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakStart?.();
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakEnd?.();
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      onSpeakEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }, [text, isSupported, i18n.language, getVoiceForLanguage, onSpeakStart, onSpeakEnd]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onSpeakEnd?.();
    }
  }, [onSpeakEnd]);

  useEffect(() => {
    if (autoSpeak && text && isSupported && voices.length > 0) {
      speak();
    }
  }, [autoSpeak, text, isSupported, voices.length]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isSpeaking ? stopSpeaking : speak}
      className={`rounded-full transition-all ${
        isSpeaking 
          ? 'bg-primary/20 text-primary animate-pulse' 
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
      title={isSpeaking ? t('concierge.stopSpeaking') : t('concierge.speak')}
    >
      {isSpeaking ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </Button>
  );
}

export function TalkToConciergeButton({ onActivate }: { onActivate: () => void }) {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const handleClick = () => {
    onActivate();
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-primary/25"
    >
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
        <Volume2 className="w-5 h-5" />
      </div>
      <span>{t('concierge.talkToConcierge')}</span>
    </Button>
  );
}
