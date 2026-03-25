import { useEffect, useMemo, useRef, useState } from "react";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import KeyboardRoundedIcon from "@mui/icons-material/KeyboardRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const QUERY_ENDPOINT =
  import.meta.env.VITE_LOCAL_GUIDE_QUERY_ENDPOINT?.trim() ||
  "/api/local-guide-query";
const TTS_ENDPOINT =
  import.meta.env.VITE_BLOG_TTS_ENDPOINT?.trim() || "/api/blog-tts";
const LANGUAGE_OPTIONS = [
  {
    code: "en",
    label: "English",
    recognition:
      import.meta.env.VITE_LOCAL_GUIDE_SPEECH_EN_LANG || "en-IN",
  },
  {
    code: "ta",
    label: "தமிழ்",
    recognition:
      import.meta.env.VITE_LOCAL_GUIDE_SPEECH_TA_LANG || "ta-IN",
  },
  {
    code: "hi",
    label: "हिन्दी",
    recognition:
      import.meta.env.VITE_LOCAL_GUIDE_SPEECH_HI_LANG || "hi-IN",
  },
];
const UI_COPY = {
  en: {
    assistantLanguage: "Assistant language",
    audioFirstBeta: "Audio-first beta",
    voiceReplyBadge: "Voice reply",
    whatsappShareBadge: "WhatsApp share",
    title: "Speak your question first",
    description:
      "Tap the mic, ask for medicines, groceries, taxis, or repairs, and the guide will answer back in voice. Typing is still available, but it is now a fallback instead of the main path.",
    listeningNow: "Listening now…",
    readyToListen: "Ready to listen",
    listeningPrompt:
      "Speak normally. The page will capture your question and submit it as soon as you stop.",
    idlePrompt:
      "Try a natural question like “Which pharmacy should we try first?” or “Where can we get milk nearby?”",
    tapToSpeak: "Tap to speak",
    stopListening: "Stop listening",
    typeInstead: "Type instead",
    hideTyping: "Hide typing",
    heard: "Heard",
    typeQuestionLabel: "Type a question instead",
    typePlaceholder:
      "Which pharmacy should we try first for repeat medicines?",
    typingHelper:
      "Typing is the fallback path if microphone capture is unavailable.",
    checkingGuide: "Checking guide…",
    askByText: "Ask by text",
    clearTypedQuestion: "Clear typed question",
    voiceFallbackAlert:
      "Voice capture is not available in this browser, so the assistant is falling back to typing for the question while keeping spoken replies.",
    question: "Question",
    spokenReply: "Spoken reply",
    generatingVoice: "Generating voice…",
    pauseVoice: "Pause voice",
    playVoiceAgain: "Play voice again",
    playVoiceReply: "Play voice reply",
    sendWhatsApp: "Send via WhatsApp",
    autoplayBlocked:
      "Your browser blocked autoplay. Use “Play voice reply” to start the spoken answer.",
    relatedListings: "Related listings",
    openMap: "Open map",
    openSource: "Open source",
    fallbackUsed:
      "OpenAI was unavailable for this request, so the page used a local keyword fallback.",
    recheckAvailability:
      "Recheck live timing and availability before depending on a listing.",
    heuristicFallback: "heuristic fallback",
    queryFailed: "The guide assistant could not answer that.",
    noUsableQuestion:
      "I did not catch a usable question. Try again or switch to typing.",
    micUnavailableHere:
      "Voice capture is not available here. Type your question instead.",
    micBusy:
      "Microphone capture is busy right now. Wait a moment and try again.",
    recognitionErrors: {
      notAllowed:
        "Microphone permission was blocked. Allow mic access or use typing.",
      noSpeech:
        "I could not hear a clear question. Try again a little closer to the microphone.",
      audioCapture: "No working microphone was detected.",
      network: "Speech recognition hit a network issue. Try again in a moment.",
      default: "Voice capture failed. Try again or switch to typing.",
    },
    confidence: {
      grounded: "Grounded in guide",
      partial: "Partial match",
      not_in_guide: "Not covered directly",
    },
  },
  ta: {
    assistantLanguage: "உதவியாளர் மொழி",
    audioFirstBeta: "ஒலி முன்னுரிமை பீட்டா",
    voiceReplyBadge: "குரல் பதில்",
    whatsappShareBadge: "WhatsApp பகிர்வு",
    title: "முதலில் உங்கள் கேள்வியை பேசுங்கள்",
    description:
      "மைக்ரோஃபோனைத் தட்டி மருந்து, மளிகை, டாக்ஸி அல்லது ரிப்பெயர் பற்றி கேளுங்கள். வழிகாட்டி குரலில் பதில் சொலும். டைப்பிங் இன்னும் உள்ளது, ஆனால் அது மாற்று வழி மட்டுமே.",
    listeningNow: "இப்போது கேட்கிறேன்…",
    readyToListen: "கேட்கத் தயாராக உள்ளது",
    listeningPrompt:
      "இயல்பாகப் பேசுங்கள். நீங்கள் நிறுத்தியவுடன் பக்கம் உங்கள் கேள்வியைப் பிடித்து அனுப்பும்.",
    idlePrompt:
      "“முதலில் எந்த மருந்தகத்தை முயற்சிக்கலாம்?” அல்லது “அருகில் பால் எங்கு கிடைக்கும்?” என்று கேளுங்கள்.",
    tapToSpeak: "பேச தட்டவும்",
    stopListening: "கேட்பதை நிறுத்து",
    typeInstead: "அதற்கு பதில் டைப் செய்யவும்",
    hideTyping: "டைப்பிங்கை மறை",
    heard: "கேட்டது",
    typeQuestionLabel: "அதற்கு பதில் கேள்வியை டைப் செய்யவும்",
    typePlaceholder: "மீண்டும் வாங்க வேண்டிய மருந்துக்கு எந்த மருந்தகம் நல்லது?",
    typingHelper:
      "மைக்ரோஃபோன் வேலை செய்யாதபோது டைப்பிங் மாற்று வழியாக இருக்கும்.",
    checkingGuide: "வழிகாட்டியை பார்க்கிறது…",
    askByText: "உரையாக கேள்",
    clearTypedQuestion: "டைப் செய்த கேள்வியை நீக்கு",
    voiceFallbackAlert:
      "இந்த உலாவியில் குரல் பதிவு இல்லை. அதனால் கேள்விக்கு டைப்பிங் பயன்படுத்தப்படும், ஆனால் பதில் குரலில் தொடரும்.",
    question: "கேள்வி",
    spokenReply: "குரல் பதில்",
    generatingVoice: "குரல் உருவாக்கப்படுகிறது…",
    pauseVoice: "குரலை நிறுத்து",
    playVoiceAgain: "குரலை மீண்டும் இயக்கு",
    playVoiceReply: "குரல் பதிலை இயக்கு",
    sendWhatsApp: "WhatsApp மூலம் அனுப்பு",
    autoplayBlocked:
      "உங்கள் உலாவி தானாக ஒலியைத் தடுத்தது. “குரல் பதிலை இயக்கு” என்பதை அழுத்துங்கள்.",
    relatedListings: "தொடர்புடைய பட்டியல்கள்",
    openMap: "வரைபடம் திற",
    openSource: "மூலத்தை திற",
    fallbackUsed:
      "இந்த கோரிக்கைக்கு OpenAI இல்லை, அதனால் பக்கம் உள்ளூர் கீவர்ட் fallback-ஐ பயன்படுத்தியது.",
    recheckAvailability:
      "ஒரு பட்டியலை நம்பும் முன் நேரமும் கிடைப்பும் மீண்டும் சரிபார்க்கவும்.",
    heuristicFallback: "உள்ளூர் fallback",
    queryFailed: "வழிகாட்டி இந்த கேள்விக்கு பதில் தர முடியவில்லை.",
    noUsableQuestion:
      "பயன்படுத்தக்கூடிய கேள்வி கேட்கவில்லை. மீண்டும் முயற்சிக்கவும் அல்லது டைப்பிங்கைப் பயன்படுத்தவும்.",
    micUnavailableHere:
      "இங்கே குரல் பதிவு இல்லை. அதற்கு பதில் உங்கள் கேள்வியை டைப் செய்யவும்.",
    micBusy:
      "மைக்ரோஃபோன் பதிவு இப்போது பிஸியாக உள்ளது. ஒரு நிமிடம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    recognitionErrors: {
      notAllowed:
        "மைக்ரோஃபோன் அனுமதி தடுக்கப்பட்டது. அனுமதி வழங்கவும் அல்லது டைப்பிங்கைப் பயன்படுத்தவும்.",
      noSpeech:
        "தெளிவான கேள்வி கேட்கவில்லை. மைக்ரோஃபோனுக்கு அருகில் இருந்து மீண்டும் முயற்சிக்கவும்.",
      audioCapture: "பணிபுரியும் மைக்ரோஃபோன் கண்டுபிடிக்கப்படவில்லை.",
      network:
        "குரல் அறிதலில் நெட்வொர்க் சிக்கல் ஏற்பட்டது. சிறிது நேரத்தில் மீண்டும் முயற்சிக்கவும்.",
      default:
        "குரல் பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும் அல்லது டைப்பிங்கைப் பயன்படுத்தவும்.",
    },
    confidence: {
      grounded: "வழிகாட்டி அடிப்படையில்",
      partial: "பகுதி பொருத்தம்",
      not_in_guide: "நேரடியாக இல்லை",
    },
  },
  hi: {
    assistantLanguage: "असिस्टेंट भाषा",
    audioFirstBeta: "ऑडियो-फर्स्ट बीटा",
    voiceReplyBadge: "आवाज़ में जवाब",
    whatsappShareBadge: "WhatsApp शेयर",
    title: "पहले अपना सवाल बोलिए",
    description:
      "माइक दबाइए, दवा, किराना, टैक्सी या रिपेयर के बारे में पूछिए, और गाइड आपको आवाज़ में जवाब देगा। टाइपिंग अभी भी उपलब्ध है, लेकिन अब वह बैकअप रास्ता है।",
    listeningNow: "अभी सुन रहा हूँ…",
    readyToListen: "सुनने के लिए तैयार",
    listeningPrompt:
      "सामान्य तरीके से बोलिए। आप रुकते ही पेज आपके सवाल को पकड़कर भेज देगा।",
    idlePrompt:
      "जैसे “पहले कौन-सी फ़ार्मेसी ट्राय करें?” या “पास में दूध कहाँ मिलेगा?” पूछकर देखें।",
    tapToSpeak: "बोलने के लिए टैप करें",
    stopListening: "सुनना बंद करें",
    typeInstead: "इसके बजाय टाइप करें",
    hideTyping: "टाइपिंग छिपाएँ",
    heard: "सुना गया",
    typeQuestionLabel: "इसके बजाय सवाल टाइप करें",
    typePlaceholder: "दोबारा खरीदने वाली दवाओं के लिए पहले कौन-सी फ़ार्मेसी ट्राय करें?",
    typingHelper:
      "अगर माइक्रोफोन उपलब्ध न हो तो टाइपिंग बैकअप रास्ता है।",
    checkingGuide: "गाइड देखा जा रहा है…",
    askByText: "टेक्स्ट से पूछें",
    clearTypedQuestion: "टाइप किया सवाल साफ करें",
    voiceFallbackAlert:
      "इस ब्राउज़र में वॉइस कैप्चर उपलब्ध नहीं है, इसलिए सवाल के लिए टाइपिंग इस्तेमाल होगी, लेकिन जवाब आवाज़ में रहेगा।",
    question: "सवाल",
    spokenReply: "आवाज़ में जवाब",
    generatingVoice: "आवाज़ बनाई जा रही है…",
    pauseVoice: "आवाज़ रोकें",
    playVoiceAgain: "आवाज़ फिर चलाएँ",
    playVoiceReply: "आवाज़ में जवाब चलाएँ",
    sendWhatsApp: "WhatsApp से भेजें",
    autoplayBlocked:
      "आपके ब्राउज़र ने ऑटोप्ले रोक दिया। आवाज़ शुरू करने के लिए “आवाज़ में जवाब चलाएँ” दबाएँ।",
    relatedListings: "संबंधित लिस्टिंग",
    openMap: "मैप खोलें",
    openSource: "स्रोत खोलें",
    fallbackUsed:
      "इस अनुरोध के लिए OpenAI उपलब्ध नहीं था, इसलिए पेज ने लोकल कीवर्ड fallback इस्तेमाल किया।",
    recheckAvailability:
      "किसी लिस्टिंग पर निर्भर होने से पहले समय और उपलब्धता फिर से जांच लें।",
    heuristicFallback: "लोकल fallback",
    queryFailed: "गाइड इस सवाल का जवाब नहीं दे सका।",
    noUsableQuestion:
      "मुझे इस्तेमाल करने लायक सवाल सुनाई नहीं दिया। फिर कोशिश करें या टाइपिंग पर जाएँ।",
    micUnavailableHere:
      "यहाँ वॉइस कैप्चर उपलब्ध नहीं है। इसके बजाय अपना सवाल टाइप करें।",
    micBusy:
      "माइक्रोफोन कैप्चर अभी व्यस्त है। एक क्षण रुककर फिर कोशिश करें।",
    recognitionErrors: {
      notAllowed:
        "माइक्रोफोन की अनुमति रोकी गई थी। माइक एक्सेस दें या टाइपिंग इस्तेमाल करें।",
      noSpeech:
        "मुझे साफ सवाल सुनाई नहीं दिया। माइक्रोफोन के थोड़ा करीब आकर फिर कोशिश करें।",
      audioCapture: "कोई काम करने वाला माइक्रोफोन नहीं मिला।",
      network:
        "स्पीच रिकग्निशन में नेटवर्क समस्या आई। थोड़ी देर बाद फिर कोशिश करें।",
      default:
        "वॉइस कैप्चर विफल रहा। फिर कोशिश करें या टाइपिंग इस्तेमाल करें।",
    },
    confidence: {
      grounded: "गाइड पर आधारित",
      partial: "आंशिक मेल",
      not_in_guide: "सीधे कवर नहीं है",
    },
  },
};

