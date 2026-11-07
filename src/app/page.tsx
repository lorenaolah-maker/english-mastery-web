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

// Datos de Phrasal Verbs por Flechas (Tomo 2)
const phrasalVerbsData = [
  {
    particle: 'UP',
    arrow: '↑',
    meaning: 'Hacia arriba · Completar al 100% · Aparecer',
    color: 'bg-[#FFD6DE] text-[#A84A60] border-[#FFAAA6]',
    verbs: [
      { phrasal: 'Wake up', es: 'Despertarse', ex: 'I woke up at 7:00 AM.' },
      { phrasal: 'Get up', es: 'Levantarse de la cama', ex: 'Get up, it is late!' },
      { phrasal: 'Grow up', es: 'Crecer hasta ser adulto', ex: 'I grew up in Salto.' },
      { phrasal: 'Show up', es: 'Aparecer / Presentarse', ex: "He didn't show up to class." },
      { phrasal: 'Give up', es: 'Rendirse / Abandonar', ex: "Never give up on your goals!" },
      { phrasal: 'Pick up', es: 'Recoger / Pasar a buscar', ex: 'Can you pick me up at 8:00?' }
    ]
  },
  {
    particle: 'OUT',
    arrow: '➔',
    meaning: 'Hacia afuera · Descubrir · Hasta agotarse',
    color: 'bg-[#D4EBF8] text-[#0369A1] border-[#7DD3FC]',
    verbs: [
      { phrasal: 'Find out', es: 'Enterarse de una información', ex: 'I found out the truth yesterday.' },
      { phrasal: 'Figure out', es: 'Resolver / Darse cuenta', ex: 'I cannot figure it out.' },
      { phrasal: 'Run out (of)', es: 'Quedarse sin nada', ex: 'We ran out of coffee!' },
      { phrasal: 'Work out', es: 'Entrenar / Resultar bien', ex: 'Everything worked out fine.' },
      { phrasal: 'Hang out', es: 'Pasar el rato / Salir con amigos', ex: 'Let us hang out this weekend.' },
      { phrasal: 'Check out', es: 'Mirar / Salir del hotel', ex: 'Check out this new place.' }
    ]
  },
  {
    particle: 'ON',
    arrow: '➔',
    meaning: 'Continuar · Colocar encima · Encender',
    color: 'bg-[#D9EBD9] text-[#1E523A] border-[#86EFAC]',
    verbs: [
      { phrasal: 'Go on', es: 'Seguir / Continuar hablando', ex: 'Go on, I am listening.' },
      { phrasal: 'Carry on', es: 'Continuar adelante', ex: 'Carry on with your study.' },
      { phrasal: 'Put on', es: 'Ponerse ropa o accesorios', ex: 'Put on your warm coat.' },
      { phrasal: 'Turn on', es: 'Encender (luces, aparatos)', ex: 'Turn on the living room light.' },
      { phrasal: 'Get on', es: 'Subirse a transporte grande / Llevarse bien', ex: 'Get on the train.' },
      { phrasal: 'Hold on', es: 'Esperar / Aguantar un segundo', ex: 'Hold on a second, please.' }
    ]
  },
  {
    particle: 'OFF',
    arrow: '↘',
    meaning: 'Separar · Cortar contacto · Salir',
    color: 'bg-[#FFE4E6] text-[#E11D48] border-[#FDA4AF]',
    verbs: [
      { phrasal: 'Turn off', es: 'Apagar luces o aparatos', ex: 'Turn off your phone before bed.' },
      { phrasal: 'Take off', es: 'Despegar el avión / Quitarse ropa', ex: 'The plane took off on time.' },
      { phrasal: 'Get off', es: 'Bajarse del transporte', ex: 'Get off at the next bus station.' },
      { phrasal: 'Call off', es: 'Cancelar un evento agendado', ex: 'They called off the meeting.' },
      { phrasal: 'Put off', es: 'Posponer / Dejar para después', ex: 'Do not put it off until tomorrow.' },
      { phrasal: 'Show off', es: 'Presumir / Alardear', ex: 'Stop showing off your new car.' }
    ]
  },
  {
    particle: 'DOWN',
    arrow: '↓',
    meaning: 'Hacia abajo · Reducir · Anotar en papel',
    color: 'bg-[#F3E8FF] text-[#6B21A8] border-[#D8B4FE]',
    verbs: [
      { phrasal: 'Calm down', es: 'Calmarse / Tranquilizarse', ex: 'Calm down, everything is alright.' },
      { phrasal: 'Slow down', es: 'Ir más despacio / Reducir velocidad', ex: 'Slow down, there is traffic ahead.' },
      { phrasal: 'Break down', es: 'Descomponerse una máquina / Quebrarse', ex: 'My car broke down on the road.' },
      { phrasal: 'Write down', es: 'Anotar en papel o libreta', ex: 'Write it down.' },
      { phrasal: 'Turn down', es: 'Bajar volumen / Rechazar oferta', ex: 'She turned down the job offer.' },
      { phrasal: 'Let down', es: 'Decepcionar a alguien', ex: 'I will not let you down.' }
    ]
  },
  {
    particle: 'BACK',
    arrow: '⮌',
    meaning: 'Volver al punto de origen · Devolver',
    color: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    verbs: [
      { phrasal: 'Come back', es: 'Volver a este lugar', ex: 'Come back home soon.' },
      { phrasal: 'Go back', es: 'Regresar allá', ex: 'I want to go back to Europe.' },
      { phrasal: 'Call back', es: 'Devolver la llamada', ex: 'I will call you back in five minutes.' },
      { phrasal: 'Give back', es: 'Devolver un objeto prestado', ex: 'Give it back to your sister.' },
      { phrasal: 'Pay back', es: 'Devolver dinero prestado', ex: 'I will pay you back tomorrow.' },
      { phrasal: 'Look back', es: 'Mirar hacia el pasado', ex: 'Do not look back with regret.' }
    ]
  },
  {
    particle: 'OVER',
    arrow: '↷',
    meaning: 'De nuevo · Repasar · Pasar por encima (Superar)',
    color: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
    verbs: [
      { phrasal: 'Get over', es: 'Superar algo difícil o una ruptura', ex: 'It took months to get over the flu.' },
      { phrasal: 'Go over', es: 'Repasar / Revisar a detalle', ex: 'Let us go over the daily lesson.' },
      { phrasal: 'Think over', es: 'Pensarlo bien antes de decidir', ex: 'Take your time and think it over.' },
      { phrasal: 'Take over', es: 'Tomar el control de algo', ex: 'She took over the family salon.' },
      { phrasal: 'Start over', es: 'Empezar desde cero de nuevo', ex: 'Let us start over with fresh energy.' },
      { phrasal: 'Hand over', es: 'Entregar en mano', ex: 'Hand over your ticket, please.' }
    ]
  },
  {
    particle: 'AWAY',
    arrow: '⇢',
    meaning: 'Alejarse · Desaparecer · Guardar en su sitio',
    color: 'bg-[#CCFBF1] text-[#115E59] border-[#99F6E4]',
    verbs: [
      { phrasal: 'Go away', es: 'Irse lejos / Marcharse', ex: 'Please go away, I need to focus.' },
      { phrasal: 'Throw away', es: 'Tirar a la basura', ex: 'Throw away the expired milk.' },
      { phrasal: 'Put away', es: 'Guardar cada cosa en su lugar', ex: 'Put away your iPad when finished.' },
      { phrasal: 'Give away', es: 'Regalar algo que no usas', ex: 'She gave away her old books.' },
      { phrasal: 'Run away', es: 'Escaparse corriendo', ex: 'The little dog ran away.' },
      { phrasal: 'Take away', es: 'Comida para llevar', ex: 'Two coffees to take away, please.' }
    ]
  }
];

