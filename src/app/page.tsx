'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  vocab200List,
  vocab500List,
  falseFriendsList,
  phrases100List,
  verbsEssentialList
} from './vocabularyData';

export default function EnglishMasteryHome() {
  const [activeTab, setActiveTab] = useState('pomodoro');

  // Métricas
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [waterDrops, setWaterDrops] = useState(3);
  const [plantStage, setPlantStage] = useState(1);
  const [weeklyActive, setWeeklyActive] = useState<boolean[]>([true, false, false, false, false, false, false]);

  // Audio Ambiental Lofi / Lluvia
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sfxCtxRef = useRef<AudioContext | null>(null);

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

  // Frase inspiracional
  const [quoteIdx, setQuoteIdx] = useState(0);
  const quotes = [
    { en: 'Small daily steps every day lead to big changes.', es: 'Pequeños pasos diarios conducen a grandes cambios.' },
    { en: 'Fluency is consistency in action, not overnight magic.', es: 'La fluidez es constancia en acción, no magia de la noche a la mañana.' },
    { en: 'Focus for twenty quiet minutes, and let time do the rest.', es: 'Concéntrate veinte minutos en calma y deja que el tiempo haga el resto.' },
    { en: 'Your dedication today opens global doors tomorrow.', es: 'Tu dedicación de hoy abre puertas globales mañana.' }
  ];

  // Voz nativa Web Speech
  const speakEnglish = (text: string) => {
    playPopSound();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const clean = text.replace(/^[A-D]\s+/, '').split('/')[0].split('(')[0].trim();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;

        window.speechSynthesis.speak(utterance);
      } catch {}
    }
  };

  // Temporizador Pomodoro
  const [pomoMinutes, setPomoMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Estados de Flashcards
  const flashcardsData = [
    { cat: 'Viajes & Hotel', front: "Where's the check-in counter?", back: '¿Dónde está el mostrador de check-in? (/uérs de chék-in káunter/)' },
    { cat: 'Restaurante', front: 'Can I have the check, please?', back: '¿Me trae la cuenta, por favor? (/kan ái jav de chek, plis/)' },
    { cat: 'Frase Salvavidas', front: 'Could you speak more slowly, please?', back: '¿Podrías hablar más despacio, por favor? (/kud iu spík mor slóuli/)' },
    { cat: 'Conversación', front: "I don't think we've met before.", back: 'Creo que no nos conocíamos. (/ái dóunt zink uív met bifór/)' },
    { cat: 'Compras', front: 'Can I try it on?', back: '¿Me lo puedo probar? (/kan ái trái it on/)' },
    { cat: 'Verbos Clave', front: 'Get (Present) ➔ Got (Past)', back: 'Conseguir, llegar, ponerse (/guet · got/)' },
    { cat: 'Verbos Clave', front: 'Think (Present) ➔ Thought (Past)', back: 'Pensar, creer (/zink · zot/)' },
    { cat: 'Falsos Amigos', front: 'Actually = ???', back: 'Significa "En realidad / De hecho", ¡NO "Actualmente"!' }
  ];
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsMastered, setCardsMastered] = useState(0);

  // Estados de Quizzes Interactivos
  const quizQuestions = [
    {
      q: '¿Cómo pides educadamente que alguien hable más despacio?',
      options: [
        'A) Speak fast, please!',
        'B) Could you speak more slowly, please?',
        'C) I want slow talk now.',
        'D) What does slowly mean?'
      ],
      correct: 1,
      explain: 'B es la fórmula cortés correcta del Bono 5: "Could you speak more slowly, please?".'
    },
    {
      q: '¿Cuál es el pasado simple irregular del verbo "Think" (pensar)?',
      options: [
        'A) Thinked',
        'B) Thank',
        'C) Thought',
        'D) Thunk'
      ],
      correct: 2,
      explain: 'El pasado de Think es Thought (/zot/).'
    },
    {
      q: '¿Qué significa realmente el falso amigo "Actually"?',
      options: [
        'A) Actualmente',
        'B) En realidad / De hecho',
        'C) En acción',
        'D) A menudo'
      ],
      correct: 1,
      explain: 'Actually significa "de hecho" o "en realidad". "Actualmente" se dice Currently o Nowadays.'
    },
    {
      q: '¿Cómo pides la cuenta en un restaurante en EE.UU.?',
      options: [
        'A) Give me the cost',
        'B) Can I have the check, please?',
        'C) The bill is finished',
        'D) Money please'
      ],
      correct: 1,
      explain: 'En EE.UU. se dice "the check" y en Reino Unido "the bill".'
    },
    {
      q: '¿Cuál es el pasado del verbo irregular "Go" (ir)?',
      options: [
        'A) Gone',
        'B) Went',
        'C) Goed',
        'D) Going'
      ],
      correct: 1,
      explain: 'Go en pasado simple es Went. (Gone es el participio).'
    }
  ];
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Estados de Verbos
  const [verbSearch, setVerbSearch] = useState('');
  const [verbFilter, setVerbFilter] = useState('TODOS');

  // Estados de Frases
  const [phraseSearch, setPhraseSearch] = useState('');
  const [selectedSituation, setSelectedSituation] = useState('TODAS');

  // Estados de Vocabulario
  const [vocabTab, setVocabTab] = useState('200_SUSTANTIVOS');
  const [vocabSearch, setVocabSearch] = useState('');

  // Planta Viva
  const plantData = [
    { icon: '🌱', name: 'Semillita Brotando' },
    { icon: '🌿', name: 'Brote Fuerte' },
    { icon: '🪴', name: 'Planta de Focus' },
    { icon: '🌸', name: 'Flor Florecida' },
    { icon: '🌳', name: 'Árbol Sabio Dorado' }
  ];

  // Cargar datos guardados
  useEffect(() => {
    const sXp = localStorage.getItem('em_xp');
    const sMins = localStorage.getItem('em_mins');
    const sStreak = localStorage.getItem('em_streak');
    const sWater = localStorage.getItem('em_water');
    const sPlant = localStorage.getItem('em_plant');
    const sCards = localStorage.getItem('em_mastered_cards');
    const sWeek = localStorage.getItem('em_week');

    if (sXp) setXp(Number(sXp));
    if (sMins) setTotalMinutes(Number(sMins));
    if (sStreak) setStreak(Number(sStreak));
    if (sWater) setWaterDrops(Number(sWater));
    if (sPlant) setPlantStage(Number(sPlant));
    if (sCards) setCardsMastered(Number(sCards));
    if (sWeek) {
      try { setWeeklyActive(JSON.parse(sWeek)); } catch {}
    }
  }, []);

  // Guardar datos
  useEffect(() => {
    localStorage.setItem('em_xp', xp.toString());
    localStorage.setItem('em_mins', totalMinutes.toString());
    localStorage.setItem('em_streak', streak.toString());
    localStorage.setItem('em_water', waterDrops.toString());
    localStorage.setItem('em_plant', plantStage.toString());
    localStorage.setItem('em_mastered_cards', cardsMastered.toString());
    localStorage.setItem('em_week', JSON.stringify(weeklyActive));
  }, [xp, totalMinutes, streak, waterDrops, plantStage, cardsMastered, weeklyActive]);

  const showSaveNotice = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3800);
  };

  const handleResetProgress = () => {
    playPopSound();
    const confirmed = window.confirm('¿Quieres reiniciar tus estadísticas de prueba a 0 para comenzar de nuevo?');
    if (confirmed) {
      localStorage.clear();
      setXp(0);
      setTotalMinutes(0);
      setStreak(1);
      setWaterDrops(3);
      setPlantStage(1);
      setCardsMastered(0);
      setWeeklyActive([true, false, false, false, false, false, false]);
      playChimeSound();
      showSaveNotice('✨ ¡Progreso reiniciado a cero con éxito!');
    }
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
        filter.frequency.setValueAtTime(650, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        setIsAudioPlaying(true);
        showSaveNotice('🌧️ Audio ambiental relajante activado');
      } catch {
        showSaveNotice('Toca la pantalla para activar el audio');
      }
    }
  };

  // Temporizador
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
      playChimeSound();
      showSaveNotice(`¡Sesión de ${pomoMinutes}m completada! +${earnedXp} XP`);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, pomoMinutes]);

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // 14 Plataformas del Hub
  const platformsList = [
    { title: 'BaBaDum (1500 Palabras)', desc: 'Juega y aprende 1500 palabras con ilustraciones y 5 juegos interactivos rápidos.', link: 'https://babadum.com', btn: 'Jugar BaBaDum', icon: '🦅', bg: 'bg-[#FFF1C5]' },
    { title: 'inglés.com (Diccionario Definitivo)', desc: 'Traductor, vocabulario, comparador de palabras y conjugador verbal completo.', link: 'https://www.ingles.com', btn: 'Abrir inglés.com', icon: '📖', bg: 'bg-[#D4EBF8]' },
    { title: 'Cambridge Learning Activities', desc: '175 actividades interactivas oficiales de gramática, vocabulario y listening por nivel.', link: 'https://www.cambridgeenglish.org/learning-english/activities-for-learners/', btn: 'Abrir Cambridge', icon: '🏛️', bg: 'bg-[#D9EBD9]' },
    { title: 'ELLLO (Listening Real)', desc: 'Más de 3000 lecciones de audio con hablantes reales de todo el mundo y transcripción (A1 a C1).', link: 'https://www.elllo.org', btn: 'Abrir ELLLO', icon: '🎧', bg: 'bg-[#E6DCF5]' },
    { title: 'TED-Ed Lessons', desc: 'Animaciones cortas y conferencias educativas con preguntas de comprensión en inglés.', link: 'https://ed.ted.com/lessons', btn: 'Ver TED-Ed', icon: '🎬', bg: 'bg-[#FFD6DE]' },
    { title: 'LanguageGuide.org', desc: 'Exploración de vocabulario visual con pronunciación instantánea al pasar el cursor.', link: 'https://www.languageguide.org/english/', btn: 'Abrir LanguageGuide', icon: '🌍', bg: 'bg-[#FFF1C5]' },
    { title: 'Games to Learn English', desc: 'Juegos online para entrenar Monster Vocab, adjetivos, frases y gramática jugando.', link: 'https://www.gamestolearnenglish.com', btn: 'Abrir Games English', icon: '🎮', bg: 'bg-[#D4EBF8]' },
    { title: 'Cambridge Dictionary', desc: 'Diccionario con audio británico y americano oficial y transcripción fonética IPA.', link: 'https://dictionary.cambridge.org', btn: 'Abrir Diccionario', icon: '📕', bg: 'bg-[#FFD6DE]' },
    { title: 'AVI UNAM (Práctica Libre)', desc: 'Fichas gramaticales, audios y ejercicios de autoevaluación gratuitos de A1 a B2.', link: 'https://avi.cuaed.unam.mx/idioma-ingles.html', btn: 'Abrir AVI UNAM', icon: '🎓', bg: 'bg-[#FFF1C5]' },
    { title: 'Speak & Improve (Cambridge IA)', desc: 'Evaluador acústico oficial de Cambridge con IA para medir tu pronunciación y nivel.', link: 'https://speakandimprove.com', btn: 'Abrir Speak&Improve', icon: '🤖', bg: 'bg-[#D9EBD9]' },
    { title: 'Duolingo Web', desc: 'Práctica ágil de vocabulario y racha diaria de gramática interactiva.', link: 'https://www.duolingo.com', btn: 'Abrir Duolingo', icon: '🦉', bg: 'bg-[#D9EBD9]' },
    { title: 'YouGlish (Contexto Real)', desc: 'Escribe cualquier frase y escúchala pronunciada en clips reales de YouTube.', link: 'https://youglish.com/pronounce/english', btn: 'Abrir YouGlish', icon: '📺', bg: 'bg-[#FFF1C5]' },
    { title: 'BBC Learning English', desc: 'Episodios de 6 minutos (*6 Minute English*) y pronunciación clara.', link: 'https://www.bbc.co.uk/learningenglish', btn: 'Abrir BBC English', icon: '📻', bg: 'bg-[#E6DCF5]' },
    { title: 'LingoClip (LyricsTraining)', desc: 'Entrena tu comprensión auditiva rellenando la letra de tus canciones favoritas.', link: 'https://lingoclip.com', btn: 'Abrir LingoClip', icon: '🎵', bg: 'bg-[#D4EBF8]' }
  ];

  const filteredVerbs = verbsEssentialList.filter(v => {
    const matchesSearch = v.base.toLowerCase().includes(verbSearch.toLowerCase()) ||
                          v.past.toLowerCase().includes(verbSearch.toLowerCase()) ||
                          v.es.toLowerCase().includes(verbSearch.toLowerCase());
    if (verbFilter === 'TODOS') return matchesSearch;
    return matchesSearch && v.type === verbFilter;
  });

  const filteredPhrases = phrases100List.filter(p => {
    const matchesSearch = p.en.toLowerCase().includes(phraseSearch.toLowerCase()) ||
                          p.es.toLowerCase().includes(phraseSearch.toLowerCase()) ||
                          p.pron.toLowerCase().includes(phraseSearch.toLowerCase());
    if (selectedSituation === 'TODAS') return matchesSearch;
    return matchesSearch && p.situation === selectedSituation;
  });

  const situationsList = Array.from(new Set(phrases100List.map(p => p.situation)));

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
                ⚡ A0 ➔ C2 • Full English Hub
              </div>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'pomodoro', label: 'Dashboard & Focus', icon: '⏱️', badge: 'Focus', bg: 'bg-[#FFD6DE]' },
              { id: 'flashcards', label: 'Flashcards de Repaso', icon: '🗂️', badge: `${cardsMastered} Dominadas`, bg: 'bg-[#FFF1C5]' },
              { id: 'quizzes', label: 'Quizzes & Diagnóstico', icon: '🎯', badge: 'Test', bg: 'bg-[#D9EBD9]' },
              { id: 'verbos', label: 'Verbos Esenciales', icon: '⚡', badge: 'Pas/Pres/Fut', bg: 'bg-[#FFF1C5]' },
              { id: 'frases', label: '100 Frases Clave (Bono 5)', icon: '💬', badge: '10 Situaciones', bg: 'bg-[#D9EBD9]' },
              { id: 'vocabulario', label: 'Vocabulario (PDFs)', icon: '📖', badge: '200+ Palabras', bg: 'bg-[#D4EBF8]' },
              { id: 'hub', label: 'Hub de Plataformas', icon: '🌐', badge: '14 Sitios', bg: 'bg-[#E6DCF5]' },
              { id: 'cursos', label: 'Biblioteca de Cursos', icon: '📚', badge: '3 Cursos', bg: 'bg-[#FFF1C5]' },
            ].map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playPopSound();
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[22px] text-xs font-black transition-all ${
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

          <button
            onClick={handleResetProgress}
            className="w-full py-2 rounded-[16px] bg-[#F3ECE1] hover:bg-[#EADFD0] text-[#8C7E72] hover:text-[#5C524A] text-[10px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>↺</span> Reiniciar Progreso a Cero
          </button>
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

        {/* CABECERA INSPIRACIONAL */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4E7267] bg-[#E3EFEA] px-3 py-1 rounded-full">
              Santuario de Fluidez & Aprendizaje Activo 🌿
            </span>
            <h1 className="text-2xl font-black text-[#3D352E] tracking-tight mt-1">
              English Mastery Hub
            </h1>
          </div>

          <div
            onClick={() => {
              playPopSound();
              setQuoteIdx((quoteIdx + 1) % quotes.length);
            }}
            className="hidden sm:flex items-center gap-3 bg-white p-3.5 rounded-[22px] max-w-md cursor-pointer hover:scale-[1.01] transition-transform shadow-[6px_8px_18px_rgba(210,190,175,0.2)] border border-[#F3ECE1]"
            title="Toca para cambiar de frase"
          >
            <span className="text-2xl">💬</span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#3D352E] italic line-clamp-1">&quot;{quotes[quoteIdx].en}&quot;</p>
              <span className="text-[10px] font-black text-[#7A6E63]">— {quotes[quoteIdx].es}</span>
            </div>
          </div>
        </div>

        {/* 1. DASHBOARD & FOCUS */}
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
                  Repasa las 100 frases clave del Bono 5, practica tus flashcards y entrena tus verbos con bloques de inmersión.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => {
                      playPopSound();
                      setIsRunning(true);
                      setTimeLeft(pomoMinutes * 60);
                    }}
                    className="px-5 py-2.5 rounded-[20px] bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-xs font-black text-white flex items-center gap-2 shadow-sm"
                  >
                    <span>▶</span> Play Focus ({pomoMinutes}m)
                  </button>
                  <button
                    onClick={handleWaterPlant}
                    className="px-4 py-2.5 rounded-[20px] bg-[#D4EBF8] text-[#0369A1] text-xs font-black flex items-center gap-1.5 shadow-sm"
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

              <div className="flex items-center gap-3">
                <div
                  onClick={handleWaterPlant}
                  className="w-24 h-24 rounded-[24px] bg-[#EAF5EC] p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all text-center border-2 border-[#CBEAD0] shadow-sm"
                >
                  <span className="text-3xl animate-bounce">{plantData[plantStage - 1].icon}</span>
                  <span className="text-[9px] font-black text-[#266245] mt-1 line-clamp-1">{plantData[plantStage - 1].name}</span>
                  <span className="text-[8px] text-[#3E8062] font-bold">Nivel {plantStage}/5</span>
                </div>
              </div>
            </div>

            {/* CRONOMETRO */}
            <div className="bg-white rounded-[28px] p-6 space-y-4 shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#EAF5EC] text-[#266245] inline-block">
                    Temporizador de Inmersión ⏱️
                  </span>
                  <div className="text-base font-black text-[#3D352E] mt-1">Bloque de Estudio Focalizado</div>
                </div>
                <div className="text-3xl font-black font-mono text-[#FF85A1] bg-[#F3ECE1] rounded-[20px] px-5 py-2 shadow-inner">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[15, 20, 25].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      playPopSound();
                      setPomoMinutes(mins);
                      setTimeLeft(mins * 60);
                      setIsRunning(false);
                    }}
                    className={`py-2.5 rounded-[18px] text-xs font-black transition-all ${
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
                  className={`flex-1 py-3.5 rounded-[20px] text-xs font-black text-white transition-all ${
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
                { label: 'Tarjetas Dominadas', val: `${cardsMastered}`, sub: 'Flashcards listas', icon: '🧠', bg: 'bg-[#D9EBD9]' }
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

            {/* ACTIVIDAD SEMANAL */}
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

        {/* 2. FLASHCARDS INTERACTIVAS */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Flashcards de Repaso Activo <span>🗂️</span>
              </h2>
              <p className="text-[#7A6E63] text-xs mt-1">
                Toca la tarjeta para girarla. Repasa frases del Bono 5, verbos clave y falsos amigos.
              </p>
            </div>

            <div
              onClick={() => {
                playPopSound();
                setIsFlipped(!isFlipped);
              }}
              className="bg-white rounded-[32px] p-10 sm:p-14 text-center cursor-pointer hover:scale-[1.01] transition-all min-h-[260px] flex flex-col items-center justify-center space-y-4 shadow-[8px_12px_26px_rgba(210,190,175,0.25)] border border-[#F3ECE1] relative"
            >
              <span className="text-[11px] font-black uppercase px-4 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60]">
                {flashcardsData[cardIndex].cat}
              </span>

              <div className="text-xl sm:text-2xl font-black text-[#3D352E] max-w-xl leading-relaxed">
                {isFlipped ? flashcardsData[cardIndex].back : flashcardsData[cardIndex].front}
              </div>

              <span className="text-[11px] text-[#A89066] font-bold">
                {isFlipped ? '💡 Significado y fonética' : '👆 Toca la tarjeta para ver la respuesta'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  playPopSound();
                  setIsFlipped(false);
                  setCardIndex(prev => (prev + 1) % flashcardsData.length);
                }}
                className="flex-1 py-3.5 rounded-[20px] bg-white text-[#695F56] font-black text-xs shadow-sm border hover:bg-[#FAF6F0]"
              >
                ➡️ Siguiente Tarjeta
              </button>
              <button
                onClick={() => {
                  playChimeSound();
                  setCardsMastered(prev => prev + 1);
                  setXp(prev => prev + 15);
                  setIsFlipped(false);
                  setCardIndex(prev => (prev + 1) % flashcardsData.length);
                  showSaveNotice('🎉 ¡Tarjeta dominada! +15 XP');
                }}
                className="flex-1 py-3.5 rounded-[20px] bg-[#D9EBD9] text-[#1E523A] font-black text-xs shadow-sm hover:brightness-105"
              >
                ✅ ¡Me la sé! (+15 XP)
              </button>
            </div>
          </div>
        )}

        {/* 3. QUIZZES & DIAGNÓSTICO INTERACTIVO */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Quizzes & Desafío Rápido <span>🎯</span>
                </h2>
                <p className="text-[#7A6E63] text-xs mt-1">
                  Pon a prueba tu oído, frases clave y gramática práctica.
                </p>
              </div>

              <span className="text-xs font-black px-3.5 py-1.5 rounded-full bg-[#FFF1C5] text-[#8C6200] shadow-sm">
                Aciertos: {quizScore}
              </span>
            </div>

            <div className="bg-white rounded-[28px] p-7 shadow-[8px_10px_22px_rgba(210,190,175,0.22)] border border-[#F3ECE1] space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#E3EFEA] text-[#245445]">
                  Pregunta {quizIdx + 1} de {quizQuestions.length}
                </span>
                <button
                  onClick={() => speakEnglish(quizQuestions[quizIdx].q)}
                  className="w-8 h-8 rounded-full bg-[#FAF6F0] hover:bg-[#FFD6DE] text-xs flex items-center justify-center"
                >
                  🔊
                </button>
              </div>

              <h3 className="text-base font-black text-[#3D352E] leading-snug">
                {quizQuestions[quizIdx].q}
              </h3>

              <div className="space-y-2.5">
                {quizQuestions[quizIdx].options.map((opt, oIdx) => {
                  let btnBg = 'bg-[#FAF6F0] text-[#4A4139] border border-[#F3ECE1]';
                  if (selectedOption !== null) {
                    if (oIdx === quizQuestions[quizIdx].correct) {
                      btnBg = 'bg-[#D9EBD9] text-[#1E523A] border-2 border-[#52B788] font-black';
                    } else if (selectedOption === oIdx) {
                      btnBg = 'bg-[#FFD6DE] text-[#A84A60] border-2 border-[#FFAAA6] font-black';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={selectedOption !== null}
                      onClick={() => {
                        setSelectedOption(oIdx);
                        if (oIdx === quizQuestions[quizIdx].correct) {
                          playChimeSound();
                          setQuizScore(prev => prev + 1);
                          setXp(prev => prev + 20);
                          setQuizFeedback('🎉 ¡Correcto! ' + quizQuestions[quizIdx].explain);
                        } else {
                          playPopSound();
                          setQuizFeedback('❌ Incorrecto. ' + quizQuestions[quizIdx].explain);
                        }
                      }}
                      className={`w-full text-left p-4 rounded-[20px] text-xs font-semibold transition-all ${btnBg}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizFeedback && (
                <div className="p-4 rounded-[18px] bg-[#FAF6F0] text-xs font-bold text-[#5C524A] leading-relaxed border">
                  {quizFeedback}
                </div>
              )}

              {selectedOption !== null && (
                <button
                  onClick={() => {
                    playPopSound();
                    setSelectedOption(null);
                    setQuizFeedback(null);
                    setQuizIdx(prev => (prev + 1) % quizQuestions.length);
                  }}
                  className="w-full py-3.5 rounded-[20px] bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-white font-black text-xs shadow-sm hover:brightness-105"
                >
                  Siguiente Pregunta ➔
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. VERBOS ESENCIALES */}
        {activeTab === 'verbos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Verbos Esenciales de Alta Frecuencia <span>⚡</span>
                </h2>
                <p className="text-[#7A6E63] text-xs mt-1">
                  Consulta Presente, Pasado, Futuro y Participio con pronunciación fonética y voz nativa.
                </p>
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
                placeholder="Buscar verbo en inglés o español (ej. go, went, comprar, speak)..."
                className="w-full bg-transparent border-none text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none font-medium"
              />
              {verbSearch && (
                <button onClick={() => setVerbSearch('')} className="text-xs text-[#8C7E72]">✕</button>
              )}
            </div>

            <div className="space-y-3">
              {filteredVerbs.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[24px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-[#3D352E]">{v.base}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        v.type === 'Irregular' ? 'bg-[#FFD6DE] text-[#A84A60]' : 'bg-[#D9EBD9] text-[#1E523A]'
                      }`}>
                        {v.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#A84A60]">Significado: {v.es}</span>
                      <button
                        onClick={() => speakEnglish(v.base)}
                        className="w-8 h-8 rounded-full bg-[#F3ECE1] hover:bg-[#FFD6DE] text-xs flex items-center justify-center shadow-sm"
                        title="Escuchar presente"
                      >
                        🔊
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-[#FAF6F0] p-2.5 rounded-[16px]">
                      <div className="text-[10px] text-[#8C7E72] font-black uppercase">Presente</div>
                      <div className="font-extrabold text-[#3D352E] mt-0.5">{v.base}</div>
                    </div>
                    <div className="bg-[#FAF6F0] p-2.5 rounded-[16px]">
                      <div className="text-[10px] text-[#8C7E72] font-black uppercase">Pasado Simple</div>
                      <div className="font-extrabold text-[#0369A1] mt-0.5 flex items-center justify-between">
                        <span>{v.past}</span>
                        <button onClick={() => speakEnglish(v.past)} className="text-[11px] opacity-70 hover:opacity-100">🔊</button>
                      </div>
                    </div>
                    <div className="bg-[#FAF6F0] p-2.5 rounded-[16px]">
                      <div className="text-[10px] text-[#8C7E72] font-black uppercase">Futuro Simple</div>
                      <div className="font-extrabold text-[#5B21B6] mt-0.5 flex items-center justify-between">
                        <span>{v.future}</span>
                        <button onClick={() => speakEnglish(v.future)} className="text-[11px] opacity-70 hover:opacity-100">🔊</button>
                      </div>
                    </div>
                    <div className="bg-[#FAF6F0] p-2.5 rounded-[16px]">
                      <div className="text-[10px] text-[#8C7E72] font-black uppercase">Participio</div>
                      <div className="font-extrabold text-[#1E523A] mt-0.5 flex items-center justify-between">
                        <span>{v.participle}</span>
                        <button onClick={() => speakEnglish(v.participle)} className="text-[11px] opacity-70 hover:opacity-100">🔊</button>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7A6E63] font-medium bg-[#FBF6EF] p-2 rounded-[14px]">
                    🗣️ <strong>Cómo suena:</strong> /{v.pron}/
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. 100 FRASES DEL BONO 5 */}
        {activeTab === 'frases' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  100 Frases Clave para Hablar con Seguridad <span>💬</span>
                </h2>
                <p className="text-[#7A6E63] text-xs mt-1">
                  Organizadas en 10 situaciones del Bono 5 con pronunciación escrita y audio nativo.
                </p>
              </div>

              <select
                value={selectedSituation}
                onChange={e => {
                  playPopSound();
                  setSelectedSituation(e.target.value);
                }}
                className="bg-white rounded-[18px] px-3.5 py-2 text-xs font-black text-[#3D352E] shadow-sm border focus:outline-none"
              >
                <option value="TODAS">Todas las Situaciones (100 + 10)</option>
                {situationsList.map((sit, i) => (
                  <option key={i} value={sit}>{sit}</option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-[24px] p-4 flex items-center gap-3 shadow-[6px_8px_18px_rgba(210,190,175,0.18)]">
              <span className="text-lg">🔍</span>
              <input
                type="text"
                value={phraseSearch}
                onChange={e => setPhraseSearch(e.target.value)}
                placeholder="Buscar frase en inglés, pronunciación o español (ej. check, cuenta, repeat, coffee)..."
                className="w-full bg-transparent border-none text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none font-medium"
              />
              {phraseSearch && (
                <button onClick={() => setPhraseSearch('')} className="text-xs text-[#8C7E72]">✕</button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {filteredPhrases.map((phrase, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[24px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-2.5 hover:scale-[1.01] transition-transform"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E3EFEA] text-[#245445]">
                      #{phrase.num} • {phrase.situation}
                    </span>
                    <button
                      onClick={() => speakEnglish(phrase.en)}
                      className="w-9 h-9 rounded-full bg-[#FFD6DE] hover:bg-[#FFAAA6] text-xs flex items-center justify-center shadow-sm"
                      title="Escuchar frase en inglés"
                    >
                      🔊
                    </button>
                  </div>

                  <div>
                    <div className="text-base font-black text-[#3D352E]">{phrase.en}</div>
                    <div className="text-xs font-bold text-[#A84A60] mt-0.5">{phrase.es}</div>
                  </div>

                  <div className="bg-[#FAF6F0] p-2.5 rounded-[16px] text-xs font-semibold text-[#5C524A] flex items-center gap-2">
                    <span className="text-[10px] text-[#8C7E72] font-black uppercase">Suena:</span>
                    <span className="italic">/{phrase.pron}/</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. VOCABULARIO (200 SUSTANTIVOS & 500 PALABRAS) */}
        {activeTab === 'vocabulario' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Vocabulario Esencial (PDFs de Apoyo) <span>📖</span>
                </h2>
                <p className="text-[#7A6E63] text-xs mt-1">200 sustantivos categorizados y falsos amigos.</p>
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: '200_SUSTANTIVOS', label: `200 Sustantivos (${vocab200List.length})` },
                  { id: '500_PALABRAS', label: `Frecuentes (${vocab500List.length})` },
                  { id: 'FALSOS_AMIGOS', label: `Falsos Amigos (${falseFriendsList.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      playPopSound();
                      setVocabTab(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${
                      vocabTab === tab.id ? 'bg-[#FFD6DE] text-[#A84A60] font-extrabold shadow-sm' : 'bg-white text-[#8C7E72] border'
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
                placeholder="Buscar palabra o traducción (ej. eye, sister, brother)..."
                className="w-full bg-transparent border-none text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none font-medium"
              />
            </div>

            {vocabTab === '200_SUSTANTIVOS' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {vocab200List
                  .filter(v => v.en.toLowerCase().includes(vocabSearch.toLowerCase()) || v.es.toLowerCase().includes(vocabSearch.toLowerCase()))
                  .map((item, idx) => (
                    <div key={idx} className="bg-white rounded-[24px] p-4 flex items-start justify-between gap-3 shadow-sm border border-[#F3ECE1]">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#E3EFEA] text-[#245445]">{item.cat}</span>
                          <span className="text-[10px] text-[#A89066] font-bold">/{item.ipa}/</span>
                        </div>
                        <div className="text-sm font-black text-[#3D352E]">{item.en}</div>
                        <div className="text-xs text-[#A84A60] font-bold">{item.es}</div>
                        <p className="text-[11px] text-[#7A6E63] font-medium leading-relaxed">{item.note}</p>
                      </div>
                      <button onClick={() => speakEnglish(item.en)} className="w-8 h-8 rounded-full bg-[#F3ECE1] hover:bg-[#FFD6DE] text-xs flex items-center justify-center shrink-0">
                        🔊
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* 7. HUB DE PLATAFORMAS (14 PLATAFORMAS) */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Hub de Plataformas & Recursos Recomendados <span>🌐</span>
              </h2>
              <p className="text-[#7A6E63] text-xs mt-1">
                Tus 14 plataformas gratuitas para entrenar vocabulario, listening, gramática y juegos interactivos.
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
                    className="mt-4 text-center py-2.5 rounded-[18px] font-black text-xs bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-white block shadow-sm hover:brightness-105"
                  >
                    {p.btn} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. BIBLIOTECA DE CURSOS */}
        {activeTab === 'cursos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Biblioteca de Cursos <span>📚</span>
              </h2>
              <p className="text-[#7A6E63] text-xs mt-1">Accesos directos a tus programas oficiales.</p>
            </div>

            <div className="bg-white rounded-[28px] p-5 space-y-3 border-2 border-[#FFE4B5] shadow-sm">
              <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#FFF1C5] text-[#8C6200]">Inglés Práctico</span>
              <h3 className="text-base font-black text-[#3D352E]">App & Biblioteca Oficial</h3>
              <p className="text-xs text-[#6B5E55]">Portal de clases, asistente con IA y materiales descargables.</p>
              <a href="https://app.inglespractico.info" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 rounded-[16px] bg-[#FFAAA6] text-white font-black text-xs">
                Abrir Portal ↗
              </a>
            </div>

            <div className="bg-white rounded-[28px] p-5 space-y-3 border-2 border-[#BAE6FD] shadow-sm">
              <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#D4EBF8] text-[#0369A1]">Hotmart Club</span>
              <h3 className="text-base font-black text-[#3D352E]">Gringo Academy & Activación Neural</h3>
              <p className="text-xs text-[#6B5E55]">Telenovelas, lecciones auditivas y reprogramación subconsciente.</p>
              <a href="https://consumer.hotmart.com" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 rounded-[16px] bg-[#38BDF8] text-white font-black text-xs">
                Abrir Hotmart ↗
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}