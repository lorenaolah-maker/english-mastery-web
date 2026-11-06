'use client';

import React, { useState, useEffect, useRef } from 'react';

// Estructuras de datos
interface VerbItemFull {
  id: number;
  day: number;
  base: string;
  es: string;
  type: string;
  pron: string;
  past: string;
  participle: string;
  will: string;
  going: string;
  exPres: string;
  exPast: string;
  exFut: string;
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

// Lecciones de gramática integradas directamente
const grammarLessons = [
  {
    id: 'be',
    level: 'A0 - Starter',
    title: "1. El Verbo 'To Be' (Ser o Estar)",
    rule: "En inglés, 'To Be' cumple la función de dos verbos en español: 'ser' y 'estar'. Además, se usa obligatoriamente para la edad (I am 38 years old), las sensaciones físicas (I am cold, I am hungry) y los estados emocionales.",
    formula: "Afirmativo: Sujeto + am/is/are + complemento\nNegativo: Sujeto + am/is/are + NOT + complemento\nPregunta: Am/Is/Are + Sujeto + complemento?",
    examples: [
      { en: "I am from Mexico.", es: "Soy de México." },
      { en: "She is not at home right now.", es: "Ella no está en casa ahora mismo." },
      { en: "Are you ready for class?", es: "¿Estás lista para la clase?" }
    ]
  },
  {
    id: 'third_person',
    level: 'A1 - Elemental',
    title: "2. Tercera Persona en Presente Simple (-s / -es)",
    rule: "Cuando hablas de He (él), She (ella) o It (eso/cosa) en Presente Simple afirmativo, el verbo DEBE llevar -s o -es al final. Si usas preguntas o negaciones con Does/Doesn't, el verbo vuelve a su forma base.",
    formula: "Afirmativo: He / She / It + Verbo(-s/-es)\nNegativo: He / She / It + DOES NOT (doesn't) + Verbo base",
    examples: [
      { en: "She drinks coffee every morning.", es: "Ella toma café cada mañana." },
      { en: "He doesn't eat meat.", es: "Él no come carne (el verbo 'eat' va sin -s por el auxiliar doesn't)." },
      { en: "Does your sister work here?", es: "¿Tu hermana trabaja aquí?" }
    ]
  },
  {
    id: 'past_simple',
    level: 'A2 - Pre-Intermedio',
    title: "3. Pasado Simple: Regulares (-ed) vs Irregulares",
    rule: "Para acciones terminadas en el pasado. Los regulares sólo añaden -ed (worked, played). Los irregulares cambian su forma (went, had, bought). En preguntas y negaciones se usa el auxiliar DID y el verbo principal queda en forma presente.",
    formula: "Afirmativo: Sujeto + Verbo en Pasado\nNegativo: Sujeto + DID NOT (didn't) + Verbo base\nPregunta: Did + Sujeto + Verbo base?",
    examples: [
      { en: "Yesterday I went to the store.", es: "Ayer fui a la tienda." },
      { en: "I didn't buy anything.", es: "No compré nada (el verbo 'buy' va en presente por didn't)." },
      { en: "Did you study yesterday?", es: "¿Estudiaste ayer?" }
    ]
  },
  {
    id: 'future',
    level: 'A2 - Futuro Real',
    title: "4. Futuro: 'Will' vs 'Going to'",
    rule: "Usa 'Going to' cuando ya decidiste o planeaste algo con anticipación, o cuando hay evidencia visible (It is going to rain). Usa 'Will' para decisiones instantáneas tomadas en el momento de hablar, promesas o predicciones generales.",
    formula: "Going to: Sujeto + am/is/are + GOING TO + Verbo base\nWill: Sujeto + WILL + Verbo base",
    examples: [
      { en: "I am going to study English tonight.", es: "Voy a estudiar inglés esta noche (plan previo)." },
      { en: "I'm tired. I will call a taxi.", es: "Estoy cansada. Pediré un taxi (decisión espontánea)." }
    ]
  },
  {
    id: 'present_perfect',
    level: 'B1 - Intermedio',
    title: "5. Present Perfect (Have/Has + Participio)",
    rule: "Conecta el pasado con el presente. Se usa para experiencias de vida sin fecha exacta o acciones que empezaron en el pasado y continúan hoy. Se combina con FOR (duración: for 5 years) y SINCE (punto de inicio: since 2020).",
    formula: "Sujeto + have/has + Participio Pasado (3ra columna de verbos)",
    examples: [
      { en: "I have lived in this city for three years.", es: "He vivido en esta ciudad durante tres años." },
      { en: "Have you ever been to Canada?", es: "¿Alguna vez has estado en Canadá?" }
    ]
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('mision'); // Modo Duolingo por defecto

  // Métricas
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [waterDrops, setWaterDrops] = useState(3);
  const [currentDay, setCurrentDay] = useState(1);

  // Bases de datos cargadas desde public/data/
  const [allVerbs, setAllVerbs] = useState<VerbItemFull[]>([]);
  const [allWords, setAllWords] = useState<WordItemFull[]>([]);

  // Mini-Juego de Parejas
  const [gameCards, setGameCards] = useState<{ id: string; text: string; matchId: string; isMatched: boolean }[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);

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
  const [vocabSearch, setVocabSearch] = useState('');

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

  // Cargar datos JSON de public/data/
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
    const sDay = localStorage.getItem('em_day');

    if (sXp) setXp(Number(sXp));
    if (sMins) setTotalMinutes(Number(sMins));
    if (sStreak) setStreak(Number(sStreak));
    if (sWater) setWaterDrops(Number(sWater));
    if (sDay) setCurrentDay(Number(sDay));
  }, []);

