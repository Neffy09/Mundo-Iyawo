import { Orisha, Pataki, Libro, VideoItem, GuiaEspiritual } from "./types";

export const DEFAULT_ORISHAS: Orisha[] = [
  {
    id: "eleggua",
    nombre: "Elegguá",
    sincretismo: "Santo Niño de Atocha / San Antonio de Padua",
    colores: "Rojo y Negro",
    herramientas: "Garabato de guayaba, llaves, sombrero de paja, juguetes de niño, monedas",
    ofrendas: "Manteca de corojo, aguardiente, tabaco, dulces, maíz tostado, coco",
    numero: "3",
    descripcion: "Es el Orisha que abre y cierra los caminos de la vida, el destino, la fortuna y la desgracia. Es el portero del monte y de la sabana, el primero del grupo de los Guerreros (junto a Oggún, Ochosi y Osun). Ninguna ceremonia se inicia sin cantarle o alimentarle primero.",
    panteon: "Santería",
    linea: "Guerreros",
    fechaCelebracion: "13 de Junio / 4 de Octubre de cada año"
  },
  {
    id: "obatala",
    nombre: "Obatalá",
    sincretismo: "Virgen de las Mercedes",
    colores: "Blanco puro (a veces con acentos según el camino)",
    herramientas: "Iruke de cola de caballo blanca, campana de plata, cetro, corona de plata",
    ofrendas: "Manteca de cacao, cascarilla, merengue sin sal, arroz blanco, peras",
    numero: "8",
    descripcion: "Es el creador del ser humano, dueño del pensamiento, de la cabeza, de la mente y de los sueños. Es el Orisha mayor y personifica la paz, la pureza, la justicia, la sabiduría y la moderación. Todos los Orishas le respetan y le acatan como padre. Su elemento es el metal blanco espiritual.",
    panteon: "Santería",
    linea: "Cabecera",
    fechaCelebracion: "24 de Septiembre"
  },
  {
    id: "chango",
    nombre: "Changó",
    sincretismo: "Santa Bárbara",
    colores: "Rojo y Blanco",
    herramientas: "Hacha de doble filo (Oshé), tambores Batá, espada de madera, copa de madera",
    ofrendas: "Plátano verde en racimo, manzana roja, harina de maíz con quimbombó, vino tinto",
    numero: "6 o 4",
    descripcion: "Es el dios del trueno, del rayo, del fuego ardiente, de la justicia, de la virilidad y del baile apasionado. Es el rey de la música y soberano de los sagrados tambores Batá. Fue un rey histórico del pueblo Yoruba en Oyo (Nigeria). Su presencia evoca fuerza, majestad y realeza.",
    panteon: "Santería",
    linea: "Cabecera",
    fechaCelebracion: "4 de Diciembre"
  },
  {
    id: "yemaya",
    nombre: "Yemayá",
    sincretismo: "Virgen de Regla",
    colores: "Azul profundo y Blanco",
    herramientas: "Abanico de plumas de pato con perlas, timón de barco, ancla, caracoles de mar",
    ofrendas: "Melaza (miel de caña), sandía (patilla), chicharrones de cerdo, pescado frito",
    numero: "7",
    descripcion: "Es la madre de la vida, dueña de todos los mares y de las aguas saladas. Es la reina de la fertilidad, de los partos y de la supervivencia. Posee un carácter maternal insondable pero, cuando se enoja con furia de maremoto, es temible. Es consejera sabia y proveedora de abundancia espiritual.",
    panteon: "Santería",
    linea: "Cabecera",
    fechaCelebracion: "7 de Septiembre"
  },
  {
    id: "ochun",
    nombre: "Ochún",
    sincretismo: "Virgen de la Caridad del Cobre",
    colores: "Amarillo, Oro y Ámbar",
    herramientas: "Abanico de sándalo, campana de bronce, 5 manillas de oro, espejos, corona",
    ofrendas: "Miel de abeja pura, calabaza con miel, dulces finos, naranjas de río",
    numero: "5",
    descripcion: "Diosa del amor, de los ríos, del agua dulce que da vida, del oro y de la riqueza material y espiritual. Representa la coquetería, la delicadeza, el arte y la fertilidad femenina. Es la protectora especial de las embarazadas y de los desposeídos. Sus lágrimas limpian las penas familiares.",
    panteon: "Santería",
    linea: "Cabecera",
    fechaCelebracion: "8 de Septiembre"
  },
  {
    id: "oggun",
    nombre: "Oggún",
    sincretismo: "San Pedro / San Juan Bautista",
    colores: "Verde y Negro",
    herramientas: "Machete (embelé), yunque, martillo, pico, cadenas de hierro, pala",
    ofrendas: "Aguardiente de caña, tabaco, manteca de corojo, melaza, frutas ácidas",
    numero: "7",
    descripcion: "Es el dios del hierro, de los metales, del trabajo incesante, de la guerra, de la tecnología y de los cirujanos. Habita en el monte junto a Elegguá. Representa la fuerza bruta, la constancia, la construcción civil y la defensa inquebrantable de la comunidad espiritual y social.",
    panteon: "Santería",
    linea: "Guerreros",
    fechaCelebracion: "29 de Junio"
  },
  {
    id: "orula",
    nombre: "Orula (Orunmila)",
    sincretismo: "San Francisco de Asís",
    colores: "Verde y Amarillo (alternados)",
    herramientas: "Tablero de Ifá, Ékuele (cadena de adivinación), Irofá (cuerno tallado), Idefá",
    ofrendas: "Ñame hervido, coco seco, pargo entero, velas blancas, flores amarillas",
    numero: "16",
    descripcion: "Es el gran testigo de la creación (Eleri Ipin) y el oráculo supremo de Ifá. Conoce el pasado, el presente y el futuro de todas las almas en la Tierra. A través de sus sacerdotes (Babalaos), aconseja a los seres humanos para que vivan de acuerdo con su destino divino y eviten los tropiezos de la vida terrenal.",
    panteon: "Ifá",
    linea: "Oráculo Supremo",
    fechaCelebracion: "4 de Octubre"
  },
  {
    id: "oya",
    nombre: "Oyá (Yansá)",
    sincretismo: "Virgen de la Candelaria / Santa Teresa de Jesús",
    colores: "Marrón, Púrpura y 9 flecos de colores vivos (excepto negro)",
    herramientas: "Iruke de cola de caballo negra con mangos decorados, espada o machete, corona de 9 puntas",
    ofrendas: "Berenjena fresca (especialmente 9 piezas), manteca de corojo, chocolate oscuro, uvas",
    numero: "9",
    descripcion: "La indómita deidad que gobierna los vientos, los tornados, el arcoíris y las centellas. Es la guardiana de las puertas del camposanto (cementerio) y recibe las almas humanas en su transición del plano terrenal. Excelente guerrera, amante del tambor, esposa de Changó y de carácter impetuoso y justiciero.",
    panteon: "Santería",
    linea: "Fuerza de la Naturaleza",
    fechaCelebracion: "2 de Febrero"
  },
  {
    id: "ochosi",
    nombre: "Ochosi",
    sincretismo: "San Norberto / San Alberto Magno",
    colores: "Azul rey, Amarillo y Ámbar",
    herramientas: "Arco y flecha labrados en metal (Oshé), trampa de caza, corona con plumas finas",
    ofrendas: "Anís con miel, alpiste molido, frutas del monte, frijoles carita cocinados",
    numero: "3 o 7",
    descripcion: "Es el gran cazador divino y el patrón de la justicia integral. Símbolo del balance espiritual y terrenal. Es sumamente veloz para cazar las malas vibraciones y proveer soluciones rápidas ante juicios, cárceles y problemas legalistas difíciles del ser humano.",
    panteon: "Santería",
    linea: "Guerreros",
    fechaCelebracion: "6 de Junio"
  },
  {
    id: "babalu_aye",
    nombre: "Babalú Ayé",
    sincretismo: "San Lázaro (El Milagroso)",
    colores: "Morado obispo, Amarillo Pajizo y Marrón",
    herramientas: "Ja (escobilla sagrada de fibras de palma reales), muletas de madera, vasijas de barro",
    ofrendas: "Maíz tostado, pan de ajo, habichuelas cocidas con jengibre, cebolla morada, ajonjolí",
    numero: "17",
    descripcion: "Venerado Orisha que asume el control absoluto de las plagas, los virus contagiosos, las afecciones dermatológicas y de la sanidad milagrosa. Se le asocia con la humildad sagrada, la purificación del cuerpo, las promesas de fe y la salvaguarda de vidas necesitadas de salud.",
    panteon: "Santería",
    linea: "Fuerza Creadora y Sanación",
    fechaCelebracion: "17 de Diciembre"
  },
  {
    id: "aggayu_sola",
    nombre: "Aggayú Solá",
    sincretismo: "San Cristóbal (El Gigante)",
    colores: "Marrón tierra cocida y los 9 colores del arcoíris sagrado",
    herramientas: "Hacha bípene de mango muy largo (Oshé d'Aggayú), bastón de viaje o cayado",
    ofrendas: "Piña entera pelada con miel, plátano verde sancochado con corojo, dulce de boniato",
    numero: "9",
    descripcion: "El Orisha gigante del centro de la Tierra, que domina la lava ardiente de los volcanes, las cordilleras y los desiertos polvorientos. Simboliza el sostén firme de las personas débiles, el barquero fiel que ayuda a cruzar las dificultades de la vida y el custodio sagrado del hogar.",
    panteon: "Santería",
    linea: "Fuerza de la Naturaleza",
    fechaCelebracion: "25 de Julio"
  },
  {
    id: "olokun",
    nombre: "Olokun",
    sincretismo: "Aspecto profundo de la Virgen de Regla / San Rafael Arcángel",
    colores: "Azul ultramar, Verde oliva y Negro profundo",
    herramientas: "Careta de plomo cincelada, sirena, caballito de mar, timón, conchas de abismo",
    ofrendas: "Gofio amasado con melaza (bolas), maíz frito, sandía de río, pescado fresco entero",
    numero: "9 / 7",
    descripcion: "El monarca indiscutible y misterioso de los abismos y fosas oceánicas profundas. Es una fuerza primordial de abundancia infinita, estabilidad emocional y firmeza frente a las envidias y la brujería oscura. Representa aquello que es oculto, respetado y magnífico bajo el oleaje.",
    panteon: "Santería",
    linea: "Fuerzas Primordiales",
    fechaCelebracion: "7 o 12 de Septiembre"
  },
  {
    id: "siete_rayos",
    nombre: "Siete Rayos (Nsasi)",
    sincretismo: "Santa Bárbara / San Silvestre (Regla de Palo Monte)",
    colores: "Rojo y Blanco",
    herramientas: "Caldero de hierro, piedras de rayo, machetes, maderos fuertes del monte",
    ofrendas: "Chamba (líquido sagrado con alcohol y ají), tabaco mueso, ron bravo, coco",
    numero: "Variado",
    descripcion: "Fuerza bantú de la naturaleza que gobierna el fuego, el rayo y el trueno. En el Palo Mayombe, es una de las entidades espirituales (Nkisi Mpungo) más respetadas por su bravura y poder instantáneo para librar batallas místicas en el cementerio y en el monte.",
    panteon: "Palo Mayombe",
    linea: "Mpungos / Nfumbis de Congo",
    fechaCelebracion: "4 de Diciembre"
  },
  {
    id: "sarabanda",
    nombre: "Sarabanda",
    sincretismo: "San Pedro de Verona",
    colores: "Verde, Negro y Hierro",
    herramientas: "Caldero de Palo con cadenas, clavos de ferrocarril, herraduras, machete",
    ofrendas: "Aguardiente, tabaco, sangre de sacrificios al caldero, pólvora (fula)",
    numero: "7 o 21",
    descripcion: "Nkisi Mpungo del trabajo, del hierro, de la guerra mística y de la fuerza indomable de la selva y el metal. Es el corazón místico del caldero en Palo Monte y abre caminos espirituales sangrientos y victoriosos mediante firmas específicas llamadas patipembas.",
    panteon: "Palo Mayombe",
    linea: "Mpungos / Nfumbis de Congo",
    fechaCelebracion: "29 de Junio"
  },
  {
    id: "tiembla_tierra",
    nombre: "Tiembla Tierra (Kengue)",
    sincretismo: "Virgen de las Mercedes",
    colores: "Blanco puro",
    herramientas: "Campana de metal blanco, piedra blanca sagrada, firmas de tiza, crucifijo",
    ofrendas: "Manteca de cacao, cascarilla, merengue blanco sin yema, arroz blanco lechoso",
    numero: "8",
    descripcion: "Fuerza sumamente respetable de Palo Monte que controla las montañas, el pensamiento pacífico, la pureza intelectual y la cohesión de la Tierra. Trae sosiego, alivia la demencia o furia extrema y limpia las vibraciones nocivas de la casa del iniciado.",
    panteon: "Palo Mayombe",
    linea: "Mpungos / Nfumbis de Congo",
    fechaCelebracion: "24 de Septiembre"
  },
  {
    id: "madre_agua",
    nombre: "Madre de Agua (Kalunga)",
    sincretismo: "Virgen de Regla",
    colores: "Azul, Blanco y Negro",
    herramientas: "Machete de metal, caracoles marinos gigantes, caldero de barro rústico, ancla de hierro",
    ofrendas: "Melaza oscura, pescado de mar frito, sandía madura, ron blanco y tabacos",
    numero: "7",
    descripcion: "Mpungo sublime que gobierna la riqueza mística de las mareas oceánicas y la fertilidad de las aguas vivas mundiales. Es la gran madre protectora e intuitiva de la Regla Congo; su furia es de tsunami masivo para quien quebranta los juramentos de su caldero sagrado.",
    panteon: "Palo Mayombe",
    linea: "Mpungos / Nfumbis de Congo",
    fechaCelebracion: "7 de Septiembre"
  },
  {
    id: "osun",
    nombre: "Osun",
    sincretismo: "San Juan Bautista",
    colores: "Blanco puro, Amarillo, Azul y Rojo (en anillos)",
    herramientas: "Cáliz de metal o copa con un gallito arriba, cuatro cadenas y campanitas",
    ofrendas: "Manteca de cacao, cascarilla, uvas blancas, peras, merengues sin sal",
    numero: "8 (o indeterminado)",
    descripcion: "Es el Orisha de la estabilidad, de la firmeza terrestre y espiritual del iniciado. Representa la vigilia, el bastón o torre de control de los Guerreros. No posee canastilla, vive en lo alto por encima de las cabezas y nunca debe caerse de su puesto, ya que su caída anuncia problemas de salud graves para el devoto.",
    panteon: "Santería",
    linea: "Guerreros",
    fechaCelebracion: "24 de Junio"
  },
  {
    id: "ibeyis",
    nombre: "Los Ibeyis (Jimaguas)",
    sincretismo: "San Cosme y San Damián",
    colores: "Rojo y Blanco / Amarillo y Azul (en parejas)",
    herramientas: "Tinajas pequeñas de barro decoradas, campanilla de metal, muñequitos de madera, juguetes de cuerda",
    ofrendas: "Arroz con guisantes, piñata de dulces, caramelos de azúcar, frutas dulces, palomitas",
    numero: "2",
    descripcion: "Deidades gemelas de la alegría militante, la fortuna, la inocencia infantil y la salvación mística. Son considerados los niños consentidos de todos los Orishas. El patakí relata cómo vencieron al mismísimo Diablo tocando un tambor sagrado de manera infinita hasta que este tuvo que marcharse de la Tierra.",
    panteon: "Santería",
    linea: "Fuerzas del Balance",
    fechaCelebracion: "27 de Septiembre"
  },
  {
    id: "inle",
    nombre: "Inle (Erinle)",
    sincretismo: "San Rafael Arcángel",
    colores: "Azul Prusia, Amarillo Oro y Verde Mar",
    herramientas: "Anzuelo de oro o plata, pez de metal precioso, arpón tallado, corona con figuras marinas",
    ofrendas: "Pescado asado con almendras, lechuga fresca con aderezo de miel, calabazas dulces en rodajas",
    numero: "7 o 21",
    descripcion: "Deidad de la medicina de la Osha, patrón de los médicos, de los dentistas, pescadores y dueños de astilleros. Simboliza la sanación a través de las bondades balsámicas de la naturaleza salvaje y el sustento marino. Posee una belleza física sin igual y es hermafrodita en algunos caminos místicos.",
    panteon: "Santería",
    linea: "Sanidad y Sustento",
    fechaCelebracion: "24 de Octubre"
  },
  {
    id: "osain",
    nombre: "Osain (Osaín)",
    sincretismo: "San Silvestre / San Ramón Nonato",
    colores: "Verde monte, Rojo fuego y Blanco marfil",
    herramientas: "Güiro decorado con plumas finas (que habla), pipa de caña, machete corto del monte",
    ofrendas: "Aguardiente, tabaco de mascar, miel de abeja mansa, gallo blanco, semillas secas",
    numero: "1",
    descripcion: "Es el Orisha absoluto de toda la vegetación terrestre, de los secretos de la botánica medicinal y litúrgica (Ewé). Sin su conocimiento y bendición, ninguna ceremonia de Osha o Ifá se puede consumar, pues es quien cura mediante el ashe de las plantas. Es representado con una sola pierna, un solo brazo y un gran ojo penetrante.",
    panteon: "Ifá",
    linea: "Botánica de la Creación",
    fechaCelebracion: "31 de Diciembre / 4 de Octubre de cada año"
  },
  {
    id: "centella_ndoki",
    nombre: "Centella Ndoki",
    sincretismo: "Santa Teresa de Jesús / Virgen de la Candelaria",
    colores: "Marrón oscuro, Vinotinto y los 9 colores del remolino",
    herramientas: "Caldero de barro o hierro de tumba, puñal de acero, firmas específicas de ceniza",
    ofrendas: "Chocolate oscuro amargo, berenjenas frescas con corojo, ginebra e hilo negro",
    numero: "9",
    descripcion: "Poderosa entidad espiritual de Palo Mayombe (Nkisi Mpungo) que gobierna los vientos huracanados, los remolinos de polvo del camposanto y los relámpagos mudos de la noche. Es la dueña legítima de las puertas exteriores de la fosa del camposanto espiritual, experta en batallas místicas instantáneas.",
    panteon: "Palo Mayombe",
    linea: "Mpungos / Nfumbis de Congo",
    fechaCelebracion: "2 de Febrero"
  },
  {
    id: "lucero_mundo",
    nombre: "Lucero Mundo (Nkuyo)",
    sincretismo: "Santo Niño de Atocha / San Antonio de Padua",
    colores: "Rojo y Negro profundo",
    herramientas: "Caldero de barro pequeño, herraduras, monedas antiguas, un garabato tallado",
    ofrendas: "Chamba fuerte, tabacos pequeños (tupamaros), dulces finos, aguardiente y juguetes",
    numero: "3 o 21",
    descripcion: "El Mpungo de la Regla de Palo Monte encargado de abrir y cerrar todos los caminos cósmicos y terrestres que transitan las almas. Es la contraparte conga del Elegguá yoruba, encargado de salvaguardar las esquinas físicas del templo ante espíritus oscuros perturbadores.",
    panteon: "Palo Mayombe",
    linea: "Mpungos / Nfumbis de Congo",
    fechaCelebracion: "13 de Junio de cada año"
  }
];