// Datos estructurados de la Biblioteca Dibujada (para distribuirlos como Phrasal Verbs)
const guiasDibujadasData = [
  {
    id: 'tomo1',
    label: 'Tomo 1: Inglés Dibujado',
    subtitle: '49 Temas Visuales (A0 a B2) con esquemas y ejercicios',
    color: 'bg-[#FFD6DE] text-[#A84A60] border-[#FFAAA6]',
    secciones: [
      { title: 'Parte 1: Los Cimientos (A0-A1)', desc: '12 temas: Pronombres, To Be, There is/are, Artículos, Plurales, In/On/At, Preposiciones de lugar y movimiento.' },
      { title: 'Parte 2: Moverse en el Tiempo (A1-A2)', desc: '13 temas: Mapa de tiempos, Presente Simple, Preguntas QASI, Pasado Simple (-ed), Continuo vs Simple, Futuro (Will / Going to).' },
      { title: 'Parte 3: Conectar Ideas (A2-B1)', desc: '12 temas: Presente Perfecto, Already/Yet, Pasado Perfecto, Obligación (Must vs Have to), Consejos, Make vs Do.' },
      { title: 'Parte 4: Sonar Natural (B1-B2)', desc: '12 temas: Condicionales 0 a 3, Mixtos, Wish/Ojalá, Voz Pasiva, Estilo Indirecto, Question tags, Inglés Conectado.' }
    ]
  },
  {
    id: 'tomo2',
    label: 'Tomo 2: Phrasal Verbs',
    subtitle: '40+ Verbos agrupados por las 8 flechas de dirección',
    color: 'bg-[#D9EBD9] text-[#1E523A] border-[#86EFAC]',
    secciones: [
      { title: 'Flecha UP ↑ (Arriba / Completo)', desc: 'Wake up, Get up, Grow up, Show up, Give up, Pick up.' },
      { title: 'Flecha OUT ➔ (Hacia afuera / Descubrir)', desc: 'Find out, Figure out, Run out of, Work out, Hang out, Check out.' },
      { title: 'Flecha ON ➔ (Continuar / Activar)', desc: 'Go on, Carry on, Put on, Turn on, Get on, Hold on.' },
      { title: 'Flechas OFF ↘ / DOWN ↓ / BACK ⮌ / OVER ↷ / AWAY ⇢', desc: 'Separar, reducir, volver, superar y alejarse explicados con dibujos.' }
    ]
  },
  {
    id: 'tomo3',
    label: 'Tomo 3: Vocabulario Dibujado',
    subtitle: '25 Escenas de la vida real con pronunciación criolla',
    color: 'bg-[#D4EBF8] text-[#0369A1] border-[#7DD3FC]',
    secciones: [
      { title: 'Escenas Cotidianas 🍳', desc: 'La cocina y la comida, El cuerpo humano, La ropa, La casa y sus muebles, Las bebidas.' },
      { title: 'Escenas Urbanas & Viajes ✈️', desc: 'El trabajo y la oficina, El aeropuerto y vuelos, La ciudad y comercios, Transporte, El dinero y compras.' },
      { title: 'Escenas de Conversación 💬', desc: 'La familia, El clima, Verbos del día a día, Las emociones, Saludos y fórmulas de cortesía.' }
    ]
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('mision');

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

  // Bases de datos JSON
  const [allVerbs, setAllVerbs] = useState<VerbItemFull[]>([]);
  const [allWords, setAllWords] = useState<WordItemFull[]>([]);

  // Mini-Juego de Parejas
  const [gameCards, setGameCards] = useState<{ id: string; text: string; matchId: string; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);

  // Estados interactivos para Phrasal Verbs y Biblioteca Dibujada
  const [selectedParticle, setSelectedParticle] = useState('UP');
  const [selectedGuia, setSelectedGuia] = useState('tomo1');

  // Audio Ambiental y Efectos
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

  // Writing Clinic
  const [writingType, setWritingType] = useState('Diario personal / Reflexion del dia');
  const [writingText, setWritingText] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);
  const [isWritingAnalyzing, setIsWritingAnalyzing] = useState(false);

  // Control simplificado de Cursos
  const [curso1Semana, setCurso1Semana] = useState(1);
  const [curso2Capitulo, setCurso2Capitulo] = useState(1);
  const [curso3Fase, setCurso3Fase] = useState(1);

  const plantData = [
    { icon: '🌱', name: 'Semillita Brotando', desc: 'Regada con tus primeros minutos de inmersión.' },
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

  useEffect(() => {
    const sXp = localStorage.getItem('em_xp');
    const sMins = localStorage.getItem('em_mins');
    const sStreak = localStorage.getItem('em_streak');
    const sWater = localStorage.getItem('em_water');
    const sPlant = localStorage.getItem('em_plant');
    const sDay = localStorage.getItem('em_day');
    const sWeek = localStorage.getItem('em_week');

    if (sXp) setXp(Number(sXp));
    if (sMins) setTotalMinutes(Number(sMins));
    if (sStreak) setStreak(Number(sStreak));
    if (sWater) setWaterDrops(Number(sWater));
    if (sPlant) setPlantStage(Number(sPlant));
    if (sDay) setCurrentDay(Number(sDay));
    if (sWeek !== null) {
      try { setWeeklyActive(JSON.parse(sWeek)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('em_xp', xp.toString());
    localStorage.setItem('em_mins', totalMinutes.toString());
    localStorage.setItem('em_streak', streak.toString());
    localStorage.setItem('em_water', waterDrops.toString());
    localStorage.setItem('em_plant', plantStage.toString());
    localStorage.setItem('em_day', currentDay.toString());
    localStorage.setItem('em_week', JSON.stringify(weeklyActive));
  }, [xp, totalMinutes, streak, waterDrops, plantStage, currentDay, weeklyActive]);

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
      showSaveNotice('Necesitas gotitas de agua. Completa un bloque de Focus para ganar más.');
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

  const currentDayVerbs: VerbItemFull[] = allVerbs.length > 0
    ? allVerbs.filter(v => v.day === currentDay).slice(0, 3)
    : [
        { id: 1, day: 1, base: "be", es: "ser / estar", type: "Irregular", pron: "bíi", past: "was / were", participle: "been", pres_i: "I am", pres_you: "You are", pres_he: "He/She/It is", pres_we: "We are", pres_they: "They are", pas_i: "I was", pas_you: "You were", pas_he: "He/She/It was", pas_we: "We were", pas_they: "They were", will: "I will be", will_he: "He will be", will_they: "They will be", going: "I am going to be", exPres: "I am happy today.", exPast: "Yesterday I was busy.", exFut: "Tomorrow I will be there." },
        { id: 2, day: 1, base: "have", es: "tener / haber", type: "Irregular", pron: "jáv", past: "had", participle: "had", pres_i: "I have", pres_you: "You have", pres_he: "He/She/It has", pres_we: "We have", pres_they: "They have", pas_i: "I had", pas_you: "You had", pas_he: "He/She/It had", pas_we: "We had", pas_they: "They had", will: "I will have", will_he: "He will have", will_they: "They will have", going: "I am going to have", exPres: "I have two sisters.", exPast: "Yesterday I had lunch.", exFut: "Tomorrow I will have time." },
        { id: 3, day: 1, base: "do", es: "hacer", type: "Irregular", pron: "dúu", past: "did", participle: "done", pres_i: "I do", pres_you: "You do", pres_he: "He/She/It does", pres_we: "We do", pres_they: "They do", pas_i: "I did", pas_you: "You did", pas_he: "He/She/It did", pas_we: "We did", pas_they: "They did", will: "I will do", will_he: "He will do", will_they: "They will do", going: "I am going to do", exPres: "I do my best.", exPast: "Yesterday I did it.", exFut: "Tomorrow I will do that." }
      ];

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
              { id: 'phrasal', label: 'Phrasal Verbs (Flechas)', icon: '🏹', badge: 'Tomo 2', bg: 'bg-[#D9EBD9]' },
              { id: 'guias_pdf', label: 'Biblioteca Dibujada', icon: '🎨', badge: 'Tomos 1, 2 y 3', bg: 'bg-[#FFD6DE]' },
              { id: 'pomodoro', label: 'Dashboard & Focus', icon: '⏱️', badge: 'Focus & Planta', bg: 'bg-[#D4EBF8]' },
              { id: 'verbos', label: 'Buscador de Verbos', icon: '⚡', badge: '2,151 Verbos', bg: 'bg-[#FFF1C5]' },
              { id: 'vocabulario', label: 'Vocabulario Esencial', icon: '📖', badge: '5,000 Palabras', bg: 'bg-[#D9EBD9]' },
              { id: 'hub', label: 'Hub de Plataformas', icon: '🌐', badge: '14 Sitios', bg: 'bg-[#E6DCF5]' },
              { id: 'cursos', label: 'Biblioteca de Cursos', icon: '📚', badge: '3 Cursos', bg: 'bg-[#FFF1C5]' },
              { id: 'writing', label: 'Writing Clinic', icon: '✍️', badge: 'Notion', bg: 'bg-[#FFD6DE]' },
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
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-5xl mx-auto overflow-y-auto">
        {savedNotice && (
          <div className="fixed top-5 right-5 z-50 bg-[#D9EBD9] text-[#1B4332] font-black text-xs px-5 py-3.5 border-2 border-[#B7DDB7] rounded-[24px] shadow-xl animate-bounce flex items-center gap-2">
            <span>🌸</span>
            <span>{savedNotice}</span>
          </div>
        )}

        {/* 1. MISIÓN DIARIA (CON CONJUGACIÓN COMPLETA) */}
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

              <div className="flex items-center gap-2">
                <button
                  disabled={currentDay <= 1}
                  onClick={() => {
                    playPopSound();
                    setCurrentDay(prev => Math.max(prev - 1, 1));
                  }}
                  className="w-10 h-10 rounded-[16px] bg-white border border-[#E8DFC8] font-black text-sm disabled:opacity-30 shadow-sm"
                >
                  ◀
                </button>
                <div className="bg-[#F3ECE1] px-4 py-2 rounded-[16px] text-xs font-black text-[#3D352E] text-center min-w-[90px] shadow-inner">
                  Día {currentDay}
                </div>
                <button
                  disabled={currentDay >= 708}
                  onClick={() => {
                    playPopSound();
                    setCurrentDay(prev => prev + 1);
                  }}
                  className="w-10 h-10 rounded-[16px] bg-white border border-[#E8DFC8] font-black text-sm disabled:opacity-30 shadow-sm"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Los 3 Verbos del Día */}
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

                      <button
                        onClick={() => {
                          playPopSound();
                          setShowConjugation(isExpanded ? null : i);
                        }}
                        className="w-full py-2.5 rounded-[16px] bg-[#F1F7F7] hover:bg-[#E3EFEA] text-[11px] font-black text-[#4E7267] flex items-center justify-center gap-1.5 transition-colors border border-[#D3E3DD]"
                      >
                        <span>📖</span> {isExpanded ? 'Ocultar conjugación completa' : 'Ver conjugación completa con todos los pronombres (I, You, He/She/It, We, They)'}
                      </button>

                      {isExpanded && (
                        <div className="p-4 rounded-[20px] bg-[#FBF6EF] border border-[#E8DFC8] space-y-3 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-[16px] shadow-sm space-y-1">
                              <span className="text-[10px] font-black uppercase text-[#8C7E72] block border-b pb-1">Presente Simple</span>
                              <div className="flex justify-between"><span>I:</span> <strong>{v.pres_i || `I ${v.base}`}</strong></div>
                              <div className="flex justify-between"><span>You:</span> <strong>{v.pres_you || `You ${v.base}`}</strong></div>
                              <div className="flex justify-between text-[#A84A60]"><span>He/She/It:</span> <strong>{v.pres_he || `He/She/It ${v.base}s`}</strong></div>
                              <div className="flex justify-between"><span>We:</span> <strong>{v.pres_we || `We ${v.base}`}</strong></div>
                              <div className="flex justify-between"><span>They:</span> <strong>{v.pres_they || `They ${v.base}`}</strong></div>
                            </div>

                            <div className="bg-white p-3 rounded-[16px] shadow-sm space-y-1">
                              <span className="text-[10px] font-black uppercase text-[#0369A1] block border-b pb-1">Pasado Simple</span>
                              <div className="flex justify-between"><span>I:</span> <strong>{v.pas_i || `I ${v.past}`}</strong></div>
                              <div className="flex justify-between"><span>You:</span> <strong>{v.pas_you || `You ${v.past}`}</strong></div>
                              <div className="flex justify-between"><span>He/She/It:</span> <strong>{v.pas_he || `He/She/It ${v.past}`}</strong></div>
                              <div className="flex justify-between"><span>We:</span> <strong>{v.pas_we || `We ${v.past}`}</strong></div>
                              <div className="flex justify-between"><span>They:</span> <strong>{v.pas_they || `They ${v.past}`}</strong></div>
                            </div>

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

            {/* Las 7 Palabras del Día */}
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

            {/* Mini-Juego de Parejas */}
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

            {/* Botón completar día */}
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
        {/* 2. PHRASAL VERBS POR FLECHAS (TOMO 2) */}
        {/* ========================================================= */}
        {activeTab === 'phrasal' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D9EBD9] text-[#1E523A]">
                Guía Visual Tomo 2 · Phrasal Verbs Dibujados 🏹
              </span>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight mt-1">
                La Flecha de la Partícula
              </h1>
              <p className="text-xs text-[#7A6E63] mt-0.5">
                No memorices listas infinitas: la partícula indica la dirección exacta de la acción.
              </p>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {phrasalVerbsData.map(p => (
                <button
                  key={p.particle}
                  onClick={() => {
                    playPopSound();
                    setSelectedParticle(p.particle);
                  }}
                  className={`p-3 rounded-[18px] text-center font-black transition-all border ${
                    selectedParticle === p.particle
                      ? `${p.color} scale-105 shadow-md`
                      : 'bg-white text-[#7A6E63] border-[#E8DFC8]'
                  }`}
                >
                  <div className="text-base font-black">{p.arrow}</div>
                  <div className="text-[11px] mt-0.5">{p.particle}</div>
                </button>
              ))}
            </div>

            {(() => {
              const currentP = phrasalVerbsData.find(p => p.particle === selectedParticle) || phrasalVerbsData[0];
              return (
                <div className="bg-white rounded-[28px] p-6 shadow-[8px_10px_22px_rgba(210,190,175,0.22)] border border-[#F3ECE1] space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-[20px] bg-[#FAF6F0] flex items-center justify-center text-2xl font-black border">
                      {currentP.arrow}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-[#3D352E]">Partícula + {currentP.particle}</h3>
                      <p className="text-xs font-bold text-[#A84A60]">{currentP.meaning}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                    {currentP.verbs.map((pv, idx) => (
                      <div key={idx} className="p-4 rounded-[20px] bg-[#FAF6F0] border border-[#F3ECE1] space-y-1.5 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-[#3D352E]">{pv.phrasal}</span>
                            <button
                              onClick={() => speakEnglish(pv.phrasal)}
                              className="w-7 h-7 rounded-full bg-white text-xs shadow-sm flex items-center justify-center"
                            >
                              🔊
                            </button>
                          </div>
                          <div className="text-xs font-bold text-[#0369A1]">{pv.es}</div>
                        </div>
                        <div className="text-[11px] text-[#7A6E63] italic pt-1 border-t border-[#EADBCE]">
                          &quot;{pv.ex}&quot;
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. BIBLIOTECA DIBUJADA (DISTRIBUIDA COMO PHRASAL VERBS) */}
        {/* ========================================================= */}
        {activeTab === 'guias_pdf' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60]">
                Material Visual Oficial Comprado 🎨
              </span>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight mt-1">
                Biblioteca Visual: Inglés Dibujado
              </h1>
              <p className="text-xs text-[#7A6E63] mt-0.5">
                Consulta los esquemas organizados por tomos y ábrelos directamente en Goodnotes para rellenar los ejercicios a mano.
              </p>
            </div>

            {/* Selector de Tomo con botones pill estilo Phrasal Verbs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {guiasDibujadasData.map(g => (
                <button
                  key={g.id}
                  onClick={() => {
                    playPopSound();
                    setSelectedGuia(g.id);
                  }}
                  className={`p-4 rounded-[22px] text-left font-black transition-all border ${
                    selectedGuia === g.id
                      ? `${g.color} scale-105 shadow-md`
                      : 'bg-white text-[#7A6E63] border-[#E8DFC8]'
                  }`}
                >
                  <div className="text-xs uppercase font-extrabold">{g.label}</div>
                  <div className="text-[10px] font-semibold opacity-85 mt-1 line-clamp-1">{g.subtitle}</div>
                </button>
              ))}
            </div>

            {/* Vista del Tomo Seleccionado con tarjeta y acceso a Goodnotes */}
            {(() => {
              const currentGuia = guiasDibujadasData.find(g => g.id === selectedGuia) || guiasDibujadasData[0];
              return (
                <div className="bg-white rounded-[28px] p-6 shadow-[8px_10px_22px_rgba(210,190,175,0.22)] border border-[#F3ECE1] space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F3ECE1] pb-4">
                    <div>
                      <h2 className="text-lg font-black text-[#3D352E]">{currentGuia.label}</h2>
                      <p className="text-xs text-[#7A6E63]">{currentGuia.subtitle}</p>
                    </div>

                    <a
                      href="goodnotes://"
                      onClick={playPopSound}
                      className="px-5 py-2.5 rounded-[18px] bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-white font-black text-xs text-center shadow-sm"
                    >
                      ✏️ Abrir y Rayar en Goodnotes ↗
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {currentGuia.secciones.map((sec, idx) => (
                      <div key={idx} className="p-4 rounded-[20px] bg-[#FAF6F0] border border-[#F3ECE1] space-y-1.5">
                        <div className="text-sm font-black text-[#3D352E]">{sec.title}</div>
                        <p className="text-xs text-[#6B5E55] leading-relaxed">{sec.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. DASHBOARD & FOCUS (CON PLANTA VIVA 🌱) */}
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
                  Comienza tu sesión de estudio con bloques de 15 a 20 minutos de inmersión y enfoque.
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

              {/* PLANTA VIVA 🌱 */}
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

            <div className="bg-white rounded-[26px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-3">
              <div className="text-xs font-black text-[#3D352E]">Racha Semanal de Consistencia</div>
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
        {/* 5. BUSCADOR GLOBAL DE VERBOS (2,151) */}
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
        {/* 6. VOCABULARIO ESENCIAL (5,000 PALABRAS + BONO 5 + FALSOS AMIGOS) */}
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
        {/* 7. HUB DE PLATAFORMAS (CON BOTONES DE COLORES) */}
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
        {/* 8. BIBLIOTECA DE CURSOS (MINIMALISTA Y SIN AGOBIOS) */}
        {/* ========================================================= */}
        {activeTab === 'cursos' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFF1C5] text-[#8C6200]">
                Tus Programas Oficiales 📚
              </span>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight mt-1">
                Biblioteca de Cursos
              </h1>
              <p className="text-xs text-[#7A6E63] mt-0.5">
                Acceso en un solo toque a tus clases sin formularios complicados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* CURSO 1: INGLÉS PRÁCTICO */}
              <div className="bg-white rounded-[26px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border-2 border-[#FFAAA6] flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#FFD6DE] text-[#A84A60]">
                    Curso 1 · Portal Oficial
                  </span>
                  <h3 className="text-base font-black text-[#3D352E] mt-2">Inglés Práctico</h3>
                  <p className="text-xs text-[#6B5E55] leading-relaxed">
                    Portal de clases en video, material de apoyo y asistente oficial con IA.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#F3ECE1]">
                  <div className="flex items-center justify-between text-xs font-black text-[#4A4139]">
                    <span>Semana en Curso:</span>
                    <span className="text-[#A84A60]">Semana {curso1Semana} de 12</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={curso1Semana}
                    onChange={e => setCurso1Semana(Number(e.target.value))}
                    className="w-full accent-[#FF85A1]"
                  />
                  <a
                    href="https://app.inglespractico.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playPopSound}
                    className="w-full py-2.5 rounded-[16px] bg-[#FF85A1] text-white font-black text-xs block text-center shadow-sm"
                  >
                    🚀 Abrir Portal ↗
                  </a>
                </div>
              </div>

              {/* CURSO 2: GRINGO ACADEMY */}
              <div className="bg-white rounded-[26px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border-2 border-[#7DD3FC] flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#D4EBF8] text-[#0369A1]">
                    Curso 2 · Hotmart Club
                  </span>
                  <h3 className="text-base font-black text-[#3D352E] mt-2">Gringo Academy</h3>
                  <p className="text-xs text-[#6B5E55] leading-relaxed">
                    Telenovelas, episodios contextuales y entrenamiento auditivo continuo.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#F3ECE1]">
                  <div className="flex items-center justify-between text-xs font-black text-[#4A4139]">
                    <span>Telenovela:</span>
                    <span className="text-[#0369A1]">Bloque {curso2Capitulo} de 130</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="130"
                    value={curso2Capitulo}
                    onChange={e => setCurso2Capitulo(Number(e.target.value))}
                    className="w-full accent-[#0284C7]"
                  />
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playPopSound}
                    className="w-full py-2.5 rounded-[16px] bg-[#0284C7] text-white font-black text-xs block text-center shadow-sm"
                  >
                    🎬 Ver en Hotmart ↗
                  </a>
                </div>
              </div>

              {/* CURSO 3: ACTIVACIÓN NEURAL */}
              <div className="bg-white rounded-[26px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border-2 border-[#D8B4FE] flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#6B21A8]">
                    Curso 3 · Audios Guiados
                  </span>
                  <h3 className="text-base font-black text-[#3D352E] mt-2">Activación Neural</h3>
                  <p className="text-xs text-[#6B5E55] leading-relaxed">
                    Reprogramación subconsciente y sesiones de acondicionamiento auditivo.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#F3ECE1]">
                  <div className="flex items-center justify-between text-xs font-black text-[#4A4139]">
                    <span>Fase Activa:</span>
                    <span className="text-[#6B21A8]">Fase {curso3Fase} de 12</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={curso3Fase}
                    onChange={e => setCurso3Fase(Number(e.target.value))}
                    className="w-full accent-[#9333EA]"
                  />
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playPopSound}
                    className="w-full py-2.5 rounded-[16px] bg-[#9333EA] text-white font-black text-xs block text-center shadow-sm"
                  >
                    🎧 Abrir Audios ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 9. WRITING CLINIC */}
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
      </main>
    </div>
  );
}