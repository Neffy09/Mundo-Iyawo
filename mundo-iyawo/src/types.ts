export interface Orisha {
  id: string;
  nombre: string;
  sincretismo: string;
  colores: string;
  herramientas: string;
  ofrendas: string;
  numero: number | string;
  descripcion: string;
  panteon: "Santería" | "Ifá" | "Palo Mayombe";
  linea: string; // e.g. "Guerreros", "Cabecera", "Fuerza de la Naturaleza"
  imagenUrl?: string;
  fechaCelebracion?: string; // e.g. "13 de Junio"
  colorSchemeId?: string;
  animatedIconId?: string;
  customIconUrl?: string;
}

export interface Pataki {
  id: string;
  titulo: string;
  orishaRelacionado: string;
  descripcionBreve: string;
  contenido: string; // The main storytelling markdown/text
}

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  descripcion: string;
  categoria: "Santería" | "Ifá" | "Palo Mayombe" | "Espiritismo" | "General";
  linkDescarga?: string; // or link reference
  pdfData?: string; // Base64 representation of uploaded PDF
  pdfNombre?: string; // Original uploaded file name
}

export interface VideoItem {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: "Santería" | "Ifá" | "Palo Mayombe" | "Cantos y Tambor" | "Espiritismo" | "General";
  videoUrl: string; // Can be a YouTube embed URL or a general link
  esYoutube: boolean;
}

export interface GuiaEspiritual {
  id: string;
  nombre: string;
  sincretismo: string;
  tipo: "Congos" | "Gitanas" | "Madamas" | "Indios" | "Médicos" | "Familiares" | "Otros";
  colores: string;
  atributos: string; // e.g. tabaco, flores, maderos
  ofrendas: string; // e.g. café, vino tinto, aguardiente
  descripcion: string;
  oracion: string;
}

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export interface UserAccount {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  status: "pending" | "approved";
  fechaRegistro: string;
}

