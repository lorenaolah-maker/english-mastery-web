export interface VocabItem {
  en: string;
  es: string;
  cat: string;
  ipa: string;
  note: string;
}

export interface PhraseItem {
  num: number | string;
  situation: string;
  en: string;
  pron: string;
  es: string;
}

export interface VerbItem {
  base: string;
  past: string;
  future: string;
  participle: string;
  es: string;
  pron: string;
  type: 'Irregular' | 'Regular';
}

// 1. BANCO DE LAS 100 FRASES DEL BONO 5 (+10 BONUS)
export const phrases100List: PhraseItem[] = [
  // 1. Saludar y presentarte
  { num: 1, situation: '1. Saludar y presentarte', en: "Hi, how's it going?", pron: 'jái, jáus it góuin?', es: 'Hola, ¿cómo va?' },
  { num: 2, situation: '1. Saludar y presentarte', en: 'Nice to meet you!', pron: 'náis tu mít iu!', es: '¡Un gusto conocerte!' },
  { num: 3, situation: '1. Saludar y presentarte', en: "I don't think we've met before.", pron: 'ái dóunt zink uív met bifór', es: 'Creo que no nos conocíamos.' },
  { num: 4, situation: '1. Saludar y presentarte', en: "My name's... / I'm...", pron: 'mái néims... / áim...', es: 'Me llamo... / Soy...' },
  { num: 5, situation: '1. Saludar y presentarte', en: 'Where are you from?', pron: 'uér ar iu from?', es: '¿De dónde sos?' },
  { num: 6, situation: '1. Saludar y presentarte', en: "I'm from Uruguay.", pron: 'áim from iúruguai', es: 'Soy de Uruguay (o México).' },
  { num: 7, situation: '1. Saludar y presentarte', en: 'What do you do for a living?', pron: 'uát du iu du for a lívin?', es: '¿A qué te dedicás?' },
  { num: 8, situation: '1. Saludar y presentarte', en: 'I work as a...', pron: 'ái uérk as a...', es: 'Trabajo como...' },
  { num: 9, situation: '1. Saludar y presentarte', en: 'How long have you been here?', pron: 'jáu long jav iu bin jíer?', es: '¿Hace cuánto que estás acá?' },
  { num: 10, situation: '1. Saludar y presentarte', en: "I'm just passing through.", pron: 'áim yast pásin zru', es: 'Estoy de paso.' },

  // 2. Mantener la conversación
  { num: 11, situation: '2. Mantener la conversación', en: 'What about you?', pron: 'uát abáut iu?', es: '¿Y vos?' },
  { num: 12, situation: '2. Mantener la conversación', en: 'Really? Tell me more!', pron: 'ríli? tel mi mor!', es: '¿En serio? ¡Contame más!' },
  { num: 13, situation: '2. Mantener la conversación', en: "That's interesting!", pron: 'dats íntrestin!', es: '¡Qué interesante!' },
  { num: 14, situation: '2. Mantener la conversación', en: 'How was your weekend?', pron: 'jáu uós iór uíkend?', es: '¿Cómo estuvo tu fin de semana?' },
  { num: 15, situation: '2. Mantener la conversación', en: 'What do you do for fun?', pron: 'uát du iu du for fan?', es: '¿Qué hacés para divertirte?' },
  { num: 16, situation: '2. Mantener la conversación', en: 'Have you ever been to...?', pron: 'jav iu éver bin tu...?', es: '¿Alguna vez fuiste a...?' },
  { num: 17, situation: '2. Mantener la conversación', en: 'I know what you mean.', pron: 'ái nóu uát iu min', es: 'Te entiendo. / Sé a qué te referís.' },
  { num: 18, situation: '2. Mantener la conversación', en: "I agree. / I don't agree.", pron: 'ái agrí / ái dóunt agrí', es: 'Estoy de acuerdo. / No estoy de acuerdo.' },
  { num: 19, situation: '2. Mantener la conversación', en: 'By the way...', pron: 'bái de uéi...', es: 'Por cierto...' },
  { num: 20, situation: '2. Mantener la conversación', en: 'It was great talking to you!', pron: 'it uós gréit tókin tu iu!', es: '¡Me encantó charlar con vos!' },

  // 3. Frases salvavidas
  { num: 21, situation: '3. Frases salvavidas', en: 'Sorry, could you repeat that?', pron: 'sóri, kud iu ripít dat?', es: 'Perdón, ¿podrías repetir?' },
  { num: 22, situation: '3. Frases salvavidas', en: 'Could you speak more slowly, please?', pron: 'kud iu spík mor slóuli, plis?', es: '¿Podrías hablar más despacio, por favor?' },
  { num: 23, situation: '3. Frases salvavidas', en: 'What does... mean?', pron: 'uát das... min?', es: '¿Qué significa...?' },
  { num: 24, situation: '3. Frases salvavidas', en: 'How do you say... in English?', pron: 'jáu du iu séi... in ínglish?', es: '¿Cómo se dice... en inglés?' },
  { num: 25, situation: '3. Frases salvavidas', en: 'How do you spell that?', pron: 'jáu du iu spel dat?', es: '¿Cómo se escribe?' },
  { num: 26, situation: '3. Frases salvavidas', en: "I'm not sure I understand.", pron: 'áim not shur ái anderstánd', es: 'No estoy segura/o de entender.' },
  { num: 27, situation: '3. Frases salvavidas', en: 'Do you mean...?', pron: 'du iu min...?', es: '¿Querés decir...?' },
  { num: 28, situation: '3. Frases salvavidas', en: 'Let me think.', pron: 'let mi zink', es: 'Dejame pensar.' },
  { num: 29, situation: '3. Frases salvavidas', en: "I'm still learning English.", pron: 'áim stil lérnin ínglish', es: 'Todavía estoy aprendiendo inglés.' },
  { num: 30, situation: '3. Frases salvavidas', en: 'Can you write it down, please?', pron: 'kan iu ráit it dáun, plis?', es: '¿Me lo podés escribir, por favor?' },

  // 4. Aeropuerto y hotel
  { num: 31, situation: '4. Aeropuerto y hotel', en: "Where's the check-in counter?", pron: 'uérs de chék-in káunter?', es: '¿Dónde está el mostrador de check-in?' },
  { num: 32, situation: '4. Aeropuerto y hotel', en: 'Can I have a window seat, please?', pron: 'kan ái jav a uíndou sit, plis?', es: '¿Me podría dar un asiento de ventanilla?' },
  { num: 33, situation: '4. Aeropuerto y hotel', en: 'How long is the flight?', pron: 'jáu long is de fláit?', es: '¿Cuánto dura el vuelo?' },
  { num: 34, situation: '4. Aeropuerto y hotel', en: 'Which gate is it?', pron: 'uích guéit is it?', es: '¿Qué puerta de embarque es?' },
  { num: 35, situation: '4. Aeropuerto y hotel', en: 'My flight is delayed.', pron: 'mái fláit is diléid', es: 'Mi vuelo está demorado.' },
  { num: 36, situation: '4. Aeropuerto y hotel', en: "I've lost my luggage.", pron: 'áiv lost mái lágich', es: 'Perdí mi equipaje.' },
  { num: 37, situation: '4. Aeropuerto y hotel', en: 'I have a reservation under...', pron: 'ái jav a reservéishon ánder...', es: 'Tengo una reserva a nombre de...' },
  { num: 38, situation: '4. Aeropuerto y hotel', en: 'What time is check-out?', pron: 'uát táim is chék-áut?', es: '¿A qué hora es el check-out?' },
  { num: 39, situation: '4. Aeropuerto y hotel', en: 'Can I get an extra towel, please?', pron: 'kan ái guet an ékstra táuel, plis?', es: '¿Me podrían dar una toalla extra?' },
  { num: 40, situation: '4. Aeropuerto y hotel', en: "The Wi-Fi isn't working.", pron: 'de uái-fai ísent uérkin', es: 'No funciona el wifi.' },

  // 5. Restaurante y café
  { num: 41, situation: '5. Restaurante y café', en: 'A table for two, please.', pron: 'a téibol for tu, plis', es: 'Una mesa para dos, por favor.' },
  { num: 42, situation: '5. Restaurante y café', en: 'Could I see the menu, please?', pron: 'kud ái si de méniu, plis?', es: '¿Podría ver el menú, por favor?' },
  { num: 43, situation: '5. Restaurante y café', en: 'What do you recommend?', pron: 'uát du iu rekoménd?', es: '¿Qué me recomienda?' },
  { num: 44, situation: '5. Restaurante y café', en: "I'll have the...", pron: 'áil jav de...', es: 'Voy a pedir el/la...' },
  { num: 45, situation: '5. Restaurante y café', en: 'Can I have it without...?', pron: 'kan ái jav it uidáut...?', es: '¿Me lo puede traer sin...?' },
  { num: 46, situation: '5. Restaurante y café', en: "I'm allergic to...", pron: 'áim alérchik tu...', es: 'Soy alérgica/o a...' },
  { num: 47, situation: '5. Restaurante y café', en: 'Could I have some water, please?', pron: 'kud ái jav sam uóter, plis?', es: '¿Me trae agua, por favor?' },
  { num: 48, situation: '5. Restaurante y café', en: 'This is delicious!', pron: 'dis is dilíshas!', es: '¡Esto está delicioso!' },
  { num: 49, situation: '5. Restaurante y café', en: 'Can I have the check, please?', pron: 'kan ái jav de chek, plis?', es: '¿Me trae la cuenta, por favor? (UK: the bill)' },
  { num: 50, situation: '5. Restaurante y café', en: 'Is service included?', pron: 'is sérvis inklúdid?', es: '¿Está incluida la propina / el servicio?' },

  // 6. Compras y pagos
  { num: 51, situation: '6. Compras y pagos', en: 'How much is this?', pron: 'jáu mach is dis?', es: '¿Cuánto cuesta esto?' },
  { num: 52, situation: '6. Compras y pagos', en: "I'm just looking, thanks.", pron: 'áim yast lúkin, zanks', es: 'Solo estoy mirando, gracias.' },
  { num: 53, situation: '6. Compras y pagos', en: 'Do you have this in a smaller size?', pron: 'du iu jav dis in a smóler sáis?', es: '¿Lo tiene en una talla más chica?' },
  { num: 54, situation: '6. Compras y pagos', en: 'Can I try it on?', pron: 'kan ái trái it on?', es: '¿Me lo puedo probar?' },
  { num: 55, situation: '6. Compras y pagos', en: 'Where are the fitting rooms?', pron: 'uér ar de fítin rums?', es: '¿Dónde están los probadores?' },
  { num: 56, situation: '6. Compras y pagos', en: 'Do you accept credit cards?', pron: 'du iu aksépt krédit kards?', es: '¿Aceptan tarjeta de crédito?' },
  { num: 57, situation: '6. Compras y pagos', en: 'Can I pay in cash?', pron: 'kan ái péi in kash?', es: '¿Puedo pagar en efectivo?' },
  { num: 58, situation: '6. Compras y pagos', en: 'Is there a discount?', pron: 'is der a dískaunt?', es: '¿Hay algún descuento?' },
  { num: 59, situation: '6. Compras y pagos', en: 'Where can I find...?', pron: 'uér kan ái fáind...?', es: '¿Dónde encuentro...?' },
  { num: 60, situation: '6. Compras y pagos', en: 'Can I have a receipt, please?', pron: 'kan ái jav a risít, plis?', es: '¿Me da el ticket / comprobante, por favor?' },

  // 7. Direcciones y transporte
  { num: 61, situation: '7. Direcciones y transporte', en: "Excuse me, where's the nearest...?", pron: 'ekskiús mi, uérs de níarest...?', es: 'Disculpe, ¿dónde queda el/la... más cercano/a?' },
  { num: 62, situation: '7. Direcciones y transporte', en: 'How do I get to...?', pron: 'jáu du ái guet tu...?', es: '¿Cómo llego a...?' },
  { num: 63, situation: '7. Direcciones y transporte', en: 'Is it far from here?', pron: 'is it far from jíer?', es: '¿Queda lejos de acá?' },
  { num: 64, situation: '7. Direcciones y transporte', en: 'Is this the right way to...?', pron: 'is dis de ráit uéi tu...?', es: '¿Es por acá para ir a...?' },
  { num: 65, situation: '7. Direcciones y transporte', en: 'Can you show me on the map?', pron: 'kan iu shóu mi on de map?', es: '¿Me lo muestra en el mapa?' },
  { num: 66, situation: '7. Direcciones y transporte', en: 'Which bus goes to...?', pron: 'uích bas góus tu...?', es: '¿Qué autobús va a...?' },
  { num: 67, situation: '7. Direcciones y transporte', en: 'Where do I get off?', pron: 'uér du ái guet of?', es: '¿Dónde me tengo que bajar?' },
  { num: 68, situation: '7. Direcciones y transporte', en: 'A ticket to..., please.', pron: 'a tíket tu..., plis', es: 'Un boleto a..., por favor.' },
  { num: 69, situation: '7. Direcciones y transporte', en: 'Could you call me a taxi?', pron: 'kud iu kol mi a táksi?', es: '¿Me podría pedir un taxi?' },
  { num: 70, situation: '7. Direcciones y transporte', en: 'Thanks for your help!', pron: 'zanks for iór jelp!', es: '¡Gracias por su ayuda!' },

  // 8. Trabajo, llamadas y reuniones
  { num: 71, situation: '8. Trabajo, llamadas y reuniones', en: 'May I speak to..., please?', pron: 'méi ái spík tu..., plis?', es: '¿Podría hablar con..., por favor?' },
  { num: 72, situation: '8. Trabajo, llamadas y reuniones', en: 'Can I leave a message?', pron: 'kan ái liv a mésich?', es: '¿Puedo dejar un mensaje?' },
  { num: 73, situation: '8. Trabajo, llamadas y reuniones', en: "I'll get back to you as soon as possible.", pron: 'áil guet bak tu iu as sun as pósibol', es: 'Te respondo lo antes posible.' },
  { num: 74, situation: '8. Trabajo, llamadas y reuniones', en: "Let's get straight to the point.", pron: 'lets guet stréit tu de póint', es: 'Vayamos directo al grano.' },
  { num: 75, situation: '8. Trabajo, llamadas y reuniones', en: "I'd like to add something.", pron: 'áid láik tu ad sámzin', es: 'Me gustaría agregar algo.' },
  { num: 76, situation: '8. Trabajo, llamadas y reuniones', en: 'Could you clarify that?', pron: 'kud iu klárifai dat?', es: '¿Podrías aclarar eso?' },
  { num: 77, situation: '8. Trabajo, llamadas y reuniones', en: 'Can we schedule a follow-up meeting?', pron: 'kan uí skéyul a fólou-ap mítin?', es: '¿Podemos agendar una reunión de seguimiento?' },
  { num: 78, situation: '8. Trabajo, llamadas y reuniones', en: "I'll send you an email.", pron: 'áil send iu an ímeil', es: 'Te mando un correo.' },
  { num: 79, situation: '8. Trabajo, llamadas y reuniones', en: "What's the deadline?", pron: 'uáts de dédlain?', es: '¿Cuál es la fecha de entrega?' },
  { num: 80, situation: '8. Trabajo, llamadas y reuniones', en: 'Thanks for your time.', pron: 'zanks for iór táim', es: 'Gracias por tu tiempo.' },

  // 9. Socializar y hacer amigos
  { num: 81, situation: '9. Socializar y hacer amigos', en: "Let's hang out sometime.", pron: 'lets jang áut sámtaim', es: 'Salgamos algún día.' },
  { num: 82, situation: '9. Socializar y hacer amigos', en: 'Do you want to grab a coffee?', pron: 'du iu uánt tu grab a kófi?', es: '¿Querés ir a tomar un café?' },
  { num: 83, situation: '9. Socializar y hacer amigos', en: 'That sounds great!', pron: 'dat sáunds gréit!', es: '¡Suena genial! / ¡Me encanta!' },
  { num: 84, situation: '9. Socializar y hacer amigos', en: "I'm in!", pron: 'áim in!', es: '¡Me sumo! / ¡Cuenten conmigo!' },
  { num: 85, situation: '9. Socializar y hacer amigos', en: 'Maybe next time.', pron: 'méibi nekst táim', es: 'Quizás la próxima.' },
  { num: 86, situation: '9. Socializar y hacer amigos', en: 'What are you up to this weekend?', pron: 'uát ar iu ap tu dis uíkend?', es: '¿Qué planes tienes este finde?' },
  { num: 87, situation: '9. Socializar y hacer amigos', en: 'Can I have your number?', pron: 'kan ái jav iór námber?', es: '¿Me pasas tu número?' },
  { num: 88, situation: '9. Socializar y hacer amigos', en: "Let's keep in touch!", pron: 'lets kip in tach!', es: '¡Sigamos en contacto!' },
  { num: 89, situation: '9. Socializar y hacer amigos', en: 'I had a great time!', pron: 'ái jad a gréit táim!', es: '¡La pasé genial!' },
  { num: 90, situation: '9. Socializar y hacer amigos', en: 'See you soon!', pron: 'si iu sun!', es: '¡Nos vemos pronto!' },

  // 10. Emergencias y salud
  { num: 91, situation: '10. Emergencias y salud', en: 'I need help!', pron: 'ái nid jelp!', es: '¡Necesito ayuda!' },
  { num: 92, situation: '10. Emergencias y salud', en: 'Call an ambulance!', pron: 'kol an ámbiulans!', es: '¡Llamen a una ambulancia!' },
  { num: 93, situation: '10. Emergencias y salud', en: 'Can you call the police?', pron: 'kan iu kol de polís?', es: '¿Puede llamar a la policía?' },
  { num: 94, situation: '10. Emergencias y salud', en: "Where's the nearest hospital?", pron: 'uérs de níarest jóspital?', es: '¿Dónde está el hospital más cercano?' },
  { num: 95, situation: '10. Emergencias y salud', en: "I don't feel well.", pron: 'ái dóunt fil uél', es: 'No me siento bien.' },
  { num: 96, situation: '10. Emergencias y salud', en: 'It hurts here.', pron: 'it jerts jíer', es: 'Me duele acá.' },
  { num: 97, situation: '10. Emergencias y salud', en: 'I need a doctor.', pron: 'ái nid a dóktor', es: 'Necesito un médico.' },
  { num: 98, situation: '10. Emergencias y salud', en: 'Is there a pharmacy near here?', pron: 'is der a fármasi níer jíer?', es: '¿Hay una farmacia cerca?' },
  { num: 99, situation: '10. Emergencias y salud', en: 'I lost my wallet.', pron: 'ái lost mái uólet', es: 'Perdí mi cartera / billetera.' },
  { num: 100, situation: '10. Emergencias y salud', en: "I'm lost. Can you help me?", pron: 'áim lost. kan iu jelp mi?', es: 'Estoy perdida/o. ¿Me ayuda?' },

  // Bonus: Expresiones útiles y motivación
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: 'No worries!', pron: 'nóu uóris!', es: '¡No te preocupes! / ¡Tranqui!' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: "It's up to you.", pron: 'its ap tu iu', es: 'Como tú quieras. / Depende de ti.' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: "I'm not sure.", pron: 'áim not shur', es: 'No estoy segura/o.' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: "It doesn't matter.", pron: 'it dásent máter', es: 'No importa.' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: 'Let me think about it.', pron: 'let mi zink abáut it', es: 'Déjame pensarlo.' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: 'You can do it!', pron: 'iu kan du it!', es: '¡Tú puedes!' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: 'Never give up!', pron: 'néver guiv ap!', es: '¡Nunca te rindas!' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: 'Every mistake is a lesson.', pron: 'évri mistéik is a léson', es: 'Cada error es una lección.' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: 'Trust the process.', pron: 'trast de próses', es: 'Confía en el proceso.' },
  { num: '★', situation: '★ Bonus: Motivación y Frases Útiles', en: 'Believe in yourself.', pron: 'bilív in iorsélf', es: 'Cree en ti.' }
];

