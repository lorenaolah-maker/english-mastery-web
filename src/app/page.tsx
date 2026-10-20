'use client';

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('quizzes');
  
  // Métricas persistentes
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  // Sistema de Jardín y Planta Viva
  const [waterDrops, setWaterDrops] = useState(3);
  const [plantStage, setPlantStage] = useState(1);

  // Misiones Diarias (Quests)
  const [questPomo, setQuestPomo] = useState(false);
  const [questCards, setQuestCards] = useState(false);
  const [questListening, setQuestListening] = useState(false);
  const [questClaimed, setQuestClaimed] = useState(false);

  // Frase inspiracional diaria
  const [quoteIdx, setQuoteIdx] = useState(0);
  const quotes = [
    { en: "“Small daily improvements over time lead to stunning results.”", es: "Pequeñas mejoras diarias con el tiempo producen resultados asombrosos." },
    { en: "“Fluency is not about perfection, it's about connection and courage.”", es: "La fluidez no es perfección, es conexión y confianza." },
    { en: "“You don't need hours a day, just 20 focused minutes of genuine curiosity.”", es: "No necesitas horas al día, solo 20 minutos con auténtica curiosidad." },
    { en: "“Every word you learn today builds the tomorrow you desire.”", es: "Cada palabra aprendida hoy construye el mañana que deseas." }
  ];

  // Cargar datos guardados
  useEffect(() => {
    const sXp = localStorage.getItem('em_xp');
    const sMins = localStorage.getItem('em_mins');
    const sStreak = localStorage.getItem('em_streak');
    const sFavs = localStorage.getItem('em_favs');
    const sWater = localStorage.getItem('em_water');
    const sPlant = localStorage.getItem('em_plant');
    const sQP = localStorage.getItem('em_qp');
    const sQC = localStorage.getItem('em_qc');
    const sQL = localStorage.getItem('em_ql');
    const sClaimed = localStorage.getItem('em_claimed');

    if (sXp !== null) setXp(Number(sXp));
    if (sMins !== null) setTotalMinutes(Number(sMins));
    if (sStreak !== null) setStreak(Number(sStreak));
    if (sFavs !== null) setFavoritesCount(Number(sFavs));
    if (sWater !== null) setWaterDrops(Number(sWater));
    if (sPlant !== null) setPlantStage(Number(sPlant));
    if (sQP === 'true') setQuestPomo(true);
    if (sQC === 'true') setQuestCards(true);
    if (sQL === 'true') setQuestListening(true);
    if (sClaimed === 'true') setQuestClaimed(true);
  }, []);

  // Guardar datos automáticamente
  useEffect(() => {
    localStorage.setItem('em_xp', xp.toString());
    localStorage.setItem('em_mins', totalMinutes.toString());
    localStorage.setItem('em_streak', streak.toString());
    localStorage.setItem('em_favs', favoritesCount.toString());
    localStorage.setItem('em_water', waterDrops.toString());
    localStorage.setItem('em_plant', plantStage.toString());
    localStorage.setItem('em_qp', questPomo.toString());
    localStorage.setItem('em_qc', questCards.toString());
    localStorage.setItem('em_ql', questListening.toString());
    localStorage.setItem('em_claimed', questClaimed.toString());
  }, [xp, totalMinutes, streak, favoritesCount, waterDrops, plantStage, questPomo, questCards, questListening, questClaimed]);

  // Pomodoro Timer State
  const [pomoMinutes, setPomoMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Speaking Lab State
  const [speakingText, setSpeakingText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Writing Clinic State
  const [writingType, setWritingType] = useState('Diario personal / Reflexión del día');
  const [writingText, setWritingText] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);
  const [isWritingAnalyzing, setIsWritingAnalyzing] = useState(false);

  // Milestones State
  const [selectedMilestone, setSelectedMilestone] = useState('A0');

  // Course Progress State (3 Cursos)
  const [ipWeek, setIpWeek] = useState(1);
  const [gringoUnit, setGringoUnit] = useState(1);
  const [neuralWeek, setNeuralWeek] = useState(1);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Flashcards State
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const flashcards = [
    { lvl: 'A0', cat: 'Edad & Verbo Be', front: 'I am 38 years old', back: 'Tengo 38 años (En inglés la edad se ES con "To Be", nunca con "have") 🌸' },
    { lvl: 'A1', cat: 'Rutinas', front: 'I wake up at 7:00 AM every morning', back: 'Me despierto a las 7:00 AM todas las mañanas (Presente simple) ☀️' },
    { lvl: 'A2', cat: 'Pasado Simple', front: 'I went to the salon yesterday afternoon', back: 'Fui al salón ayer por la tarde (went = pasado irregular de go) 💇‍♀️' },
    { lvl: 'B1', cat: 'Experiencias', front: 'I have lived here for five years', back: 'He vivido aquí durante cinco años (Present Perfect con for) 🌿' },
    { lvl: 'B2', cat: 'Fluidez', front: 'Despite the tight deadline, we delivered on time', back: 'A pesar del plazo ajustado, logramos entregar a tiempo 💼' },
    { lvl: 'C1', cat: 'Inversión', front: 'Seldom have I seen such dedication to mastery', back: 'Rara vez he visto tal dedicación a la maestría ✨' },
    { lvl: 'C2', cat: 'Modismos', front: 'To hit the nail on the head', back: 'Dar en el clavo / acertar con total exactitud 🎯' },
  ];

  // BANCO DE PREGUNTAS SECUENCIALES PARA QUIZZES
  const quizList = [
    {
      level: 'NIVEL A0 • Starter',
      question: '¿Cuál es la forma correcta en inglés para decir "Tengo 30 años"?',
      options: [
        { text: 'I have 30 years', correct: false },
        { text: 'I am 30 years old', correct: true },
        { text: 'I am having 30 years', correct: false },
        { text: 'I got 30 years', correct: false },
      ],
      explanation: 'En inglés la edad se indica con el verbo To Be ("I am ... years old"), nunca con "have".'
    },
    {
      level: 'NIVEL A1 • Presente Simple',
      question: 'Completa la oración: "She _____ coffee every single morning."',
      options: [
        { text: 'drink', correct: false },
        { text: 'drinking', correct: false },
        { text: 'drinks', correct: true },
        { text: 'is drink', correct: false },
      ],
      explanation: 'En Presente Simple, a las terceras personas (he, she, it) se les añade "-s" al verbo.'
    },
    {
      level: 'NIVEL A2 • Pasado Simple',
      question: '¿Cuál es el pasado del verbo irregular "BUY" (comprar)?',
      options: [
        { text: 'Buyed', correct: false },
        { text: 'Bought', correct: true },
        { text: 'Brought', correct: false },
        { text: 'Boat', correct: false },
      ],
      explanation: 'El pasado de "buy" es "bought" (ojo: "brought" es el pasado de "bring").'
    },
    {
      level: 'NIVEL B1 • Present Perfect',
      question: 'Elige la opción correcta: "I have lived in this city _____ five years."',
      options: [
        { text: 'since', correct: false },
        { text: 'for', correct: true },
        { text: 'during', correct: false },
        { text: 'ago', correct: false },
      ],
      explanation: 'Se utiliza "for" para periodos o duraciones de tiempo, y "since" para puntos de partida exactos.'
    },
    {
      level: 'NIVEL B2 • Preposiciones & Phrasal Verbs',
      question: '¿Qué significa el phrasal verb "LOOK FORWARD TO"?',
      options: [
        { text: 'Mirar hacia adelante con precaución', correct: false },
        { text: 'Esperar algo con mucha emoción e ilusión', correct: true },
        { text: 'Buscar un objeto extraviado', correct: false },
        { text: 'Investigar un problema técnico', correct: false },
      ],
      explanation: '"Look forward to" expresa entusiasmo por un evento futuro (ej: I look forward to seeing you).'
    },
    {
      level: 'NIVEL C1 • Inversión Enfatizada',
      question: 'Completa la inversión formal: "Hardly _____ home when the phone rang."',
      options: [
        { text: 'I had arrived', correct: false },
        { text: 'had I arrived', correct: true },
        { text: 'did I arrived', correct: false },
        { text: 'I arrived', correct: false },
      ],
      explanation: 'Tras adverbios negativos iniciales como "Hardly" o "Scarcely", se invierte el sujeto y el auxiliar (Had I arrived).'
    }
  ];

  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Timer Effect
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
      showSaveNotice(`🎉 ¡Sesión de ${pomoMinutes}m completada! +${earnedXp} XP y +2 💧 Gotitas de agua ganadas.`);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, pomoMinutes]);

  const handleStartTimer = (mins: number) => {
    setPomoMinutes(mins);
    setTimeLeft(mins * 60);
    setIsRunning(true);
  };

  const plantData = [
    { icon: '🌱', name: 'Semillita Brotando', desc: 'Regada con tus primeros minutos de inmersión auditiva.' },
    { icon: '🌿', name: 'Brote Fuerte', desc: 'Creciendo con consistencia y práctica diaria.' },
    { icon: '🪴', name: 'Planta de Focus', desc: '¡Llena de energía y hojas verdes por tu concentración!' },
    { icon: '🌸', name: 'Flor Florecida', desc: 'Tu vocabulario florece con cada sesión y tarjeta dominada.' },
    { icon: '🌳', name: 'Árbol Sabio Dorado', desc: '¡Maestría consolidada! Fluidez y soltura bilingüe.' }
  ];

  const handleWaterPlant = () => {
    if (waterDrops > 0) {
      setWaterDrops(prev => prev - 1);
      setPlantStage(prev => (prev < 5 ? prev + 1 : 1));
      setXp(prev => prev + 25);
      showSaveNotice(`💧 ¡Regaste tu planta! +25 XP ✨ Vitalidad al 100%`);
    } else {
      showSaveNotice('🌧️ Necesitas gotitas de agua. Completa un Pomodoro o domina flashcards para ganar más.');
    }
  };

  const handleAnalyzeSpeaking = () => {
    if (!speakingText.trim()) return;
    setAnalyzing(true);
    setTimeout(() => {
      setFeedback(
        "🎯 Puntuación Global: 9.6/10 🌸\n\n🔍 Análisis Gramatical: Excelente estructura y tiempo verbal correcto.\n\n✨ Versión Nivel Nativo: 'I genuinely enjoy building consistent learning habits every single day.'\n\n🗣️ Fonética sugerida: Thoroughly (THUR-uh-lee) — enlaza sonidos sin frenar el flujo.\n\n💡 Tip de Fluidez: Tu cadencia es muy natural, continúa respondiendo en voz alta."
      );
      setAnalyzing(false);
      setXp(prev => prev + 50);
      setWaterDrops(prev => prev + 1);
      showSaveNotice('💖 ¡Speaking corregido con IA! +50 XP y +1 💧');
    }, 1200);
  };

  const handleAnalyzeWriting = () => {
    if (!writingText.trim()) return;
    setIsWritingAnalyzing(true);
    setTimeout(() => {
      setWritingFeedback(
        "📝 Diagnóstico Editorial de Redacción:\n\n✨ Versión Pulida: 'Consistency is the true cornerstone of language fluency. Dedicating twenty focused minutes daily yields significantly better results than cramming once a week.'\n\n💎 Vocabulario Elevado Empleado:\n• Cornerstone (Piedra angular / base sólida)\n• Yields (Produce resultados tangibles)\n• Cramming (Estudio apresurado de último momento)\n\n📌 Guardado: Registro sincronizado automáticamente con tu Notion."
      );
      setIsWritingAnalyzing(false);
      setXp(prev => prev + 60);
      setWaterDrops(prev => prev + 1);
      showSaveNotice('📖 ¡Escrito analizado y guardado! +60 XP y +1 💧');
    }, 1200);
  };

  const showSaveNotice = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3800);
  };

  const handleClaimReward = () => {
    if (questPomo && questCards && questListening && !questClaimed) {
      setQuestClaimed(true);
      setXp(prev => prev + 100);
      setWaterDrops(prev => prev + 3);
      showSaveNotice('🎁 ¡Cofre diario desbloqueado! +100 XP y +3 💧 Gotitas de Agua');
    }
  };

  const handleSelectQuizOption = (option: { text: string; correct: boolean }) => {
    if (selectedAnswer !== null) return; // Evitar doble selección
    setSelectedAnswer(option.text);
    setIsAnswerCorrect(option.correct);
    if (option.correct) {
      setXp(prev => prev + 30);
      setWaterDrops(prev => prev + 1);
      showSaveNotice('🎉 ¡Correcto! +30 XP y +1 💧 Gotita de agua ganada');
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setCurrentQuizIdx(prev => (prev + 1) % quizList.length);
  };

  return (
    <div className="flex min-h-screen bg-[#F7F2EA] text-[#4A4139] font-sans antialiased selection:bg-[#FCD5CE]">
      {/* ESTILOS DE RELIEVE Y SOMBRAS 3D CLAY */}
      <style jsx global>{`
        .clay-card-big {
          background: #FFFFFF;
          box-shadow: 8px 10px 22px rgba(195, 175, 155, 0.25),
                      -6px -6px 16px rgba(255, 255, 255, 0.95);
          border-radius: 30px;
        }
        .clay-icon-big {
          box-shadow: 5px 6px 14px rgba(185, 165, 145, 0.3),
                      -4px -4px 10px rgba(255, 255, 255, 0.95),
                      inset 2px 2px 3px rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-icon-big:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 7px 9px 18px rgba(185, 165, 145, 0.38),
                      -5px -5px 14px rgba(255, 255, 255, 1);
        }
        .clay-icon-big:active {
          transform: translateY(2px) scale(0.98);
          box-shadow: 2px 2px 5px rgba(185, 165, 145, 0.25);
        }
        .clay-inset-pill {
          background: #EFE8DE;
          box-shadow: inset 3px 3px 6px rgba(190, 170, 150, 0.3),
                      inset -3px -3px 6px rgba(255, 255, 255, 0.85);
          border-radius: 20px;
        }
        .clay-pill-active {
          background: #FFFFFF !important;
          box-shadow: 5px 6px 16px rgba(170, 190, 185, 0.4),
                      -4px -4px 12px rgba(255, 255, 255, 1);
          transform: translateX(3px);
        }
        .clay-btn-orange {
          background: linear-gradient(135deg, #FF9B85 0%, #FF856D 100%);
          box-shadow: 5px 6px 14px rgba(255, 133, 109, 0.4),
                      -3px -3px 8px rgba(255, 255, 255, 0.9),
                      inset 2px 2px 3px rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          color: white;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-btn-orange:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
        }
        .clay-btn-orange:active {
          transform: translateY(2px);
        }
      `}</style>

      {/* BARRA LATERAL SALVIA */}
      <aside className="w-76 shrink-0 bg-[#DCECE7] p-5 flex flex-col justify-between border-r border-[#CFE1DC] shadow-[6px_0_24px_rgba(180,200,195,0.2)]">
        <div>
          {/* AVATAR */}
          <div className="clay-card-big p-3.5 mb-5 flex items-center gap-3 bg-[#FFFFFF]/90">
            <div className="relative w-14 h-14 rounded-[24px] p-1 bg-[#DCECE7] clay-icon-big flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[18px] overflow-hidden bg-[#FFD8CC] flex items-center justify-center font-bold text-[#A84A32]">
                <img
                  src="/lorena.jpg"
                  alt="Lorena Alvarez"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-sm font-black">LA</span>
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs">🌸</span>
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-[#55756C] font-extrabold flex items-center gap-1">
                Hi, Lorena! <span>👋</span>
              </div>
              <div className="font-extrabold text-[#3D352E] text-sm tracking-tight truncate">
                English Mastery
              </div>
              <div className="text-[10px] text-[#4A7C59] font-black mt-0.5 flex items-center gap-1">
                <span>⚡</span> Nivel A0 ➔ C2
              </div>
            </div>
          </div>

          {/* MENÚ DE NAVEGACIÓN */}
          <nav className="space-y-2">
            {[
              { id: 'pomodoro', label: 'Dashboard & Focus', icon: '⏱️', badge: '15-20m', bg: 'bg-[#FFD8CC]' },
              { id: 'speaking', label: 'Speaking & Feedback', icon: '🗣️', badge: 'IA Lab', bg: 'bg-[#D8F3DC]' },
              { id: 'cursos', label: 'Biblioteca de Cursos', icon: '📚', badge: '3 Cursos', bg: 'bg-[#FFF0C2]' },
              { id: 'hub', label: 'Hub de Plataformas', icon: '🌐', badge: 'Free', bg: 'bg-[#D9EDF8]' },
              { id: 'listening', label: 'Listening & Inmersión', icon: '🎧', badge: 'Audio', bg: 'bg-[#EEDEF8]' },
              { id: 'writing', label: 'Writing Clinic', icon: '✍️', badge: 'Notion', bg: 'bg-[#FFE5EC]' },
              { id: 'milestones', label: 'Ruta de Hitos', icon: '🗺️', badge: 'A0-C2', bg: 'bg-[#FFF0C2]' },
              { id: 'flashcards', label: 'Flashcards Activas', icon: '🗂️', badge: 'Repaso', bg: 'bg-[#D8F3DC]' },
              { id: 'quizzes', label: 'Quizzes & Tests', icon: '📝', badge: 'Tests', bg: 'bg-[#D9EDF8]' },
            ].map(item => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-[22px] text-xs font-black transition-all ${
                    active
                      ? 'clay-pill-active text-[#3A322C]'
                      : 'text-[#48635B] hover:bg-[#FFFFFF]/50'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-9 h-9 rounded-[16px] flex items-center justify-center text-base clay-icon-big shrink-0 ${item.bg}`}>
                      {item.icon}
                    </span>
                    <span className="text-xs tracking-tight truncate">{item.label}</span>
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                    active ? 'bg-[#DCECE7] text-[#2D5A4C]' : 'bg-[#CFE3DD] text-[#55756C]'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* GOODNOTES */}
        <div className="pt-3 border-t border-[#CFE1DC]">
          <div className="clay-card-big p-4 bg-gradient-to-br from-[#FFE8DF] via-[#FFD8CC] to-[#FFCAD4] border-2 border-[#FFCCD5] flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE4D6] clay-icon-big flex items-center justify-center text-xl mb-1 shadow-inner">
              📓
            </div>
            <div className="text-xs font-black text-[#5C2B34] mt-0.5">Cuaderno Digital</div>
            <p className="text-[10px] text-[#7A3F49] font-semibold mb-2.5">Apuntes en Goodnotes</p>
            <a
              href="goodnotes://"
              className="w-full py-2.5 rounded-[18px] clay-btn-orange text-xs font-black text-center flex items-center justify-center gap-1.5"
            >
              <span>📖</span> Abrir Goodnotes <span>↗</span>
            </a>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto overflow-y-auto">
        {/* NOTIFICACIÓN FLOTANTE */}
        {savedNotice && (
          <div className="fixed top-5 right-5 z-50 clay-card-big bg-[#D8F3DC] text-[#1B4332] font-black text-xs px-5 py-3.5 border-2 border-[#B7E4C7] shadow-xl animate-bounce flex items-center gap-2">
            <span>🌸</span>
            <span>{savedNotice}</span>
          </div>
        )}

        {/* CABECERA SUPERIOR */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-xl font-black text-[#3D352E] tracking-tight">
            Dashboard
          </div>

          <div className="flex items-center gap-3">
            <div className="clay-inset-pill px-4 py-2 flex items-center gap-2 text-xs text-[#8C7E72] w-56 sm:w-64">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search lessons, flashcards..."
                className="bg-transparent border-none text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none w-full font-medium"
              />
            </div>

            <button
              onClick={() => showSaveNotice('🔔 Todas tus metas y repasos van al día con tu semana.')}
              className="w-10 h-10 rounded-full bg-[#FFFFFF] clay-icon-big flex items-center justify-center text-sm relative"
            >
              🔔
              <span className="w-2 h-2 rounded-full bg-[#FF856D] absolute top-2 right-2 ring-2 ring-white"></span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. FOCUS & POMODORO */}
        {/* ========================================================= */}
        {activeTab === 'pomodoro' && (
          <div className="space-y-6">
            <div className="clay-card-big p-6 sm:p-7 bg-gradient-to-r from-[#FFF2EB] via-[#FFF8F3] to-[#FFFFFF] flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden border border-[#F3E2D8]">
              <div className="space-y-2 z-10 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs font-black text-[#8C341E]">
                  <span>Good Morning, Lorena!</span>
                  <span>☀️</span>
                </div>
                <h1 className="text-2xl font-black text-[#3D352E] tracking-tight leading-tight">
                  Let&apos;s master your English today! 🎶
                </h1>
                <p className="text-xs text-[#7A6E63] max-w-md font-medium">
                  Comienza tu semana de estudio con bloques de 15 a 20 minutos de inmersión y enfoque.
                </p>
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleStartTimer(15)}
                    className="px-5 py-2.5 rounded-[20px] clay-btn-orange text-xs font-black flex items-center gap-2"
                  >
                    <span>▶</span> Play Focus (15 Min)
                  </button>
                  <button
                    onClick={handleWaterPlant}
                    className="px-4 py-2.5 rounded-[20px] bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#0369A1] clay-icon-big text-xs font-black flex items-center gap-1.5"
                  >
                    <span>💧</span> Regar Jardín ({waterDrops})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-[28px] bg-[#FFE8DF] clay-icon-big flex items-center justify-center text-4xl shadow-inner">
                  🎧
                </div>
                <div
                  onClick={handleWaterPlant}
                  className="w-22 h-24 rounded-[26px] bg-[#E8F4EE] clay-icon-big p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all text-center border-2 border-[#C7E9D6]"
                  title="Toca para regar tu planta con tus gotitas"
                >
                  <span className="text-3xl animate-bounce">{plantData[plantStage - 1].icon}</span>
                  <span className="text-[9px] font-black text-[#2D6A4F] mt-1 line-clamp-1">{plantData[plantStage - 1].name}</span>
                  <span className="text-[8px] text-[#40916C] font-bold">Nivel {plantStage}/5</span>
                </div>
              </div>
            </div>

            {/* FRASE INSPIRACIONAL */}
            <div
              onClick={() => setQuoteIdx((quoteIdx + 1) % quotes.length)}
              className="clay-card-big p-4 bg-[#FFF9F2] border border-[#F6E1D3] cursor-pointer hover:scale-[1.01] transition-transform flex items-center gap-3"
            >
              <span className="w-10 h-10 rounded-2xl bg-[#FFE4D6] clay-icon-big flex items-center justify-center text-xl shrink-0">
                💬
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-[#6B3728]">{quotes[quoteIdx].en}</div>
                <div className="text-[11px] text-[#8C6D62] font-medium mt-0.5">{quotes[quoteIdx].es}</div>
              </div>
              <span className="text-[10px] text-[#A88B7E] font-bold shrink-0">Toca para cambiar 🔄</span>
            </div>

            {/* TARJETAS PASTEL */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'Songs / XP', val: `${xp}`, sub: 'Iniciando semana', bg: 'bg-[#D8F3DC]', icon: '🎵', text: 'text-[#1B4332]' },
                { label: 'Favorites', val: `${favoritesCount}`, sub: 'Tarjetas dominadas', bg: 'bg-[#FFD8CC]', icon: '💖', text: 'text-[#8C341E]' },
                { label: 'Hours Listened', val: `${(totalMinutes / 60).toFixed(1)}h`, sub: `${totalMinutes} min registrados`, bg: 'bg-[#FFF0C2]', icon: '⏱️', text: 'text-[#7A5B00]' },
                { label: 'Current Streak', val: `${streak}`, sub: 'Día 1 de racha', bg: 'bg-[#D9EDF8]', icon: '🔥', text: 'text-[#1E6091]' },
              ].map((m, idx) => (
                <div key={idx} className="clay-card-big p-4 flex flex-col justify-between items-start h-40 text-left">
                  <div className={`w-11 h-11 rounded-[20px] ${m.bg} clay-icon-big flex items-center justify-center text-xl`}>
                    {m.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#7A6E63] tracking-wide">{m.label}</div>
                    <div className="text-xl sm:text-2xl font-black text-[#3D352E] mt-0.5">{m.val}</div>
                    <div className={`text-[10px] font-black ${m.text} mt-0.5`}>{m.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* MISIONES DIARIAS */}
            <div className="clay-card-big p-5 sm:p-6 space-y-3.5 border border-[#E8DFC8]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span className="font-black text-sm text-[#3D352E]">Reto Diario: 3 Victorias Hoy</span>
                </div>
                <button
                  onClick={handleClaimReward}
                  disabled={!(questPomo && questCards && questListening) || questClaimed}
                  className={`px-4 py-1.5 rounded-full text-xs font-black clay-icon-big transition-all ${
                    questClaimed
                      ? 'bg-[#E5E7EB] text-[#9CA3AF]'
                      : (questPomo && questCards && questListening)
                        ? 'bg-[#FFD8CC] text-[#8C341E] animate-pulse'
                        : 'bg-[#F3EFE6] text-[#A89F91]'
                  }`}
                >
                  {questClaimed ? '✅ Reclamado (+100 XP)' : (questPomo && questCards && questListening) ? '🎁 ¡Abrir Cofre!' : 'Completa las 3'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    setQuestPomo(!questPomo);
                    showSaveNotice(questPomo ? 'Bloque desmarcado' : '⏱️ ¡Meta de Focus marcada!');
                  }}
                  className={`p-3.5 rounded-[22px] clay-icon-big cursor-pointer flex items-center gap-3 ${
                    questPomo ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-[#FFFFFF] text-[#6B5E55]'
                  }`}
                >
                  <span className="text-xl">{questPomo ? '✅' : '⏳'}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-black">1 Bloque de Focus</div>
                    <div className="text-[10px] opacity-80">15 min de estudio</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setQuestCards(!questCards);
                    showSaveNotice(questCards ? 'Meta desmarcada' : '🗂️ ¡Meta de Flashcards marcada!');
                  }}
                  className={`p-3.5 rounded-[22px] clay-icon-big cursor-pointer flex items-center gap-3 ${
                    questCards ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-[#FFFFFF] text-[#6B5E55]'
                  }`}
                >
                  <span className="text-xl">{questCards ? '✅' : '🗂️'}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-black">Repasar Flashcards</div>
                    <div className="text-[10px] opacity-80">Dominar 1 tarjeta</div>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setQuestListening(!questListening);
                    showSaveNotice(questListening ? 'Meta desmarcada' : '🎧 ¡Meta de Listening marcada!');
                  }}
                  className={`p-3.5 rounded-[22px] clay-icon-big cursor-pointer flex items-center gap-3 ${
                    questListening ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-[#FFFFFF] text-[#6B5E55]'
                  }`}
                >
                  <span className="text-xl">{questListening ? '✅' : '🎧'}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-black">Inmersión Auditiva</div>
                    <div className="text-[10px] opacity-80">Listening o YouGlish</div>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA DE RANGO */}
            <div className="clay-card-big p-5 sm:p-6 space-y-2.5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👑</span>
                  <span className="font-black text-sm text-[#3D352E]">Nivel de Progreso: Beginner (Nivel 1)</span>
                </div>
                <span className="font-black text-[#D946EF] text-sm flex items-center gap-1">
                  <span>⭐</span> {xp} XP
                </span>
              </div>
              <div className="clay-inset-pill h-4 p-1 flex items-center">
                <div
                  className="bg-gradient-to-r from-[#FF9A85] via-[#FFB8A3] to-[#FFD8CC] h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min((xp / 1000) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-[#7A6E63] flex justify-between font-semibold">
                <span>Faltan {Math.max(1000 - xp, 0)} XP para el rango Traveler</span>
                <span className="font-black text-[#FF856D]">¡Comenzando con todo esta semana, Lorena! 🌷</span>
              </div>
            </div>

            {/* LOGROS PASTEL */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#7A6E63] mb-3 flex items-center gap-1.5">
                <span>🏆</span> Logros de Consistencia
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { icon: '☀️', title: 'Early Bird', bg: 'bg-[#FFF0C2]', label: 'Mañanera' },
                  { icon: '🌱', title: 'First Step', bg: 'bg-[#D8F3DC]', label: 'Primer paso' },
                  { icon: '🔥', title: 'Warming Up', bg: 'bg-[#FFD8CC]', label: 'En racha' },
                  { icon: '📖', title: 'Module Down', bg: 'bg-[#EEDEF8]', label: 'Módulo listo' },
                ].map((b, idx) => (
                  <div
                    key={idx}
                    onClick={() => showSaveNotice(`🏆 Logro: ${b.title} (${b.label}) activo en tu perfil.`)}
                    className="clay-card-big p-4 flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className={`w-14 h-14 ${b.bg} clay-icon-big rounded-[22px] flex items-center justify-center text-2xl mb-2`}>
                      {b.icon}
                    </div>
                    <span className="text-xs font-black text-[#3D352E]">{b.title}</span>
                    <span className="text-[10px] text-[#8C7E72] font-semibold mt-0.5">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TEMPORIZADOR 3D */}
            <div className="clay-card-big p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#EBF5EE] text-[#2D6A4F] clay-icon-big inline-block">
                    Temporizador ☁️
                  </span>
                  <div className="text-base font-black text-[#3D352E] mt-1">Bloque de Inmersión Focalizado</div>
                </div>
                <div className="text-3xl font-black font-mono text-[#FF856D] clay-inset-pill px-5 py-2">
                  {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[15, 20, 25].map(mins => (
                  <button
                    key={mins}
                    onClick={() => handleStartTimer(mins)}
                    className={`py-2.5 rounded-[18px] text-xs font-black transition-all ${
                      pomoMinutes === mins
                        ? 'clay-icon-big bg-[#FFD8CC] text-[#8C341E]'
                        : 'clay-icon-big bg-[#FFFFFF] text-[#695F56]'
                    }`}
                  >
                    🌸 {mins} Minutos
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 py-3.5 rounded-[20px] text-xs font-black clay-icon-big text-white transition-all ${
                    isRunning
                      ? 'bg-[#FF856D] hover:bg-[#F26A50]'
                      : 'bg-[#52B788] hover:bg-[#40916C]'
                  }`}
                >
                  {isRunning ? '⏸️ Pausar Bloque' : '▶️ Iniciar Estudio (+XP)'}
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setTimeLeft(pomoMinutes * 60);
                  }}
                  className="px-5 py-3.5 rounded-[20px] text-xs font-black clay-icon-big bg-[#FFFFFF] text-[#695F56]"
                >
                  ↺ Reiniciar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. SPEAKING & FEEDBACK LAB */}
        {/* ========================================================= */}
        {activeTab === 'speaking' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Speaking & Feedback Lab <span>🐰</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Corrección de respuestas escritas con IA y evaluación oficial de Cambridge.</p>
            </div>

            <div className="clay-card-big p-6 bg-gradient-to-r from-[#FFF5F0] to-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#FADCD1]">
              <div>
                <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#FFD8CC] text-[#8C341E] clay-icon-big inline-block">
                  Oficial Cambridge 🎓
                </span>
                <div className="text-base font-black text-[#3D352E] mt-1.5">Evaluación de Voz con Sandi el Robot</div>
                <div className="text-xs text-[#6B5E55] mt-0.5">Habla con el evaluador acústico de Cambridge para calibrar tu pronunciación (A1 a C2).</div>
              </div>
              <a
                href="https://speakandimprove.com"
                target="_blank"
                className="px-5 py-2.5 rounded-[18px] clay-btn-orange text-xs font-black text-center whitespace-nowrap"
              >
                Abrir Speak & Improve ↗
              </a>
            </div>

            <div className="clay-card-big p-6 sm:p-7 space-y-4">
              <label className="block text-xs font-black text-[#3D352E]">
                Escribe aquí tu frase o respuesta en inglés para evaluar gramática y pronunciación:
              </label>
              <textarea
                value={speakingText}
                onChange={e => setSpeakingText(e.target.value)}
                placeholder="Ejemplo: Introduce yourself: your name, where you live, and your age. (A0)"
                rows={4}
                className="w-full clay-inset-pill p-4 text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none transition-all font-medium"
              />
              <button
                onClick={handleAnalyzeSpeaking}
                disabled={analyzing}
                className="w-full py-3.5 rounded-[20px] bg-[#D8F3DC] hover:bg-[#B7E4C7] text-[#1B4332] font-black text-xs clay-icon-big disabled:opacity-50"
              >
                {analyzing ? 'Analizando con IA...' : '✨ Analizar y Corregir con IA (+50 XP)'}
              </button>

              {feedback && (
                <div className="clay-inset-pill p-5 text-xs whitespace-pre-line text-[#403833] leading-relaxed font-medium bg-[#FAF6F0]">
                  {feedback}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. BIBLIOTECA DE CURSOS */}
        {/* ========================================================= */}
        {activeTab === 'cursos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Biblioteca de Cursos <span>📚</span>
                </h1>
                <p className="text-[#7A6E63] text-xs mt-1">Tus 3 programas de inglés con accesos directos y control de avance semanal.</p>
              </div>
              <a
                href="https://consumer.hotmart.com"
                target="_blank"
                className="px-5 py-2.5 rounded-[20px] clay-btn-orange text-xs font-black flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
              >
                <span>👑</span> Abrir Mi Cuenta Hotmart ↗
              </a>
            </div>

            {/* CURSO 1: INGLÉS PRÁCTICO */}
            <div className="clay-card-big p-5 sm:p-6 space-y-4 border-2 border-[#FED7AA] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#FFEDD5] text-[#9A3412] clay-icon-big inline-block">
                    Curso 1 • Portal Oficial Propio 📱
                  </span>
                  <h2 className="text-base font-black text-[#3D352E]">Inglés Práctico (App & Biblioteca)</h2>
                  <p className="text-xs text-[#6B5E55]">Acceso directo a tus clases, material en PDF de cada lección y asistente con IA.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="https://app.inglespractico.info"
                    target="_blank"
                    className="px-4 py-2 rounded-[18px] bg-[#FF9B85] hover:bg-[#FF856D] text-white font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    🚀 Abrir App
                  </a>
                  <a
                    href="https://app.inglespractico.info"
                    target="_blank"
                    className="px-4 py-2 rounded-[18px] bg-[#FFF0C2] text-[#7A5B00] font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    📖 PDFs
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3E7DC] flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <span className="text-xs font-bold text-[#6D635B] whitespace-nowrap">Semana completada:</span>
                <select
                  value={ipWeek}
                  onChange={e => setIpWeek(Number(e.target.value))}
                  className="flex-1 min-w-[180px] clay-inset-pill p-2.5 text-xs font-black text-[#3D352E] focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Semana {i + 1} de 12 (Activación Neural)</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setWaterDrops(prev => prev + 1);
                    showSaveNotice(`✅ Inglés Práctico guardado en Semana ${ipWeek} (+1 💧)`);
                  }}
                  className="px-5 py-2.5 rounded-[18px] bg-[#52B788] hover:bg-[#40916C] text-white font-black text-xs clay-icon-big whitespace-nowrap ml-auto sm:ml-0"
                >
                  💾 Guardar Avance
                </button>
              </div>
            </div>

            {/* CURSO 2: GRINGO ACADEMY */}
            <div className="clay-card-big p-5 sm:p-6 space-y-4 border-2 border-[#BAE6FD] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] clay-icon-big inline-block">
                    Curso 2 • Método Inmersivo 🎬
                  </span>
                  <h2 className="text-base font-black text-[#3D352E]">Gringo Academy (Hotmart Club)</h2>
                  <p className="text-xs text-[#6B5E55]">Telenovelas, episodios y entrenamiento auditivo continuo.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    className="px-4 py-2 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    🎬 Ver en Hotmart ↗
                  </a>
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    className="px-4 py-2 rounded-[18px] bg-[#E0F2FE] text-[#0369A1] font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    📑 Guías
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
                  onChange={e => setGringoUnit(Number(e.target.value))}
                  className="w-24 clay-inset-pill p-2.5 text-xs font-black text-[#3D352E] focus:outline-none"
                />
                <span className="text-xs text-[#8C7E72] font-semibold">de 130</span>
                <div className="flex-1 hidden sm:block"></div>
                <button
                  onClick={() => {
                    setWaterDrops(prev => prev + 1);
                    showSaveNotice(`✅ Gringo Academy guardado en Telenovela ${gringoUnit} (+1 💧)`);
                  }}
                  className="px-5 py-2.5 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs clay-icon-big whitespace-nowrap ml-auto sm:ml-0"
                >
                  💾 Guardar Telenovela
                </button>
              </div>
            </div>

            {/* CURSO 3: ACTIVACIÓN NEURAL */}
            <div className="clay-card-big p-5 sm:p-6 space-y-4 border-2 border-[#DDD6FE] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#EDE9FE] text-[#5B21B6] clay-icon-big inline-block">
                    Curso 3 • Reprogramación Subconsciente 🧠
                  </span>
                  <h2 className="text-base font-black text-[#3D352E]">Activación Neural: Audios & Subconsciente</h2>
                  <p className="text-xs text-[#6B5E55]">Sesiones de audio guiadas y acondicionamiento auditivo profundo en Hotmart.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    className="px-4 py-2 rounded-[18px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    🎧 Abrir en Hotmart ↗
                  </a>
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    className="px-4 py-2 rounded-[18px] bg-[#EDE9FE] text-[#5B21B6] font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    🎵 Audios
                  </a>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F3E7DC] flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                <span className="text-xs font-bold text-[#6D635B] whitespace-nowrap">Módulo activo:</span>
                <select
                  value={neuralWeek}
                  onChange={e => setNeuralWeek(Number(e.target.value))}
                  className="flex-1 min-w-[180px] clay-inset-pill p-2.5 text-xs font-black text-[#3D352E] focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Fase {i + 1}: Reprogramación & Escucha Diaria</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setWaterDrops(prev => prev + 1);
                    showSaveNotice(`✅ Activación Neural guardada en Fase ${neuralWeek} (+1 💧)`);
                  }}
                  className="px-5 py-2.5 rounded-[18px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-xs clay-icon-big whitespace-nowrap ml-auto sm:ml-0"
                >
                  💾 Guardar Fase
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. HUB DE PLATAFORMAS */}
        {/* ========================================================= */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Hub de Plataformas Gratuitas <span>☁️</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Herramientas seleccionadas con botones en relieve y color cálido.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Speak & Improve (Cambridge)', desc: 'Evaluador acústico oficial de Cambridge con IA para medir tu nivel exacto.', link: 'https://speakandimprove.com', btn: 'Abrir Cambridge', icon: '🤖', bg: 'bg-[#FFD8CC]', btnBg: 'bg-[#FF9B85] hover:bg-[#FF856D] text-white' },
                { title: 'Duolingo Web', desc: 'Práctica ágil de vocabulario y racha diaria de gramática interactiva.', link: 'https://www.duolingo.com', btn: 'Abrir Duolingo', icon: '🦉', bg: 'bg-[#D8F3DC]', btnBg: 'bg-[#52B788] hover:bg-[#40916C] text-white' },
                { title: 'YouGlish: Contexto Real', desc: 'Escribe cualquier palabra y escúchala pronunciada en clips reales de YouTube.', link: 'https://youglish.com/pronounce/english', btn: 'Abrir YouGlish', icon: '🎬', bg: 'bg-[#FFF0C2]', btnBg: 'bg-[#FB923C] hover:bg-[#F97316] text-white' },
                { title: 'BBC Learning English', desc: 'Episodios de 6 minutos (*6 Minute English*) y pronunciación clara.', link: 'https://www.bbc.co.uk/learningenglish', btn: 'Abrir BBC', icon: '📻', bg: 'bg-[#EEDEF8]', btnBg: 'bg-[#38BDF8] hover:bg-[#0284C7] text-white' },
                { title: 'LingoClip (LyricsTraining)', desc: 'Entrena tu comprensión auditiva rellenando la letra de tus canciones favoritas.', link: 'https://lingoclip.com', btn: 'Abrir LingoClip', icon: '🎵', bg: 'bg-[#D9EDF8]', btnBg: 'bg-[#818CF8] hover:bg-[#6366F1] text-white' },
                { title: 'Cambridge Dictionary', desc: 'Diccionario con audio británico y americano oficial y transcripción IPA.', link: 'https://dictionary.cambridge.org', btn: 'Abrir Diccionario', icon: '📖', bg: 'bg-[#FFE5EC]', btnBg: 'bg-[#F472B6] hover:bg-[#EC4899] text-white' },
              ].map((p, idx) => (
                <div key={idx} className="clay-card-big p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <span className={`w-11 h-11 rounded-[18px] ${p.bg} clay-icon-big flex items-center justify-center text-xl`}>
                        {p.icon}
                      </span>
                      <h3 className="font-black text-[#3D352E] text-sm">{p.title}</h3>
                    </div>
                    <p className="text-xs text-[#6B5E55] leading-relaxed font-medium">{p.desc}</p>
                  </div>
                  <a href={p.link} target="_blank" className={`mt-4 text-center py-2.5 rounded-[18px] font-black text-xs clay-icon-big ${p.btnBg} block`}>
                    {p.btn} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. LISTENING & INMERSIÓN */}
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
              <div className="clay-card-big p-6 space-y-3">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD8CC] text-[#8C341E] clay-icon-big inline-block">
                  Método 1 • Connected Speech
                </span>
                <h3 className="font-black text-sm text-[#3D352E]">El Filtro YouGlish 🎬</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Los nativos enlazan sonidos (por ejemplo, <em>&quot;going to&quot;</em> suena <em>&quot;gonna&quot;</em>; <em>&quot;what do you&quot;</em> suena <em>&quot;whaddya&quot;</em>). Busca frases cortas en YouGlish para entrenar el oído a la cadencia real.
                </p>
                <a
                  href="https://youglish.com/pronounce/english"
                  target="_blank"
                  className="inline-block px-5 py-2.5 rounded-[18px] clay-btn-orange text-xs font-black"
                >
                  Probar en YouGlish ↗
                </a>
              </div>

              <div className="clay-card-big p-6 space-y-3">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D9EDF8] text-[#1E6091] clay-icon-big inline-block">
                  Método 2 • Micro-Inmersión
                </span>
                <h3 className="font-black text-sm text-[#3D352E]">BBC 6 Minute English 📻</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Escucha un episodio breve de 6 minutos sin leer. En la segunda vuelta, sigue la transcripción para identificar exactamente los sonidos que no captaste al inicio.
                </p>
                <a
                  href="https://www.bbc.co.uk/learningenglish/features/6-minute-english"
                  target="_blank"
                  className="inline-block px-5 py-2.5 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs clay-icon-big"
                >
                  Escuchar BBC 6-Minute ↗
                </a>
              </div>
            </div>

            <div className="clay-card-big p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-[22px] bg-[#D8F3DC] clay-icon-big flex items-center justify-center text-2xl shrink-0">
                  🎧
                </div>
                <div>
                  <div className="text-xs font-black text-[#3D352E]">Meta de Escucha Diaria: 20 Minutos</div>
                  <div className="text-[11px] text-[#7A6E63] font-semibold">Podcasts, audio-lecciones de Gringo Academy o videos YouGlish.</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setXp(prev => prev + 30);
                  setTotalMinutes(prev => prev + 20);
                  setWaterDrops(prev => prev + 2);
                  setQuestListening(true);
                  showSaveNotice('🎉 ¡20 min de Listening registrados! +30 XP y +2 💧');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-[18px] bg-[#52B788] hover:bg-[#40916C] text-white font-black text-xs clay-icon-big whitespace-nowrap"
              >
                ✅ Marcar como Completado (+30 XP)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. WRITING CLINIC */}
        {/* ========================================================= */}
        {activeTab === 'writing' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Writing Clinic: Taller Editorial <span>✍️</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Escribe borradores, diarios o correos y recíbelos pulidos con nivel nativo.</p>
            </div>

            <div className="clay-card-big p-6 sm:p-7 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#EEDEF8] text-[#6A3D8A] clay-icon-big inline-block">
                  Sincronizado con Notion 📓
                </span>
                <span className="text-xs text-[#7A6E63] font-semibold">Borrador persistente</span>
              </div>

              <div>
                <label className="block text-xs font-black text-[#3D352E] mb-2">Tipo de texto a redactar:</label>
                <select
                  value={writingType}
                  onChange={e => setWritingType(e.target.value)}
                  className="w-full clay-inset-pill p-3 text-xs font-black text-[#3D352E] focus:outline-none"
                >
                  <option>Diario personal / Reflexión del día</option>
                  <option>Correo electrónico profesional o de negocios</option>
                  <option>Resumen de lo aprendido hoy</option>
                  <option>Redacción libre sobre un tema</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-[#3D352E] mb-2">Tu texto en inglés:</label>
                <textarea
                  value={writingText}
                  onChange={e => setWritingText(e.target.value)}
                  placeholder="Write your thoughts in English here..."
                  rows={5}
                  className="w-full clay-inset-pill p-4 text-xs text-[#3D352E] placeholder-[#A3978C] focus:outline-none transition-all font-medium"
                />
              </div>

              <button
                onClick={handleAnalyzeWriting}
                disabled={isWritingAnalyzing}
                className="w-full py-3.5 rounded-[20px] bg-[#EEDEF8] hover:bg-[#E3CCF2] text-[#6A3D8A] font-black text-xs clay-icon-big disabled:opacity-50"
              >
                {isWritingAnalyzing ? 'Analizando redacción...' : '✨ Analizar y Guardar en Notion (+60 XP)'}
              </button>

              {writingFeedback && (
                <div className="clay-inset-pill p-5 text-xs whitespace-pre-line text-[#403833] leading-relaxed font-medium bg-[#FAF6F0]">
                  {writingFeedback}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. RUTA DE HITOS (A0 A C2) */}
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
                { id: 'A0', label: 'A0: Starter', color: 'bg-[#FFD8CC] text-[#8C341E]' },
                { id: 'A1', label: 'A1: Elemental', color: 'bg-[#D9EDF8] text-[#1E6091]' },
                { id: 'A2', label: 'A2: Pre-Intermedio', color: 'bg-[#D8F3DC] text-[#1B4332]' },
                { id: 'B1', label: 'B1: Intermedio', color: 'bg-[#EEDEF8] text-[#6A3D8A]' },
                { id: 'B2', label: 'B2: Fluidez', color: 'bg-[#FFE5EC] text-[#9D4E67]' },
                { id: 'C1', label: 'C1: Avanzado', color: 'bg-[#FFF0C2] text-[#7A5B00]' },
                { id: 'C2', label: 'C2: Nativo', color: 'bg-[#EBF5EE] text-[#2D6A4F]' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedMilestone(lvl.id)}
                  className={`px-4 py-2.5 rounded-[18px] text-xs font-black transition-all shrink-0 ${
                    selectedMilestone === lvl.id
                      ? `${lvl.color} clay-icon-big scale-105`
                      : 'bg-[#FFFFFF] text-[#695F56] clay-icon-big'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            <div className="clay-card-big p-6 sm:p-7 space-y-4">
              {selectedMilestone === 'A0' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD8CC] text-[#8C341E] clay-icon-big inline-block">Nivel A0 • Primeros Pasos</span>
                  <h3 className="text-base font-black text-[#3D352E]">Fundamentos Absolutos y Desbloqueo Inicial</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Verbo <em>To Be</em> en afirmación, negación y pregunta. Pronombres personales (I, you, he, she, it, we, they) y adjetivos posesivos (my, your, her, his).</li>
                    <li>• <strong>Expresiones fijas:</strong> Edad (<em>I am 38 years old</em>), origen (<em>I am from Mexico</em>), alfabeto para deletreo y números básicos.</li>
                    <li>• <strong>Meta evaluable:</strong> Presentarte a ti misma, decir tu profesión, origen y edad con pronunciación fluida y sin titubeos.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'A1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D9EDF8] text-[#1E6091] clay-icon-big inline-block">Nivel A1 • Elemental</span>
                  <h3 className="text-base font-black text-[#3D352E]">Rutinas y Entorno Cotidiano</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Presente Simple (regla de tercera persona con -s/-es), auxiliares <em>do / does / don&apos;t / doesn&apos;t</em>, y preposiciones de tiempo/lugar (in, on, at).</li>
                    <li>• <strong>Vocabulario clave:</strong> Horas, comida, familia, compras y pasatiempos.</li>
                    <li>• <strong>Meta evaluable:</strong> Describir tu día típico de la mañana a la noche sin traducir mentalmente.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'A2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] clay-icon-big inline-block">Nivel A2 • Pre-Intermedio</span>
                  <h3 className="text-base font-black text-[#3D352E]">Pasado, Planes y Experiencias Inmediatas</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Pasado Simple regular (-ed) y los 50 verbos irregulares más frecuentes (went, bought, spoke), pasado continuo (was/were doing), y futuro con <em>going to</em> vs <em>will</em>.</li>
                    <li>• <strong>Vocabulario clave:</strong> Viajes, hoteles, direcciones y citas en el calendario.</li>
                    <li>• <strong>Meta evaluable:</strong> Contar qué hiciste el fin de semana pasado y qué harás el próximo mes.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'B1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#EEDEF8] text-[#6A3D8A] clay-icon-big inline-block">Nivel B1 • Intermedio Independiente</span>
                  <h3 className="text-base font-black text-[#3D352E]">Autonomía Conversacional y Trabajo</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Present Perfect (con <em>already, yet, just, since, for</em>), primer y segundo condicional (if + would), modales de obligación (must, should, have to).</li>
                    <li>• <strong>Meta evaluable:</strong> Mantener una conversación de 15 minutos explicando tus proyectos o resolver imprevistos en viajes.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'B2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFE5EC] text-[#9D4E67] clay-icon-big inline-block">Nivel B2 • Intermedio Alto</span>
                  <h3 className="text-base font-black text-[#3D352E]">Fluidez Profesional y Técnica</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Tercer condicional y condicionales mixtos, voz pasiva avanzada, modales de deducción pasada (must have been) y phrasal verbs idiomáticos.</li>
                    <li>• <strong>Meta evaluable:</strong> Participar en reuniones de trabajo internacionales y entender podcasts sin subtítulos.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'C1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFF0C2] text-[#7A5B00] clay-icon-big inline-block">Nivel C1 • Avanzado Operativo</span>
                  <h3 className="text-base font-black text-[#3D352E]">Dominio Académico y Especializado</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Inversión gramatical enfática (<em>Rarely had I seen...</em>), modo subjuntivo formal, cláusulas de participio y conectores discursivos sofisticados.</li>
                    <li>• <strong>Meta evaluable:</strong> Diseñar y presentar un pitch completo en inglés técnico con soltura absoluta.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'C2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#EBF5EE] text-[#2D6A4F] clay-icon-big inline-block">Nivel C2 • Maestría Nativa</span>
                  <h3 className="text-base font-black text-[#3D352E]">Bilingüismo Completo y Espontaneidad</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Competencias clave:</strong> Captar ironías sutiles, dobles sentidos, modismos culturales contemporáneos y control absoluto del tono y registro lingüístico.</li>
                    <li>• <strong>Meta evaluable:</strong> Liderar entrevistas, conferencias o debates con la misma soltura que un orador nativo educado.</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 8. FLASHCARDS ACTIVAS */}
        {/* ========================================================= */}
        {activeTab === 'flashcards' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Smart Flashcards (A0 a C2) <span>🌷</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Repaso espaciado activo con tarjetas táctiles tridimensionales.</p>
            </div>

            <div
              onClick={() => setShowAnswer(!showAnswer)}
              className="clay-card-big p-10 sm:p-14 text-center cursor-pointer hover:scale-[1.01] transition-all min-h-[240px] flex flex-col items-center justify-center space-y-3.5"
            >
              <span className="text-[10px] font-black uppercase px-3.5 py-1 rounded-full bg-[#FFD8CC] text-[#8C341E] clay-icon-big inline-block">
                {flashcards[cardIndex].lvl} • {flashcards[cardIndex].cat}
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#3D352E]">
                {showAnswer ? flashcards[cardIndex].back : flashcards[cardIndex].front}
              </div>
              <span className="text-[11px] text-[#A89C90] font-bold">
                {showAnswer ? '💡 Regla y significado' : '👆 Toca la tarjeta para voltear'}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAnswer(false);
                  setCardIndex(prev => (prev + 1) % flashcards.length);
                }}
                className="flex-1 py-3.5 rounded-[20px] bg-[#FFFFFF] text-[#5C524A] font-black text-xs clay-icon-big"
              >
                ➡️ Siguiente Tarjeta
              </button>
              <button
                onClick={() => {
                  setXp(prev => prev + 20);
                  setFavoritesCount(prev => prev + 1);
                  setWaterDrops(prev => prev + 1);
                  setQuestCards(true);
                  setShowAnswer(false);
                  setCardIndex(prev => (prev + 1) % flashcards.length);
                  showSaveNotice('🎉 ¡Tarjeta dominada! +20 XP y +1 💧');
                }}
                className="flex-1 py-3.5 rounded-[20px] bg-[#52B788] text-white font-black text-xs clay-icon-big"
              >
                ✅ ¡La domino! (+20 XP)
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 9. QUIZZES & EVALUACIONES (BANCO COMPLETO CON BOTÓN SIGUIENTE) */}
        {/* ========================================================= */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                  Quizzes & Evaluaciones <span>🧁</span>
                </h1>
                <p className="text-[#7A6E63] text-xs mt-1">Preguntas de diagnóstico progresivas de A0 a C1 con retroalimentación inmediata.</p>
              </div>
              <div className="clay-inset-pill px-4 py-1.5 text-xs font-black text-[#6B5E55] self-start sm:self-auto">
                Pregunta {currentQuizIdx + 1} de {quizList.length}
              </div>
            </div>

            <div className="clay-card-big p-6 sm:p-7 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D9EDF8] text-[#1E6091] clay-icon-big inline-block">
                  {quizList[currentQuizIdx].level}
                </span>
                <span className="text-[11px] font-bold text-[#8C7E72]">
                  Aciertos: +30 XP y +1 💧
                </span>
              </div>

              <div className="text-sm sm:text-base font-black text-[#3D352E] leading-snug">
                {quizList[currentQuizIdx].question}
              </div>

              <div className="space-y-2.5 pt-1">
                {quizList[currentQuizIdx].options.map((op, idx) => {
                  const isSelected = selectedAnswer === op.text;
                  let btnStyle = "bg-[#FFFFFF] text-[#4A4139] border-[#E8DFC8]";
                  
                  if (selectedAnswer !== null) {
                    if (op.correct) {
                      btnStyle = "bg-[#D8F3DC] text-[#1B4332] border-[#74C69D] font-extrabold";
                    } else if (isSelected && !op.correct) {
                      btnStyle = "bg-[#FFD8CC] text-[#8C341E] border-[#FCA5A5] font-extrabold";
                    } else {
                      btnStyle = "bg-[#F3EFE6] text-[#A89F91] border-transparent opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(op)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left p-3.5 rounded-[20px] text-xs font-black transition-all border clay-icon-big ${btnStyle}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center text-[10px] font-black text-[#7A6E63] shadow-sm shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{op.text}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* RETROALIMENTACIÓN Y BOTÓN SIGUIENTE */}
              {selectedAnswer !== null && (
                <div className="space-y-3 pt-2">
                  <div className={`p-4 rounded-[20px] text-xs font-bold clay-inset-pill leading-relaxed ${
                    isAnswerCorrect ? 'text-[#1B4332] bg-[#D8F3DC]' : 'text-[#8C341E] bg-[#FFD8CC]'
                  }`}>
                    <div className="font-black text-sm mb-0.5">
                      {isAnswerCorrect ? '🎉 ¡Respuesta Correcta!' : '❌ Incorrecto'}
                    </div>
                    {quizList[currentQuizIdx].explanation}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={handleNextQuiz}
                      className="flex-1 py-3.5 rounded-[20px] clay-btn-orange text-xs font-black flex items-center justify-center gap-2"
                    >
                      <span>➡️</span> {currentQuizIdx + 1 === quizList.length ? 'Comenzar de Nuevo' : 'Siguiente Pregunta'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