const CONFIDENCE_META = {
  grounded: { severity: "success" },
  partial: { severity: "warning" },
  not_in_guide: { severity: "info" },
};
const VOICE_INSTRUCTIONS = {
  en: "Speak clearly, calmly, and warmly. Keep the delivery practical and easy to follow for a family member checking nearby options.",
  ta: "தமிழில் தெளிவாக, மெதுவாக, அன்பாக பேசுங்கள். குடும்ப உறுப்பினர் அருகிலுள்ள விருப்பங்களை பார்த்துக்கொள்ள எளிதாக இருக்க வேண்டும்.",
  hi: "हिंदी में साफ, शांत और गर्मजोशी से बोलें। जवाब व्यावहारिक और परिवार के किसी सदस्य के लिए आसानी से समझ आने वाला हो।",
};

function resolveInitialLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  const browserLanguages = [
    ...(window.navigator.languages || []),
    window.navigator.language,
  ]
    .filter(Boolean)
    .map((entry) => String(entry).toLowerCase());

  if (browserLanguages.some((entry) => entry.startsWith("ta"))) {
    return "ta";
  }
  if (browserLanguages.some((entry) => entry.startsWith("hi"))) {
    return "hi";
  }
  return "en";
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function buildGuideUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return new URL("/local/ananyas-nearby", window.location.origin).toString();
  }
  return "https://www.kumar2net.com/local/ananyas-nearby";
}