// 2. BANCO DE VERBOS MÁS FRECUENTES (PRESENTE, PASADO, FUTURO, PARTICIPIO)
export const verbsEssentialList: VerbItem[] = [
  { base: 'Be (am/is/are)', past: 'Was / Were', future: 'Will be', participle: 'Been', es: 'Ser o estar', pron: 'bi · uos/uer · uil bi · bin', type: 'Irregular' },
  { base: 'Have', past: 'Had', future: 'Will have', participle: 'Had', es: 'Tener; haber', pron: 'jav · jad · uil jav · jad', type: 'Irregular' },
  { base: 'Do', past: 'Did', future: 'Will do', participle: 'Done', es: 'Hacer', pron: 'du · did · uil du · dan', type: 'Irregular' },
  { base: 'Say', past: 'Said', future: 'Will say', participle: 'Said', es: 'Decir', pron: 'séi · sed · uil séi · sed', type: 'Irregular' },
  { base: 'Go', past: 'Went', future: 'Will go', participle: 'Gone', es: 'Ir', pron: 'góu · uent · uil góu · gon', type: 'Irregular' },
  { base: 'Get', past: 'Got', future: 'Will get', participle: 'Got / Gotten', es: 'Conseguir, llegar, ponerse', pron: 'guet · got · uil guet · goten', type: 'Irregular' },
  { base: 'Make', past: 'Made', future: 'Will make', participle: 'Made', es: 'Hacer, crear, fabricar', pron: 'méik · méid · uil méik · méid', type: 'Irregular' },
  { base: 'Know', past: 'Knew', future: 'Will know', participle: 'Known', es: 'Saber, conocer', pron: 'nóu · niu · uil nóu · nóun', type: 'Irregular' },
  { base: 'Think', past: 'Thought', future: 'Will think', participle: 'Thought', es: 'Pensar, creer', pron: 'zink · zot · uil zink · zot', type: 'Irregular' },
  { base: 'Take', past: 'Took', future: 'Will take', participle: 'Taken', es: 'Tomar, llevar', pron: 'téik · tuk · uil téik · téiken', type: 'Irregular' },
  { base: 'See', past: 'Saw', future: 'Will see', participle: 'Seen', es: 'Ver', pron: 'si · so · uil si · sin', type: 'Irregular' },
  { base: 'Come', past: 'Came', future: 'Will come', participle: 'Come', es: 'Venir', pron: 'kam · kéim · uil kam · kam', type: 'Irregular' },
  { base: 'Want', past: 'Wanted', future: 'Will want', participle: 'Wanted', es: 'Querer', pron: 'uónt · uóntid · uil uónt · uóntid', type: 'Regular' },
  { base: 'Look', past: 'Looked', future: 'Will look', participle: 'Looked', es: 'Mirar, parecer', pron: 'luk · lukt · uil luk · lukt', type: 'Regular' },
  { base: 'Use', past: 'Used', future: 'Will use', participle: 'Used', es: 'Usar, utilizar', pron: 'iús · iúst · uil iús · iúst', type: 'Regular' },
  { base: 'Find', past: 'Found', future: 'Will find', participle: 'Found', es: 'Encontrar', pron: 'fáind · fáund · uil fáind · fáund', type: 'Irregular' },
  { base: 'Give', past: 'Gave', future: 'Will give', participle: 'Given', es: 'Dar', pron: 'guiv · guéiv · uil guiv · guíven', type: 'Irregular' },
  { base: 'Tell', past: 'Told', future: 'Will tell', participle: 'Told', es: 'Contar, decir a alguien', pron: 'tel · tóuld · uil tel · tóuld', type: 'Irregular' },
  { base: 'Work', past: 'Worked', future: 'Will work', participle: 'Worked', es: 'Trabajar, funcionar', pron: 'uérk · uérkt · uil uérk · uérkt', type: 'Regular' },
  { base: 'Call', past: 'Called', future: 'Will call', participle: 'Called', es: 'Llamar', pron: 'kol · kold · uil kol · kold', type: 'Regular' },
  { base: 'Try', past: 'Tried', future: 'Will try', participle: 'Tried', es: 'Intentar, probar', pron: 'trái · tráid · uil trái · tráid', type: 'Regular' },
  { base: 'Ask', past: 'Asked', future: 'Will ask', participle: 'Asked', es: 'Preguntar, pedir', pron: 'ask · askt · uil ask · askt', type: 'Regular' },
  { base: 'Need', past: 'Needed', future: 'Will need', participle: 'Needed', es: 'Necesitar', pron: 'nid · nídid · uil nid · nídid', type: 'Regular' },
  { base: 'Feel', past: 'Felt', future: 'Will feel', participle: 'Felt', es: 'Sentir, sentirse', pron: 'fil · felt · uil fil · felt', type: 'Irregular' },
  { base: 'Become', past: 'Became', future: 'Will become', participle: 'Become', es: 'Convertirse, llegar a ser', pron: 'bikám · bikéim · uil bikám · bikám', type: 'Irregular' },
  { base: 'Leave', past: 'Left', future: 'Will leave', participle: 'Left', es: 'Dejar, marcharse, salir', pron: 'liv · left · uil liv · left', type: 'Irregular' },
  { base: 'Put', past: 'Put', future: 'Will put', participle: 'Put', es: 'Poner, colocar', pron: 'put · put · uil put · put', type: 'Irregular' },
  { base: 'Mean', past: 'Meant', future: 'Will mean', participle: 'Meant', es: 'Significar, querer decir', pron: 'min · ment · uil min · ment', type: 'Irregular' },
  { base: 'Keep', past: 'Kept', future: 'Will keep', participle: 'Kept', es: 'Mantener, guardar', pron: 'kip · kept · uil kip · kept', type: 'Irregular' },
  { base: 'Let', past: 'Let', future: 'Will let', participle: 'Let', es: 'Permitir, dejar', pron: 'let · let · uil let · let', type: 'Irregular' },
  { base: 'Begin', past: 'Began', future: 'Will begin', participle: 'Begun', es: 'Empezar, comenzar', pron: 'biguín · bigán · uil biguín · bigán', type: 'Irregular' },
  { base: 'Seem', past: 'Seemed', future: 'Will seem', participle: 'Seemed', es: 'Parecer', pron: 'sim · simd · uil sim · simd', type: 'Regular' },
  { base: 'Help', past: 'Helped', future: 'Will help', participle: 'Helped', es: 'Ayudar', pron: 'yelp · yelpt · uil yelp · yelpt', type: 'Regular' },
  { base: 'Talk', past: 'Talked', future: 'Will talk', participle: 'Talked', es: 'Hablar, conversar', pron: 'tok · dokt · uil tok · dokt', type: 'Regular' },
  { base: 'Turn', past: 'Turned', future: 'Will turn', participle: 'Turned', es: 'Girar, doblar, encender/apagar', pron: 'tern · ternd · uil tern · ternd', type: 'Regular' },
  { base: 'Start', past: 'Started', future: 'Will start', participle: 'Started', es: 'Iniciar, arrancar', pron: 'start · stártid · uil start · stártid', type: 'Regular' },
  { base: 'Show', past: 'Showed', future: 'Will show', participle: 'Shown', es: 'Mostrar, enseñar', pron: 'shóu · shóud · uil shóu · shóun', type: 'Irregular' },
  { base: 'Hear', past: 'Heard', future: 'Will hear', participle: 'Heard', es: 'Oír, escuchar', pron: 'jíer · jerd · uil jíer · jerd', type: 'Irregular' },
  { base: 'Play', past: 'Played', future: 'Will play', participle: 'Played', es: 'Jugar, tocar instrumento', pron: 'pléi · pléid · uil pléi · pléid', type: 'Regular' },
  { base: 'Move', past: 'Moved', future: 'Will move', participle: 'Moved', es: 'Mover, mudarse', pron: 'muv · muvd · uil muv · muvd', type: 'Regular' },
  { base: 'Live', past: 'Lived', future: 'Will live', participle: 'Lived', es: 'Vivir', pron: 'liv · livd · uil liv · livd', type: 'Regular' },
  { base: 'Believe', past: 'Believed', future: 'Will believe', participle: 'Believed', es: 'Creer', pron: 'bilív · bilívd · uil bilív · bilívd', type: 'Regular' },
  { base: 'Bring', past: 'Brought', future: 'Will bring', participle: 'Brought', es: 'Traer', pron: 'bring · brot · uil bring · brot', type: 'Irregular' },
  { base: 'Happen', past: 'Happened', future: 'Will happen', participle: 'Happened', es: 'Suceder, ocurrir', pron: 'jápen · jápend · uil jápen · jápend', type: 'Regular' },
  { base: 'Write', past: 'Wrote', future: 'Will write', participle: 'Written', es: 'Escribir', pron: 'ráit · róut · uil ráit · ríten', type: 'Irregular' },
  { base: 'Provide', past: 'Provided', future: 'Will provide', participle: 'Provided', es: 'Proporcionar, proveer', pron: 'prováid · prováidid · uil prováid', type: 'Regular' },
  { base: 'Sit', past: 'Sat', future: 'Will sit', participle: 'Sat', es: 'Sentarse', pron: 'sit · sat · uil sit · sat', type: 'Irregular' },
  { base: 'Stand', past: 'Stood', future: 'Will stand', participle: 'Stood', es: 'Estar de pie, aguantar', pron: 'stand · stud · uil stand · stud', type: 'Irregular' },
  { base: 'Lose', past: 'Lost', future: 'Will lose', participle: 'Lost', es: 'Perder', pron: 'lus · lost · uil lus · lost', type: 'Irregular' },
  { base: 'Pay', past: 'Paid', future: 'Will pay', participle: 'Paid', es: 'Pagar', pron: 'péi · péid · uil péi · péid', type: 'Irregular' },
  { base: 'Meet', past: 'Met', future: 'Will meet', participle: 'Met', es: 'Conocer, reunirse', pron: 'mit · met · uil mit · met', type: 'Irregular' },
  { base: 'Include', past: 'Included', future: 'Will include', participle: 'Included', es: 'Incluir', pron: 'inklúd · inklúdid · uil inklúd', type: 'Regular' },
  { base: 'Continue', past: 'Continued', future: 'Will continue', participle: 'Continued', es: 'Continuar', pron: 'kontíniu · kontíniud · uil kontíniu', type: 'Regular' },
  { base: 'Set', past: 'Set', future: 'Will set', participle: 'Set', es: 'Ajustar, establecer', pron: 'set · set · uil set · set', type: 'Irregular' },
  { base: 'Learn', past: 'Learned', future: 'Will learn', participle: 'Learned', es: 'Aprender', pron: 'lern · lernd · uil lern · lernd', type: 'Regular' },
  { base: 'Change', past: 'Changed', future: 'Will change', participle: 'Changed', es: 'Cambiar', pron: 'chéinch · chéinchd · uil chéinch', type: 'Regular' },
  { base: 'Lead', past: 'Led', future: 'Will lead', participle: 'Led', es: 'Liderar, guiar', pron: 'lid · led · uil lid · led', type: 'Irregular' },
  { base: 'Understand', past: 'Understood', future: 'Will understand', participle: 'Understood', es: 'Entender, comprender', pron: 'anderstánd · anderstúd · uil anderstánd', type: 'Irregular' },
  { base: 'Watch', past: 'Watched', future: 'Will watch', participle: 'Watched', es: 'Mirar, vigilar', pron: 'uoch · uocht · uil uoch · uocht', type: 'Regular' },
  { base: 'Follow', past: 'Followed', future: 'Will follow', participle: 'Followed', es: 'Seguir', pron: 'fólou · fóloud · uil fólou · fóloud', type: 'Regular' },
  { base: 'Stop', past: 'Stopped', future: 'Will stop', participle: 'Stopped', es: 'Detener, parar', pron: 'stop · stopt · uil stop · stopt', type: 'Regular' },
  { base: 'Create', past: 'Created', future: 'Will create', participle: 'Created', es: 'Crear', pron: 'kriéit · kriéitid · uil kriéit', type: 'Regular' },
  { base: 'Speak', past: 'Spoke', future: 'Will speak', participle: 'Spoken', es: 'Hablar un idioma', pron: 'spik · spóuk · uil spik · spóuken', type: 'Irregular' },
  { base: 'Read', past: 'Read (red)', future: 'Will read', participle: 'Read (red)', es: 'Leer', pron: 'rid · red · uil rid · red', type: 'Irregular' },
  { base: 'Spend', past: 'Spent', future: 'Will spend', participle: 'Spent', es: 'Gastar dinero, pasar tiempo', pron: 'spend · spent · uil spend · spent', type: 'Irregular' },
  { base: 'Grow', past: 'Grew', future: 'Will grow', participle: 'Grown', es: 'Crecer, cultivar', pron: 'gróu · griu · uil gróu · gróun', type: 'Irregular' },
  { base: 'Open', past: 'Opened', future: 'Will open', participle: 'Opened', es: 'Abrir', pron: 'óupen · óupend · uil óupen · óupend', type: 'Regular' },
  { base: 'Walk', past: 'Walked', future: 'Will walk', participle: 'Walked', es: 'Caminar', pron: 'uok · uokt · uil uok · uokt', type: 'Regular' },
  { base: 'Win', past: 'Won', future: 'Will win', participle: 'Won', es: 'Ganar', pron: 'uin · uan · uil uin · uan', type: 'Irregular' },
  { base: 'Offer', past: 'Offered', future: 'Will offer', participle: 'Offered', es: 'Ofrecer', pron: 'ófer · óferd · uil ófer · óferd', type: 'Regular' },
  { base: 'Remember', past: 'Remembered', future: 'Will remember', participle: 'Remembered', es: 'Recordar', pron: 'rimémber · rimémberd · uil rimémber', type: 'Regular' },
  { base: 'Buy', past: 'Bought', future: 'Will buy', participle: 'Bought', es: 'Comprar', pron: 'bái · bot · uil bái · bot', type: 'Irregular' },
  { base: 'Wait', past: 'Waited', future: 'Will wait', participle: 'Waited', es: 'Esperar', pron: 'uéit · uéitid · uil uéit · uéitid', type: 'Regular' },
  { base: 'Send', past: 'Sent', future: 'Will send', participle: 'Sent', es: 'Enviar, mandar', pron: 'send · sent · uil send · sent', type: 'Irregular' },
  { base: 'Build', past: 'Built', future: 'Will build', participle: 'Built', es: 'Construir', pron: 'bild · bilt · uil bild · bilt', type: 'Irregular' },
  { base: 'Fall', past: 'Fell', future: 'Will fall', participle: 'Fallen', es: 'Caer', pron: 'fol · fel · uil fol · fólen', type: 'Irregular' },
  { base: 'Cut', past: 'Cut', future: 'Will cut', participle: 'Cut', es: 'Cortar', pron: 'kat · kat · uil kat · kat', type: 'Irregular' },
  { base: 'Kill', past: 'Killed', future: 'Will kill', participle: 'Killed', es: 'Matar', pron: 'kil · kild · uil kil · kild', type: 'Regular' },
  { base: 'Reach', past: 'Reached', future: 'Will reach', participle: 'Reached', es: 'Alcanzar, llegar a', pron: 'rich · richt · uil rich · richt', type: 'Regular' },
  { base: 'Remain', past: 'Remained', future: 'Will remain', participle: 'Remained', es: 'Permanecer', pron: 'riméin · riméind · uil riméin', type: 'Regular' }
];

