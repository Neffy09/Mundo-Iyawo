import React, { useState, useEffect } from "react";
import { Orisha, Pataki, Libro, VideoItem, ChatMessage, GuiaEspiritual, UserAccount } from "./types";
import {
  DEFAULT_ORISHAS,
  DEFAULT_PATAKIS,
  DEFAULT_LIBROS,
  DEFAULT_VIDEOS,
  DEFAULT_GUIAS_ESPIRITUALES,
  loadFromStorage,
  saveToStorage,
} from "./data";
import OrishasSection from "./components/OrishasSection";
import PatakisSection from "./components/PatakisSection";
import VideosSection from "./components/VideosSection";
import BooksSection from "./components/BooksSection";
import EspiritismoSection from "./components/EspiritismoSection";
import AdminSection from "./components/AdminSection";
import {
  BookOpen,
  Compass,
  Video,
  Bookmark,
  MessageSquare,
  Sparkles,
  Info,
  Calendar,
  Send,
  HelpCircle,
  FolderOpen,
  Heart,
  Lock,
  User,
  ShieldAlert,
  LogOut,
  ChevronRight,
  Flame,
  Globe,
  Shield,
  UserPlus,
  Users,
  CheckCircle,
  Mail,
  Copy,
  Check,
  Trash2
} from "lucide-react";

// Initial default user preset accounts
const DEFAULT_USERS: UserAccount[] = [
  {
    id: "admin_1",
    nombre: "Neftali P.N.",
    email: "neftali.pn.25@gmail.com",
    password: "122132",
    role: "admin",
    status: "approved",
    fechaRegistro: "15 Jun 2026",
  },
  {
    id: "user_1",
    nombre: "Iyawo Iniciado",
    email: "neftali.perez.joccards@gmail.com",
    password: "iyawo2026",
    role: "user",
    status: "approved",
    fechaRegistro: "15 Jun 2026",
  },
  {
    id: "user_test",
    nombre: "Carlos Orula",
    email: "carlos.orula@gmail.com",
    password: "carlos5",
    role: "user",
    status: "pending",
    fechaRegistro: "15 Jun 2026",
  }
];

// Helper to format AI replies into beautifully spaced ChatGPT-like HTML elements
const formatMessageText = (text: string) => {
  return text.split("\n").map((line, lineIdx) => {
    // Bullet/list checks
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ") || line.trim().startsWith("• ")) {
      const cleanText = line.replace(/^[\s\-*•]+/, "");
      return (
        <li key={lineIdx} className="ml-5 list-disc my-1 text-zinc-300 font-sans text-sm tracking-wide">
          {cleanText}
        </li>
      );
    }
    // Numbered lists checks e.g. "1. "
    const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
    if (numMatch) {
      return (
        <li key={lineIdx} className="ml-5 list-decimal my-1 text-zinc-300 font-sans text-sm tracking-wide">
          {numMatch[2]}
        </li>
      );
    }
    // Bold headers checking e.g., "**Title**"
    if (line.match(/\*\*(.*?)\*\*/)) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={lineIdx} className="text-zinc-300 text-sm leading-relaxed my-1.5 font-sans">
          {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-serif font-black text-white text-[13px] tracking-wide">{p}</strong> : p)}
        </p>
      );
    }
    // Subtitle checks (starts with ### or ##)
    if (line.trim().startsWith("###") || line.trim().startsWith("##")) {
      const cleanSub = line.replace(/^[#\s]+/, "");
      return (
        <h5 key={lineIdx} className="font-serif font-black text-[#D4AF37] text-[13px] tracking-wider uppercase mt-4 mb-2 pb-1 border-b border-[#242424]">
          {cleanSub}
        </h5>
      );
    }
    // Empty line check
    if (!line.trim()) {
      return <div key={lineIdx} className="h-2"></div>;
    }
    // Standard paragraph
    return (
      <p key={lineIdx} className="text-zinc-300 text-sm leading-relaxed my-1 font-sans font-light">
        {line}
      </p>
    );
  });
};