export const DEFAULT_PATAKIS: Pataki[] = [
  {
    id: "p1",
    titulo: "Por qué Elegguá come primero que todos los Orishas",
    orishaRelacionado: "Elegguá",
    descripcionBreve: "La curación milagrosa de Obatalá y la recompensa suprema del creador Olofin.",
    contenido: `Se cuenta que en el principio del mundo, **Obatalá (o en otros caminos, Olofin)** cayó gravemente enfermo debido a las intrigas espirituales y la suciedad en la Tierra. Ningún sabio ni Orisha lograba encontrar la hierba correcta para restaurar el vigor y la mente pura del gran anciano creador.

**Elegguá**, siendo un niño astuto y observador que siempre estaba rondando por las esquinas y los bosques del monte de Oggún, conocía el secreto de una planta llamada *Ewé Alusí*, un helecho silvestre que crecía oculto bajo las rocas húmedas. 

Con mucha paciencia y respeto, Elegguá arrancó la hierba sagrada y preparó un brebaje aromático que sopló en la coronilla de Obatalá, devolviéndole de inmediato la lucidez, la respiración y el pulso robusto.

Al ver esto, **Olofin deparó ante todo el panteón**:
> *"Por haber salvado al padre del pensamiento con tu astucia y humildad, desde hoy dictaminó que ningún ser espiritual, humano u Orisha podrá comer ni recibir ofrenda alguna sin que tú, Elegguá, recibas la tuya primero. Serás el dueño de todas las llaves, de la primera esquina del templo y de todas las puertas del destino.*"

Por este motivo, en cualquier toque de tambor Batá o fiesta de Osha, el primer canto y plato siempre le pertenecen al travieso Elegguá.`
  },
  {
    id: "p2",
    titulo: "La rivalidad entre Changó y Oggún por el hierro y el fuego",
    orishaRelacionado: "Changó & Oggún",
    descripcionBreve: "El enfrentamiento místico entre el dios del rayo y el indomable herrero de los bosques.",
    contenido: `En los reinos de la antigua África Yoruba, **Oggún** vivía sumido en la soledad del monte, forjando incansablemente armas y herramientas. Oggún era callado, ríspido y rústico, pero poseía la fuerza indiscutible del acero. 

Por otro lado, **Changó** era un rey magnífico, apuesto, amante de las artes, la danza y poseedor del misterio del rayo y el trueno. La rivalidad estalló por el amor de la valiente **Oyá** (la tempestad) y también por el cortejo de la dulce **Ochún**. Ochún, con su risa coqueta de río dulce, logró sacar a Oggún del monte usando miel de abejas, pero finalmente prefirió el palacio resplandeciente de Changó.

Oggún, enfurecido por perder el amor y sintiéndose humillado, forjó un machete gigantesco maldiciendo el nombre de Changó. El cielo se encendió y Changó, usando sus dos piedras de rayo (*Edún Ará*), golpeó el yunque de Oggún, fundiendo instantáneamente el metal tosco.

**Obatalá** tuvo que intervenir poniéndose entre el rayo abrasador y el machete de hierro:
> *"Oggún, el hierro sin fuego de Changó es solo un mineral frío. Changó, el fuego sin la forja del hierro de Oggún es solo una llamarada destructiva que se apaga sola. Ambos deben respetarse porque donde hay metal, se templará con el fuego, pero jamás deben habitar bajo el mismo techo espiritual.*"

Desde entonces, el caldero de hierro de Oggún y el mortero de madera de Changó nunca se mezclan físicamente en el altar del iniciado santero, recordando la tregua sagrada dictada por el padre de las cabezas.`
  },
  {
    id: "p3",
    titulo: "Yemayá calma la furia sagrada de Obatalá",
    orishaRelacionado: "Yemayá",
    descripcionBreve: "Cómo el mar infinito de Yemayá devolvió el equilibrio fresco a la cabeza del anciano creador.",
    contenido: `Hubo una época cósmica donde la maldad de los hombres en el plano terrenal colmó la paciencia de **Obatalá**. Tanta era la hipocresía, la codicia y el ruido pecaminoso, que el anciano sintió que su cabeza blanca daba vueltas, perdiendo el temperamento pacífico que le caracteriza. 

Obatalá alzó su báculo sagrado de plata y comenzó a enviar tempestades de nieve, sequías de polvo blanco y temblores de tierra para silenciar a la humanidad. Las deidades temían que el mundo fuera borrado por completo.

**Yemayá**, al ver el peligro de extinción, emergió de las profundidades del mar con sus brazos cargados de un líquido lechoso y fresco proveniente de un coco de agua gigante (*Obí*), mezclado con hojas de prodigiosa (*ewé dun dun*). Con suavidad, empezó a cantar cantos melódicos que emulaban el romper de las olas mansas en la arena blanca.

Obatalá se sintió arrullado por el canto marino. Yemayá se postró pacientemente a sus pies y lavó la cabeza del anciano con el agua fresca, aplicando cascarilla (*efún*) y manteca de cacao (*orí*). 

Poco a poco, el fuego de la cabeza de Obatalá se disipó. El anciano agradeció a la reina de los mares:
> *"Yemayá, tú has refrescado mi coronilla ardiente y salvado a mis hijos de mi propia ira justa. En agradecimiento, declaro que la sabiduría del mar será el espejo del cielo, y tu caracol (*Diloggun*) será portador de gran verdad espiritual.*"

Este patakí enseña el valor del **refrescamiento de cabeza (Rogación de Cabeza)** en el culto de la Santería, usando coco para purificar las mentes cargadas de angustia.`
  }
];