// 3. LOS 200 SUSTANTIVOS DEL PDF 1
export const vocab200List: VocabItem[] = [
  { en: 'Baby', es: 'Bebé', cat: 'Familia', ipa: 'béibi', note: 'Sustantivo singular' },
  { en: 'Boy', es: 'Chico, nene', cat: 'Familia', ipa: 'bói', note: 'Masculino' },
  { en: 'Brother', es: 'Hermano', cat: 'Familia', ipa: 'bráder', note: 'Familiar masculino' },
  { en: 'Child / Children', es: 'Niño/a ➔ Niños/as', cat: 'Familia', ipa: 'cháild ➔ chíldren', note: 'Plural irregular sin -s' },
  { en: 'Crowd', es: 'Multitud, gentío', cat: 'Familia', ipa: 'kráud', note: 'Grupo de personas' },
  { en: 'Doctor', es: 'Médico/a, doctor/a', cat: 'Familia', ipa: 'dóktor', note: 'Profesión' },
  { en: 'Girl', es: 'Chica, nena', cat: 'Familia', ipa: 'guérl', note: 'Femenino' },
  { en: 'Group', es: 'Grupo', cat: 'Familia', ipa: 'grup', note: 'Conjunto de personas' },
  { en: 'Man / Men', es: 'Hombre ➔ Hombres', cat: 'Familia', ipa: 'man ➔ men', note: 'Plural irregular' },
  { en: 'Person / People', es: 'Persona ➔ Gente', cat: 'Familia', ipa: 'pérson ➔ pípol', note: 'People siempre lleva verbo en plural' },
  { en: 'President', es: 'Presidente/a', cat: 'Familia', ipa: 'président', note: 'Cargo' },
  { en: 'Sister', es: 'Hermana', cat: 'Familia', ipa: 'síster', note: 'Familiar femenino' },
  { en: 'Soldier', es: 'Soldado', cat: 'Familia', ipa: 'sóulyer', note: 'Profesión' },
  { en: 'Son', es: 'Hijo varón', cat: 'Familia', ipa: 'san', note: 'Suena igual que Sun (sol)' },
  { en: 'Student', es: 'Estudiante', cat: 'Familia', ipa: 'stiúdent', note: 'Ocupación' },
  { en: 'Wife / Wives', es: 'Esposa ➔ Esposas', cat: 'Familia', ipa: 'uáif ➔ uáivz', note: 'Plural irregular terminado en -ves' },
  { en: 'Woman / Women', es: 'Mujer ➔ Mujeres', cat: 'Familia', ipa: 'úman ➔ uímin', note: 'Plural irregular: cambia la pronunciación' },

  { en: 'Back', es: 'Espalda / Atrás', cat: 'Cuerpo', ipa: 'bak', note: 'Doble función: espalda o regresar' },
  { en: 'Blood', es: 'Sangre', cat: 'Cuerpo', ipa: 'blad', note: 'Incontable' },
  { en: 'Body', es: 'Cuerpo', cat: 'Cuerpo', ipa: 'bódi', note: 'Sustantivo' },
  { en: 'Bone', es: 'Hueso', cat: 'Cuerpo', ipa: 'bóun', note: 'Estructura ósea' },
  { en: 'Ear', es: 'Oreja, oído', cat: 'Cuerpo', ipa: 'íer', note: 'No confundir con year (año)' },
  { en: 'Eye', es: 'Ojo', cat: 'Cuerpo', ipa: 'ái', note: 'Suena exactamente igual que I (yo)' },
  { en: 'Hair', es: 'Pelo, cabello', cat: 'Cuerpo', ipa: 'jéar', note: 'Incontable: My hair is clean' },
  { en: 'Hand', es: 'Mano', cat: 'Cuerpo', ipa: 'jand', note: 'También verbo: hand in (entregar)' },
  { en: 'Head', es: 'Cabeza', cat: 'Cuerpo', ipa: 'jed', note: 'Parte superior' },
  { en: 'Heart', es: 'Corazón', cat: 'Cuerpo', ipa: 'jart', note: 'No confundir con hurt (doler)' },
  { en: 'Leg', es: 'Pierna', cat: 'Cuerpo', ipa: 'leg', note: 'Extremidad' },
  { en: 'Mind', es: 'Mente', cat: 'Cuerpo', ipa: 'máind', note: 'También: Do you mind? (¿Te molesta?)' },
  { en: 'Mouth', es: 'Boca', cat: 'Cuerpo', ipa: 'máuz', note: 'Sonido th suave entre los dientes' },
  { en: 'Nose', es: 'Nariz', cat: 'Cuerpo', ipa: 'nóus', note: 'Sustantivo singular' },
  { en: 'Skin', es: 'Piel', cat: 'Cuerpo', ipa: 'skin', note: 'Incontable' },

  { en: 'Ball', es: 'Pelota', cat: 'Casa', ipa: 'bol', note: 'Objeto' },
  { en: 'Bed', es: 'Cama', cat: 'Casa', ipa: 'bed', note: 'Mueble' },
  { en: 'Book', es: 'Libro', cat: 'Casa', ipa: 'buk', note: 'Lectura' },
  { en: 'Box', es: 'Caja', cat: 'Casa', ipa: 'boks', note: 'Plural: boxes' },
  { en: 'Clothes', es: 'Ropa', cat: 'Casa', ipa: 'clóudz', note: 'Siempre plural: My clothes are...' },
  { en: 'Copy', es: 'Copia, ejemplar', cat: 'Casa', ipa: 'kópi', note: 'Sustantivo' },
  { en: 'Dictionary', es: 'Diccionario', cat: 'Casa', ipa: 'díkshoneri', note: 'Referencia' },
  { en: 'Door', es: 'Puerta', cat: 'Casa', ipa: 'dor', note: 'Entrada' },
  { en: 'Glass / Glasses', es: 'Vidrio, vaso ➔ Anteojos', cat: 'Casa', ipa: 'glas ➔ glásiz', note: 'En plural significa lentes' },
  { en: 'Hat', es: 'Sombrero, gorro', cat: 'Casa', ipa: 'jat', note: 'Prenda' },
  { en: 'Home', es: 'Hogar, casa', cat: 'Casa', ipa: 'jóum', note: 'Go home (sin to)' },
  { en: 'House', es: 'Casa (edificio)', cat: 'Casa', ipa: 'jáus', note: 'Edificio físico' },
  { en: 'Iron', es: 'Hierro, plancha', cat: 'Casa', ipa: 'áiron', note: 'En UK la r no se pronuncia' },
  { en: 'Key', es: 'Llave, clave', cat: 'Casa', ipa: 'ki', note: 'Acceso' },
  { en: 'List', es: 'Lista', cat: 'Casa', ipa: 'list', note: 'Registro' },
  { en: 'Machine', es: 'Máquina', cat: 'Casa', ipa: 'mashín', note: 'Aparato' },
  { en: 'Map', es: 'Mapa', cat: 'Casa', ipa: 'map', note: 'Guía' },
  { en: 'Note', es: 'Nota, billete (UK)', cat: 'Casa', ipa: 'nout', note: 'Apunte' },
  { en: 'Page', es: 'Página', cat: 'Casa', ipa: 'péich', note: 'De un libro' },
  { en: 'Pair', es: 'Par', cat: 'Casa', ipa: 'pear', note: 'A pair of shoes' },
  { en: 'Paper', es: 'Papel, diario', cat: 'Casa', ipa: 'péiper', note: 'Material' },
  { en: 'Paragraph', es: 'Párrafo', cat: 'Casa', ipa: 'párograf', note: 'Texto' },
  { en: 'Radio', es: 'Radio', cat: 'Casa', ipa: 'réidiou', note: 'Aparato' },
  { en: 'Ring', es: 'Anillo, timbre', cat: 'Casa', ipa: 'ring', note: 'Objeto o sonido' },
  { en: 'Seat', es: 'Asiento, lugar', cat: 'Casa', ipa: 'sit', note: 'Para sentarse' },
  { en: 'Set', es: 'Juego, conjunto', cat: 'Casa', ipa: 'set', note: 'A set of keys' },
  { en: 'Window', es: 'Ventana', cat: 'Casa', ipa: 'uíndou', note: 'Abertura' },

  { en: 'Apple', es: 'Manzana', cat: 'Comida', ipa: 'ápol', note: 'Fruta' },
  { en: 'Corn', es: 'Maíz, choclo', cat: 'Comida', ipa: 'korn', note: 'Cereal' },
  { en: 'Egg', es: 'Huevo', cat: 'Comida', ipa: 'eg', note: 'Alimento' },
  { en: 'Ice', es: 'Hielo', cat: 'Comida', ipa: 'áis', note: 'Incontable' },
  { en: 'Meat', es: 'Carne', cat: 'Comida', ipa: 'mit', note: 'Incontable' },
  { en: 'Milk', es: 'Leche', cat: 'Comida', ipa: 'milk', note: 'Incontable: Milk is white' },
  { en: 'Oil', es: 'Aceite, petróleo', cat: 'Comida', ipa: 'óil', note: 'Líquido' },
  { en: 'Sugar', es: 'Azúcar', cat: 'Comida', ipa: 'shúgar', note: 'Empieza con sonido sh' },

  { en: 'City', es: 'Ciudad', cat: 'Ciudad', ipa: 'síti', note: 'Plural: cities' },
  { en: 'Street', es: 'Calle', cat: 'Ciudad', ipa: 'strit', note: 'On Main Street' },
  { en: 'School', es: 'Escuela, colegio', cat: 'Ciudad', ipa: 'skul', note: 'Educación' },
  { en: 'Building', es: 'Edificio', cat: 'Ciudad', ipa: 'bílding', note: 'Construcción' },
  { en: 'Money', es: 'Dinero', cat: 'Trabajo', ipa: 'máni', note: 'Incontable' },
  { en: 'Job', es: 'Trabajo, empleo', cat: 'Trabajo', ipa: 'yob', note: 'Puesto laboral' },
  { en: 'Bill', es: 'Cuenta, factura', cat: 'Trabajo', ipa: 'bil', note: 'Can I have the bill, please?' },
  { en: 'Business', es: 'Negocio, empresa', cat: 'Trabajo', ipa: 'bíznes', note: 'En 2 sílabas' }
];

