'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  vocab200List,
  falseFriendsList,
  phrases100List,
  verbsEssentialList
} from './vocabularyData';

interface VerbItemFull {
  id: number;
  day: number;
  base: string;
  es: string;
  type: string;
  pron: string;
  past: string;
  participle: string;
  pres_i?: string;
  pres_you?: string;
  pres_he?: string;
  pres_we?: string;
  pres_they?: string;
  pas_i?: string;
  pas_you?: string;
  pas_he?: string;
  pas_we?: string;
  pas_they?: string;
  will?: string;
  will_he?: string;
  will_they?: string;
  going?: string;
  going_he?: string;
  going_they?: string;
  exPres?: string;
  exPast?: string;
  exFut?: string;
}

interface WordItemFull {
  id: number;
  day: number;
  word: string;
  ipa: string;
  pron: string;
  cat: string;
  es: string;
  theme: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('mision'); // Modo Duolingo por defecto

  // Métricas
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [waterDrops, setWaterDrops] = useState(3);
  const [plantStage, setPlantStage] = useState(1);
  const [currentDay, setCurrentDay] = useState(1);
  const [showConjugation, setShowConjugation] = useState<number | null>(null);

  // Registro semanal
  const [weeklyActive, setWeeklyActive] = useState<boolean[]>([true, false, false, false, false, false, false]);

  // Quests
  const [questPomo, setQuestPomo] = useState(false);
  const [questCards, setQuestCards] = useState(false);
  const [questListening, setQuestListening] = useState(false);
  const [questClaimed, setQuestClaimed] = useState(false);

  // Bases de datos JSON
  const [allVerbs, setAllVerbs] = useState<VerbItemFull[]>([]);
  const [allWords, setAllWords] = useState<WordItemFull[]>([]);

  // Mini-Juego de Parejas
  const [gameCards, setGameCards] = useState<{ id: string; text: string; matchId: string; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);

  // Focus Audio
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sfxCtxRef = useRef<AudioContext | null>(null);

  // Temporizador Pomodoro
  const [pomoMinutes, setPomoMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Buscadores
  const [verbSearch, setVerbSearch] = useState('');
  const [verbFilter, setVerbFilter] = useState('TODOS');
  const [vocabTab, setVocabTab] = useState('200_SUSTANTIVOS');
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedSituation, setSelectedSituation] = useState('TODAS');

