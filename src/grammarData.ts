export interface GrammarLesson {
  id: string;
  level: string;
  title: string;
  rule: string;
  formula: string;
  examples: { en: string; es: string }[];
}

export const grammarLessons: GrammarLesson[] = [
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