export const falseFriendsList = [
  { en: 'Actually', parece: 'Actualmente', es: 'En realidad / De hecho', ejemplo: 'Actually, I prefer morning workouts.' },
  { en: 'Large', parece: 'Largo', es: 'Grande', ejemplo: 'We have a large room. (Largo se dice long).' },
  { en: 'College', parece: 'Colegio', es: 'Universidad / Facultad', ejemplo: 'She studies psychology in college.' },
  { en: 'Current', parece: 'Corriente', es: 'Actual', ejemplo: 'This is my current schedule.' },
  { en: 'Policy', parece: 'Policía', es: 'Política / Norma institucional', ejemplo: 'It is the company policy.' },
  { en: 'Date', parece: 'Dato', es: 'Fecha o Cita romántica', ejemplo: 'What is today date? (Dato se dice data).' },
  { en: 'Miss', parece: 'Señorita', es: 'Extrañar o Perder (el transporte)', ejemplo: 'I miss you / I missed the bus.' },
  { en: 'Pretty', parece: 'Lindo', es: 'Bastante (modificador)', ejemplo: 'It is pretty good!' }
];

export const vocab500List = [
  { en: 'The', type: 'Funcional', es: 'El, la, los, las', note: 'Palabra #1 más frecuente' },
  { en: 'To', type: 'Funcional', es: 'A, hacia, para', note: 'Preposición fundamental' },
  { en: 'And', type: 'Funcional', es: 'Y', note: 'Conector básico' },
  { en: 'Of', type: 'Funcional', es: 'De', note: 'Preposición de pertenencia' },
  { en: 'A / An', type: 'Funcional', es: 'Un, una', note: 'An antes de sonido vocal' },
  { en: 'In', type: 'Funcional', es: 'En, dentro de', note: 'Preposición de lugar o tiempo' },
  { en: 'That', type: 'Funcional', es: 'Ese/a, eso; que', note: 'Pronombre o conector' },
  { en: 'Have (had)', type: 'Verbo', es: 'Tener; haber', note: 'Verbo auxiliar principal' },
  { en: 'Be (was/were)', type: 'Verbo', es: 'Ser o estar', note: 'Verbo irregular base' },
  { en: 'Do (did)', type: 'Verbo', es: 'Hacer; auxiliar', note: 'Preguntas y negaciones' },
  { en: 'Say (said)', type: 'Verbo', es: 'Decir', note: 'Said se pronuncia sed' },
  { en: 'Get (got)', type: 'Verbo', es: 'Conseguir, llegar', note: 'Verbo muy versátil' },
  { en: 'Make (made)', type: 'Verbo', es: 'Hacer, crear', note: 'Creación de cosas' },
  { en: 'Go (went)', type: 'Verbo', es: 'Ir', note: 'Pasado: went' },
  { en: 'Know (knew)', type: 'Verbo', es: 'Saber, conocer', note: 'K inicial muda' },
  { en: 'Take (took)', type: 'Verbo', es: 'Tomar, llevar', note: 'Pasado: took' },
  { en: 'See (saw)', type: 'Verbo', es: 'Ver', note: 'Suena igual que sea' },
  { en: 'Come (came)', type: 'Verbo', es: 'Venir', note: 'Pasado: came' },
  { en: 'Think (thought)', type: 'Verbo', es: 'Pensar', note: 'Pasado: thought' },
  { en: 'Find (found)', type: 'Verbo', es: 'Encontrar', note: 'Pasado: found' },
  { en: 'Give (gave)', type: 'Verbo', es: 'Dar', note: 'Pasado: gave' }
];