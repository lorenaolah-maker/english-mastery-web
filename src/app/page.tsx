'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('vocabulario');
  
  // Métricas persistentes
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  // Jardín y Agua
  const [waterDrops, setWaterDrops] = useState(3);
  const [plantStage, setPlantStage] = useState(1);

  // Registro semanal de racha (Lunes a Domingo)
  const [weeklyActive, setWeeklyActive] = useState<boolean[]>([true, false, false, false, false, false, false]);

  // Quests
  const [questPomo, setQuestPomo] = useState(false);
  const [questCards, setQuestCards] = useState(false);
  const [questListening, setQuestListening] = useState(false);
  const [questClaimed, setQuestClaimed] = useState(false);

  // Focus Audio Ambiental
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Context compartido para efectos táctiles
  const sfxCtxRef = useRef<AudioContext | null>(null);

  const getSfxContext = () => {
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
    { en: "“Small daily steps every day lead to big changes.”", es: "Pequeños pasos diarios conducen a grandes cambios." },
    { en: "“Fluency is consistency in action, not overnight magic.”", es: "La fluidez es constancia en acción, no magia de la noche a la mañana." },
    { en: "“Focus for twenty quiet minutes, and let time do the rest.”", es: "Concéntrate veinte minutos en calma y deja que el tiempo haga el resto." },
    { en: "“Your dedication today opens global doors tomorrow.”", es: "Tu dedicación de hoy abre puertas globales mañana." }
  ];

  // Cargar datos
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
    const sWeek = localStorage.getItem('em_week');

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
    if (sWeek !== null) {
      try { setWeeklyActive(JSON.parse(sWeek)); } catch {}
    }
  }, []);

  // Guardar datos
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
    localStorage.setItem('em_week', JSON.stringify(weeklyActive));
  }, [xp, totalMinutes, streak, favoritesCount, waterDrops, plantStage, questPomo, questCards, questListening, questClaimed, weeklyActive]);

  // Manejo de sonido ambiental de lluvia
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
        showSaveNotice('🌧️ Sonido de lluvia suave activado para tu concentración');
      } catch {
        showSaveNotice('🎧 Toca la pantalla para activar el audio');
      }
    }
  };

  // Función de voz nativa Web Speech
  const speakEnglish = (text: string) => {
    playPopSound();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const cleanText = text.replace(/^[A-D]\s+/, '').trim();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        utterance.volume = 1;

        const voices = window.speechSynthesis.getVoices();
        const enVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Siri') || v.name.includes('Google') || v.lang === 'en-US'));
        if (enVoice) {
          utterance.voice = enVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch {
        showSaveNotice('🔊 Error al activar altavoz en Safari');
      }
    } else {
      showSaveNotice('🔊 Voz no soportada en este navegador');
    }
  };

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

  // Course Progress State
  const [ipWeek, setIpWeek] = useState(1);
  const [gringoUnit, setGringoUnit] = useState(1);
  const [neuralWeek, setNeuralWeek] = useState(1);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Banco amplio de Flashcards con regla gramatical
  const [cardLevelFilter, setCardLevelFilter] = useState('TODOS');
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const rawFlashcards = [
    { lvl: 'A0', cat: 'Edad & Verbo Be', front: 'I am 38 years old', back: 'Tengo 38 años. Regla: En inglés la edad siempre se expresa con el verbo To Be (I am / She is), nunca con have.' },
    { lvl: 'A0', cat: 'Verbo Be Negativo', front: 'They are not at home', back: 'Ellos no están en casa. Regla: La negación simple se forma colocando NOT directamente después de am / is / are.' },
    { lvl: 'A0', cat: 'Artículos A vs AN', front: 'An hour / A university', back: 'Una hora / Una universidad. Regla: La regla de a/an depende del sonido, no de la letra escrita. Hour suena vocal ("our"); university suena semiconsonante (/ju:/).' },
    { lvl: 'A0', cat: 'Plurales Irregulares', front: 'Child ➔ Children / Person ➔ People', back: 'Niño ➔ Niños / Persona ➔ Gente. Regla: Sustantivos irregulares que no llevan -s al pluralizarse.' },
    { lvl: 'A0', cat: 'Pronombres Sujeto vs Objeto', front: 'She called him yesterday', back: 'Ella lo llamó a él ayer. Regla: Los pronombres sujeto hacen la acción (She) y los objeto la reciben (him/her/them).' },

    { lvl: 'A1', cat: 'Tercera Persona Singular', front: 'She drinks coffee every morning', back: 'Ella toma café cada mañana. Regla: En Presente Simple afirmativo, a he/she/it se le añade -s o -es al verbo principal.' },
    { lvl: 'A1', cat: 'Preguntas con Do/Does', front: 'Where do you work?', back: '¿Dónde trabajas? Regla: En preguntas de presente simple se requiere el auxiliar Do (I/you/we/they) o Does (he/she/it).' },
    { lvl: 'A1', cat: 'Preposiciones de Tiempo', front: 'At 7:00 AM / On Monday / In July', back: 'A las 7:00 / El lunes / En julio. Regla: AT para horas exactas, ON para días específicos y fechas, IN para meses o años.' },
    { lvl: 'A1', cat: 'Sustantivos Incontables', front: 'The money is on the table', back: 'El dinero está en la mesa. Regla: Money e information son incontables en inglés: van siempre en singular (is), nunca con -s ni con "are".' },
    { lvl: 'A1', cat: 'Expresión de Existencia', front: 'There is a book / There are two cats', back: 'Hay un libro / Hay dos gatos. Regla: "There is" para singular, "There are" para plural.' },

    { lvl: 'A2', cat: 'Pasado Simple Irregular', front: 'I bought a new dictionary yesterday', back: 'Compré un nuevo diccionario ayer. Regla: Bought es el pasado irregular de buy (ojo: brought viene de bring).' },
    { lvl: 'A2', cat: 'Futuro: Going to vs Will', front: 'I am going to study tonight', back: 'Voy a estudiar esta noche. Regla: "Going to" se usa para planes o intenciones ya decididas; "will" para decisiones espontáneas.' },
    { lvl: 'A2', cat: 'Comparativos con Than', front: 'My city is larger than yours', back: 'Mi ciudad es más grande que la tuya. Regla: Adjetivos cortos añaden -er y se acompañan con la partícula "than".' },
    { lvl: 'A2', cat: 'Pasado Continuo Interrumpido', front: 'I was reading when the phone rang', back: 'Estaba leyendo cuando sonó el teléfono. Regla: Pasado continuo (was/were + -ing) para la acción larga interrumpida por pasado simple.' },
    { lvl: 'A2', cat: 'Falsos Amigos: Actually', front: 'Actually, I never said that', back: 'En realidad, nunca dije eso. Regla: "Actually" significa en realidad / de hecho. Actualmente se dice "Currently".' },

    { lvl: 'B1', cat: 'Present Perfect con For/Since', front: 'I have lived here for five years', back: 'He vivido aquí durante cinco años. Regla: "For" indica duración temporal; "since" marca el punto exacto de inicio.' },
    { lvl: 'B1', cat: 'Primer Condicional', front: 'If it rains, we will stay at home', back: 'Si llueve, nos quedaremos en casa. Regla: If + Presente Simple en la condición, Will + verbo base en el resultado.' },
    { lvl: 'B1', cat: 'Segundo Condicional', front: 'If I had more time, I would travel', back: 'Si tuviera más tiempo, viajaría. Regla: If + Pasado Simple en la hipótesis, Would + verbo base en la consecuencia.' },
    { lvl: 'B1', cat: 'Phrasal Verb: Look Forward To', front: 'I look forward to meeting you', back: 'Espero con mucha ilusión conocerte. Regla: La preposición "to" aquí exige verbo con terminación -ing o sustantivo.' },
    { lvl: 'B1', cat: 'Modales de Deducción', front: 'She must be at work right now', back: 'Ella debe de estar en el trabajo ahora mismo. Regla: "Must" expresa certeza o deducción lógica afirmativa de alta probabilidad.' },

    { lvl: 'B2', cat: 'Tercer Condicional', front: 'If I had known, I would have helped you', back: 'Si lo hubiera sabido, te habría ayudado. Regla: If + Past Perfect, Would have + Participio Pasado.' },
    { lvl: 'B2', cat: 'Voz Pasiva Formal', front: 'The new system was implemented yesterday', back: 'El nuevo sistema fue implementado ayer. Regla: Verbo To Be conjugado + Participio del verbo principal cuando importa la acción.' },
    { lvl: 'B2', cat: 'Cláusulas de Contraste', front: 'Despite the rain, we enjoyed the trip', back: 'A pesar de la lluvia, disfrutamos el viaje. Regla: "Despite" e "In spite of" van seguidos de sustantivo o gerundio (-ing).' },
    { lvl: 'B2', cat: 'Modales Pasados', front: 'You should have told me earlier', back: 'Deberías habérmelo dicho antes. Regla: Should have + participio expresa arrepentimiento o crítica sobre el pasado.' },

    { lvl: 'C1', cat: 'Inversión Gramatical Enfática', front: 'Seldom have I seen such dedication', back: 'Rara vez he visto tal dedicación. Regla: Adverbios negativos iniciales (Seldom, Rarely, Hardly) fuerzan la estructura auxiliar + sujeto.' },
    { lvl: 'C1', cat: 'Subjuntivo Formal', front: 'I recommend that she be present', back: 'Recomiendo que ella esté presente. Regla: En registros formales se usa la forma base del verbo (be, go) tras verbos de demanda o sugerencia.' },
    { lvl: 'C2', cat: 'Modismos Nativos', front: 'To hit the nail on the head', back: 'Dar en el clavo con total exactitud. Uso: Expresión idiomática que denota precisión conceptual absoluta en una conversación.' },
    { lvl: 'C2', cat: 'Participle Clauses', front: 'Having finished her project, she rested', back: 'Habiendo concluido su proyecto, descansó. Regla: Reduce cláusulas temporales o causales aportando fluidez nativa y elegancia.' }
  ];

  const filteredFlashcards = rawFlashcards.filter(c => {
    if (cardLevelFilter === 'TODOS') return true;
    if (cardLevelFilter === 'A0-A1') return c.lvl === 'A0' || c.lvl === 'A1';
    if (cardLevelFilter === 'A2-B1') return c.lvl === 'A2' || c.lvl === 'B1';
    if (cardLevelFilter === 'B2-C2') return c.lvl === 'B2' || c.lvl === 'C1' || c.lvl === 'C2';
    return true;
  });

  const activeCard = filteredFlashcards[cardIndex % filteredFlashcards.length] || rawFlashcards[0];

  // Vocabulario estructurado de los PDFs
  const [vocabTab, setVocabTab] = useState('200_SUSTANTIVOS');
  const [vocabSearch, setVocabSearch] = useState('');

  const vocab200List = [
    { en: 'Head', es: 'Cabeza', cat: 'El Cuerpo', ipa: 'jed', note: 'Parte superior del cuerpo' },
    { en: 'Eye', es: 'Ojo', cat: 'El Cuerpo', ipa: 'ái', note: 'Suena exactamente igual que "I" (yo)' },
    { en: 'Ear', es: 'Oreja, oído', cat: 'El Cuerpo', ipa: 'íer', note: 'No confundir con year (año)' },
    { en: 'Nose', es: 'Nariz', cat: 'El Cuerpo', ipa: 'nóus', note: 'Sustantivo singular' },
    { en: 'Mouth', es: 'Boca', cat: 'El Cuerpo', ipa: 'máuz', note: 'Sonido "th" suave entre los dientes' },
    { en: 'Heart', es: 'Corazón', cat: 'El Cuerpo', ipa: 'jart', note: 'No confundir con hurt (doler)' },
    { en: 'Hair', es: 'Cabello, pelo', cat: 'El Cuerpo', ipa: 'jéar', note: 'Incontable: "My hair is clean"' },
    { en: 'Hand', es: 'Mano', cat: 'El Cuerpo', ipa: 'jand', note: 'También verbo: "hand in" (entregar)' },
    { en: 'Back', es: 'Espalda / Atrás', cat: 'El Cuerpo', ipa: 'bak', note: 'Doble función: espalda o regresar (come back)' },
    { en: 'Mind', es: 'Mente', cat: 'El Cuerpo', ipa: 'máind', note: 'También: "Do you mind?" (¿Te molesta?)' },

    { en: 'Child / Children', es: 'Niño/a ➔ Niños/as', cat: 'Familia', ipa: 'chaild ➔ chídren', note: 'Plural irregular sin -s' },
    { en: 'Woman / Women', es: 'Mujer ➔ Mujeres', cat: 'Familia', ipa: 'úman ➔ uímin', note: 'Cambia la pronunciación de las dos vocales' },
    { en: 'Man / Men', es: 'Hombre ➔ Hombres', cat: 'Familia', ipa: 'man ➔ men', note: 'Plural irregular' },
    { en: 'Person / People', es: 'Persona ➔ Gente', cat: 'Familia', ipa: 'pérson ➔ pípol', note: 'People siempre lleva verbo en plural: "People are..."' },
    { en: 'Wife / Wives', es: 'Esposa ➔ Esposas', cat: 'Familia', ipa: 'uáif ➔ uáivz', note: 'Terminaciones en -fe cambian a -ves' },
    { en: 'Son', es: 'Hijo varón', cat: 'Familia', ipa: 'san', note: 'Suena exactamente igual que "Sun" (sol)' },

    { en: 'Home', es: 'Hogar, donde vives', cat: 'Casa', ipa: 'jóum', note: 'I go home (sin preposición "to")' },
    { en: 'House', es: 'Casa (el edificio físico)', cat: 'Casa', ipa: 'jáus', note: 'Refiere a la construcción' },
    { en: 'Clothes', es: 'Ropa', cat: 'Casa', ipa: 'clóudz', note: 'Siempre plural: "My clothes are in the closet"' },
    { en: 'Glass / Glasses', es: 'Vaso/Vidrio ➔ Anteojos', cat: 'Casa', ipa: 'glas ➔ glásiz', note: 'En plural significa lentes o gafas' },
    { en: 'Key', es: 'Llave o clave', cat: 'Casa', ipa: 'ki', note: 'Tanto llave física como clave de acceso' },
    { en: 'Window', es: 'Ventana', cat: 'Casa', ipa: 'uíndou', note: 'Sustantivo común' },

    { en: 'City', es: 'Ciudad', cat: 'Ciudad', ipa: 'síti', note: 'Plural: cities' },
    { en: 'Street', es: 'Calle', cat: 'Ciudad', ipa: 'strit', note: 'Usa la preposición "on": On Main Street' },
    { en: 'School', es: 'Escuela / Colegio', cat: 'Ciudad', ipa: 'skul', note: 'Colegio escolar (universidad es college/university)' },
    { en: 'Building', es: 'Edificio', cat: 'Ciudad', ipa: 'bílding', note: 'Proviene del verbo build (construir)' },

    { en: 'Money', es: 'Dinero', cat: 'Trabajo', ipa: 'máni', note: 'Incontable: "The money is safe" (no existe moneys)' },
    { en: 'Job', es: 'Empleo, trabajo puntual', cat: 'Trabajo', ipa: 'yob', note: 'Contable: "A new job"' },
    { en: 'Bill', es: 'Cuenta, factura o billete', cat: 'Trabajo', ipa: 'bil', note: '"Can I have the bill, please?" en el restaurante' },
    { en: 'Business', es: 'Negocio, empresa', cat: 'Trabajo', ipa: 'bíznes', note: 'Se pronuncia en 2 sílabas' }
  ];

  const vocab500List = [
    { en: 'The', type: 'Funcional', es: 'El, la, los, las', note: 'La palabra #1 más frecuente de todo el idioma inglés' },
    { en: 'Be (was/were, been)', type: 'Verbo', es: 'Ser o estar', note: 'Verbo irregular base' },
    { en: 'Have (had)', type: 'Verbo', es: 'Tener; haber', note: 'Verbo auxiliar en tiempos compuestos' },
    { en: 'Do (did, done)', type: 'Verbo', es: 'Hacer; auxiliar de preguntas', note: 'Auxiliar para presente y pasado' },
    { en: 'Say (said)', type: 'Verbo', es: 'Decir', note: 'Said se pronuncia "sed"' },
    { en: 'Get (got)', type: 'Verbo', es: 'Conseguir, llegar, ponerse', note: 'El verbo más versátil en inglés conversacional' },
    { en: 'Make (made)', type: 'Verbo', es: 'Hacer, crear, fabricar', note: 'Make mistakes, make coffee, make plans' },
    { en: 'Go (went, gone)', type: 'Verbo', es: 'Ir', note: 'Pasado irregular: went' },
    { en: 'Know (knew, known)', type: 'Verbo', es: 'Saber, conocer', note: 'La K inicial es completamente muda' },
    { en: 'Take (took, taken)', type: 'Verbo', es: 'Tomar, llevar', note: 'Take time, take photos, take a shower' },
    { en: 'See (saw, seen)', type: 'Verbo', es: 'Ver', note: 'Suena igual que "sea" (mar)' },
    { en: 'Come (came, come)', type: 'Verbo', es: 'Venir', note: 'Pasado: came' },
    { en: 'Think (thought)', type: 'Verbo', es: 'Pensar, creer', note: 'Thought suena con "o" abierta y gh muda' },
    { en: 'Find (found)', type: 'Verbo', es: 'Encontrar', note: 'Pasado: found' },
    { en: 'Give (gave, given)', type: 'Verbo', es: 'Dar', note: 'Pasado: gave' }
  ];

  const falseFriendsList = [
    { en: 'Actually', parece: 'Actualmente', es: 'En realidad / De hecho', ejemplo: 'Actually, I prefer morning workouts.' },
    { en: 'Large', parece: 'Largo', es: 'Grande', ejemplo: 'We have a large room. (Largo se dice "long").' },
    { en: 'College', parece: 'Colegio', es: 'Universidad / Facultad', ejemplo: 'She studies psychology in college.' },
    { en: 'Current', parece: 'Corriente', es: 'Actual', ejemplo: 'This is my current schedule.' },
    { en: 'Policy', parece: 'Policía', es: 'Política / Norma institucional', ejemplo: 'It is the company policy.' },
    { en: 'Date', parece: 'Dato', es: 'Fecha o Cita romántica', ejemplo: 'What is today\'s date? (Dato se dice "data").' },
    { en: 'Miss', parece: 'Señorita', es: 'Extrañar o Perder (el transporte)', ejemplo: 'I miss you / I missed the bus.' },
    { en: 'Pretty', parece: 'Lindo', es: 'Bastante (modificador)', ejemplo: 'It is pretty good! (Está bastante bueno).' }
  ];

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
      level: 'NIVEL B2 • Phrasal Verbs',
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

  const handleClaimReward = () => {
    if (questPomo && questCards && questListening && !questClaimed) {
      playChimeSound();
      setQuestClaimed(true);
      setXp(prev => prev + 100);
      setWaterDrops(prev => prev + 3);
      showSaveNotice('🎁 ¡Cofre diario desbloqueado! +100 XP y +3 💧 Gotitas de Agua');
    } else {
      playPopSound();
    }
  };

  const handleSelectQuizOption = (option: { text: string; correct: boolean }) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option.text);
    setIsAnswerCorrect(option.correct);
    if (option.correct) {
      playChimeSound();
      setXp(prev => prev + 30);
      setWaterDrops(prev => prev + 1);
      showSaveNotice('🎉 ¡Correcto! +30 XP y +1 💧');
    } else {
      playPopSound();
    }
  };

  const handleNextQuiz = () => {
    playPopSound();
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setCurrentQuizIdx(prev => (prev + 1) % quizList.length);
  };

  const showSaveNotice = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3800);
  };

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="flex min-h-screen bg-[#FBF6EF] text-[#4A4139] font-sans antialiased selection:bg-[#FFD1DC]">
      <style jsx global>{`
        .clay-card-big {
          background: #FFFFFF;
          box-shadow: 8px 10px 22px rgba(210, 190, 175, 0.22),
                      -6px -6px 16px rgba(255, 255, 255, 0.95);
          border-radius: 28px;
        }
        .clay-icon-big {
          box-shadow: 5px 6px 14px rgba(200, 180, 165, 0.28),
                      -4px -4px 10px rgba(255, 255, 255, 0.95),
                      inset 2px 2px 3px rgba(255, 255, 255, 0.7);
          border-radius: 22px;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-icon-big:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 7px 9px 18px rgba(200, 180, 165, 0.35);
        }
        .clay-icon-big:active {
          transform: translateY(2px) scale(0.98);
        }
        .clay-inset-pill {
          background: #F3ECE1;
          box-shadow: inset 3px 3px 6px rgba(195, 175, 160, 0.28),
                      inset -3px -3px 6px rgba(255, 255, 255, 0.85);
          border-radius: 20px;
        }
        .clay-pill-active {
          background: #FFFFFF !important;
          box-shadow: 5px 6px 16px rgba(180, 200, 195, 0.4),
                      -4px -4px 12px rgba(255, 255, 255, 1);
          transform: translateX(3px);
        }
        .clay-btn-pink {
          background: linear-gradient(135deg, #FFAAA6 0%, #FF85A1 100%);
          box-shadow: 5px 6px 14px rgba(255, 133, 161, 0.35),
                      -3px -3px 8px rgba(255, 255, 255, 0.9),
                      inset 2px 2px 3px rgba(255, 255, 255, 0.5);
          border-radius: 20px;
          color: white;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .clay-btn-pink:hover {
          transform: translateY(-2px);
          filter: brightness(1.03);
        }
      `}</style>

      {/* BARRA LATERAL */}
      <aside className="w-76 shrink-0 bg-[#E3EFEA] p-5 flex flex-col justify-between border-r border-[#D3E3DD] shadow-[6px_0_24px_rgba(180,200,195,0.18)]">
        <div>
          <div className="clay-card-big p-3.5 mb-5 flex items-center gap-3 bg-[#FFFFFF]/90">
            <div className="relative w-14 h-14 rounded-[22px] p-1 bg-[#E3EFEA] clay-icon-big flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-[18px] overflow-hidden bg-[#FFD6DE] flex items-center justify-center font-bold text-[#A84A60]">
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
              <div className="text-[11px] text-[#4E7267] font-extrabold flex items-center gap-1">
                Hi, Lorena! <span>👋</span>
              </div>
              <div className="font-extrabold text-[#3D352E] text-sm tracking-tight truncate">
                English Mastery
              </div>
              <div className="text-[10px] text-[#3E8062] font-black mt-0.5 flex items-center gap-1">
                <span>⚡</span> Nivel A0 ➔ C2
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'pomodoro', label: 'Dashboard & Focus', icon: '⏱️', badge: '15-20m', bg: 'bg-[#FFD6DE]' },
              { id: 'vocabulario', label: 'Vocabulario Esencial', icon: '📖', badge: 'PDFs 700+', bg: 'bg-[#FFF1C5]' },
              { id: 'flashcards', label: 'Flashcards Activas', icon: '🗂️', badge: 'Reglas A0-C2', bg: 'bg-[#D9EBD9]' },
              { id: 'quizzes', label: 'Quizzes & Tests', icon: '📝', badge: 'Banco 6', bg: 'bg-[#D4EBF8]' },
              { id: 'cursos', label: 'Biblioteca de Cursos', icon: '📚', badge: '3 Cursos', bg: 'bg-[#FFF1C5]' },
              { id: 'hub', label: 'Hub de Plataformas', icon: '🌐', badge: 'Free', bg: 'bg-[#D4EBF8]' },
              { id: 'speaking', label: 'Speaking & Feedback', icon: '🗣️', badge: 'IA Lab', bg: 'bg-[#D9EBD9]' },
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
                    active ? 'bg-[#D6E7E1] text-[#245445]' : 'bg-[#D3E3DD] text-[#55756C]'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-3 border-t border-[#D3E3DD]">
          <div className="clay-card-big p-4 bg-gradient-to-br from-[#FFF0F3] via-[#FFD6DE] to-[#FFC2D1] border-2 border-[#FFB3C6] flex flex-col items-center text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE4EB] clay-icon-big flex items-center justify-center text-xl mb-1 shadow-inner">
              📓
            </div>
            <div className="text-xs font-black text-[#5C2333] mt-0.5">Cuaderno Digital</div>
            <p className="text-[10px] text-[#7A3345] font-semibold mb-2.5">Apuntes en Goodnotes</p>
            <a
              href="goodnotes://"
              onClick={playPopSound}
              className="w-full py-2.5 rounded-[18px] clay-btn-pink text-xs font-black text-center flex items-center justify-center gap-1.5"
            >
              <span>📖</span> Abrir Goodnotes <span>↗</span>
            </a>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-8 max-w-4xl mx-auto overflow-y-auto">
        {savedNotice && (
          <div className="fixed top-5 right-5 z-50 clay-card-big bg-[#D9EBD9] text-[#1B4332] font-black text-xs px-5 py-3.5 border-2 border-[#B7DDB7] shadow-xl animate-bounce flex items-center gap-2">
            <span>🌸</span>
            <span>{savedNotice}</span>
          </div>
        )}

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
              onClick={() => {
                playPopSound();
                showSaveNotice('🔔 Tu plan semanal está listo y sincronizado.');
              }}
              className="w-10 h-10 rounded-full bg-[#FFFFFF] clay-icon-big flex items-center justify-center text-sm relative"
            >
              🔔
              <span className="w-2 h-2 rounded-full bg-[#FF85A1] absolute top-2 right-2 ring-2 ring-white"></span>
            </button>
          </div>
        </div>

        {/* 1. FOCUS & POMODORO */}
        {activeTab === 'pomodoro' && (
          <div className="space-y-6">
            <div className="clay-card-big p-6 sm:p-7 bg-gradient-to-r from-[#FFF4F6] via-[#FFF9F3] to-[#FFFFFF] flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden border border-[#FADCD5]">
              <div className="space-y-2 z-10 w-full sm:w-auto">
                <div className="flex items-center gap-2 text-xs font-black text-[#A84A60]">
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
                    className="px-5 py-2.5 rounded-[20px] clay-btn-pink text-xs font-black flex items-center gap-2"
                  >
                    <span>▶</span> Play Focus (15 Min)
                  </button>
                  <button
                    onClick={toggleFocusAudio}
                    className={`px-4 py-2.5 rounded-[20px] clay-icon-big text-xs font-black flex items-center gap-1.5 transition-all ${
                      isAudioPlaying ? 'bg-[#D4EBF8] text-[#0369A1] animate-pulse' : 'bg-[#FFFFFF] text-[#6B5E55]'
                    }`}
                  >
                    <span>{isAudioPlaying ? '🌧️' : '🎧'}</span> {isAudioPlaying ? 'Lluvia Focus (Activa)' : 'Sonido Lluvia Lofi'}
                  </button>
                  <button
                    onClick={handleWaterPlant}
                    className="px-4 py-2.5 rounded-[20px] bg-[#D4EBF8] hover:bg-[#BAE6FD] text-[#0369A1] clay-icon-big text-xs font-black flex items-center gap-1.5"
                  >
                    <span>💧</span> Regar Jardín ({waterDrops})
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-[26px] bg-[#FFE8ED] clay-icon-big flex items-center justify-center text-4xl shadow-inner">
                  🎧
                </div>
                <div
                  onClick={handleWaterPlant}
                  className="w-22 h-24 rounded-[24px] bg-[#EAF5EC] clay-icon-big p-2 flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all text-center border-2 border-[#CBEAD0]"
                  title="Toca para regar tu planta"
                >
                  <span className="text-3xl animate-bounce">{plantData[plantStage - 1].icon}</span>
                  <span className="text-[9px] font-black text-[#266245] mt-1 line-clamp-1">{plantData[plantStage - 1].name}</span>
                  <span className="text-[8px] text-[#3E8062] font-bold">Nivel {plantStage}/5</span>
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                playPopSound();
                setQuoteIdx((quoteIdx + 1) % quotes.length);
              }}
              className="clay-card-big p-4 bg-[#FFFBF0] border border-[#F5E6CA] cursor-pointer hover:scale-[1.01] transition-transform flex items-center gap-3"
            >
              <span className="w-10 h-10 rounded-2xl bg-[#FFF1C5] clay-icon-big flex items-center justify-center text-xl shrink-0">
                💬
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-black text-[#6B5024]">{quotes[quoteIdx].en}</div>
                <div className="text-[11px] text-[#8C7348] font-medium mt-0.5">{quotes[quoteIdx].es}</div>
              </div>
              <span className="text-[10px] text-[#A89066] font-bold shrink-0">Toca para cambiar 🔄</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'Songs / XP', val: `${xp}`, sub: 'Iniciando semana', bg: 'bg-[#D9EBD9]', icon: '🎵', text: 'text-[#1E523A]' },
                { label: 'Favorites', val: `${favoritesCount}`, sub: 'Tarjetas dominadas', bg: 'bg-[#FFD6DE]', icon: '💖', text: 'text-[#A84A60]' },
                { label: 'Hours Listened', val: `${(totalMinutes / 60).toFixed(1)}h`, sub: `${totalMinutes} min registrados`, bg: 'bg-[#FFF1C5]', icon: '⏱️', text: 'text-[#7A5B00]' },
                { label: 'Current Streak', val: `${streak}`, sub: 'Día 1 de racha', bg: 'bg-[#D4EBF8]', icon: '🔥', text: 'text-[#1E6091]' },
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

            <div className="clay-card-big p-5 sm:p-6 space-y-4">
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
                  className="bg-gradient-to-r from-[#FFAAA6] via-[#FF85A1] to-[#FFCAD4] h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min((xp / 1000) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-[#7A6E63] flex justify-between font-semibold">
                <span>Faltan {Math.max(1000 - xp, 0)} XP para el rango Traveler</span>
                <span className="font-black text-[#FF85A1]">¡Comenzando con todo esta semana, Lorena! 🌷</span>
              </div>

              <div className="pt-3 border-t border-[#F2E8DC]">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-black text-[#5C524A] flex items-center gap-1.5">
                    <span>🗓️</span> Registro Semanal de Consistencia
                  </span>
                  <span className="text-[10px] text-[#8C7E72] font-semibold">Semana en Curso</span>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day, idx) => {
                    const active = weeklyActive[idx];
                    return (
                      <div
                        key={day}
                        onClick={() => {
                          playPopSound();
                          const updated = [...weeklyActive];
                          updated[idx] = !updated[idx];
                          setWeeklyActive(updated);
                          showSaveNotice(updated[idx] ? `🔥 ¡${day} marcado con estudio!` : `Día ${day} desmarcado`);
                        }}
                        className={`p-2.5 rounded-[18px] text-center clay-icon-big cursor-pointer transition-all ${
                          active
                            ? 'bg-[#D9EBD9] text-[#1E523A] border-2 border-[#B7DDB7] scale-105'
                            : 'bg-[#FFFFFF] text-[#9E9085] hover:bg-[#F9F5EE]'
                        }`}
                      >
                        <div className="text-[10px] font-black">{day}</div>
                        <div className="text-base mt-0.5">{active ? '🌱' : '⚪'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="clay-card-big p-5 sm:p-6 space-y-3.5 border border-[#EADBCE]">
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
                        ? 'bg-[#FFD6DE] text-[#A84A60] animate-pulse'
                        : 'bg-[#F3EFE6] text-[#A89F91]'
                  }`}
                >
                  {questClaimed ? '✅ Reclamado (+100 XP)' : (questPomo && questCards && questListening) ? '🎁 ¡Abrir Cofre!' : 'Completa las 3'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => {
                    playPopSound();
                    setQuestPomo(!questPomo);
                    showSaveNotice(questPomo ? 'Bloque desmarcado' : '⏱️ ¡Meta de Focus marcada!');
                  }}
                  className={`p-3.5 rounded-[20px] clay-icon-big cursor-pointer flex items-center gap-3 ${
                    questPomo ? 'bg-[#D9EBD9] text-[#1E523A]' : 'bg-[#FFFFFF] text-[#6B5E55]'
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
                    playPopSound();
                    setQuestCards(!questCards);
                    showSaveNotice(questCards ? 'Meta desmarcada' : '🗂️ ¡Meta de Flashcards marcada!');
                  }}
                  className={`p-3.5 rounded-[20px] clay-icon-big cursor-pointer flex items-center gap-3 ${
                    questCards ? 'bg-[#D9EBD9] text-[#1E523A]' : 'bg-[#FFFFFF] text-[#6B5E55]'
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
                    playPopSound();
                    setQuestListening(!questListening);
                    showSaveNotice(questListening ? 'Meta desmarcada' : '🎧 ¡Meta de Listening marcada!');
                  }}
                  className={`p-3.5 rounded-[20px] clay-icon-big cursor-pointer flex items-center gap-3 ${
                    questListening ? 'bg-[#D9EBD9] text-[#1E523A]' : 'bg-[#FFFFFF] text-[#6B5E55]'
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

            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-[#7A6E63] mb-3 flex items-center gap-1.5">
                <span>🏆</span> Logros de Consistencia
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { icon: '☀️', title: 'Early Bird', bg: 'bg-[#FFF1C5]', label: 'Mañanera' },
                  { icon: '🌱', title: 'First Step', bg: 'bg-[#D9EBD9]', label: 'Primer paso' },
                  { icon: '🔥', title: 'Warming Up', bg: 'bg-[#FFD6DE]', label: 'En racha' },
                  { icon: '📖', title: 'Module Down', bg: 'bg-[#E6DCF5]', label: 'Módulo listo' },
                ].map((b, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      playPopSound();
                      showSaveNotice(`🏆 Logro: ${b.title} (${b.label}) activo en tu perfil.`);
                    }}
                    className="clay-card-big p-4 flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className={`w-14 h-14 ${b.bg} clay-icon-big rounded-[20px] flex items-center justify-center text-2xl mb-2`}>
                      {b.icon}
                    </div>
                    <span className="text-xs font-black text-[#3D352E]">{b.title}</span>
                    <span className="text-[10px] text-[#8C7E72] font-semibold mt-0.5">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="clay-card-big p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#EAF5EC] text-[#266245] clay-icon-big inline-block">
                    Temporizador ☁️
                  </span>
                  <div className="text-base font-black text-[#3D352E] mt-1">Bloque de Inmersión Focalizado</div>
                </div>
                <div className="text-3xl font-black font-mono text-[#FF85A1] clay-inset-pill px-5 py-2">
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
                        ? 'clay-icon-big bg-[#FFD6DE] text-[#A84A60]'
                        : 'clay-icon-big bg-[#FFFFFF] text-[#695F56]'
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
                  className={`flex-1 py-3.5 rounded-[20px] text-xs font-black clay-icon-big text-white transition-all ${
                    isRunning
                      ? 'bg-[#FF85A1] hover:bg-[#F26A8A]'
                      : 'bg-[#52B788] hover:bg-[#40916C]'
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
                  className="px-5 py-3.5 rounded-[20px] text-xs font-black clay-icon-big bg-[#FFFFFF] text-[#695F56]"
                >
                  ↺ Reiniciar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SPEAKING & FEEDBACK LAB */}
        {activeTab === 'speaking' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Speaking & Feedback Lab <span>🐰</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Corrección de respuestas escritas con IA y evaluación oficial de Cambridge.</p>
            </div>

            <div className="clay-card-big p-6 bg-gradient-to-r from-[#FFF5F7] to-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#FADCD5]">
              <div>
                <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60] clay-icon-big inline-block">
                  Oficial Cambridge 🎓
                </span>
                <div className="text-base font-black text-[#3D352E] mt-1.5">Evaluación de Voz con Sandi el Robot</div>
                <div className="text-xs text-[#6B5E55] mt-0.5">Habla con el evaluador acústico de Cambridge para calibrar tu pronunciación (A1 a C2).</div>
              </div>
              <a
                href="https://speakandimprove.com"
                target="_blank"
                onClick={playPopSound}
                className="px-5 py-2.5 rounded-[18px] clay-btn-pink text-xs font-black text-center whitespace-nowrap"
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
                className="w-full py-3.5 rounded-[20px] bg-[#D9EBD9] hover:bg-[#C5E3C5] text-[#1E523A] font-black text-xs clay-icon-big disabled:opacity-50"
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

        {/* 3. BIBLIOTECA DE CURSOS */}
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
                className="px-5 py-2.5 rounded-[20px] clay-btn-pink text-xs font-black flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
              >
                <span>👑</span> Abrir Mi Cuenta Hotmart ↗
              </a>
            </div>

            <div className="clay-card-big p-5 sm:p-6 space-y-4 border-2 border-[#FFE4B5] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#FFF1C5] text-[#8C6200] clay-icon-big inline-block">
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
                    className="px-4 py-2 rounded-[18px] bg-[#FFAAA6] hover:bg-[#FF85A1] text-white font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    🚀 Abrir App
                  </a>
                  <a
                    href="https://app.inglespractico.info"
                    target="_blank"
                    onClick={playPopSound}
                    className="px-4 py-2 rounded-[18px] bg-[#FFF1C5] text-[#8C6200] font-black text-xs clay-icon-big whitespace-nowrap"
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
                  className="flex-1 min-w-[180px] clay-inset-pill p-2.5 text-xs font-black text-[#3D352E] focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Semana {i + 1} de 12 (Activación Neural)</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    playChimeSound();
                    setWaterDrops(prev => prev + 1);
                    showSaveNotice(`✅ Inglés Práctico guardado en Semana ${ipWeek} (+1 💧)`);
                  }}
                  className="px-5 py-2.5 rounded-[18px] bg-[#52B788] hover:bg-[#40916C] text-white font-black text-xs clay-icon-big whitespace-nowrap ml-auto sm:ml-0"
                >
                  💾 Guardar Avance
                </button>
              </div>
            </div>

            <div className="clay-card-big p-5 sm:p-6 space-y-4 border-2 border-[#BAE6FD] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#D4EBF8] text-[#0369A1] clay-icon-big inline-block">
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
                    className="px-4 py-2 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    🎬 Ver en Hotmart ↗
                  </a>
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    onClick={playPopSound}
                    className="px-4 py-2 rounded-[18px] bg-[#D4EBF8] text-[#0369A1] font-black text-xs clay-icon-big whitespace-nowrap"
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
                  onChange={e => {
                    playPopSound();
                    setGringoUnit(Number(e.target.value));
                  }}
                  className="w-24 clay-inset-pill p-2.5 text-xs font-black text-[#3D352E] focus:outline-none"
                />
                <span className="text-xs text-[#8C7E72] font-semibold">de 130</span>
                <div className="flex-1 hidden sm:block"></div>
                <button
                  onClick={() => {
                    playChimeSound();
                    setWaterDrops(prev => prev + 1);
                    showSaveNotice(`✅ Gringo Academy guardado en Telenovela ${gringoUnit} (+1 💧)`);
                  }}
                  className="px-5 py-2.5 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs clay-icon-big whitespace-nowrap ml-auto sm:ml-0"
                >
                  💾 Guardar Telenovela
                </button>
              </div>
            </div>

            <div className="clay-card-big p-5 sm:p-6 space-y-4 border-2 border-[#DDD6FE] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black px-3 py-1 rounded-full bg-[#E6DCF5] text-[#5B21B6] clay-icon-big inline-block">
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
                    className="px-4 py-2 rounded-[18px] bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    🎧 Abrir en Hotmart ↗
                  </a>
                  <a
                    href="https://consumer.hotmart.com"
                    target="_blank"
                    onClick={playPopSound}
                    className="px-4 py-2 rounded-[18px] bg-[#E6DCF5] text-[#5B21B6] font-black text-xs clay-icon-big whitespace-nowrap"
                  >
                    🎵 Audios
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
                  className="flex-1 min-w-[180px] clay-inset-pill p-2.5 text-xs font-black text-[#3D352E] focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Fase {i + 1}: Reprogramación & Escucha Diaria</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    playChimeSound();
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

        {/* 4. HUB DE PLATAFORMAS */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-[#3D352E] tracking-tight flex items-center gap-2">
                Hub de Plataformas Gratuitas <span>☁️</span>
              </h1>
              <p className="text-[#7A6E63] text-xs mt-1">Herramientas seleccionadas con acceso directo a material gratuito de calidad.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Cambridge Dictionary', desc: 'Diccionario con audio británico y americano oficial y transcripción fonética IPA.', link: 'https://dictionary.cambridge.org', btn: 'Abrir Diccionario', icon: '📖', bg: 'bg-[#FFD6DE]', btnBg: 'bg-[#FF85A1] hover:bg-[#F26A8A] text-white' },
                { title: 'AVI UNAM (Práctica Libre)', desc: 'Fichas gramaticales, audios y ejercicios de autoevaluación gratuitos de A1 a B2.', link: 'https://avi.cuaed.unam.mx/idioma-ingles.html', btn: 'Abrir AVI UNAM', icon: '🏛️', bg: 'bg-[#FFF1C5]', btnBg: 'bg-[#EAB308] hover:bg-[#CA8A04] text-white' },
                { title: 'Speak & Improve (Cambridge)', desc: 'Evaluador acústico oficial de Cambridge con IA para medir tu nivel exacto.', link: 'https://speakandimprove.com', btn: 'Abrir Cambridge', icon: '🤖', bg: 'bg-[#FFD6DE]', btnBg: 'bg-[#FFAAA6] hover:bg-[#FF85A1] text-white' },
                { title: 'Duolingo Web', desc: 'Práctica ágil de vocabulario y racha diaria de gramática interactiva.', link: 'https://www.duolingo.com', btn: 'Abrir Duolingo', icon: '🦉', bg: 'bg-[#D9EBD9]', btnBg: 'bg-[#52B788] hover:bg-[#40916C] text-white' },
                { title: 'YouGlish: Contexto Real', desc: 'Escribe cualquier palabra y escúchala pronunciada en clips reales de YouTube.', link: 'https://youglish.com/pronounce/english', btn: 'Abrir YouGlish', icon: '🎬', bg: 'bg-[#FFF1C5]', btnBg: 'bg-[#FB923C] hover:bg-[#F97316] text-white' },
                { title: 'BBC Learning English', desc: 'Episodios de 6 minutos (*6 Minute English*) y pronunciación clara.', link: 'https://www.bbc.co.uk/learningenglish', btn: 'Abrir BBC', icon: '📻', bg: 'bg-[#E6DCF5]', btnBg: 'bg-[#38BDF8] hover:bg-[#0284C7] text-white' },
                { title: 'LingoClip (LyricsTraining)', desc: 'Entrena tu comprensión auditiva rellenando la letra de tus canciones favoritas.', link: 'https://lingoclip.com', btn: 'Abrir LingoClip', icon: '🎵', bg: 'bg-[#D4EBF8]', btnBg: 'bg-[#818CF8] hover:bg-[#6366F1] text-white' },
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
                  <a
                    href={p.link}
                    target="_blank"
                    onClick={playPopSound}
                    className={`mt-4 text-center py-2.5 rounded-[18px] font-black text-xs clay-icon-big ${p.btnBg} block`}
                  >
                    {p.btn} ↗
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. LISTENING & INMERSIÓN */}
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
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60] clay-icon-big inline-block">
                  Método 1 • Connected Speech
                </span>
                <h3 className="font-black text-sm text-[#3D352E]">El Filtro YouGlish 🎬</h3>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Los nativos enlazan sonidos (por ejemplo, <em>&quot;going to&quot;</em> suena <em>&quot;gonna&quot;</em>; <em>&quot;what do you&quot;</em> suena <em>&quot;whaddya&quot;</em>). Busca frases cortas en YouGlish para entrenar el oído a la cadencia real.
                </p>
                <a
                  href="https://youglish.com/pronounce/english"
                  target="_blank"
                  onClick={playPopSound}
                  className="inline-block px-5 py-2.5 rounded-[18px] clay-btn-pink text-xs font-black"
                >
                  Probar en YouGlish ↗
                </a>
              </div>

              <div className="clay-card-big p-6 space-y-3">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D4EBF8] text-[#1E6091] clay-icon-big inline-block">
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
                  className="inline-block px-5 py-2.5 rounded-[18px] bg-[#38BDF8] hover:bg-[#0284C7] text-white font-black text-xs clay-icon-big"
                >
                  Escuchar BBC 6-Minute ↗
                </a>
              </div>
            </div>

            <div className="clay-card-big p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-[20px] bg-[#D9EBD9] clay-icon-big flex items-center justify-center text-2xl shrink-0">
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

        {/* 6. WRITING CLINIC */}
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
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#E6DCF5] text-[#5B21B6] clay-icon-big inline-block">
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
                className="w-full py-3.5 rounded-[20px] bg-[#E6DCF5] hover:bg-[#D5C2ED] text-[#5B21B6] font-black text-xs clay-icon-big disabled:opacity-50"
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

        {/* 7. RUTA DE HITOS (A0 A C2) */}
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
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60] clay-icon-big inline-block">Nivel A0 • Primeros Pasos</span>
                  <h3 className="text-base font-black text-[#3D352E]">Fundamentos Absolutos y Desbloqueo Inicial</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Verbo <em>To Be</em> en afirmación, negación y pregunta. Pronombres personales y adjetivos posesivos.</li>
                    <li>• <strong>Expresiones fijas:</strong> Edad (<em>I am 38 years old</em>), origen (<em>I am from Mexico</em>) y alfabeto.</li>
                    <li>• <strong>Meta evaluable:</strong> Presentarte a ti misma con pronunciación clara y sin titubeos.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'A1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D4EBF8] text-[#1E6091] clay-icon-big inline-block">Nivel A1 • Elemental</span>
                  <h3 className="text-base font-black text-[#3D352E]">Rutinas y Entorno Cotidiano</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática indispensable:</strong> Presente Simple (regla de tercera persona con -s/-es), auxiliares <em>do / does</em> y preposiciones.</li>
                    <li>• <strong>Meta evaluable:</strong> Describir tu día típico de la mañana a la noche sin traducir mentalmente.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'A2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#D9EBD9] text-[#1E523A] clay-icon-big inline-block">Nivel A2 • Pre-Intermedio</span>
                  <h3 className="text-base font-black text-[#3D352E]">Pasado, Planes y Experiencias Inmediatas</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática:</strong> Pasado Simple regular (-ed) y verbos irregulares clave, pasado continuo, y futuro con <em>going to</em> vs <em>will</em>.</li>
                    <li>• <strong>Meta:</strong> Contar qué hiciste el fin de semana pasado y qué harás el próximo mes.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'B1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#E6DCF5] text-[#5B21B6] clay-icon-big inline-block">Nivel B1 • Intermedio Independiente</span>
                  <h3 className="text-base font-black text-[#3D352E]">Autonomía Conversacional y Trabajo</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática:</strong> Present Perfect, condicionales y verbos modales.</li>
                    <li>• <strong>Meta:</strong> Mantener una conversación fluida de 15 minutos sobre tus proyectos.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'B2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFD6DE] text-[#A84A60] clay-icon-big inline-block">Nivel B2 • Fluidez Profesional</span>
                  <h3 className="text-base font-black text-[#3D352E]">Dominio Laboral y Fluidez Espontánea</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática:</strong> Condicionales avanzados, voz pasiva y phrasal verbs idiomáticos.</li>
                    <li>• <strong>Meta:</strong> Participar en reuniones internacionales y entender podcasts a velocidad normal.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'C1' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#FFF1C5] text-[#7A5B00] clay-icon-big inline-block">Nivel C1 • Avanzado Operativo</span>
                  <h3 className="text-base font-black text-[#3D352E]">Dominio Académico y Especializado</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Gramática:</strong> Inversión gramatical enfática, lenguaje persuasivo y estilo formal.</li>
                  </ul>
                </>
              )}

              {selectedMilestone === 'C2' && (
                <>
                  <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-[#EAF5EC] text-[#266245] clay-icon-big inline-block">Nivel C2 • Maestría Nativa</span>
                  <h3 className="text-base font-black text-[#3D352E]">Bilingüismo Completo y Espontaneidad</h3>
                  <ul className="text-xs text-[#52443C] space-y-2.5 leading-relaxed font-medium">
                    <li>• <strong>Competencias:</strong> Captar ironías, modismos culturales sutiles y control estilístico total.</li>
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