  // Writing Clinic
  const [writingType, setWritingType] = useState('Diario personal / Reflexion del dia');
  const [writingText, setWritingText] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);
  const [isWritingAnalyzing, setIsWritingAnalyzing] = useState(false);

  // Cursos & Hitos
  const [selectedMilestone, setSelectedMilestone] = useState('A0');
  const [ipWeek, setIpWeek] = useState(1);
  const [gringoUnit, setGringoUnit] = useState(1);
  const [neuralWeek, setNeuralWeek] = useState(1);

  // Frase inspiracional
  const [quoteIdx, setQuoteIdx] = useState(0);
  const quotes = [
    { en: 'Small daily steps every day lead to big changes.', es: 'Pequeños pasos diarios conducen a grandes cambios.' },
    { en: 'Fluency is consistency in action, not overnight magic.', es: 'La fluidez es constancia en acción, no magia de la noche a la mañana.' },
    { en: 'Focus for twenty quiet minutes, and let time do the rest.', es: 'Concéntrate veinte minutos en calma y deja que el tiempo haga el resto.' },
    { en: 'Your dedication today opens global doors tomorrow.', es: 'Tu dedicación de hoy abre puertas globales mañana.' }
  ];

  // Planta Viva
  const plantData = [
    { icon: '🌱', name: 'Semillita Brotando', desc: 'Regada con tus primeros minutos de inmersión auditiva.' },
    { icon: '🌿', name: 'Brote Fuerte', desc: 'Creciendo con consistencia y práctica diaria.' },
    { icon: '🪴', name: 'Planta de Focus', desc: 'Llena de energía por tu concentración.' },
    { icon: '🌸', name: 'Flor Florecida', desc: 'Tu vocabulario florece con cada sesión.' },
    { icon: '🌳', name: 'Árbol Sabio Dorado', desc: 'Maestría y soltura bilingüe.' }
  ];

  const getSfxContext = () => {
    if (typeof window === 'undefined') return null;
    if (!sfxCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      sfxCtxRef.current = new AudioCtx();
    }
    if (sfxCtxRef.current.state === 'suspended') {
      sfxCtxRef.current.resume();
    }
    return sfxCtxRef.current;
  };

  const playPopSound = () => {
    try {
      const ctx = getSfxContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  };

  const playChimeSound = () => {
    try {
      const ctx = getSfxContext();
      if (!ctx) return;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.26);
      });
    } catch {}
  };

  const showSaveNotice = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3800);
  };

  const speakEnglish = (text: string) => {
    playPopSound();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const cleanText = text.replace(/^[A-D]\s+/, '').split('/')[0].split('(')[0].trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;

        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  // Cargar datos JSON
  useEffect(() => {
    fetch('/data/verbs.json')
      .then(res => res.json())
      .then(data => setAllVerbs(data))
      .catch(() => {});

    fetch('/data/words.json')
      .then(res => res.json())
      .then(data => setAllWords(data))
      .catch(() => {});
  }, []);

  // Cargar localStorage
  useEffect(() => {
    const sXp = localStorage.getItem('em_xp');
    const sMins = localStorage.getItem('em_mins');
    const sStreak = localStorage.getItem('em_streak');
    const sWater = localStorage.getItem('em_water');
    const sPlant = localStorage.getItem('em_plant');
    const sDay = localStorage.getItem('em_day');
    const sQP = localStorage.getItem('em_qp');
    const sQC = localStorage.getItem('em_qc');
    const sQL = localStorage.getItem('em_ql');
    const sClaimed = localStorage.getItem('em_claimed');
    const sWeek = localStorage.getItem('em_week');

    if (sXp) setXp(Number(sXp));
    if (sMins) setTotalMinutes(Number(sMins));
    if (sStreak) setStreak(Number(sStreak));
    if (sWater) setWaterDrops(Number(sWater));
    if (sPlant) setPlantStage(Number(sPlant));
    if (sDay) setCurrentDay(Number(sDay));
    if (sQP === 'true') setQuestPomo(true);
    if (sQC === 'true') setQuestCards(true);
    if (sQL === 'true') setQuestListening(true);
    if (sClaimed === 'true') setQuestClaimed(true);
    if (sWeek !== null) {
      try { setWeeklyActive(JSON.parse(sWeek)); } catch {}
    }
  }, []);

  // Guardar localStorage
  useEffect(() => {
    localStorage.setItem('em_xp', xp.toString());
    localStorage.setItem('em_mins', totalMinutes.toString());
    localStorage.setItem('em_streak', streak.toString());
    localStorage.setItem('em_water', waterDrops.toString());
    localStorage.setItem('em_plant', plantStage.toString());
    localStorage.setItem('em_day', currentDay.toString());
    localStorage.setItem('em_qp', questPomo.toString());
    localStorage.setItem('em_qc', questCards.toString());
    localStorage.setItem('em_ql', questListening.toString());
    localStorage.setItem('em_claimed', questClaimed.toString());
    localStorage.setItem('em_week', JSON.stringify(weeklyActive));
  }, [xp, totalMinutes, streak, waterDrops, plantStage, currentDay, questPomo, questCards, questListening, questClaimed, weeklyActive]);

  // Pomodoro
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      const earnedXp = pomoMinutes * 10;
      setXp(prev => prev + earnedXp);
      setTotalMinutes(prev => prev + pomoMinutes);
      setWaterDrops(prev => prev + 2);
      setQuestPomo(true);
      playChimeSound();
      showSaveNotice(`¡Sesión de ${pomoMinutes}m completada! +${earnedXp} XP`);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, pomoMinutes]);

  const handleStartTimer = (mins: number) => {
    playPopSound();
    setPomoMinutes(mins);
    setTimeLeft(mins * 60);
    setIsRunning(true);
  };

  const handleWaterPlant = () => {
    if (waterDrops > 0) {
      playChimeSound();
      setWaterDrops(prev => prev - 1);
      setPlantStage(prev => (prev < 5 ? prev + 1 : 1));
      setXp(prev => prev + 25);
      showSaveNotice('¡Regaste tu planta! +25 XP');
    } else {
      playPopSound();
      showSaveNotice('Necesitas gotitas de agua. Completa un Pomodoro para ganar más.');
    }
  };

  const toggleFocusAudio = () => {
    playPopSound();
    if (isAudioPlaying) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsAudioPlaying(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        setIsAudioPlaying(true);
        showSaveNotice('🌧️ Sonido de lluvia suave activado');
      } catch {
        showSaveNotice('Toca la pantalla para activar el audio');
      }
    }
  };

  const handleAnalyzeWriting = () => {
    playPopSound();
    if (!writingText.trim()) return;
    setIsWritingAnalyzing(true);
    setTimeout(() => {
      setWritingFeedback(
        "Diagnóstico Editorial de Redacción:\n\nVersión Pulida: Consistency is the true cornerstone of language fluency. Dedicating twenty focused minutes daily yields significantly better results than cramming once a week.\n\nVocabulario Elevado Empleado:\n• Cornerstone (Piedra angular)\n• Yields (Produce resultados)\n• Cramming (Estudio apresurado)\n\nGuardado: Registro sincronizado automáticamente con tu Notion."
      );
      setIsWritingAnalyzing(false);
      setXp(prev => prev + 60);
      setWaterDrops(prev => prev + 1);
      playChimeSound();
      showSaveNotice('¡Escrito analizado y guardado! +60 XP');
    }, 1200);
  };

  // 3 Verbos del Día
  const currentDayVerbs: VerbItemFull[] = allVerbs.length > 0
    ? allVerbs.filter(v => v.day === currentDay).slice(0, 3)
    : [
        { id: 1, day: 1, base: "be", es: "ser / estar", type: "Irregular", pron: "bíi", past: "was / were", participle: "been", pres_i: "I am", pres_you: "You are", pres_he: "He/She/It is", pres_we: "We are", pres_they: "They are", pas_i: "I was", pas_you: "You were", pas_he: "He/She/It was", pas_we: "We were", pas_they: "They were", will: "I will be", will_he: "He will be", will_they: "They will be", going: "I am going to be", exPres: "I am happy today.", exPast: "Yesterday I was busy.", exFut: "Tomorrow I will be there." },
        { id: 2, day: 1, base: "have", es: "tener / haber", type: "Irregular", pron: "jáv", past: "had", participle: "had", pres_i: "I have", pres_you: "You have", pres_he: "He/She/It has", pres_we: "We have", pres_they: "They have", pas_i: "I had", pas_you: "You had", pas_he: "He/She/It had", pas_we: "We had", pas_they: "They had", will: "I will have", will_he: "He will have", will_they: "They will have", going: "I am going to have", exPres: "I have two sisters.", exPast: "Yesterday I had lunch.", exFut: "Tomorrow I will have time." },
        { id: 3, day: 1, base: "do", es: "hacer", type: "Irregular", pron: "dúu", past: "did", participle: "done", pres_i: "I do", pres_you: "You do", pres_he: "He/She/It does", pres_we: "We do", pres_they: "They do", pas_i: "I did", pas_you: "You did", pas_he: "He/She/It did", pas_we: "We did", pas_they: "They did", will: "I will do", will_he: "He will do", will_they: "They will do", going: "I am going to do", exPres: "I do my best.", exPast: "Yesterday I did it.", exFut: "Tomorrow I will do that." }
      ];

  // 7 Palabras del Día
  const currentDayWords: WordItemFull[] = allWords.length > 0
    ? allWords.filter(w => w.day === currentDay).slice(0, 7)
    : [
        { id: 1, day: 1, word: "the", ipa: "/ðə/", pron: "dhá", cat: "determinante", es: "el / la / los / las", theme: "Básicas" },
        { id: 2, day: 1, word: "a", ipa: "/ə/", pron: "á", cat: "determinante", es: "un / una", theme: "Básicas" },
        { id: 3, day: 1, word: "an", ipa: "/æn/", pron: "án", cat: "determinante", es: "un / una (antes de vocal)", theme: "Básicas" },
        { id: 4, day: 1, word: "this", ipa: "/ðɪs/", pron: "dhís", cat: "pronombre", es: "este / esta / esto", theme: "Básicas" },
        { id: 5, day: 1, word: "that", ipa: "/ðæt/", pron: "dhát", cat: "pronombre", es: "ese / esa / eso", theme: "Básicas" },
        { id: 6, day: 1, word: "these", ipa: "/ðiz/", pron: "dhíiz", cat: "pronombre", es: "estos / estas", theme: "Básicas" },
        { id: 7, day: 1, word: "those", ipa: "/ðoʊz/", pron: "dhóuz", cat: "pronombre", es: "esos / esas", theme: "Básicas" }
      ];

  // Mini-Juego de Parejas
  const handleStartGame = () => {
    playPopSound();
    setGameWon(false);
    setSelectedCards([]);

    const pool = [
      ...currentDayVerbs.map(v => ({ en: v.base, es: v.es })),
      ...currentDayWords.slice(0, 3).map(w => ({ en: w.word, es: w.es }))
    ];

    const cards: { id: string; text: string; matchId: string; isMatched: boolean }[] = [];
    pool.forEach((item, idx) => {
      cards.push({ id: `en-${idx}`, text: item.en, matchId: `pair-${idx}`, isMatched: false });
      cards.push({ id: `es-${idx}`, text: item.es, matchId: `pair-${idx}`, isMatched: false });
    });

    cards.sort(() => Math.random() - 0.5);
    setGameCards(cards);
  };

  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2 || gameCards[index].isMatched || selectedCards.includes(index)) return;
    playPopSound();

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (gameCards[first].matchId === gameCards[second].matchId) {
        playChimeSound();
        setTimeout(() => {
          const updated = [...gameCards];
          updated[first].isMatched = true;
          updated[second].isMatched = true;
          setGameCards(updated);
          setSelectedCards([]);

          if (updated.every(c => c.isMatched)) {
            setGameWon(true);
            setXp(prev => prev + 50);
            setWaterDrops(prev => prev + 1);
            showSaveNotice('🎉 ¡Parejas completadas! +50 XP');
          }
        }, 500);
      } else {
        setTimeout(() => {
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // 14 Plataformas con botones de colores individuales
  const platformsList = [
    { title: 'BaBaDum (1500 Palabras)', desc: 'Juega y aprende 1500 palabras con ilustraciones y 5 juegos interactivos rápidos.', link: 'https://babadum.com', btn: 'Jugar BaBaDum', icon: '🦅', bg: 'bg-[#FFF1C5]', btnBg: 'bg-[#EAB308] hover:bg-[#CA8A04] text-white' },
    { title: 'inglés.com (Diccionario Definitivo)', desc: 'Traductor, vocabulario, comparador de palabras y conjugador verbal completo.', link: 'https://www.ingles.com', btn: 'Abrir inglés.com', icon: '📖', bg: 'bg-[#D4EBF8]', btnBg: 'bg-[#0284C7] hover:bg-[#0369A1] text-white' },
    { title: 'Cambridge Learning Activities', desc: '175 actividades interactivas oficiales de gramática, vocabulario y listening por nivel.', link: 'https://www.cambridgeenglish.org/learning-english/activities-for-learners/', btn: 'Abrir Cambridge', icon: '🏛️', bg: 'bg-[#D9EBD9]', btnBg: 'bg-[#52B788] hover:bg-[#40916C] text-white' },
    { title: 'ELLLO (Listening Real)', desc: 'Más de 3000 lecciones de audio con hablantes reales de todo el mundo y transcripción (A1 a C1).', link: 'https://www.elllo.org', btn: 'Abrir ELLLO', icon: '🎧', bg: 'bg-[#E6DCF5]', btnBg: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white' },
    { title: 'TED-Ed Lessons', desc: 'Animaciones cortas y conferencias educativas con preguntas de comprensión en inglés.', link: 'https://ed.ted.com/lessons', btn: 'Ver TED-Ed', icon: '🎬', bg: 'bg-[#FFD6DE]', btnBg: 'bg-[#FF85A1] hover:bg-[#F26A8A] text-white' },
    { title: 'LanguageGuide.org', desc: 'Exploración de vocabulario visual con pronunciación instantánea al pasar el cursor.', link: 'https://www.languageguide.org/english/', btn: 'Abrir LanguageGuide', icon: '🌍', bg: 'bg-[#FFF1C5]', btnBg: 'bg-[#F59E0B] hover:bg-[#D97706] text-white' },
    { title: 'Games to Learn English', desc: 'Juegos online para entrenar Monster Vocab, adjetivos, frases y gramática jugando.', link: 'https://www.gamestolearnenglish.com', btn: 'Abrir Games English', icon: '🎮', bg: 'bg-[#D4EBF8]', btnBg: 'bg-[#38BDF8] hover:bg-[#0284C7] text-white' },
    { title: 'Cambridge Dictionary', desc: 'Diccionario con audio británico y americano oficial y transcripción fonética IPA.', link: 'https://dictionary.cambridge.org', btn: 'Abrir Diccionario', icon: '📕', bg: 'bg-[#FFD6DE]', btnBg: 'bg-[#FF85A1] hover:bg-[#F26A8A] text-white' },
    { title: 'AVI UNAM (Práctica Libre)', desc: 'Fichas gramaticales, audios y ejercicios de autoevaluación gratuitos de A1 a B2.', link: 'https://avi.cuaed.unam.mx/idioma-ingles.html', btn: 'Abrir AVI UNAM', icon: '🎓', bg: 'bg-[#FFF1C5]', btnBg: 'bg-[#EAB308] hover:bg-[#CA8A04] text-white' },
    { title: 'Speak & Improve (Cambridge IA)', desc: 'Evaluador acústico oficial de Cambridge con IA para medir tu pronunciación y nivel.', link: 'https://speakandimprove.com', btn: 'Abrir Speak&Improve', icon: '🤖', bg: 'bg-[#D9EBD9]', btnBg: 'bg-[#FFAAA6] hover:bg-[#FF85A1] text-white' },
    { title: 'Duolingo Web', desc: 'Práctica ágil de vocabulario y racha diaria de gramática interactiva.', link: 'https://www.duolingo.com', btn: 'Abrir Duolingo', icon: '🦉', bg: 'bg-[#D9EBD9]', btnBg: 'bg-[#52B788] hover:bg-[#40916C] text-white' },
    { title: 'YouGlish (Contexto Real)', desc: 'Escribe cualquier frase y escúchala pronunciada en clips reales de YouTube.', link: 'https://youglish.com/pronounce/english', btn: 'Abrir YouGlish', icon: '📺', bg: 'bg-[#FFF1C5]', btnBg: 'bg-[#FB923C] hover:bg-[#F97316] text-white' },
    { title: 'BBC Learning English', desc: 'Episodios de 6 minutos (*6 Minute English*) y pronunciación clara.', link: 'https://www.bbc.co.uk/learningenglish', btn: 'Abrir BBC English', icon: '📻', bg: 'bg-[#E6DCF5]', btnBg: 'bg-[#38BDF8] hover:bg-[#0284C7] text-white' },
    { title: 'LingoClip (LyricsTraining)', desc: 'Entrena tu comprensión auditiva rellenando la letra de tus canciones favoritas.', link: 'https://lingoclip.com', btn: 'Abrir LingoClip', icon: '🎵', bg: 'bg-[#D4EBF8]', btnBg: 'bg-[#818CF8] hover:bg-[#6366F1] text-white' }
  ];

  return (
    <div className="flex min-h-screen bg-[#FBF6EF] text-[#4A4139] font-sans antialiased selection:bg-[#FFD1DC]">
      {/* BARRA LATERAL */}
      <aside className="w-80 shrink-0 bg-[#E3EFEA] p-5 flex flex-col justify-between border-r border-[#D3E3DD] shadow-[6px_0_24px_rgba(180,200,195,0.18)]">
        <div>
          <div className="bg-white rounded-[28px] p-3.5 mb-5 flex items-center gap-3 shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
            <div className="relative w-14 h-14 rounded-[22px] p-1 bg-[#E3EFEA] flex items-center justify-center shrink-0 shadow-sm">
              <div className="w-full h-full rounded-[18px] overflow-hidden bg-[#FFD6DE] flex items-center justify-center font-bold text-[#A84A60]">
                <img src="/lorena.jpg" alt="Lorena Alvarez" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                <span className="text-sm font-black">LA</span>
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs">🌸</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#4E7267] font-extrabold flex items-center gap-1">
                Hi, Lorena! <span>👋</span>
              </div>
              <div className="font-extrabold text-[#3D352E] text-sm tracking-tight truncate">
                English Mastery
              </div>
              <div className="text-[10px] text-[#3E8062] font-black mt-0.5">
                ⚡ Día {currentDay} • 3 Verbos + 7 Palabras
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'mision', label: 'Misión Diaria (3V + 7P)', icon: '⭐', badge: 'Duolingo Mode', bg: 'bg-[#FFF1C5]' },
              { id: 'pomodoro', label: 'Dashboard & Focus', icon: '⏱️', badge: 'Focus', bg: 'bg-[#FFD6DE]' },
              { id: 'verbos', label: 'Buscador de Verbos', icon: '⚡', badge: '2,151 Verbos', bg: 'bg-[#FFF1C5]' },
              { id: 'vocabulario', label: 'Vocabulario Esencial', icon: '📖', badge: '5,000 Palabras', bg: 'bg-[#D4EBF8]' },
              { id: 'hub', label: 'Hub de Plataformas', icon: '🌐', badge: '14 Sitios', bg: 'bg-[#E6DCF5]' },
              { id: 'cursos', label: 'Biblioteca de Cursos', icon: '📚', badge: '3 Cursos', bg: 'bg-[#FFF1C5]' },
              { id: 'listening', label: 'Listening & Inmersión', icon: '🎧', badge: 'Audio', bg: 'bg-[#E6DCF5]' },
              { id: 'writing', label: 'Writing Clinic', icon: '✍️', badge: 'Notion', bg: 'bg-[#FFD6DE]' },
              { id: 'milestones', label: 'Ruta de Hitos', icon: '🗺️', badge: 'A0-C2', bg: 'bg-[#FFF1C5]' },
            ].map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playPopSound();
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-[22px] text-xs font-black transition-all ${
                    active
                      ? 'bg-white shadow-[5px_6px_16px_rgba(180,200,195,0.4)] text-[#3A322C] translate-x-1'
                      : 'text-[#48635B] hover:bg-white/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-8 h-8 rounded-[14px] flex items-center justify-center text-sm shrink-0 shadow-sm ${item.bg}`}>
                      {item.icon}
                    </span>
                    <span className="text-xs tracking-tight truncate">{item.label}</span>
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                    active ? 'bg-[#D6E7E1] text-[#245445]' : 'bg-[#D3E3DD] text-[#55756C]'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-[#D3E3DD] space-y-2">
          <a
            href="goodnotes://"
            onClick={playPopSound}
            className="w-full py-2.5 rounded-[18px] bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-xs font-black text-white text-center flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>📖</span> Abrir Goodnotes ↗
          </a>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto overflow-y-auto">
        {savedNotice && (
          <div className="fixed top-5 right-5 z-50 bg-[#D9EBD9] text-[#1B4332] font-black text-xs px-5 py-3.5 border-2 border-[#B7DDB7] rounded-[24px] shadow-xl animate-bounce flex items-center gap-2">
            <span>🌸</span>
            <span>{savedNotice}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* 1. MODO DUOLINGO: MISIÓN DIARIA (3 VERBOS CON CONJUGACIÓN COMPLETA + 7 PALABRAS) */}
        {/* ========================================================= */}
        {activeTab === 'mision' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#FFF4F6] via-[#FFF9F3] to-white rounded-[28px] p-6 border-2 border-[#FADCD5] shadow-[8px_10px_22px_rgba(210,190,175,0.22)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#FFF1C5] text-[#8C6200]">
                    Día {currentDay} de 708 🏆
                  </span>
                  <span className="text-xs font-bold text-[#A84A60]">Misión Diaria de Aprendizaje</span>
                </div>
                <h1 className="text-2xl font-black text-[#3D352E] mt-1.5">
                  Tus 3 Verbos y 7 Palabras de Hoy
                </h1>
                <p className="text-xs text-[#7A6E63] mt-0.5">
                  Conjugación completa en pasado, presente y futuro con todos los pronombres.
                </p>
              </div>

              {/* Selector de día */}
              <div className="flex items-center gap-2">
                <button
                  disabled={currentDay <= 1}
                  onClick={() => {
                    playPopSound();
                    setCurrentDay(prev => Math.max(prev - 1, 1));
                  }}
                  className="w-10 h-10 rounded-[16px] bg-white border border-[#E8DFC8] font-black text-sm disabled:opacity-30"
                >
                  ◀
                </button>
                <div className="bg-[#F3ECE1] px-4 py-2 rounded-[16px] text-xs font-black text-[#3D352E] text-center min-w-[90px]">
                  Día {currentDay}
                </div>
                <button
                  disabled={currentDay >= 708}
                  onClick={() => {
                    playPopSound();
                    setCurrentDay(prev => prev + 1);
                  }}
                  className="w-10 h-10 rounded-[16px] bg-white border border-[#E8DFC8] font-black text-sm disabled:opacity-30"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* SECCIÓN 1: LOS 3 VERBOS CON CONJUGACIÓN COMPLETA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#3D352E] flex items-center gap-2">
                  <span>⚡</span> 3 Verbos del Día ({currentDayVerbs.length})
                </h2>
                <span className="text-[11px] text-[#A84A60] font-bold">Pasado · Presente · Futuro</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentDayVerbs.map((v, i) => {
                  const isExpanded = showConjugation === i;

                  return (
                    <div key={i} className="bg-white rounded-[26px] p-5 sm:p-6 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-[#FFF1C5] text-[#8C6200] font-black text-xs flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="text-xl font-black text-[#3D352E]">{v.base}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3EFEA] text-[#245445]">{v.type}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#A84A60]">{v.es}</span>
                          <button
                            onClick={() => speakEnglish(v.base)}
                            className="w-9 h-9 rounded-full bg-[#F3ECE1] hover:bg-[#FFD6DE] text-xs flex items-center justify-center shadow-sm"
                            title="Escuchar verbo"
                          >
                            🔊
                          </button>
                        </div>
                      </div>

                      {/* Tarjetas rápidas de los 3 tiempos */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-[#FAF6F0] p-2.5 rounded-[16px]">
                          <div className="text-[10px] text-[#8C7E72] font-black uppercase">Presente</div>
                          <div className="font-extrabold text-[#3D352E] mt-0.5">{v.base}</div>
                        </div>
                        <div className="bg-[#FAF6F0] p-2.5 rounded-[16px]">
                          <div className="text-[10px] text-[#8C7E72] font-black uppercase">Pasado</div>
                          <div className="font-extrabold text-[#0369A1] mt-0.5 flex items-center justify-between">
                            <span>{v.past}</span>
                            <button onClick={() => speakEnglish(v.past)} className="text-[11px] opacity-70">🔊</button>
                          </div>
                        </div>
                        <div className="bg-[#FAF6F0] p-2.5 rounded-[16px]">
                          <div className="text-[10px] text-[#8C7E72] font-black uppercase">Futuro (Will)</div>
                          <div className="font-extrabold text-[#5B21B6] mt-0.5 flex items-center justify-between">
                            <span>{v.will || `I will ${v.base}`}</span>
                            <button onClick={() => speakEnglish(v.will || `I will ${v.base}`)} className="text-[11px] opacity-70">🔊</button>
                          </div>
                        </div>
                        <div className="bg-[#FAF6F0] p-2.5 rounded-[16px]">
                          <div className="text-[10px] text-[#8C7E72] font-black uppercase">Participio</div>
                          <div className="font-extrabold text-[#1E523A] mt-0.5 flex items-center justify-between">
                            <span>{v.participle}</span>
                            <button onClick={() => speakEnglish(v.participle)} className="text-[11px] opacity-70">🔊</button>
                          </div>
                        </div>
                      </div>

                      {/* Botón para desplegar conjugación completa con pronombres */}
                      <button
                        onClick={() => {
                          playPopSound();
                          setShowConjugation(isExpanded ? null : i);
                        }}
                        className="w-full py-2 rounded-[14px] bg-[#F1F7F7] hover:bg-[#E3EFEA] text-[11px] font-black text-[#4E7267] flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>📖</span> {isExpanded ? 'Ocultar conjugación completa' : 'Ver conjugación completa con todos los pronombres (I, You, He/She/It, We, They)'}
                      </button>

                      {/* TABLA DE CONJUGACIÓN COMPLETA */}
                      {isExpanded && (
                        <div className="p-4 rounded-[20px] bg-[#FBF6EF] border border-[#E8DFC8] space-y-3 animate-fadeIn text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* PRESENTE */}
                            <div className="bg-white p-3 rounded-[16px] shadow-sm space-y-1">
                              <span className="text-[10px] font-black uppercase text-[#8C7E72] block border-b pb-1">Presente Simple</span>
                              <div className="flex justify-between"><span>I:</span> <strong>{v.pres_i || `I ${v.base}`}</strong></div>
                              <div className="flex justify-between"><span>You:</span> <strong>{v.pres_you || `You ${v.base}`}</strong></div>
                              <div className="flex justify-between text-[#A84A60]"><span>He/She/It:</span> <strong>{v.pres_he || `He/She/It ${v.base}s`}</strong></div>
                              <div className="flex justify-between"><span>We:</span> <strong>{v.pres_we || `We ${v.base}`}</strong></div>
                              <div className="flex justify-between"><span>They:</span> <strong>{v.pres_they || `They ${v.base}`}</strong></div>
                            </div>

                            {/* PASADO */}
                            <div className="bg-white p-3 rounded-[16px] shadow-sm space-y-1">
                              <span className="text-[10px] font-black uppercase text-[#0369A1] block border-b pb-1">Pasado Simple</span>
                              <div className="flex justify-between"><span>I:</span> <strong>{v.pas_i || `I ${v.past}`}</strong></div>
                              <div className="flex justify-between"><span>You:</span> <strong>{v.pas_you || `You ${v.past}`}</strong></div>
                              <div className="flex justify-between"><span>He/She/It:</span> <strong>{v.pas_he || `He/She/It ${v.past}`}</strong></div>
                              <div className="flex justify-between"><span>We:</span> <strong>{v.pas_we || `We ${v.past}`}</strong></div>
                              <div className="flex justify-between"><span>They:</span> <strong>{v.pas_they || `They ${v.past}`}</strong></div>
                            </div>

                            {/* FUTURO */}
                            <div className="bg-white p-3 rounded-[16px] shadow-sm space-y-1">
                              <span className="text-[10px] font-black uppercase text-[#5B21B6] block border-b pb-1">Futuro (Will & Going)</span>
                              <div className="flex justify-between"><span>I will:</span> <strong>{v.will || `I will ${v.base}`}</strong></div>
                              <div className="flex justify-between"><span>He will:</span> <strong>{v.will_he || `He will ${v.base}`}</strong></div>
                              <div className="flex justify-between"><span>They will:</span> <strong>{v.will_they || `They will ${v.base}`}</strong></div>
                              <div className="pt-1 text-[10px] text-[#7A6E63]">
                                <em>Going to:</em> {v.going || `I am going to ${v.base}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-[11px] text-[#7A6E63] font-medium bg-[#FBF6EF] p-2.5 rounded-[16px] space-y-1">
                        <div>🗣️ <strong>Pronunciación:</strong> /{v.pron}/</div>
                        {v.exPres && <div>• <em>Presente:</em> {v.exPres}</div>}
                        {v.exPast && <div>• <em>Pasado:</em> {v.exPast}</div>}
                        {v.exFut && <div>• <em>Futuro:</em> {v.exFut}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 2: LAS 7 PALABRAS DEL DÍA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#3D352E] flex items-center gap-2">
                  <span>📖</span> 7 Palabras de Vocabulario ({currentDayWords.length})
                </h2>
                <span className="text-[11px] text-[#0369A1] font-bold">Dosis diaria</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentDayWords.map((w, i) => (
                  <div key={i} className="bg-white rounded-[22px] p-4 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#D4EBF8] text-[#0369A1] font-black text-[10px] flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3ECE1] text-[#8C7E72]">{w.cat}</span>
                        <span className="text-[10px] text-[#A89066] font-bold">/{w.pron}/</span>
                      </div>
                      <div className="text-base font-black text-[#3D352E]">{w.word}</div>
                      <div className="text-xs text-[#A84A60] font-bold">{w.es}</div>
                    </div>
                    <button
                      onClick={() => speakEnglish(w.word)}
                      className="w-8 h-8 rounded-full bg-[#F3ECE1] hover:bg-[#FFD6DE] text-xs flex items-center justify-center shadow-sm shrink-0"
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 3: MINI-JUEGO DE EMPAREJAR (MEMORY MATCH) */}
            <div className="bg-white rounded-[28px] p-6 shadow-[8px_10px_22px_rgba(210,190,175,0.22)] border-2 border-[#D9EBD9] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#3D352E] flex items-center gap-2">
                    <span>🎮</span> Mini-Juego: Emparejar Parejas del Día
                  </h3>
                  <p className="text-xs text-[#7A6E63]">Empareja la palabra o verbo en inglés con su significado en español.</p>
                </div>
                <button
                  onClick={handleStartGame}
                  className="px-4 py-2 rounded-[18px] bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-white text-xs font-black shadow-sm"
                >
                  {gameCards.length === 0 ? '▶ Iniciar Juego' : '↺ Reiniciar Parejas'}
                </button>
              </div>

              {gameCards.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {gameCards.map((card, idx) => {
                    const isSelected = selectedCards.includes(idx);
                    let cardStyle = "bg-[#FAF6F0] text-[#4A4139] border border-[#F3ECE1]";
                    if (card.isMatched) {
                      cardStyle = "bg-[#D9EBD9] text-[#1E523A] border-2 border-[#52B788] opacity-60";
                    } else if (isSelected) {
                      cardStyle = "bg-[#FFD6DE] text-[#A84A60] border-2 border-[#FFAAA6] scale-105 shadow-md font-black";
                    }

                    return (
                      <button
                        key={idx}
                        disabled={card.isMatched}
                        onClick={() => handleCardClick(idx)}
                        className={`p-3.5 rounded-[18px] text-xs font-bold text-center transition-all min-h-[55px] flex items-center justify-center ${cardStyle}`}
                      >
                        {card.text}
                      </button>
                    );
                  })}
                </div>
              )}

              {gameWon && (
                <div className="p-4 rounded-[20px] bg-[#D9EBD9] text-[#1E523A] text-xs font-black text-center animate-bounce">
                  🎉 ¡Felicidades! Completaste las parejas del Día {currentDay}. +50 XP registrados.
                </div>
              )}
            </div>

            {/* BOTÓN COMPLETAR DÍA */}
            <div className="pt-2">
              <button
                onClick={() => {
                  playChimeSound();
                  setXp(prev => prev + 100);
                  setStreak(prev => prev + 1);
                  setWaterDrops(prev => prev + 2);
                  setCurrentDay(prev => prev + 1);
                  showSaveNotice(`🎉 ¡Día ${currentDay} completado! +100 XP ganados. ¡Avanzas al Día ${currentDay + 1}!`);
                }}
                className="w-full py-4 rounded-[22px] bg-gradient-to-r from-[#52B788] to-[#40916C] text-white font-black text-sm shadow-md hover:brightness-105 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>⭐</span> ¡He terminado mi meta de hoy! Avanzar al Día {currentDay + 1} (+100 XP)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. DASHBOARD & FOCUS (CON TU PLANTA 🌱 DE REGRESO) */}
        {/* ========================================================= */}
        {activeTab === 'pomodoro' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#FFF4F6] via-[#FFF9F3] to-white rounded-[28px] p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 border border-[#FADCD5] shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <div className="space-y-2 z-10 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs font-black text-[#A84A60]">
                  <span>Good Morning, Lorena!</span>
                  <span>☀️</span>
                </div>
                <h2 className="text-2xl font-black text-[#3D352E] tracking-tight leading-tight">
                  Let&apos;s master your English today! 🎶
                </h2>
                <p className="text-xs text-[#7A6E63] max-w-md font-medium">
                  Comienza tu semana de estudio con bloques de 15 a 20 minutos de inmersión y enfoque.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleStartTimer(15)}
                    className="px-5 py-2.5 rounded-[20px] bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-xs font-black text-white flex items-center gap-2 shadow-sm"
                  >
                    <span>▶</span> Play Focus (15 Min)
                  </button>
                  <button
                    onClick={handleWaterPlant}
                    className="px-4 py-2.5 rounded-[20px] bg-[#D4EBF8] hover:bg-[#BAE6FD] text-[#0369A1] text-xs font-black flex items-center gap-1.5 shadow-sm"
                  >
                    <span>💧</span> Regar Jardín ({waterDrops})
                  </button>
                  <button
                    onClick={toggleFocusAudio}
                    className={`px-4 py-2.5 rounded-[20px] text-xs font-black flex items-center gap-1.5 shadow-sm transition-all ${
                      isAudioPlaying ? 'bg-[#D9EBD9] text-[#1E523A] animate-pulse' : 'bg-white text-[#7A6E63] border'
                    }`}
                  >
                    <span>{isAudioPlaying ? '🌧️' : '🎧'}</span> {isAudioPlaying ? 'Lluvia Relajante Activa' : 'Lluvia Suave'}
                  </button>
                </div>
              </div>

              {/* TU PLANTA VIVA 🌱 */}
              <div className="flex items-center gap-3">
                <div
                  onClick={handleWaterPlant}
                  className="w-24 h-24 rounded-[24px] bg-[#EAF5EC] p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all text-center border-2 border-[#CBEAD0] shadow-sm"
                  title="Toca para regar tu planta"
                >
                  <span className="text-3xl animate-bounce">{plantData[plantStage - 1].icon}</span>
                  <span className="text-[9px] font-black text-[#266245] mt-1 line-clamp-1">{plantData[plantStage - 1].name}</span>
                  <span className="text-[8px] text-[#3E8062] font-bold">Nivel {plantStage}/5</span>
                </div>
              </div>
            </div>

            {/* CRONÓMETRO */}
            <div className="bg-white rounded-[28px] p-6 space-y-4 shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#EAF5EC] text-[#266245] inline-block shadow-sm">
                    Temporizador ☁️
                  </span>
                  <div className="text-base font-black text-[#3D352E] mt-1">Bloque de Inmersión Focalizado</div>
                </div>
                <div className="text-3xl font-black font-mono text-[#FF85A1] bg-[#F3ECE1] rounded-[20px] px-5 py-2 shadow-inner">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[15, 20, 25].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleStartTimer(mins)}
                    className={`py-2.5 rounded-[18px] text-xs font-black transition-all shadow-sm ${
                      pomoMinutes === mins ? 'bg-[#FFD6DE] text-[#A84A60]' : 'bg-white text-[#695F56] border'
                    }`}
                  >
                    🌸 {mins} Minutos
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    playPopSound();
                    setIsRunning(!isRunning);
                  }}
                  className={`flex-1 py-3.5 rounded-[20px] text-xs font-black text-white transition-all shadow-sm ${
                    isRunning ? 'bg-[#FF85A1]' : 'bg-[#52B788]'
                  }`}
                >
                  {isRunning ? '⏸️ Pausar Bloque' : '▶️ Iniciar Estudio (+XP)'}
                </button>
                <button
                  onClick={() => {
                    playPopSound();
                    setIsRunning(false);
                    setTimeLeft(pomoMinutes * 60);
                  }}
                  className="px-5 py-3.5 rounded-[20px] text-xs font-black bg-white text-[#695F56] border"
                >
                  ↺ Reiniciar
                </button>
              </div>
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {[
                { label: 'Puntos XP', val: `${xp}`, sub: 'Nivel Explorer', icon: '⭐', bg: 'bg-[#FFF1C5]' },
                { label: 'Racha Diaria', val: `${streak} Días`, sub: 'Activa hoy', icon: '🔥', bg: 'bg-[#FFD6DE]' },
                { label: 'Minutos Totales', val: `${totalMinutes}m`, sub: `${(totalMinutes / 60).toFixed(1)}h acumuladas`, icon: '⏱️', bg: 'bg-[#D4EBF8]' },
                { label: 'Día de Ruta', val: `Día ${currentDay}`, sub: '3V + 7P diarios', icon: '🗺️', bg: 'bg-[#D9EBD9]' }
              ].map((m, idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-4 flex flex-col justify-between h-32 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1]">
                  <div className={`w-9 h-9 rounded-[16px] ${m.bg} flex items-center justify-center text-lg`}>
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-[#8C7E72]">{m.label}</div>
                    <div className="text-xl font-black text-[#3D352E] mt-0.5">{m.val}</div>
                    <div className="text-[9px] font-bold text-[#A89066]">{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* RACHA SEMANAL */}
            <div className="bg-white rounded-[26px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-3">
              <div className="text-xs font-black text-[#3D352E]">Racha Semanal de Aprendizaje</div>
              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      playPopSound();
                      const updated = [...weeklyActive];
                      updated[i] = !updated[i];
                      setWeeklyActive(updated);
                    }}
                    className={`py-3 rounded-[18px] text-center cursor-pointer transition-all ${
                      weeklyActive[i] ? 'bg-[#D9EBD9] text-[#1E523A] font-black scale-105 shadow-sm' : 'bg-[#FAF6F0] text-[#A3978C] font-semibold'
                    }`}
                  >
                    <div className="text-[10px]">{day}</div>
                    <div className="text-xs mt-1">{weeklyActive[i] ? '✓' : '•'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. BUSCADOR GLOBAL DE VERBOS (2,151) */}
        {/* ========================================================= */}
        {activeTab === 'verbos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Buscador de Verbos <span>⚡</span>
                </h1>
                <p className="text-[#7A6E63] text-xs mt-1">Consulta los 2,151 verbos conjugados de tus archivos de Excel.</p>
              </div>

              <div className="flex gap-2">
                {['TODOS', 'Irregular', 'Regular'].map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      playPopSound();
                      setVerbFilter(f);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                      verbFilter === f ? 'bg-[#FFD6DE] text-[#A84A60] shadow-sm' : 'bg-white text-[#7A6E63] border'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-4 flex items-center gap-3 shadow-[6px_8px_18px_rgba(210,190,175,0.18)]">
              <span className="text-lg">🔍</span>
              <input
                type="text"
                value={verbSearch}
                onChange={e => setVerbSearch(e.target.value)}
                placeholder="Buscar verbo en inglés o español (ej. be, think, comprar, speak)..."
                className="w-full bg-transparent border-none text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none font-medium"
              />
              {verbSearch && (
                <button onClick={() => setVerbSearch('')} className="text-xs text-[#8C7E72]">✕</button>
              )}
            </div>

            <div className="space-y-3">
              {(allVerbs.length > 0 ? allVerbs : currentDayVerbs)
                .filter(v => {
                  const matchesSearch = v.base.toLowerCase().includes(verbSearch.toLowerCase()) || v.es.toLowerCase().includes(verbSearch.toLowerCase());
                  if (verbFilter === 'TODOS') return matchesSearch;
                  return matchesSearch && v.type.toLowerCase().includes(verbFilter.toLowerCase());
                })
                .slice(0, 30)
                .map((v, idx) => (
                  <div key={idx} className="bg-white rounded-[24px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-[#3D352E]">{v.base}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3EFEA] text-[#245445]">{v.type}</span>
                        <span className="text-[10px] text-[#8C7E72]">Día {v.day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#A84A60]">{v.es}</span>
                        <button onClick={() => speakEnglish(v.base)} className="w-8 h-8 rounded-full bg-[#F3ECE1] text-xs">🔊</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-[#FAF6F0] p-2 rounded-[14px]">
                        <div className="text-[10px] text-[#8C7E72] font-black uppercase">Presente</div>
                        <div className="font-extrabold text-[#3D352E]">{v.base}</div>
                      </div>
                      <div className="bg-[#FAF6F0] p-2 rounded-[14px]">
                        <div className="text-[10px] text-[#8C7E72] font-black uppercase">Pasado</div>
                        <div className="font-extrabold text-[#0369A1]">{v.past}</div>
                      </div>
                      <div className="bg-[#FAF6F0] p-2 rounded-[14px]">
                        <div className="text-[10px] text-[#8C7E72] font-black uppercase">Futuro</div>
                        <div className="font-extrabold text-[#5B21B6]">{v.will || `I will ${v.base}`}</div>
                      </div>
                      <div className="bg-[#FAF6F0] p-2 rounded-[14px]">
                        <div className="text-[10px] text-[#8C7E72] font-black uppercase">Participio</div>
                        <div className="font-extrabold text-[#1E523A]">{v.participle}</div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. VOCABULARIO ESENCIAL (5,000 PALABRAS + BONO 5 + FALSOS AMIGOS) */}
        {/* ========================================================= */}
        {activeTab === 'vocabulario' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Vocabulario Esencial <span>📖</span>
                </h1>
                <p className="text-[#7A6E63] text-xs mt-1">5,000 palabras de Excel + 100 frases del Bono 5 + Falsos amigos.</p>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: '200_SUSTANTIVOS', label: `Excel 5,000 Palabras` },
                  { id: 'BONO_5_FRASES', label: `Bono 5 (100 Frases)` },
                  { id: 'FALSOS_AMIGOS', label: `Falsos Amigos` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playPopSound();
                      setVocabTab(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${
                      vocabTab === tab.id ? 'bg-[#FFD6DE] text-[#A84A60] shadow-sm' : 'bg-white text-[#8C7E72] border'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-4 flex items-center gap-3 shadow-[6px_8px_18px_rgba(210,190,175,0.18)]">
              <span className="text-lg">🔍</span>
              <input
                type="text"
                value={vocabSearch}
                onChange={e => setVocabSearch(e.target.value)}
                placeholder="Buscar palabra o traducción..."
                className="w-full bg-transparent border-none text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none font-medium"
              />
            </div>

            {vocabTab === 'BONO_5_FRASES' && (
              <div className="grid grid-cols-1 gap-3.5">
                {phrases100List
                  .filter(p => p.en.toLowerCase().includes(vocabSearch.toLowerCase()) || p.es.toLowerCase().includes(vocabSearch.toLowerCase()))
                  .map((phrase, idx) => (
                    <div key={idx} className="bg-white rounded-[24px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E3EFEA] text-[#245445]">
                          #{phrase.num} • {phrase.situation}
                        </span>
                        <button onClick={() => speakEnglish(phrase.en)} className="w-8 h-8 rounded-full bg-[#FFD6DE] text-xs">🔊</button>
                      </div>
                      <div className="text-base font-black text-[#3D352E]">{phrase.en}</div>
                      <div className="text-xs font-bold text-[#A84A60]">{phrase.es}</div>
                      <div className="bg-[#FAF6F0] p-2 rounded-[14px] text-xs italic">/{phrase.pron}/</div>
                    </div>
                  ))}
              </div>
            )}

            {vocabTab === '200_SUSTANTIVOS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(allWords.length > 0 ? allWords : currentDayWords)
                  .filter(w => w.word.toLowerCase().includes(vocabSearch.toLowerCase()) || w.es.toLowerCase().includes(vocabSearch.toLowerCase()))
                  .slice(0, 40)
                  .map((w, idx) => (
                    <div key={idx} className="bg-white rounded-[22px] p-4 shadow-sm border border-[#F3ECE1] flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#E3EFEA] text-[#245445]">{w.cat || 'General'}</span>
                          <span className="text-[10px] text-[#A89066] font-bold">/{w.pron}/</span>
                        </div>
                        <div className="text-sm font-black text-[#3D352E]">{w.word}</div>
                        <div className="text-xs text-[#A84A60] font-bold">{w.es}</div>
                      </div>
                      <button onClick={() => speakEnglish(w.word)} className="w-8 h-8 rounded-full bg-[#F3ECE1] text-xs">🔊</button>
                    </div>
                  ))}
              </div>
            )}

            {vocabTab === 'FALSOS_AMIGOS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {falseFriendsList.map((item, idx) => (
                  <div key={idx} className="bg-white rounded-[24px] p-4 space-y-2 border-2 border-[#FFD6DE] shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#3D352E]">{item.en}</span>
                      <button onClick={() => speakEnglish(item.en)} className="w-8 h-8 rounded-full bg-white text-xs">🔊</button>
                    </div>
                    <div className="text-[11px] text-[#8C341E] font-bold">⚠️ Parece: <span className="line-through">{item.parece}</span></div>
                    <div className="text-xs text-[#1E523A] font-black">✅ Significa: {item.es}</div>
                    <div className="bg-[#F3ECE1] rounded-[14px] p-2 text-[11px] text-[#5C524A] italic">&quot;{item.ejemplo}&quot;</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. HUB DE PLATAFORMAS (CON LOS BOTONES DE COLORES QUE TE GUSTABAN) */}
        {/* ========================================================= */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Hub de Plataformas & Recursos Gratuitos <span>🌐</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">
                Tus 14 plataformas gratuitas seleccionadas con acceso directo para entrenar listening, vocabulario y juegos.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {platformsList.map((p, idx) => (
                <div key={idx} className="bg-white rounded-[24px] p-5 flex flex-col justify-between shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1]">
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className={`w-11 h-11 rounded-[18px] ${p.bg} flex items-center justify-center text-xl shadow-sm`}>
                        {p.icon}
                      </span>
                      <h3 className="font-black text-[#3D352E] text-sm">{p.title}</h3>
                    </div>
                    <p className="text-xs text-[#6B5E55] leading-relaxed font-medium">{p.desc}</p>
                  </div>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playPopSound}
                    className={`mt-4 text-center py-2.5 rounded-[18px] font-black text-xs shadow-sm ${p.btnBg} block`}
                  >
                    {p.btn} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. BIBLIOTECA DE CURSOS */}
        {/* ========================================================= */}
        {activeTab === 'cursos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Biblioteca de Cursos <span>📚</span>
                </h1>
                <p className="text-[#7A6E63] text-xs mt-1">Tus 3 programas de inglés con accesos directos y control semanal.</p>
              </div>
              <a
                href="https://consumer.hotmart.com"
                target="_blank"
                onClick={playPopSound}
                className="px-5 py-2.5 rounded-[20px] bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-xs font-black text-white flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto shadow-sm"
              >
                <span>👑</span> Abrir Mi Cuenta Hotmart ↗
              </a>
            </div>

            <div className="bg-white rounded-[28px] p-5 sm:p-6 space-y-4 border-2 border-[#FFE4B5] overflow-hidden shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#FFF1C5] text-[#8C6200] inline-block shadow-sm">
                    Curso 1 • Portal Oficial Propio 📱
                  </span>
                  <h2 className="text-base font-black text-[#3D352E]">Inglés Práctico (App & Biblioteca)</h2>
                  <p className="text-xs text-[#6B5E55]">Acceso directo a tus clases, material en PDF de cada lección y asistente con IA.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="https://app.inglespractico.info"
                    target="_blank"
                    onClick={playPopSound}
                    className="px-4 py-2 rounded-[18px] bg-[#FFAAA6] hover:bg-[#FF85A1] text-white font-black text-xs shadow-sm whitespace-nowrap"
                  >
                    🚀 Abrir App
                  </a>
                  <a
                    href="https://app.inglespractico.info"
                    target="_blank"
                    onClick={playPopSound}
                    className="px-4 py-2 rounded-[18px] bg-[#FFF1C5] text-[#8C6200] font-black text-xs shadow-sm whitespace-nowrap"
                  >
                    📖 PDFs
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3E7DC] flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <span className="text-xs font-bold text-[#6D635B] whitespace-nowrap">Semana completada:</span>
                <select
                  value={ipWeek}
                  onChange={e => {
                    playPopSound();
                    setIpWeek(Number(e.target.value));
                  }}
                  className="flex-1 min-w-[180px] bg-[#F3ECE1] rounded-[20px] p-2.5 text-xs font-black text-[#3D352E] focus:outline-none shadow-inner"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Semana {i + 1} de 12 (Activación Neural)</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    playChimeSound();
                    setWaterDrops(prev => prev + 1);
                    showSaveNotice(`Inglés Práctico guardado en Semana ${ipWeek}`);
                  }}
                  className="px-5 py-2.5 rounded-[18px] bg-[#52B788] hover:bg-[#40916C] text-white font-black text-xs shadow-sm whitespace-nowrap ml-auto sm:ml-0"
                >
                  💾 Guardar Avance
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 sm:p-6 space-y-4 border-2 border-[#BAE6FD] overflow-hidden shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#D4EBF8] text-[#0369A1] inline-block shadow-sm">
                    Curso 2 • Método Inmersivo 🎬
                  </span>
                  <h2 className="text-base font-black text-[#3D352E]">Gringo Academy (Hotmart Club)</h2>
                  <p className="text-xs text-[#6B5E55]">Telenovelas, episodios y entrenamiento auditivo continuo.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    onClick={playPopSound}
                    className="px-4 py-2 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs shadow-sm whitespace-nowrap"
                  >
                    🎬 Ver en Hotmart ↗
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3E7DC] flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <span className="text-xs font-bold text-[#6D635B] whitespace-nowrap">Telenovela / Bloque:</span>
                <input
                  type="number"
                  min="1"
                  max="130"
                  value={gringoUnit}
                  onChange={e => {
                    playPopSound();
                    setGringoUnit(Number(e.target.value));
                  }}
                  className="w-24 bg-[#F3ECE1] rounded-[20px] p-2.5 text-xs font-black text-[#3D352E] focus:outline-none shadow-inner"
                />
                <span className="text-xs text-[#8C7E72] font-semibold">de 130</span>
                <div className="flex-1 hidden sm:block"></div>
                <button
                  onClick={() => {
                    playChimeSound();
                    setWaterDrops(prev => prev + 1);
                    showSaveNotice(`Gringo Academy guardado en Telenovela ${gringoUnit}`);
                  }}
                  className="px-5 py-2.5 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs shadow-sm whitespace-nowrap ml-auto sm:ml-0"
                >
                  💾 Guardar Telenovela
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[28px] p-5 sm:p-6 space-y-4 border-2 border-[#DDD6FE] overflow-hidden shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#E6DCF5] text-[#5B21B6] inline-block shadow-sm">
                    Curso 3 • Reprogramación Subconsciente 🧠
                  </span>
                  <h2 className="text-base font-black text-[#3D352E]">Activación Neural: Audios & Subconsciente</h2>
                  <p className="text-xs text-[#6B5E55]">Sesiones de audio guiadas y acondicionamiento auditivo profundo en Hotmart.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    onClick={playPopSound}
                    className="px-4 py-2 rounded-[18px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-xs shadow-sm whitespace-nowrap"
                  >
                    🎧 Abrir en Hotmart ↗
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3E7DC] flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <span className="text-xs font-bold text-[#6D635B] whitespace-nowrap">Módulo activo:</span>
                <select
                  value={neuralWeek}
                  onChange={e => {
                    playPopSound();
                    setNeuralWeek(Number(e.target.value));
                  }}
                  className="flex-1 min-w-[180px] bg-[#F3ECE1] rounded-[20px] p-2.5 text-xs font-black text-[#3D352E] focus:outline-none shadow-inner"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Fase {i + 1}: Reprogramación & Escucha Diaria</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    playChimeSound();
                    setWaterDrops(prev => prev + 1);
                    showSaveNotice(`Activación Neural guardada en Fase ${neuralWeek}`);
                  }}
                  className="px-5 py-2.5 rounded-[18px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-xs shadow-sm whitespace-nowrap ml-auto sm:ml-0"
                >
                  💾 Guardar Fase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. LISTENING & INMERSIÓN */}
        {/* ========================================================= */}
        {activeTab === 'listening' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Listening & Gimnasio Auditivo <span>🎧</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Estrategias y clips para acostumbrar el oído al inglés a velocidad nativa.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-[28px] p-6 space-y-3 shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60] inline-block shadow-sm">
                  Método 1 • Connected Speech
                </span>
                <h3 className="font-black text-sm text-[#3D352E]">El Filtro YouGlish 🎬</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Los nativos enlazan sonidos (por ejemplo, going to suena gonna). Busca frases cortas en YouGlish para entrenar el oído a la cadencia real.
                </p>
                <a
                  href="https://youglish.com/pronounce/english"
                  target="_blank"
                  onClick={playPopSound}
                  className="inline-block px-5 py-2.5 rounded-[18px] bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-xs font-black text-white shadow-sm"
                >
                  Probar en YouGlish ↗
                </a>
              </div>

              <div className="bg-white rounded-[28px] p-6 space-y-3 shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D4EBF8] text-[#1E6091] inline-block shadow-sm">
                  Método 2 • Micro-Inmersión
                </span>
                <h3 className="font-black text-sm text-[#3D352E]">BBC 6 Minute English 📻</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Escucha un episodio breve de 6 minutos sin leer. En la segunda vuelta, sigue la transcripción para identificar exactamente los sonidos que no captaste al inicio.
                </p>
                <a
                  href="https://www.bbc.co.uk/learningenglish/features/6-minute-english"
                  target="_blank"
                  onClick={playPopSound}
                  className="inline-block px-5 py-2.5 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs shadow-sm"
                >
                  Escuchar BBC 6-Minute ↗
                </a>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[6px_8px_18px_rgba(210,190,175,0.18)]">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-[20px] bg-[#D9EBD9] flex items-center justify-center text-2xl shrink-0 shadow-sm">
                  🎧
                </div>
                <div>
                  <div className="text-xs font-black text-[#3D352E]">Meta de Escucha Diaria: 20 Minutos</div>
                  <div className="text-[11px] text-[#7A6E63] font-semibold">Podcasts, audio-lecciones de Gringo Academy o videos YouGlish.</div>
                </div>
              </div>
              <button
                onClick={() => {
                  playChimeSound();
                  setXp(prev => prev + 30);
                  setTotalMinutes(prev => prev + 20);
                  setWaterDrops(prev => prev + 2);
                  showSaveNotice('20 min de Listening registrados! +30 XP');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-[18px] bg-[#52B788] hover:bg-[#40916C] text-white font-black text-xs shadow-sm whitespace-nowrap"
              >
                ✅ Marcar como Completado (+30 XP)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 8. WRITING CLINIC */}
        {/* ========================================================= */}
        {activeTab === 'writing' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Writing Clinic: Taller Editorial <span>✍️</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Escribe borradores, diarios o correos y recíbelos pulidos con nivel nativo.</p>
            </div>

            <div className="bg-white rounded-[28px] p-6 sm:p-7 space-y-4 shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#E6DCF5] text-[#5B21B6] inline-block shadow-sm">
                  Sincronizado con Notion 📓
                </span>
                <span className="text-xs text-[#7A6E63] font-semibold">Borrador persistente</span>
              </div>

              <div>
                <label className="block text-xs font-black text-[#3D352E] mb-2">Tipo de texto a redactar:</label>
                <select
                  value={writingType}
                  onChange={e => {
                    playPopSound();
                    setWritingType(e.target.value);
                  }}
                  className="w-full bg-[#F3ECE1] rounded-[20px] p-3 text-xs font-black text-[#3D352E] focus:outline-none shadow-inner"
                >
                  <option>Diario personal / Reflexion del dia</option>
                  <option>Correo electronico profesional o de negocios</option>
                  <option>Resumen de lo aprendido hoy</option>
                  <option>Redaccion libre sobre un tema</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#3D352E] mb-2">Tu texto en inglés:</label>
                <textarea
                  value={writingText}
                  onChange={e => setWritingText(e.target.value)}
                  placeholder="Write your thoughts in English here..."
                  rows={5}
                  className="w-full bg-[#F3ECE1] rounded-[20px] p-4 text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none transition-all font-medium shadow-inner"
                />
              </div>

              <button
                onClick={handleAnalyzeWriting}
                disabled={isWritingAnalyzing}
                className="w-full py-3.5 rounded-[20px] bg-[#E6DCF5] hover:bg-[#D5C2ED] text-[#5B21B6] font-black text-xs shadow-sm disabled:opacity-50"
              >
                {isWritingAnalyzing ? 'Analizando redacción...' : '✨ Analizar y Guardar en Notion (+60 XP)'}
              </button>

              {writingFeedback && (
                <div className="bg-[#FAF6F0] rounded-[20px] p-5 text-xs whitespace-pre-line text-[#403833] leading-relaxed font-medium shadow-inner">
                  {writingFeedback}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 9. RUTA DE HITOS */}
        {/* ========================================================= */}
        {activeTab === 'milestones' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Ruta Curricular de Hitos (A0 a C2) <span>🗺️</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">El mapa de gramática, objetivos y competencias del Marco Común Europeo.</p>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1.5">
              {[
                { id: 'A0', label: 'A0: Starter', color: 'bg-[#FFD6DE] text-[#A84A60]' },
                { id: 'A1', label: 'A1: Elemental', color: 'bg-[#D4EBF8] text-[#1E6091]' },
                { id: 'A2', label: 'A2: Pre-Intermedio', color: 'bg-[#D9EBD9] text-[#1E523A]' },
                { id: 'B1', label: 'B1: Intermedio', color: 'bg-[#E6DCF5] text-[#5B21B6]' },
                { id: 'B2', label: 'B2: Fluidez', color: 'bg-[#FFD6DE] text-[#A84A60]' },
                { id: 'C1', label: 'C1: Avanzado', color: 'bg-[#FFF1C5] text-[#7A5B00]' },
                { id: 'C2', label: 'C2: Nativo', color: 'bg-[#EAF5EC] text-[#266245]' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    playPopSound();
                    setSelectedMilestone(lvl.id);
                  }}
                  className={`px-4 py-2.5 rounded-[18px] text-xs font-black transition-all shrink-0 ${
                    selectedMilestone === lvl.id
                      ? `${lvl.color} scale-105 shadow-sm`
                      : 'bg-white text-[#695F56] shadow-sm'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[28px] p-6 sm:p-7 space-y-4 shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              {selectedMilestone === 'A0' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60] inline-block shadow-sm">Nivel A0 • Primeros Pasos</span>
                  <h3 className="text-base font-black text-[#3D352E]">Fundamentos Absolutos y Desbloqueo Inicial</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Verbo To Be en afirmación, negación y pregunta. Pronombres personales y adjetivos posesivos.</li>
                    <li>• <strong>Expresiones fijas:</strong> Edad (I am 38 years old), origen y alfabeto.</li>
                    <li>• <strong>Meta evaluable:</strong> Presentarte a ti misma con pronunciación clara.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'A1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D4EBF8] text-[#1E6091] inline-block shadow-sm">Nivel A1 • Elemental</span>
                  <h3 className="text-base font-black text-[#3D352E]">Rutinas y Entorno Cotidiano</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Presente Simple (regla de tercera persona con -s/-es), auxiliares do / does y preposiciones.</li>
                    <li>• <strong>Meta evaluable:</strong> Describir tu día típico de la mañana a la noche.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'A2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D9EBD9] text-[#1E523A] inline-block shadow-sm">Nivel A2 • Pre-Intermedio</span>
                  <h3 className="text-base font-black text-[#3D352E]">Pasado, Planes y Experiencias Inmediatas</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática:</strong> Pasado Simple regular (-ed) y verbos irregulares clave, pasado continuo, y futuro con going to vs will.</li>
                    <li>• <strong>Meta:</strong> Contar qué hiciste el fin de semana pasado.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'B1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#E6DCF5] text-[#5B21B6] inline-block shadow-sm">Nivel B1 • Intermedio Independiente</span>
                  <h3 className="text-base font-black text-[#3D352E]">Autonomía Conversacional y Trabajo</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática:</strong> Present Perfect, condicionales y verbos modales.</li>
                    <li>• <strong>Meta:</strong> Mantener una conversación fluida de 15 minutos sobre tus proyectos.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'B2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60] inline-block shadow-sm">Nivel B2 • Fluidez Profesional</span>
                  <h3 className="text-base font-black text-[#3D352E]">Dominio Laboral y Fluidez Espontánea</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática:</strong> Condicionales avanzados, voz pasiva y phrasal verbs idiomáticos.</li>
                    <li>• <strong>Meta:</strong> Participar en reuniones internacionales.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'C1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFF1C5] text-[#7A5B00] inline-block shadow-sm">Nivel C1 • Avanzado Operativo</span>
                  <h3 className="text-base font-black text-[#3D352E]">Dominio Académico y Especializado</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática:</strong> Inversión gramatical enfática y estilo formal.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'C2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#EAF5EC] text-[#266245] inline-block shadow-sm">Nivel C2 • Maestría Nativa</span>
                  <h3 className="text-base font-black text-[#3D352E]">Bilingüismo Completo y Espontaneidad</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Competencias:</strong> Captar ironías, modismos culturales y control total del tono.</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}