function extractErrorMessage(payload, fallbackMessage) {
  if (payload && typeof payload === "object" && typeof payload.error === "string") {
    return payload.error;
  }
  return fallbackMessage;
}

function getContactNumbers(item) {
  if (!Array.isArray(item?.contactNumbers)) {
    return [];
  }

  return item.contactNumbers.filter(
    (contact) =>
      contact &&
      typeof contact.display === "string" &&
      typeof contact.tel === "string" &&
      contact.display.trim() &&
      contact.tel.trim(),
  );
}

function buildTelephoneHref(value) {
  const normalized = String(value || "").replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : undefined;
}

function getSpeechRecognitionConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function describeRecognitionError(code, languageCode = "en") {
  const copy = UI_COPY[languageCode] || UI_COPY.en;

  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return copy.recognitionErrors.notAllowed;
    case "no-speech":
      return copy.recognitionErrors.noSpeech;
    case "audio-capture":
      return copy.recognitionErrors.audioCapture;
    case "network":
      return copy.recognitionErrors.network;
    case "aborted":
      return "";
    default:
      return copy.recognitionErrors.default;
  }
}

export default function LocalGuideAssistant() {
  const [selectedLanguage, setSelectedLanguage] = useState(resolveInitialLanguage);
  const [question, setQuestion] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [heardText, setHeardText] = useState("");
  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audioStatus, setAudioStatus] = useState("idle");
  const [audioError, setAudioError] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningSupported, setListeningSupported] = useState(false);
  const [listeningError, setListeningError] = useState("");
  const [showTextComposer, setShowTextComposer] = useState(false);
  const audioRef = useRef(null);
  const objectUrlRef = useRef("");
  const ttsAbortRef = useRef(null);
  const autoPlayPendingRef = useRef(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const heardTextRef = useRef("");
  const manualStopRef = useRef(false);
  const submitQuestionRef = useRef(null);

  const canSubmit = question.trim().length >= 3 && !loading;
  const activeLanguage =
    LANGUAGE_OPTIONS.find((entry) => entry.code === selectedLanguage) ||
    LANGUAGE_OPTIONS[0];
  const copy = UI_COPY[selectedLanguage] || UI_COPY.en;
  const confidenceMeta =
    CONFIDENCE_META[reply?.confidence] || CONFIDENCE_META.partial;

  const shareHref = useMemo(() => {
    if (!reply?.answer) {
      return "";
    }

    const shareText =
      reply.shareText ||
      [
        reply?.language === "hi"
          ? "अनन्यास नज़दीकी गाइड"
          : reply?.language === "ta"
            ? "அனன்யாஸ் அருகிலுள்ள வழிகாட்டி"
            : "Ananyas nearby guide",
        `${reply?.language === "hi" ? "सवाल" : reply?.language === "ta" ? "கேள்வி" : "Question"}: ${normalizeText(lastQuestion || question)}`,
        `${reply?.language === "hi" ? "जवाब" : reply?.language === "ta" ? "பதில்" : "Answer"}: ${normalizeText(reply.answer)}`,
        buildGuideUrl(),
      ].join("\n");

    return `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  }, [lastQuestion, question, reply]);

  function revokeAudioUrl() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
  }

  function clearAudio() {
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsPlaying(false);
    setAudioUrl("");
    setAudioStatus("idle");
    setAudioError("");
    setAutoPlayBlocked(false);
    autoPlayPendingRef.current = false;
    revokeAudioUrl();
  }

  const submitQuestion = async (rawQuestion) => {
    const trimmedQuestion = normalizeText(rawQuestion);
    if (trimmedQuestion.length < 3 || loading) {
      return;
    }

    clearAudio();
    setLoading(true);
    setError("");
    setListeningError("");
    setLastQuestion(trimmedQuestion);
    setReply(null);

    try {
      const response = await fetch(QUERY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          language: selectedLanguage,
        }),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        throw new Error(
          extractErrorMessage(payload, copy.queryFailed),
        );
      }

      setReply(payload);
      if (payload?.language && payload.language !== selectedLanguage) {
        setSelectedLanguage(payload.language);
      }
      void generateVoiceReply(payload?.answer, payload?.language || selectedLanguage);
    } catch (err) {
      setError(err?.message || copy.queryFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    submitQuestionRef.current = submitQuestion;
  });

  useEffect(() => {
    return () => {
      if (ttsAbortRef.current) {
        ttsAbortRef.current.abort();
        ttsAbortRef.current = null;
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore shutdown race
        }
      }

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = "";
      }
    };
  }, []);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) {
      setListeningSupported(false);
      setShowTextComposer(true);
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = activeLanguage.recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      manualStopRef.current = false;
      finalTranscriptRef.current = "";
      heardTextRef.current = "";
      setHeardText("");
      setIsListening(true);
      setListeningError("");
      setError("");
      clearAudio();
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const transcript = event.results[i]?.[0]?.transcript || "";
        if (event.results[i]?.isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const nextTranscript = normalizeText(finalTranscript || interimTranscript);
      if (finalTranscript) {
        finalTranscriptRef.current = normalizeText(
          `${finalTranscriptRef.current} ${finalTranscript}`,
        );
      }
      heardTextRef.current = nextTranscript || finalTranscriptRef.current;
      setHeardText(heardTextRef.current);
    };

    recognition.onerror = (event) => {
      const message = describeRecognitionError(event?.error, selectedLanguage);
      if (message) {
        setListeningError(message);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      const transcript = normalizeText(
        finalTranscriptRef.current || heardTextRef.current,
      );

      if (transcript.length >= 3) {
        setQuestion(transcript);
        setHeardText(transcript);
        heardTextRef.current = transcript;
        setShowTextComposer(false);
        void submitQuestionRef.current?.(transcript);
        return;
      }

      if (!manualStopRef.current) {
        setListeningError(copy.noUsableQuestion);
      }
    };

    recognitionRef.current = recognition;
    setListeningSupported(true);

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        // ignore shutdown race
      }
      recognitionRef.current = null;
    };
  }, [activeLanguage.recognition]);

  useEffect(() => {
    if (!audioUrl || !autoPlayPendingRef.current || !audioRef.current) {
      return;
    }

    autoPlayPendingRef.current = false;

    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setAutoPlayBlocked(false);
      } catch {
        setAutoPlayBlocked(true);
      }
    };

    void playAudio();
  }, [audioUrl]);

  const generateVoiceReply = async (answerText, languageCode = selectedLanguage) => {
    const normalizedAnswer = normalizeText(answerText);
    if (!normalizedAnswer) {
      return;
    }

    clearAudio();
    setAudioStatus("loading");
    setAudioError("");

    const controller = new AbortController();
    ttsAbortRef.current = controller;

    try {
      const response = await fetch(TTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          text: normalizedAnswer,
          slug: "ananyas-nearby-assistant",
          language: languageCode,
          response_format: "mp3",
          stream_format: "audio",
          instructions: VOICE_INSTRUCTIONS[languageCode] || VOICE_INSTRUCTIONS.en,
        }),
      });

      if (!response.ok) {
        let payload = null;
        try {
          payload = await response.json();
        } catch {
          payload = null;
        }
        throw new Error(
          extractErrorMessage(payload, "Failed to generate the voice reply."),
        );
      }

      const blob = await response.blob();
      if (controller.signal.aborted) {
        return;
      }

      const nextUrl = URL.createObjectURL(blob);
      objectUrlRef.current = nextUrl;
      autoPlayPendingRef.current = true;
      setAudioUrl(nextUrl);
      setAudioStatus("ready");
    } catch (err) {
      if (err?.name === "AbortError") {
        return;
      }

      setAudioStatus("error");
      setAudioError(
        err?.message || "Failed to generate the spoken version of the answer.",
      );
    } finally {
      if (ttsAbortRef.current === controller) {
        ttsAbortRef.current = null;
      }
    }
  };

  const handleSubmit = async (event) => {
    event?.preventDefault?.();
    await submitQuestion(question);
  };

  const handleMicToggle = () => {
    if (loading) {
      return;
    }

    if (!recognitionRef.current || !listeningSupported) {
      setShowTextComposer(true);
      setListeningError(copy.micUnavailableHere);
      return;
    }

    if (isListening) {
      manualStopRef.current = true;
      recognitionRef.current.stop();
      return;
    }

    setListeningError("");
    setError("");
    try {
      recognitionRef.current.start();
    } catch {
      setListeningError(copy.micBusy);
    }
  };

  const handleAudioToggle = async () => {
    if (audioStatus === "loading") {
      return;
    }

    if (isPlaying) {
      audioRef.current?.pause();
      return;
    }

    if (audioUrl && audioRef.current) {
      try {
        await audioRef.current.play();
        setAutoPlayBlocked(false);
      } catch {
        setAutoPlayBlocked(true);
      }
      return;
    }

    if (reply?.answer) {
      await generateVoiceReply(reply.answer, reply?.language || selectedLanguage);
    }
  };

  return (
    <Paper
      id="guide-assistant"
      component="section"
      elevation={0}
      sx={(theme) => ({
        p: { xs: 2.75, md: 4 },
        borderRadius: 5,
        border: "1px solid",
        borderColor: alpha(theme.palette.primary.main, 0.18),
        backgroundImage:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 30%), linear-gradient(180deg, rgba(10, 18, 28, 0.98), rgba(5, 10, 18, 1))"
            : "radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 28%), linear-gradient(180deg, rgba(250, 252, 255, 0.98), rgba(241, 247, 255, 0.98))",
        boxShadow: `0 26px 56px ${alpha(theme.palette.common.black, theme.palette.mode === "dark" ? 0.28 : 0.08)}`,
      })}
    >
      <Stack spacing={2.5}>
        <Stack spacing={1.25}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Chip size="small" color="primary" label={copy.audioFirstBeta} />
            <Chip size="small" variant="outlined" label={copy.voiceReplyBadge} />
            <Chip size="small" variant="outlined" label={copy.whatsappShareBadge} />
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 800, maxWidth: 760 }}>
            {copy.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 760 }}>
            {copy.description}
          </Typography>
          <Stack spacing={0.9}>
            <Typography variant="caption" color="text.secondary">
              {copy.assistantLanguage}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {LANGUAGE_OPTIONS.map((option) => (
                <Chip
                  key={option.code}
                  clickable
                  color={selectedLanguage === option.code ? "primary" : "default"}
                  variant={selectedLanguage === option.code ? "filled" : "outlined"}
                  label={option.label}
                  onClick={() => {
                    if (isListening) {
                      manualStopRef.current = true;
                      recognitionRef.current?.stop();
                    }
                    setSelectedLanguage(option.code);
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>

        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2.25, md: 3 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: alpha(
              isListening ? theme.palette.primary.main : theme.palette.divider,
              isListening ? 0.35 : 0.9,
            ),
            backgroundColor: isListening
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.background.paper, 0.82),
          })}
        >
          <Stack spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
            <Stack spacing={1} alignItems={{ xs: "flex-start", md: "center" }}>
              <Box
                sx={(theme) => ({
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.2),
                })}
              >
                <SmartToyRoundedIcon color="primary" sx={{ fontSize: 44 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {isListening ? copy.listeningNow : copy.readyToListen}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 680 }}>
                {isListening
                  ? copy.listeningPrompt
                  : copy.idlePrompt}
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button
                type="button"
                variant="contained"
                size="large"
                onClick={handleMicToggle}
                disabled={loading}
                startIcon={isListening ? <StopRoundedIcon /> : <MicRoundedIcon />}
                sx={{
                  minWidth: 220,
                  minHeight: 52,
                  borderRadius: 999,
                }}
              >
                {isListening ? copy.stopListening : copy.tapToSpeak}
              </Button>
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={() => setShowTextComposer((current) => !current)}
                startIcon={<KeyboardRoundedIcon />}
                sx={{ minWidth: 180, minHeight: 52, borderRadius: 999 }}
              >
                {showTextComposer ? copy.hideTyping : copy.typeInstead}
              </Button>
            </Stack>

            {heardText ? (
              <Paper
                elevation={0}
                sx={(theme) => ({
                  width: "100%",
                  maxWidth: 760,
                  p: 1.5,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.primary.main, 0.14),
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                })}
              >
                <Typography variant="caption" color="text.secondary">
                  {copy.heard}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {heardText}
                </Typography>
              </Paper>
            ) : null}

            <Collapse in={showTextComposer} sx={{ width: "100%" }}>
              <Stack
                component="form"
                spacing={1.5}
                onSubmit={handleSubmit}
                sx={{ width: "100%", maxWidth: 760, mx: "auto" }}
              >
                <TextField
                  multiline
                  minRows={2}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  label={copy.typeQuestionLabel}
                  placeholder={copy.typePlaceholder}
                  helperText={copy.typingHelper}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!canSubmit}
                    startIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <KeyboardRoundedIcon />
                      )
                    }
                    sx={{ borderRadius: 999 }}
                  >
                    {loading ? copy.checkingGuide : copy.askByText}
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      setQuestion("");
                      setShowTextComposer(false);
                    }}
                    sx={{ borderRadius: 999 }}
                  >
                    {copy.clearTypedQuestion}
                  </Button>
                </Stack>
              </Stack>
            </Collapse>
          </Stack>
        </Paper>

        {!listeningSupported ? (
          <Alert severity="info">
            {copy.voiceFallbackAlert}
          </Alert>
        ) : null}

        {listeningError ? <Alert severity="warning">{listeningError}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}

        {reply ? (
          <Stack spacing={2}>
            <Alert severity={confidenceMeta.severity}>
              <strong>
                {(copy.confidence?.[reply?.confidence] || copy.confidence.partial)}.
              </strong>{" "}
              {copy.recheckAvailability}
            </Alert>

            {reply.fallback ? (
              <Alert severity="warning">
                {copy.fallbackUsed}
              </Alert>
            ) : null}

            <Paper
              elevation={0}
              sx={(theme) => ({
                p: 2,
                borderRadius: 3,
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.14),
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
              })}
            >
              <Stack spacing={1.25}>
                {lastQuestion ? (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {copy.question}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.35, fontWeight: 600 }}>
                      {lastQuestion}
                    </Typography>
                  </Box>
                ) : null}

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {copy.spokenReply}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: "pre-line" }}>
                    {reply.answer}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    size="small"
                    label={reply.provider === "openai" ? reply.model : copy.heuristicFallback}
                    variant="outlined"
                  />
                  {audioStatus === "loading" ? (
                    <Chip size="small" label={copy.generatingVoice} color="primary" />
                  ) : null}
                </Stack>
              </Stack>
            </Paper>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
              <Button
                type="button"
                variant="contained"
                onClick={handleAudioToggle}
                disabled={audioStatus === "loading" || !reply.answer}
                startIcon={
                  isPlaying ? <PauseRoundedIcon /> : <VolumeUpRoundedIcon />
                }
                sx={{ borderRadius: 999 }}
              >
                {audioStatus === "loading"
                  ? copy.generatingVoice
                  : isPlaying
                    ? copy.pauseVoice
                    : audioUrl
                      ? copy.playVoiceAgain
                      : copy.playVoiceReply}
              </Button>

              <Button
                type="button"
                component="a"
                href={shareHref || undefined}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                disabled={!shareHref}
                startIcon={<ShareRoundedIcon />}
                sx={{ borderRadius: 999 }}
              >
                {copy.sendWhatsApp}
              </Button>
            </Stack>

            {autoPlayBlocked ? (
              <Alert severity="info">
                {copy.autoplayBlocked}
              </Alert>
            ) : null}

            {audioError ? <Alert severity="warning">{audioError}</Alert> : null}

            {Array.isArray(reply.suggestedListings) && reply.suggestedListings.length ? (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1.25 }}>
                  {copy.relatedListings}
                </Typography>
                <Stack spacing={1.25}>
                  {reply.suggestedListings.map((listing) => {
                    const contactNumbers = getContactNumbers(listing);

                    return (
                      <Paper
                        key={`${listing.type}:${listing.name}`}
                        elevation={0}
                        sx={(theme) => ({
                          p: 1.5,
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: alpha(theme.palette.divider, 0.8),
                        })}
                      >
                        <Stack spacing={1}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            spacing={0.75}
                          >
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {listing.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {listing.categoryTitle} · {listing.area}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={listing.verificationLabel}
                              variant="outlined"
                            />
                          </Stack>
                          {listing.note ? (
                            <Typography variant="body2" color="text.secondary">
                              {listing.note}
                            </Typography>
                          ) : null}
                          {contactNumbers.length ? (
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              {contactNumbers.map((contact) => (
                                <Button
                                  key={`${listing.name}:${contact.label}:${contact.tel}`}
                                  size="small"
                                  variant="outlined"
                                  component="a"
                                  href={buildTelephoneHref(contact.tel)}
                                  startIcon={<CallRoundedIcon />}
                                >
                                  {contact.label}: {contact.display}
                                </Button>
                              ))}
                            </Stack>
                          ) : null}
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {listing.mapUrl ? (
                              <Button
                                size="small"
                                variant="outlined"
                                component="a"
                                href={listing.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {copy.openMap}
                              </Button>
                            ) : null}
                            {listing.sourceUrl ? (
                              <Button
                                size="small"
                                variant="text"
                                component="a"
                                href={listing.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {copy.openSource}
                              </Button>
                            ) : null}
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            ) : null}
          </Stack>
        ) : null}

        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </Stack>
    </Paper>
  );
}