export const DEFAULT_LIBROS: Libro[] = [
  {
    id: "l1",
    titulo: "El Monte",
    autor: "Lydia Cabrera",
    descripcion: "La obra maestra definitiva sobre la teología afro-cubana y el misticismo botánico de los cultos lucumí (Santería) y congo (Palo Monte). Es un registro detallado de las hierbas del monte sagrado, cantos tradicionales, rezos y testimonios de viejos practicantes en los albores del siglo XX cubano.",
    categoria: "General"
  },
  {
    id: "l2",
    titulo: "Los Orishas en Cuba",
    autor: "Natalia Bolívar Aróstegui",
    descripcion: "Un clásico de la investigación etnográfica y folclórica cubana. Catálogo descriptivo riguroso acerca de la mitología, atributos, ofrendas, colores y sincretismo católico de cada una de las deidades del panteón Yoruba-Lucumí.",
    categoria: "Santería"
  },
  {
    id: "l3",
    titulo: "Tratado Mayor de Ifá (Introducción)",
    autor: "Tradicionalista Yoruba",
    descripcion: "Manual de estudio que expone los principios esenciales de los 16 Odun principales de Ifá (Ogbé, Oyekún, Iwori, etc.), así como los rezos para ceremonias de consulta, la consagración de amuletos e historias morales ancestrales del oráculo.",
    categoria: "Ifá"
  },
  {
    id: "l4",
    titulo: "Cabildos y la Regla Mayombe",
    autor: "Estudio sobre los Cabildos de Nación",
    descripcion: "Aproximación de peso histórico a los cultos bantúes originados en la zona del Congo y Angola, la consagración de la Nganga (prenda de Palo), las patipembas (firmas sagradas en tiza) y la estrecha comunicación de los paleros con los espíritus de los ancestros (Nfumbis).",
    categoria: "Palo Mayombe"
  },
  {
    id: "l5",
    titulo: "Colección de Oraciones Escogidas",
    autor: "Allan Kardec",
    descripcion: "El libro de cabecera fundamental del espiritismo en Cuba y el Caribe. Contiene las oraciones para la apertura y cierre de las sesiones o misas espirituales, rezos para encomendar a los guías protectores, espíritus necesitados de luz y cantos de devoción.",
    categoria: "Espiritismo"
  }
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    titulo: "Toque de Tambor de Fundación a Elegguá, Yemayá y Changó",
    descripcion: "Una de de demostración grabada de tambores Batá (Iyá, Itótele, Okónkolo) interpretando los cantos (oriki) tradicionales y pasajes de baile religioso de iniciados de la Osha.",
    categoria: "Cantos y Tambor",
    videoUrl: "https://www.youtube.com/embed/5aYy3p_W0-0",
    esYoutube: true
  },
  {
    id: "v2",
    titulo: "Teología de Ifá: ¿Qué son los Odun y cómo rigen nuestro destino?",
    descripcion: "Análisis conceptual del sistema adivinatorio de Ifá, la simbología binaria de los 256 Odun y el rol de los Babalaos como guías comunitarios y consejeros espirituales.",
    categoria: "Ifá",
    videoUrl: "https://www.youtube.com/embed/_k-0l1Y3Olc",
    esYoutube: true
  },
  {
    id: "v3",
    titulo: "Palo Mayombe: El Misterio del Caldero y los Ancestros (Nfumbis)",
    descripcion: "Documental educativo e histórico sobre las raíces congas del Palo Monte, el significado de las firmas mágicas y el respeto del palero a las fuerzas de la naturaleza.",
    categoria: "Palo Mayombe",
    videoUrl: "https://www.youtube.com/embed/S_8qMhYI6D4",
    esYoutube: true
  },
  {
    id: "v4",
    titulo: "La Bóveda Espiritual y la Misa de Espiritismo Cruzado",
    descripcion: "Explicación educativa sobre la colocación de los vasos de agua, el vaso central con el crucifijo de madera, las flores blancas y cómo se canaliza la energía de los guías ancestrales en una mesa o misa espiritual.",
    categoria: "Espiritismo",
    videoUrl: "https://www.youtube.com/embed/YpI82xZkLh4",
    esYoutube: true
  }
];