export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState("neftali.perez.joccards@gmail.com");
  const [password, setPassword] = useState("iyawo2026");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Administration and Multi-user database systems
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Self-registration states
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regError, setRegError] = useState("");

  // State for different collections loaded from local storage
  const [orishas, setOrishas] = useState<Orisha[]>([]);
  const [patakis, setPatakis] = useState<Pataki[]>([]);
  const [libros, setLibros] = useState<Libro[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [guias, setGuias] = useState<GuiaEspiritual[]>([]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>("orishas");

  // AI Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isAiConfigured, setIsAiConfigured] = useState<boolean | null>(null);

  // Initialize data and check login state
  useEffect(() => {
    // Standard data loading
    setOrishas(loadFromStorage<Orisha>("orishas", DEFAULT_ORISHAS));
    setPatakis(loadFromStorage<Pataki>("patakis", DEFAULT_PATAKIS));
    setLibros(loadFromStorage<Libro>("libros", DEFAULT_LIBROS));
    setVideos(loadFromStorage<VideoItem>("videos", DEFAULT_VIDEOS));
    setGuias(loadFromStorage<GuiaEspiritual>("guias", DEFAULT_GUIAS_ESPIRITUALES));

    // Load custom registered user database
    const savedUsers = loadFromStorage<UserAccount>("users_accounts", DEFAULT_USERS);
    setUsers(savedUsers);

    // Check localStorage login
    const isLogged = localStorage.getItem("mundo_iyawo_logged") === "true";
    const savedUserEmail = localStorage.getItem("mundo_iyawo_logged_email");

    if (isLogged && savedUserEmail) {
      const activeUser = savedUsers.find((u) => u.email.toLowerCase() === savedUserEmail.toLowerCase() && u.status === "approved");
      if (activeUser) {
        setCurrentUser(activeUser);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("mundo_iyawo_logged");
        localStorage.removeItem("mundo_iyawo_logged_email");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }

    // Check backend AI status on startup
    fetch("/api/gemini/status")
      .then((res) => res.json())
      .then((data) => {
        setIsAiConfigured(data.configured);
      })
      .catch((err) => {
        console.error("No se pudo verificar el estado del consultor IA", err);
        setIsAiConfigured(false);
      });

    // Seed initial message for AI chat
    setChatMessages([
      {
        sender: "bot",
        text: "¡Alafia! Bienvenido al **Oráculo de Sabiduría de Mundo Iyawo**. Aquí puedes formular preguntas acerca de las tradiciones de la Regla de Osha, el sacerdocio de Ifá, las fuerzas bantú de la Regla de Palo Mayombe o la teología del Espiritismo Cruzado y de Cordón.\n\n*Por ejemplo:* ¿Cuáles son los guerreros de la Santería? ¿Qué atributos pertenecen al Mpungo Sarabanda? ¿Cómo se organiza una Bóveda Espiritual? ¿Quién es la deidad Obatalá?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Save wrappers
  const handleSaveOrishas = (data: Orisha[]) => saveToStorage<Orisha>("orishas", data);
  const handleSavePatakis = (data: Pataki[]) => saveToStorage<Pataki>("patakis", data);
  const handleSaveVideos = (data: VideoItem[]) => saveToStorage<VideoItem>("videos", data);
  const handleSaveLibros = (data: Libro[]) => saveToStorage<Libro>("libros", data);
  const handleSaveGuias = (data: GuiaEspiritual[]) => saveToStorage<GuiaEspiritual>("guias", data);
  
  const handleSaveUsers = (data: UserAccount[]) => {
    setUsers(data);
    saveToStorage<UserAccount>("users_accounts", data);
  };

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    // On mobile, scroll smoothly to the content area
    setTimeout(() => {
      const el = document.getElementById("main-tab-panel");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  // Login handler with smooth feedback delay and user verification
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setLoginError("Por favor, ingresa tus credenciales rituales de acceso.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    setTimeout(() => {
      const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) {
        setLoginError("El correo electrónico ingresado no se encuentra en la orden de iniciados.");
        setIsLoggingIn(false);
        return;
      }
      if (found.password !== password.trim()) {
        setLoginError("La contraseña sagrada es incorrecta. Rectifique sus energías.");
        setIsLoggingIn(false);
        return;
      }
      if (found.status === "pending") {
        setLoginError("Su cuenta está en espera de aprobación por el Administrador Principal.");
        setIsLoggingIn(false);
        return;
      }

      // Success
      localStorage.setItem("mundo_iyawo_logged", "true");
      localStorage.setItem("mundo_iyawo_logged_email", found.email);
      setCurrentUser(found);
      setIsAuthenticated(true);
      setIsLoggingIn(false);
    }, 850);
  };

  // Registration handler for student requests
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (!regNombre.trim() || !regEmail.trim() || !regPassword.trim()) {
      setRegError("Por favor, complete todos los campos rituales obligatorios.");
      return;
    }

    if (users.some((u) => u.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setRegError("Este correo electrónico ya se encuentra registrado.");
      return;
    }

    const newUser: UserAccount = {
      id: "u_" + Date.now(),
      nombre: regNombre.trim(),
      email: regEmail.trim().toLowerCase(),
      password: regPassword.trim(),
      role: "user",
      status: "pending",
      fechaRegistro: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const updated = [...users, newUser];
    handleSaveUsers(updated);

    // Auto populate the login email for convenience
    setEmail(newUser.email);
    setPassword(newUser.password || "");

    setRegNombre("");
    setRegEmail("");
    setRegPassword("");
    setRegSuccess("¡Solicitud enviada con éxito! Su cuenta está en espera de aprobación por el Administrador.");

    setTimeout(() => {
      setShowRegisterForm(false);
      setRegSuccess("");
    }, 5500);
  };

  // Sign out handler
  const handleLogout = () => {
    localStorage.removeItem("mundo_iyawo_logged");
    localStorage.removeItem("mundo_iyawo_logged_email");
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Modern chat states and helpers
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    if (confirm("¿Estás seguro de que deseas limpiar la conversación actual con el Oráculo?")) {
      setChatMessages([]);
    }
  };

  const handleSendPromptSuggestion = async (queryText: string) => {
    if (isChatLoading) return;
    
    const userMsg: ChatMessage = {
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: queryText }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        sender: "bot",
        text: data.text || "Disculpa, ha ocurrido una dificultad al consultar los caracoles adivinatorios. Intenta nuevamente.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error communicating with Gemini backend", err);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🚨 No logro conectar con el plano celestial espiritual. Verifica la conexión a internet o la configuración del servidor.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Send message to AI Oracle backend
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const originalInput = chatInput;
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: originalInput }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        sender: "bot",
        text: data.text || "Disculpa, ha ocurrido una dificultad al consultar los caracoles adivinatorios. Intenta nuevamente.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error communicating with Gemini backend", err);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🚨 No logro conectar con el plano celestial espiritual. Verifica la conexión a internet o la configuración del servidor.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // --- RENDERING LANDING PAGE AND LOGIN GATE ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37]/35 relative flex flex-col justify-between overflow-hidden font-sans">
        {/* Revolving Background Aura Orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-[#6E44FF]/5 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[650px] h-[650px] bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none animate-pulse duration-[8s]"></div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none"></div>

        {/* Floating sacred star particle layer */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none">
          <span className="absolute top-[15%] left-[20%] text-white text-lg animate-pulse">★</span>
          <span className="absolute top-[45%] left-[10%] text-zinc-500 text-sm animate-pulse [animation-duration:5s]">★</span>
          <span className="absolute top-[75%] left-[25%] text-[#D4AF37] text-base animate-pulse [animation-duration:3s]">✨</span>
          <span className="absolute top-[25%] right-[15%] text-[#D4AF37] text-lg animate-pulse [animation-duration:4s]">★</span>
          <span className="absolute top-[60%] right-[25%] text-zinc-400 text-sm animate-pulse">★</span>
          <span className="absolute top-[80%] right-[10%] text-white text-base animate-pulse [animation-duration:6s]">✨</span>
        </div>

        {/* Main Hero & Login Split Container */}
        <main className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center justify-center relative z-10 w-full flex-1">
          
          {/* Brand Presentation Left Side (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center text-center gap-7 relative animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white font-extrabold leading-none tracking-[0.2em] md:tracking-[0.25em] bg-gradient-to-r from-[#FFF] via-[#E8C97A] to-[#D4AF37] bg-clip-text text-transparent select-none drop-shadow-[0_2px_10px_rgba(212,175,55,0.15)]">
              MUNDO IYAWO
            </h1>

            {/* The beautiful premium emblem from user image */}
            <div className="relative mx-auto w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 my-4 group shrink-0 select-none">
              {/* Decorative intense warm golden back glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/25 via-[#E8C97A]/15 to-[#D4AF37]/30 rounded-full blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              {/* Elegant slow spinning golden accent ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/25 via-transparent to-[#E8C97A]/25 rounded-full animate-spin [animation-duration:24s] opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              
              {/* Golden metallic border concentric framing */}
              <div className="absolute inset-0 rounded-full border-[3px] border-[#D4AF37]/50 p-1.5 bg-[#050505]/80 backdrop-blur-md shadow-[0_0_55px_rgba(212,175,55,0.22)] flex items-center justify-center overflow-hidden transition-all duration-700 group-hover:shadow-[0_0_70px_rgba(212,175,55,0.35)] group-hover:border-[#D4AF37]/70">
                <div className="absolute inset-2 rounded-full border border-[#D4AF37]/20"></div>
                {/* Main high-quality generated medallion image */}
                <img
                  src="/src/assets/images/regenerated_image_1781548413394.png"
                  alt="Mundo Iyawo Medallion"
                  className="w-[99%] h-[99%] object-cover rounded-full shadow-2xl transition-all duration-[1000ms] cubic-bezier(0.16,1,0.3,1) group-hover:scale-[1.06] group-hover:rotate-[2deg] filter brightness-105 contrast-[1.01]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Login Gate Right Side (5 Cols on desktop) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-[#101010]/85 border border-zinc-900 rounded-[2rem] p-7 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl relative flex flex-col justify-between overflow-hidden">
              {/* Premium Top border accent */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent"></div>

              {/* Login / Setup Tab selector */}
              <div className="flex bg-black/45 border border-zinc-900/45 p-1 rounded-xl mb-6 items-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(false);
                    setLoginError("");
                    setRegError("");
                    setRegSuccess("");
                  }}
                  className={`flex-1 py-2 text-xs font-serif font-black uppercase tracking-wider rounded-lg custom-transition cursor-pointer ${
                    !showRegisterForm
                      ? "bg-[#1c1c1c] text-[#D4AF37] shadow-inner"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  Acceder
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(true);
                    setLoginError("");
                    setRegError("");
                    setRegSuccess("");
                  }}
                  className={`flex-1 py-2 text-xs font-serif font-black uppercase tracking-wider rounded-lg custom-transition cursor-pointer ${
                    showRegisterForm
                      ? "bg-[#1c1c1c] text-[#D4AF37] shadow-inner"
                      : "text-zinc-500 hover:text-zinc-350"
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {!showRegisterForm ? (
                <>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] font-extrabold block">Control de Adeptos</span>
                      <h3 className="text-xl md:text-2xl font-serif text-white font-black mt-1 leading-tight">Acceder al Portal</h3>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal font-light">
                      Ingresa tus credenciales autorizadas del portal educativo para habilitar la biblioteca y herramientas.
                    </p>
                  </div>

                  {loginError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-[11px] text-red-400 flex items-center gap-2 font-medium">
                      <ShieldAlert size={14} className="shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4 mt-5">
                    <div className="space-y-1">
                      <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold">Correo de Iniciado (Email)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650">
                          <User size={13} />
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="ejemplo@mundoiyawo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl pl-9.5 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none custom-transition font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold">Contraseña Sagrada (Password)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                          <Lock size={13} />
                        </span>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl pl-9.5 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none custom-transition font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-110 active:scale-[0.99] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] text-black font-serif font-black tracking-widest text-xs uppercase py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/5 shrink-0"
                    >
                      {isLoggingIn ? (
                        <span className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
                          <span>ALINEANDO ENERGIAS...</span>
                        </span>
                      ) : (
                        <>
                          <span>Ingresar al Universo Yoruba</span>
                          <ChevronRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] font-extrabold block">Inscripción del Adepto</span>
                      <h3 className="text-xl md:text-2xl font-serif text-white font-black mt-1 leading-tight">Solicitar Acceso</h3>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal font-light">
                      Crea tu cuenta de estudiante. Su solicitud se enviará al Administrador Principal para su aprobación ritual.
                    </p>
                  </div>

                  {regError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-[11px] text-red-400 flex items-center gap-2 font-medium">
                      <ShieldAlert size={14} className="shrink-0" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {regSuccess && (
                    <div className="mt-4 p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-[11px] text-emerald-400 flex items-start gap-2.5 font-medium leading-relaxed">
                      <CheckCircle size={15} className="shrink-0 mt-0.5 text-emerald-400" />
                      <span>{regSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-5">
                    <div className="space-y-1">
                      <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold">Nombre de Iniciación o Alias</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650">
                          <User size={13} />
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Iyawo Nelson / Omo Ochun"
                          value={regNombre}
                          onChange={(e) => setRegNombre(e.target.value)}
                          className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl pl-9.5 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none custom-transition font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold">Correo de Iniciado (Email)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650">
                          <Mail size={13} />
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="ejemplo@mundoiyawo.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl pl-9.5 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none custom-transition font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold">Contraseña Sagrada (Password)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37]">
                          <Lock size={13} />
                        </span>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl pl-9.5 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none custom-transition font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-110 active:scale-[0.99] text-black font-serif font-black tracking-widest text-xs uppercase py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/5 shrink-0"
                    >
                      <span>Inscribirse ahora</span>
                      <ChevronRight size={14} />
                    </button>
                  </form>
                </>
              )}

              {/* Seamless instruction helper footer */}
              <div className="mt-5 pt-4 border-t border-[#242424]/40 text-center">
                <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider font-mono font-bold block bg-[#D4AF37]/5 py-1.5 px-3 rounded-lg border border-[#D4AF37]/15">
                  Admin Principal: neftali.pn.25@gmail.com / 122132
                </span>
              </div>
            </div>
          </div>

        </main>

        {/* Brand layout Footer */}
        <footer className="border-t border-[#242424]/40 py-6 relative z-10 bg-black/50 text-center">
          <p className="text-[10px] text-zinc-650 font-mono uppercase tracking-widest">
            MUNDO IYAWO © 2026 • Portal de Teología Histórica y Espiritual • Diseñado con Respeto
          </p>
        </footer>
      </div>
    );
  }

  // --- RENDERING SECURE LOGGED IN APPLICATION ---
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#6E44FF]/35 pb-16 flex flex-col justify-between">
      {/* Top Header / Brand banner - High-end Glassmorphic Look */}
      <header className="border-b border-[#242424] bg-[#050505]/75 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-4 flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4.5">
            {/* Elegant Golden Spiritual Emblem */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#181818] to-[#101010] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-serif font-bold text-lg sm:text-xl shadow-[0_0_15px_rgba(212,175,55,0.08)] shrink-0">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-xl md:text-2xl font-serif font-black tracking-widest text-white leading-none">
                  MUNDO IYAWO
                </h1>
              </div>
              <p className="text-[9px] sm:text-[11px] text-[#A0A0A0] mt-0.5 tracking-wide leading-none">
                Conocimiento que transforma <span className="hidden sm:inline">• Tradición que perdura</span>
              </p>
            </div>
          </div>

          {/* Quick status information & interactive logout / Online active indicators */}
          <div className="flex items-center gap-3 text-xs text-[#A0A0A0]">
            <div className="hidden md:flex items-center gap-2 bg-[#101010] border border-[#242424] px-4 py-1.5 rounded-full shadow-inner">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse"></span>
              <span className="font-mono text-[10px] text-zinc-300">Sábado, 13 de Junio de 2026</span>
            </div>
            
            {/* Logout trigger */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#181818] hover:bg-red-500/10 border border-[#242424] hover:border-red-500/40 p-2.5 sm:px-3.5 sm:py-1.5 rounded-xl text-zinc-400 hover:text-red-400 custom-transition text-[11px] font-semibold cursor-pointer shrink-0"
              title="Cerrar Sesión Educativa"
            >
              <LogOut size={13} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome banner - High-end Streaming Cover Vibe */}
      <section className="relative py-10 md:py-14 overflow-hidden border-b border-[#242424]/60">
        {/* Dynamic Glowing Spotlight Orbs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#6E44FF]/8 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#D4AF37]/6 rounded-full blur-[140px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-[#101010] border border-[#242424] rounded-[2.5rem] p-8 md:p-12 lg:p-14 flex flex-col lg:flex-row items-add lg:items-center justify-between gap-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Ambient reflective border flare */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-[#6E44FF]/20"></div>

            <div className="max-w-3xl space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] font-bold bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-3.5 py-1 rounded-full">
                  Estudios Ancestrales
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6E44FF]"></span>
                <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-400 font-medium">
                  BIBLIOTECA INTELIGENTE
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white font-extrabold leading-tight tracking-tight max-w-2xl bg-gradient-to-r from-white via-white to-[#E8C97A] bg-clip-text text-transparent">
                Descubre la Sabiduría Ancestral de los Orishas
              </h2>
              
              <p className="text-sm md:text-base text-[#A0A0A0] leading-relaxed max-w-2xl font-light">
                Aprende, estudia y profundiza en el conocimiento ancestral Yoruba mediante libros, videos, patakís, cantos, tratados y herramientas de consulta con el apoyo de nuestro Consultor IA.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0 w-full sm:w-auto mt-2 lg:mt-0">
              <button
                onClick={() => setActiveTab("oraculo")}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-110 active:scale-95 text-black px-6.5 py-3.5 rounded-xl text-xs font-serif font-black tracking-wider shadow-lg shadow-[#D4AF37]/15 custom-transition cursor-pointer"
              >
                <Sparkles size={15} />
                <span>Consultar Oráculo IA</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("orishas");
                  const el = document.getElementById("orishas-catalog");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 text-white bg-transparent px-6 py-3.5 rounded-xl text-xs font-serif font-bold tracking-wider custom-transition cursor-pointer"
              >
                <Compass size={14} className="text-[#D4AF37]" />
                <span>Explorar Biblioteca</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-8">
        {/* Navigation Categories Tabs - Desktop Only (MasterClass Style Container) */}
        <div className="hidden sm:flex items-center w-full gap-2 p-1.5 bg-[#101010] border border-[#242424] rounded-2xl shadow-xl">
          <button
            onClick={() => changeTab("orishas")}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 text-xs lg:text-sm font-serif font-bold rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "orishas"
                ? "bg-[#181818] text-[#D4AF37] border-[#D4AF37]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(212,175,55,0.06)]"
                : "bg-transparent text-[#A0A0A0] border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <Compass size={16} className={activeTab === "orishas" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
            <span>Orishas y Deidades</span>
          </button>

          <button
            onClick={() => changeTab("patakis")}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 text-xs lg:text-sm font-serif font-bold rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "patakis"
                ? "bg-[#181818] text-[#D4AF37] border-[#D4AF37]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(212,175,55,0.06)]"
                : "bg-transparent text-[#A0A0A0] border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen size={16} className={activeTab === "patakis" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
            <span>Patakis y Relatos</span>
          </button>

          <button
            onClick={() => changeTab("videos")}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 text-xs lg:text-sm font-serif font-bold rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "videos"
                ? "bg-[#181818] text-[#D4AF37] border-[#D4AF37]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(212,175,55,0.06)]"
                : "bg-transparent text-[#A0A0A0] border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <Video size={16} className={activeTab === "videos" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
            <span>Videos y Cantos</span>
          </button>

          <button
            onClick={() => changeTab("libros")}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 text-xs lg:text-sm font-serif font-bold rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "libros"
                ? "bg-[#181818] text-[#D4AF37] border-[#D4AF37]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(212,175,55,0.06)]"
                : "bg-transparent text-[#A0A0A0] border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <Bookmark size={16} className={activeTab === "libros" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
            <span>Libros y Tratados</span>
          </button>

          <button
            onClick={() => changeTab("espiritismo")}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 text-xs lg:text-sm font-serif font-bold rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "espiritismo"
                ? "bg-[#181818] text-[#D4AF37] border-[#D4AF37]/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(212,175,55,0.06)]"
                : "bg-transparent text-[#A0A0A0] border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <Heart size={16} className={activeTab === "espiritismo" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
            <span>Espiritismo</span>
          </button>

          <button
            onClick={() => changeTab("oraculo")}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 text-xs lg:text-sm font-serif font-bold rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer ${
              activeTab === "oraculo"
                ? "bg-[#6E44FF] text-white border-[#6E44FF] shadow-[0_4px_20px_rgba(110,68,255,0.3)] animate-pulse animate-duration-1000"
                : "bg-transparent text-[#A0A0A0] border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles size={16} className={activeTab === "oraculo" ? "text-white animate-spin" : "text-[#D4AF37]"} />
            <span>Consultor IA</span>
          </button>

          {currentUser?.role === "admin" && (
            <button
              onClick={() => changeTab("admin")}
              className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 text-xs lg:text-sm font-serif font-bold rounded-xl border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeTab === "admin"
                  ? "bg-[#6E44FF] text-white border-[#6E44FF] shadow-[0_4px_20px_rgba(110,68,255,0.3)]"
                  : "bg-transparent text-purple-400 border-transparent hover:text-purple-300 hover:bg-purple-900/10"
              }`}
            >
              <Shield size={16} className="text-[#D4AF37]" />
              <span>Portal Admin</span>
            </button>
          )}
        </div>

        {/* Navigation Categories Tabs - Mobile Only */}
        <div className="block sm:hidden space-y-4">
          <div className="text-[10px] uppercase tracking-widest text-[#A0A0A0] font-bold flex items-center justify-between px-1.5 font-mono">
            <span>Secciones del Templo</span>
            <span className="text-[#D4AF37] animate-pulse">•</span>
          </div>
          
          {/* Quick-access touchscreen-friendly 2x2 bento layout */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => changeTab("orishas")}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all text-xs cursor-pointer ${
                activeTab === "orishas"
                  ? "bg-[#181818] border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  : "bg-[#101010] border-[#242424] text-[#A0A0A0] active:bg-[#181818]"
              }`}
            >
              <Compass size={18} className={activeTab === "orishas" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
              <span className="font-serif font-bold truncate max-w-full">Orishas</span>
            </button>

            <button
              onClick={() => changeTab("patakis")}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all text-xs cursor-pointer ${
                activeTab === "patakis"
                  ? "bg-[#181818] border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  : "bg-[#101010] border-[#242424] text-[#A0A0A0] active:bg-[#181818]"
              }`}
            >
              <BookOpen size={18} className={activeTab === "patakis" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
              <span className="font-serif font-bold truncate max-w-full">Patakis</span>
            </button>

            <button
              onClick={() => changeTab("videos")}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all text-xs cursor-pointer ${
                activeTab === "videos"
                  ? "bg-[#181818] border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  : "bg-[#101010] border-[#242424] text-[#A0A0A0] active:bg-[#181818]"
              }`}
            >
              <Video size={18} className={activeTab === "videos" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
              <span className="font-serif font-bold truncate max-w-full">Videos</span>
            </button>

            <button
              onClick={() => changeTab("libros")}
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 transition-all text-xs cursor-pointer ${
                activeTab === "libros"
                  ? "bg-[#181818] border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  : "bg-[#101010] border-[#242424] text-[#A0A0A0] active:bg-[#181818]"
              }`}
            >
              <Bookmark size={18} className={activeTab === "libros" ? "text-[#D4AF37]" : "text-[#A0A0A0]"} />
              <span className="font-serif font-bold truncate max-w-full">Libros</span>
            </button>

            <button
              onClick={() => changeTab("espiritismo")}
              className={`col-span-2 p-4 rounded-xl border flex items-center justify-center text-center gap-2 transition-all text-xs cursor-pointer ${
                activeTab === "espiritismo"
                  ? "bg-[#181818] border-[#D4AF37]/50 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  : "bg-[#101010] border-[#242424] text-[#A0A0A0] active:bg-[#181818]"
              }`}
            >
              <Heart size={18} className={activeTab === "espiritismo" ? "text-[#D4AF37] fill-[#D4AF37]/10 animate-pulse" : "text-[#A0A0A0]"} />
              <span className="font-serif font-bold truncate max-w-full">Espiritismo Cruzado</span>
            </button>
          </div>

          {/* Glowing AI component prominent highlight bar */}
          <button
            onClick={() => changeTab("oraculo")}
            className={`w-full py-4 px-4 rounded-xl border flex items-center justify-center gap-2.5 transition-all text-xs cursor-pointer ${
              activeTab === "oraculo"
                ? "bg-gradient-to-r from-[#6E44FF]/30 via-[#6E44FF]/20 to-[#6E44FF]/10 border-[#6E44FF] text-white shadow-[0_0_20px_rgba(110,68,255,0.2)]"
                : "bg-[#101010] border-[#242424] text-[#D4AF37] active:bg-[#181818]"
            }`}
          >
            <Sparkles size={15} className={`shrink-0 ${activeTab === "oraculo" ? "animate-pulse text-white" : "text-[#D4AF37]"}`} />
            <span className="font-serif font-bold uppercase tracking-wider">Consultar Oráculo Especial IA</span>
          </button>

          {currentUser?.role === "admin" && (
            <button
              onClick={() => changeTab("admin")}
              className={`w-full py-4 px-4 rounded-xl border flex items-center justify-center gap-2.5 transition-all text-xs cursor-pointer ${
                activeTab === "admin"
                  ? "bg-[#6E44FF]/30 border-[#6E44FF] text-white shadow-[0_0_20px_rgba(110,68,255,0.2)]"
                  : "bg-[#101010] border-[#242424] text-purple-450 active:bg-[#181818]"
              }`}
            >
              <Shield size={15} className="shrink-0 text-purple-400" />
              <span className="font-serif font-bold uppercase tracking-wider">Portal Administrativo</span>
            </button>
          )}
        </div>

        {/* Tab Panel View */}
        <div id="main-tab-panel" className="bg-zinc-950/30 rounded-2xl border border-zinc-900/60 p-1 md:p-4">
          {activeTab === "admin" && currentUser?.role === "admin" && (
            <AdminSection 
              users={users} 
              onUpdateUsers={handleSaveUsers} 
              currentUserEmail={currentUser?.email || ""} 
            />
          )}

          {activeTab === "orishas" && (
            <OrishasSection orishas={orishas} setOrishas={setOrishas} saveOrishas={handleSaveOrishas} isAdmin={currentUser?.role === "admin"} />
          )}

          {activeTab === "patakis" && (
            <PatakisSection patakis={patakis} setPatakis={setPatakis} savePatakis={handleSavePatakis} isAdmin={currentUser?.role === "admin"} />
          )}

          {activeTab === "videos" && (
            <VideosSection videos={videos} setVideos={setVideos} saveVideos={handleSaveVideos} isAdmin={currentUser?.role === "admin"} />
          )}

          {activeTab === "libros" && (
            <BooksSection libros={libros} setLibros={setLibros} saveLibros={handleSaveLibros} isAdmin={currentUser?.role === "admin"} />
          )}

          {activeTab === "espiritismo" && (
            <EspiritismoSection guias={guias} setGuias={setGuias} saveGuias={handleSaveGuias} isAdmin={currentUser?.role === "admin"} />
          )}

          {activeTab === "oraculo" && (
            <div className="max-w-4xl mx-auto bg-[#0a0a0a] border border-[#242424] rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[710px] relative transition-all duration-300" id="oraculo-module">
              
              {/* ChatGPT styled Top Navigation Bar */}
              <div className="bg-[#0c0c0c]/98 px-6 py-4 border-b border-[#242424]/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Glowing core indicator */}
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37]/50 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D4AF37]"></span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-black tracking-widest text-white uppercase">Oráculo Especial IA</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#D4AF37]/10 text-[#E8C97A] border border-[#D4AF37]/20 font-mono font-bold">MundoIyawo-GPT4</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono tracking-wide">Consultor Teológico de la Tradición Afrocubana</p>
                  </div>
                </div>

                {/* Extra utility actions */}
                <div className="flex items-center gap-2">
                  {chatMessages.length > 0 && (
                    <button
                      onClick={handleClearChat}
                      className="flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider font-bold text-zinc-400 hover:text-red-400 bg-[#161616] hover:bg-black border border-[#242424] px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-300"
                      title="Nuevos lazos (Limpiar consulta)"
                    >
                      <Trash2 size={11} />
                      <span className="hidden sm:inline">Limpiar chat</span>
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 bg-[#121212] border border-[#242424] px-2.5 py-1 rounded-xl">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-[9px] font-mono tracking-wider font-bold text-zinc-400 uppercase">En línea</span>
                  </div>
                </div>
              </div>

              {/* Chat Thread / Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-gradient-to-b from-black to-[#080808]">
                {chatMessages.length === 0 ? (
                  /* Welcome home screen like ChatGPT */
                  <div className="h-full flex flex-col justify-center items-center text-center max-w-2xl mx-auto space-y-8 py-4">
                    <div className="space-y-3">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/20 to-[#E8C97A]/5 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-xl hover:scale-105 transition-transform duration-500 select-none">
                        <Sparkles size={26} className="animate-pulse" />
                      </div>
                      <h2 className="text-xl md:text-2xl font-serif font-black tracking-wide text-white">
                        ¿Qué misticismo deseas consultar hoy?
                      </h2>
                      <p className="text-xs text-zinc-450 max-w-md mx-auto leading-relaxed font-light">
                        El Consultor de Inteligencia Artificial está iniciado en la teología de la Regla de Osha-Ifá y el Palo Mayombe histórico. Haz clic en las sugerencias o escribe tu consulta.
                      </p>
                    </div>

                    {/* Classic starter prompt cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      {[
                        {
                          icon: <Compass className="text-[#D4AF37]" size={16} />,
                          title: "Teología de Deidades",
                          desc: "¿Quién es el Orisha Oshún y cuáles son sus caminos de bendición?",
                          color: "hover:border-[#D4AF37]/35 hover:shadow-[#D4AF37]/5"
                        },
                        {
                          icon: <BookOpen className="text-[#D4AF37]" size={16} />,
                          title: "Comparaciones Teológicas",
                          desc: "¿Cuál es la diferencia teológica entre la Regla de Osha y el Palo Mayombe?",
                          color: "hover:border-[#D4AF37]/35 hover:shadow-[#D4AF37]/5"
                        },
                        {
                          icon: <FolderOpen className="text-[#D4AF37]" size={16} />,
                          title: "Ofrendas y Tradición",
                          desc: "¿Qué ceremonias o comidas predilectas se le atribuyen a Obatalá?",
                          color: "hover:border-[#D4AF37]/35 hover:shadow-[#D4AF37]/5"
                        },
                        {
                          icon: <Sparkles className="text-[#D4AF37]" size={16} />,
                          title: "Simbología Sagrada",
                          desc: "¿Qué misticismo e historia esconde el Idefá de Orula en la tradición?",
                          color: "hover:border-[#D4AF37]/35 hover:shadow-[#D4AF37]/5"
                        }
                      ].map((card, cIdx) => (
                        <div
                          key={cIdx}
                          onClick={() => handleSendPromptSuggestion(card.desc)}
                          className={`bg-[#0d0d0d] border border-[#202020] rounded-2xl p-4 text-left custom-transition cursor-pointer group shadow-sm flex flex-col justify-between h-32 relative overflow-hidden ${card.color}`}
                        >
                          {/* Inner gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="flex items-center gap-2 relative z-10">
                            <div className="p-1 rounded-lg bg-[#141414] border border-white/5">
                              {card.icon}
                            </div>
                            <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-zinc-400 group-hover:text-white transition-colors">
                              {card.title}
                            </span>
                          </div>

                          <div className="mt-3 relative z-10 flex items-end justify-between">
                            <p className="text-[11px] md:text-[11.5px] text-zinc-400 font-serif leading-snug group-hover:text-white transition-colors line-clamp-3">
                              "{card.desc}"
                            </p>
                            <span className="text-[#D4AF37] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-350 shrink-0 text-xs pl-2">
                              →
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {isAiConfigured === false && (
                      <div className="p-3.5 bg-[#D4AF37]/5 border border-[#D4AF37]/15 rounded-2xl max-w-md w-full">
                        <span className="text-[10px] text-[#E8C97A] font-bold block mb-1">Clave de Inteligencia Artificial vacía</span>
                        <p className="text-[10px] text-zinc-400 leading-normal font-light">
                          Para respuestas dinámicas con el modelo Gemini, ingresa tu clave <code className="text-[#D4AF37] font-mono select-all">GEMINI_API_KEY</code> en la opción **Settings &gt; Secrets** del panel superior.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Messages Stream Column */
                  <div className="space-y-6 max-w-3xl mx-auto">
                    {chatMessages.map((msg, idx) => {
                      const isUser = msg.sender === "user";
                      return (
                        <div
                          key={idx}
                          className={`flex gap-4 p-4.5 rounded-2xl transition-all duration-300 ${
                            isUser
                              ? "bg-[#141414]/90 border border-white/5"
                              : "bg-[#1a1711]/25 border border-[#D4AF37]/10"
                          }`}
                        >
                          {/* Avatar Indicator */}
                          <div className="shrink-0">
                            {isUser ? (
                              <div className="w-8 h-8 rounded-full bg-zinc-855 text-zinc-200 border border-zinc-700 flex items-center justify-center font-serif text-sm font-bold uppercase shadow-inner">
                                {currentUser?.nombre?.[0] || "I"}
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/40 flex items-center justify-center font-serif text-xs font-bold shadow-[0_0_10px_rgba(212,175,55,0.15)]">
                                ★
                              </div>
                            )}
                          </div>

                          {/* Message Body Column */}
                          <div className="flex-1 space-y-2 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                                {isUser ? "Consultante" : "Oráculo de Sabiduría"}
                              </span>
                              <span className="text-[9px] font-mono text-zinc-650">
                                {msg.timestamp}
                              </span>
                            </div>

                            {/* Standard output block formatted */}
                            <div className="space-y-1.5 select-text selection:bg-[#D4AF37]/20">
                              {isUser ? (
                                <p className="text-zinc-200 text-sm leading-relaxed font-sans font-light">{msg.text}</p>
                              ) : (
                                formatMessageText(msg.text)
                              )}
                            </div>

                            {/* Message actions footer */}
                            {!isUser && (
                              <div className="pt-3 border-t border-[#242424]/40 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                  <span>Teología de Osha-Ifá</span>
                                  <span>•</span>
                                  <span>Canal verificado</span>
                                </div>
                                <button
                                  onClick={() => handleCopyMessage(msg.text, idx)}
                                  className="flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400 hover:text-[#D4AF37] py-1 px-2.5 hover:bg-black/40 rounded-lg custom-transition cursor-pointer border border-transparent hover:border-white/5"
                                >
                                  {copiedIndex === idx ? (
                                    <>
                                      <Check size={11} className="text-emerald-500" />
                                      <span className="text-emerald-400 font-bold">Copiado</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={11} />
                                      <span>Copiar respuesta</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Chat Loading state stylized */}
                    {isChatLoading && (
                      <div className="flex gap-4 p-4.5 rounded-2xl bg-[#1d1911]/15 border border-[#D4AF37]/10 animate-pulse">
                        <div className="shrink-0">
                          <div className="w-8 h-8 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/20 flex items-center justify-center text-xs shadow-inner animate-spin [animation-duration:12s]">
                            ★
                          </div>
                        </div>
                        <div className="flex-1 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest font-bold">Consultando caracoles místicos...</span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="h-3 w-40 bg-zinc-800 rounded-lg"></div>
                            <div className="h-3 w-64 bg-zinc-800 rounded-lg"></div>
                          </div>
                          <div className="flex gap-1.5 items-center justify-start h-4 py-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Chat Input Capsule Bar */}
              <div className="p-4 bg-gradient-to-t from-[#040404]/99 to-[#0c0c0c]/95 border-t border-[#242424]/80">
                <div className="max-w-3xl mx-auto space-y-2.5">
                  
                  {/* Suggestions trigger row directly above input if messages are present */}
                  {chatMessages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none select-none">
                      <button
                        onClick={handleClearChat}
                        className="text-[10px] font-mono text-zinc-400 hover:text-red-400 bg-black/40 border border-[#242424] px-2.5 py-1 rounded-lg shrink-0 hover:border-red-950/40 cursor-pointer"
                      >
                        🗑️ Limpiar Historial
                      </button>
                      <button
                        onClick={() => handleSendPromptSuggestion("¿Cuáles son los 16 Odus de Ifá principales?")}
                        className="text-[10px] font-mono text-zinc-400 hover:text-[#D4AF37] bg-black/40 border border-[#242424] hover:border-[#D4AF37]/30 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                      >
                        ✨ Odus de Ifá
                      </button>
                      <button
                        onClick={() => handleSendPromptSuggestion("¿Cómo se le atiende a Eleguá?")}
                        className="text-[10px] font-mono text-zinc-400 hover:text-[#D4AF37] bg-black/40 border border-[#242424] hover:border-[#D4AF37]/30 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                      >
                        🔑 Atenciones a Eleguá
                      </button>
                      <button
                        onClick={() => handleSendPromptSuggestion("¿Cuál es la función del Ebó en la santería?")}
                        className="text-[10px] font-mono text-zinc-400 hover:text-[#D4AF37] bg-black/40 border border-[#242424] hover:border-[#D4AF37]/30 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                      >
                        🛡️ Función del Ebó
                      </button>
                    </div>
                  )}

                  {/* Clean ChatGPT rounded input capsule */}
                  <form onSubmit={handleSendMessage} className="relative flex items-center pr-1 bg-black border border-[#242424] focus-within:border-[#D4AF37]/75 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300">
                    <input
                      type="text"
                      className="w-full bg-transparent px-5 py-4 text-xs tracking-wide text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50 font-sans"
                      placeholder="Haz una pregunta o consulta mística sobre Osha-Ifá..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      disabled={isChatLoading}
                    />
                    
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="mr-1.5 p-2 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:opacity-90 active:scale-95 text-black rounded-xl custom-transition shrink-0 cursor-pointer shadow-[0_2px_8px_rgba(212,175,55,0.2)] disabled:opacity-30 disabled:scale-100 disabled:pointer-events-none transition-all flex items-center justify-center font-bold"
                    >
                      <Send size={14} />
                    </button>
                  </form>

                  {/* Small subtitle notice info */}
                  <p className="text-[9.5px] text-center text-zinc-650 leading-normal">
                    El Oráculo de Mundo Iyawo es un consultor místico-educativo potenciado con Inteligencia Artificial. Siempre valida las consultas con mayores consagrados.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* Aesthetic Footer */}
      <footer className="mt-auto border-t border-[#242424] py-8 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2.5">
          <p className="text-[11px] text-zinc-500 font-serif italic tracking-wide">
            “Maferefún todos los Orishas todos los días de la vida. Que la paz y la salud reinen en tu cabeza espiritual.”
          </p>
          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
            Portal Educativo de Teología Afrocubana © 2026. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