  // Guardar localStorage
  useEffect(() => {
    localStorage.setItem('em_xp', xp.toString());
    localStorage.setItem('em_mins', totalMinutes.toString());
    localStorage.setItem('em_streak', streak.toString());
    localStorage.setItem('em_water', waterDrops.toString());
    localStorage.setItem('em_day', currentDay.toString());
  }, [xp, totalMinutes, streak, waterDrops, currentDay]);

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
      playChimeSound();
      showSaveNotice(`¡Sesión de ${pomoMinutes}m completada! +${earnedXp} XP`);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, pomoMinutes]);

  // Audio ambiental de lluvia
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

  // 3 Verbos del Día
  const currentDayVerbs: VerbItemFull[] = allVerbs.length > 0
    ? allVerbs.filter(v => v.day === currentDay).slice(0, 3)
    : [
        { id: 1, day: 1, base: "be", es: "ser / estar", type: "Irregular", pron: "bíi", past: "was / were", participle: "been", will: "I will be", going: "I am going to be", exPres: "I am happy today.", exPast: "Yesterday I was busy.", exFut: "Tomorrow I will be there." },
        { id: 2, day: 1, base: "have", es: "tener / haber", type: "Irregular", pron: "jáv", past: "had", participle: "had", will: "I will have", going: "I am going to have", exPres: "I have every day.", exPast: "Yesterday I had.", exFut: "Tomorrow I will have." },
        { id: 3, day: 1, base: "do", es: "hacer", type: "Irregular", pron: "dúu", past: "did", participle: "done", will: "I will do", going: "I am going to do", exPres: "I do every day.", exPast: "Yesterday I did.", exFut: "Tomorrow I will do." }
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

  // Iniciar Mini-Juego de Parejas
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

  // 14 Plataformas
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
              { id: 'gramatica', label: 'Lecciones de Gramática', icon: '📝', badge: 'Reglas A0-B1', bg: 'bg-[#D9EBD9]' },
              { id: 'pomodoro', label: 'Dashboard & Focus', icon: '⏱️', badge: 'Focus', bg: 'bg-[#FFD6DE]' },
              { id: 'verbos', label: 'Buscador de Verbos', icon: '⚡', badge: '2,151 Verbos', bg: 'bg-[#FFF1C5]' },
              { id: 'vocabulario', label: 'Vocabulario Completo', icon: '📖', badge: '5,000 Palabras', bg: 'bg-[#D4EBF8]' },
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

        {/* 1. MODO DUOLINGO: MISIÓN DIARIA */}
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
                  Estudia tu dosis diaria sin abrumarte. Escucha la pronunciación nativa y practica con el juego.
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

            {/* Los 3 Verbos del Día */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-[#3D352E] flex items-center gap-2">
                  <span>⚡</span> 3 Verbos del Día ({currentDayVerbs.length})
                </h2>
                <span className="text-[11px] text-[#A84A60] font-bold">Presente · Pasado · Futuro</span>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {currentDayVerbs.map((v, i) => (
                  <div key={i} className="bg-white rounded-[24px] p-5 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#FFF1C5] text-[#8C6200] font-black text-xs flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-lg font-black text-[#3D352E]">{v.base}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E3EFEA] text-[#245445]">{v.type}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#A84A60]">{v.es}</span>
                        <button
                          onClick={() => speakEnglish(v.base)}
                          className="w-8 h-8 rounded-full bg-[#F3ECE1] hover:bg-[#FFD6DE] text-xs flex items-center justify-center shadow-sm"
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
                          <span>{v.will}</span>
                          <button onClick={() => speakEnglish(v.will)} className="text-[11px] opacity-70">🔊</button>
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

                    <div className="text-[11px] text-[#7A6E63] font-medium bg-[#FBF6EF] p-2.5 rounded-[16px] space-y-1">
                      <div>🗣️ <strong>Pronunciación:</strong> /{v.pron}/</div>
                      {v.exPres && <div>• <em>Ejemplo:</em> {v.exPres}</div>}
                    </div>
                  </div>
                ))}
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

            {/* Mini-Juego de Emparejar */}
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

        {/* 2. LECCIONES DE GRAMÁTICA */}
        {activeTab === 'gramatica' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Lecciones de Gramática Explicada <span>📝</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">
                Fórmulas claras y ejemplos cotidianos sin rodeos confusos.
              </p>
            </div>

            <div className="space-y-4">
              {grammarLessons.map((item) => (
                <div key={item.id} className="bg-white rounded-[26px] p-6 shadow-[6px_8px_18px_rgba(210,190,175,0.18)] border border-[#F3ECE1] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#E3EFEA] text-[#245445]">
                      {item.level}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#3D352E]">{item.title}</h3>

                  <p className="text-xs text-[#5C524A] leading-relaxed font-medium">
                    {item.rule}
                  </p>

                  <div className="bg-[#FAF6F0] p-3.5 rounded-[18px] text-xs font-mono font-bold text-[#0369A1] whitespace-pre-line border border-[#E8DFC8]">
                    {item.formula}
                  </div>

                  <div className="pt-2 border-t border-[#F3ECE1] space-y-1.5">
                    <span className="text-[11px] font-black text-[#8C7E72]">Ejemplos prácticos:</span>
                    {item.examples.map((ex, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-[#FBF6EF] p-2 rounded-[14px]">
                        <div>
                          <strong className="text-[#3D352E]">{ex.en}</strong>
                          <span className="text-[#A84A60] ml-2 italic">({ex.es})</span>
                        </div>
                        <button onClick={() => speakEnglish(ex.en)} className="text-xs">🔊</button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. BUSCADOR GLOBAL DE VERBOS (2,151) */}
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
                      verbFilter === f ? 'bg-[#FFD6DE] text-[#A84A60] shadow-sm' : 'bg-white text-[#7A6E63] shadow-sm'
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
                        <div className="font-extrabold text-[#5B21B6]">{v.will}</div>
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

        {/* 4. VOCABULARIO COMPLETO */}
        {activeTab === 'vocabulario' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Vocabulario & 100 Frases <span>📖</span>
                </h1>
                <p className="text-[#7A6E63] text-xs mt-1">4,960 palabras de Excel.</p>
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
          </div>
        )}

        {/* 5. DASHBOARD & FOCUS */}
        {activeTab === 'pomodoro' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[28px] p-6 space-y-4 shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#EAF5EC] text-[#266245] inline-block shadow-sm">
                    Temporizador de Inmersión ⏱️
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
                    onClick={() => {
                      playPopSound();
                      setPomoMinutes(mins);
                      setTimeLeft(mins * 60);
                      setIsRunning(false);
                    }}
                    className={`py-2.5 rounded-[18px] text-xs font-black transition-all shadow-sm ${
                      pomoMinutes === mins ? 'bg-[#FFD6DE] text-[#A84A60]' : 'bg-white text-[#695F56]'
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
                  onClick={toggleFocusAudio}
                  className={`px-5 py-3.5 rounded-[20px] text-xs font-black flex items-center gap-1.5 transition-all shadow-sm ${
                    isAudioPlaying ? 'bg-[#D9EBD9] text-[#1E523A] animate-pulse' : 'bg-white text-[#695F56]'
                  }`}
                >
                  <span>{isAudioPlaying ? '🌧️' : '🎧'}</span> {isAudioPlaying ? 'Lluvia Activa' : 'Lluvia Ambiental'}
                </button>
                <button
                  onClick={() => {
                    playPopSound();
                    setIsRunning(false);
                    setTimeLeft(pomoMinutes * 60);
                  }}
                  className="px-5 py-3.5 rounded-[20px] text-xs font-black bg-white text-[#695F56] shadow-sm"
                >
                  ↺ Reiniciar
                </button>
              </div>
            </div>

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
          </div>
        )}

        {/* 6. HUB DE PLATAFORMAS */}
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
                    className="mt-4 text-center py-2.5 rounded-[18px] font-black text-xs bg-gradient-to-r from-[#FFAAA6] to-[#FF85A1] text-white block shadow-sm"
                  >
                    {p.btn} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. BIBLIOTECA DE CURSOS */}
        {activeTab === 'cursos' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Biblioteca de Cursos <span>📚</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Tus 3 programas de inglés con accesos directos y control semanal.</p>
            </div>

            <div className="bg-white rounded-[28px] p-5 sm:p-6 space-y-4 border-2 border-[#FFE4B5] overflow-hidden shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#FFF1C5] text-[#8C6200] inline-block shadow-sm">
                Curso 1 • Portal Oficial Propio 📱
              </span>
              <h2 className="text-base font-black text-[#3D352E]">Inglés Práctico (App & Biblioteca)</h2>
              <p className="text-xs text-[#6B5E55]">Acceso directo a tus clases, material en PDF de cada lección y asistente con IA.</p>
              <a
                href="https://app.inglespractico.info"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playPopSound}
                className="inline-block px-5 py-2.5 rounded-[18px] bg-[#FFAAA6] text-white font-black text-xs shadow-sm"
              >
                🚀 Abrir App Oficial ↗
              </a>
            </div>

            <div className="bg-white rounded-[28px] p-5 sm:p-6 space-y-4 border-2 border-[#BAE6FD] overflow-hidden shadow-[8px_10px_22px_rgba(210,190,175,0.22)]">
              <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#D4EBF8] text-[#0369A1] inline-block shadow-sm">
                Curso 2 • Método Inmersivo 🎬
              </span>
              <h2 className="text-base font-black text-[#3D352E]">Gringo Academy (Hotmart Club)</h2>
              <p className="text-xs text-[#6B5E55]">Telenovelas, episodios y entrenamiento auditivo continuo.</p>
              <a
                href="https://consumer.hotmart.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={playPopSound}
                className="inline-block px-5 py-2.5 rounded-[18px] bg-[#38BDF8] text-white font-black text-xs shadow-sm"
              >
                🎬 Ver en Hotmart ↗
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}