export const DEFAULT_GUIAS_ESPIRITUALES: GuiaEspiritual[] = [
  {
    id: "francisca",
    nombre: "Mamá Francisca (Francisca la Conga)",
    sincretismo: "Santa Teresa de Jesús / Nuestra Señora de la Regla",
    tipo: "Congos",
    colores: "Rojo, Amarillo y Negro",
    atributos: "Bastón rústico de camino, gran pañuelo en la cabeza, tabaco, ramilletes de hierbas amargas",
    ofrendas: "Aguardiente de caña soplado, café negro caliente sin azúcar, tabaco, maíz con manteca de corojo",
    descripcion: "Representa la sabiduría ancestral, la medicina botánica sanadora de las plantaciones de azúcar de herencia bantú y la inquebrantable protección maternal frente a envidias y brujería. Es alegre pero firme, fuma tabaco y limpia con hierbas frescas.",
    oracion: "¡Oh excelsa Mamá Francisca de mi cordón! Te ruego con profunda fe que limpies mi sendero con tus hierbas benditas. Concede salud y paz a mi mente, y rompe con tu bastón de luz toda vibración negativa que intente entrar en mi hogar espiritual. ¡Luz y progreso para tu alma!"
  },
  {
    id: "jose_francisco",
    nombre: "El Negro José Francisco (Francisco el Congo)",
    sincretismo: "San Benito de Palermo / San Martín de Porres",
    tipo: "Congos",
    colores: "Rojo, Negro y Blanco",
    atributos: "Bastón de palo de monte grueso, collar de cuentas rústicas de madera y caracoles, sombrero de guano (paja)",
    ofrendas: "Copa de aguardiente fuerte, tabaco encendido, ramillete de albahaca fresca, café expreso negro sin azúcar",
    descripcion: "Un espíritu vigoroso de alta jerarquía espiritual, experto en la cura tradicional mediante la botánica selvática y en despojos de arrastres energéticos muy pesados. Defiende y cuida su casa con gran celo místico.",
    oracion: "Gran ancestro José Francisco, tú que conoces las profundidades del monte y de las plantas sagradas, pido que desciendas con tu antorcha de luz. Limpia mi materia física y destraba los obstáculos que frenan mi éxito. ¡Luz y elevación espiritual!"
  },
  {
    id: "gitana_maria",
    nombre: "María la Gitana (Gitana de Mi Cordón)",
    sincretismo: "Santa Sara la Kali / Virgen del Pilar",
    tipo: "Gitanas",
    colores: "Multicolor (Amarillo, Rojo brillante y Azul zafiro)",
    atributos: "Baraja de cartas españolas, pandereta de latón, mantón bordado de flores, perfume dulce fino, monedas y anillos de cobre",
    ofrendas: "Copa de vino tinto dulce de uva, manzanas rojas brillantes, flores naturales rojas (rosas o claveles), cigarrillos rubios",
    descripcion: "Espíritu trashumante europeo dotado de asombrosa intuición, videncia y alegría. Ayuda a destrabar caminos financieros, desvelar traiciones sentimentales y limpiar la pesadez mental combinando perfumes y cartas.",
    oracion: "Gitana bailadora y consejera caritativa, que con tus pasos barres el infortunio y con tus naipes desvelas el porvenir. Te ruego que me guíes con alegría y me ayudes a atraer la abundancia y la felicidad. ¡Luz perpetua para tu espíritu de fuego!"
  },
  {
    id: "madama_dolores",
    nombre: "La Madama Dolores",
    sincretismo: "Virgen de la Candelaria / Santa Ana",
    tipo: "Madamas",
    colores: "Blanco y Amarillo sol",
    atributos: "Escoba mística de palma de abanico, paño blanco cubriendo la cabeza, perfume clásico de lavanda, delantal",
    ofrendas: "Taza de tinto dulce, bizcochos dulces de maizena, té aromático de manzanilla, ramilletes de alhelíes y azucenas blancas",
    descripcion: "Representa a las cariñosas, sabias y sacrificadas nodrizas y amas de llaves criollas. Es una absoluta especialista en el despojo de energías estancadas in hogares, orden de bóvedas y el cuidado de personas debilitadas físicamente.",
    oracion: "Madama Dolores, alma llena de ternura celestial y limpieza purificadora. Trae hoy tu escoba espiritual a esta casa de oración y barre hacia afuera cualquier corriente helada de envidia. Endulza mis pensamientos y concédeme tu bondadosa paz. ¡Luz para ti!"
  },
  {
    id: "hatuey",
    nombre: "Cacique Hatuey (El Indio Guerrero)",
    sincretismo: "San Juan Bautista / El Indio de la Fuerza de la Habana",
    tipo: "Indios",
    colores: "Amarronado tierra, Rojo y Verde bosque",
    atributos: "Plumas decorativas de águila, flecha de monte de madera dura, vasija de barro cocido con agua corriente",
    ofrendas: "Humo de tabaco silvestre soplado vigorosamente, agua cristalina de manantial endulzada con panela o miel de abejas",
    descripcion: "Espíritu nativo de indomable gallardía y supremo orgullo por su libertad ancestral. Actúa como un colosal escudo defensivo contra asaltos astrales negativos o pensamientos dañinos de adversarios.",
    oracion: "Oh gran Cacique Hatuey, indio valiente defensor de las tierras indómitas. Te invoco en este instante como mi celoso guardián para que apuntes con tus flechas espirituales hacia cualquier maldad armada en mi contra. ¡Luz de altura para tus plumas!"
  },
  {
    id: "jose_gregorio",
    nombre: "Venerable Dr. José Gregorio Hernández (Médico de Almas)",
    sincretismo: "Ninguno (Estatura de Beato Científico)",
    tipo: "Médicos",
    colores: "Blanco impoluto y Negro riguroso",
    atributos: "Recetas con fórmulas curativas místicas, estetoscopio de época, vaso invertido de cristal con agua pura",
    ofrendas: "Vaso de cristal colmado de agua mineral bendecida, cirio blanco de cera encendido con recogimiento, rosas de color blanco",
    descripcion: "Alma ejemplar dedicada por entero a socorrer caritativamente a los convalecientes. Transmite potentes fluidos balsámicos invisibles para aliviar el dolor corporal y calmar el agobio mental.",
    oracion: "Paciente Dr. José Gregorio, dador de bálsamos celestiales y ciencia con compasión. Te ruego que entres con tu maletín espiritual de misericordia a restaurar la corriente de vigor que fluye por mis venas, otorgándome salud duradera. ¡Que brille para ti la luz eterna de Dios!"
  }
];

// Helper to initialize custom collections in localStorage
export function loadFromStorage<T>(key: string, defaultData: T[]): T[] {
  const stored = localStorage.getItem(`afro_cuban_learning_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Error de lectura de localStorage para ${key}`, e);
    }
  }
  // If not stored, store default data first
  saveToStorage(key, defaultData);
  return defaultData;
}

export function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(`afro_cuban_learning_${key}`, JSON.stringify(data));
}
