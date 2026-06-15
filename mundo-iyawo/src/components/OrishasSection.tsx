import React, { useState, useEffect } from "react";
import { Orisha } from "../types";
import { PlusCircle, Edit3, Trash2, X, Sparkles, BookOpen, Layers, Compass, ArrowUpRight, Palette, Sliders } from "lucide-react";

// Predefined Premium Sacred Color Schemes for Yoruba & Congo Entities
export const COLOR_SCHEMES = [
  { 
    id: "rojo_negro", 
    name: "🔴⚫ Rojo y Negro (Elegguá, Lucero Mundo, Guerreros)", 
    bg: "bg-gradient-to-br from-[#1c0202] via-[#080808] to-black", 
    border: "border-[#e74c3c]/35", 
    hoverBorder: "hover:border-[#ff3333]", 
    text: "text-red-400", 
    glow: "shadow-[0_0_20px_rgba(231,76,60,0.12)]",
    colors: "Rojo y Negro" 
  },
  { 
    id: "blanco", 
    name: "⚪ Blanco y Plata (Obatalá, Tiembla Tierra, Osun)", 
    bg: "bg-gradient-to-br from-[#121212] via-[#1c1c1c] to-black", 
    border: "border-zinc-500/35", 
    hoverBorder: "hover:border-white", 
    text: "text-zinc-200", 
    glow: "shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    colors: "Blanco puro" 
  },
  { 
    id: "rojo_blanco", 
    name: "🔴⚪ Rojo y Blanco (Changó, Siete Rayos, Ibeyis)", 
    bg: "bg-gradient-to-br from-[#1f0201] via-[#080808] to-black", 
    border: "border-red-500/25", 
    hoverBorder: "hover:border-[#e74c3c]", 
    text: "text-red-350", 
    glow: "shadow-[0_0_20px_rgba(231,76,60,0.08)]",
    colors: "Rojo y Blanco" 
  },
  { 
    id: "azul_blanco", 
    name: "🔵⚪ Azul y Blanco (Yemayá, Madre de Agua, Olokun)", 
    bg: "bg-gradient-to-br from-[#021c3d] via-[#080808] to-black", 
    border: "border-blue-500/30", 
    hoverBorder: "hover:border-[#3b82f6]", 
    text: "text-blue-300", 
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]",
    colors: "Azul y Blanco" 
  },
  { 
    id: "oro_amarillo", 
    name: "🟡🍯 Amarillo y Oro (Ochún, Caridad)", 
    bg: "bg-gradient-to-br from-[#241a02] via-[#080808] to-black", 
    border: "border-amber-500/35", 
    hoverBorder: "hover:border-[#D4AF37]", 
    text: "text-[#D4AF37]", 
    glow: "shadow-[0_0_20px_rgba(212,175,55,0.12)]",
    colors: "Amarillo y Oro" 
  },
  { 
    id: "verde_negro", 
    name: "🟢⚫ Verde y Negro (Oggún, Sarabanda, Monte)", 
    bg: "bg-gradient-to-br from-[#021f0a] via-[#080808] to-black", 
    border: "border-emerald-500/25", 
    hoverBorder: "hover:border-emerald-400", 
    text: "text-emerald-400", 
    glow: "shadow-[0_0_20px_rgba(46,204,113,0.1)]",
    colors: "Verde y Negro" 
  },
  { 
    id: "verde_amarillo", 
    name: "🟢🟡 Verde y Amarillo (Orula, Ifá)", 
    bg: "bg-gradient-to-br from-[#0a1e0c] via-[#1c1802] to-black", 
    border: "border-yellow-600/30", 
    hoverBorder: "hover:border-yellow-400", 
    text: "text-yellow-400/90", 
    glow: "shadow-[0_0_20px_rgba(163,127,5,0.12)]",
    colors: "Verde y Amarillo" 
  },
  { 
    id: "marron_9colores", 
    name: "🟤🌈 Marrón y Colores (Oyá, Centella, Aggayú)", 
    bg: "bg-gradient-to-br from-[#240c06] via-[#1c0818] to-black", 
    border: "border-purple-500/25", 
    hoverBorder: "hover:border-pink-500", 
    text: "text-pink-400/90", 
    glow: "shadow-[0_0_20px_rgba(236,72,153,0.1)]",
    colors: "Marrón y 9 Colores" 
  },
  { 
    id: "morado", 
    name: "🟣🟡 Morado y Paja (Babalú Ayé, San Lázaro)", 
    bg: "bg-gradient-to-br from-[#1b0324] via-[#080808] to-black", 
    border: "border-purple-500/30", 
    hoverBorder: "hover:border-purple-400", 
    text: "text-purple-400", 
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.1)]",
    colors: "Morado y Amarillo Pajizo" 
  }
];

// Predefined Cartoon animated icons / emojis representing spiritual weapons and elements
export const ANIMATED_ICONS = [
  { id: "key_pulse", emoji: "🔑", name: "Llave del Monte (Abre caminos - Elegguá)", animationClass: "animate-bounce" },
  { id: "door_glowing", emoji: "🚪", name: "Puerta del Portal (Destino y Osha)", animationClass: "animate-pulse" },
  { id: "dove_floating", emoji: "🕊️", name: "Paloma de Paz (Pureza divina - Obatalá)", animationClass: "animate-pulse Scale-110" },
  { id: "lightning_strike", emoji: "⚡", name: "Rayo Abrasador (Hierba y Trueno - Changó)", animationClass: "animate-pulse duration-100 focus:scale-125" },
  { id: "wave_tide", emoji: "🌊", name: "Olas de Mar (Madre universal - Yemayá)", animationClass: "animate-pulse" },
  { id: "honey_jar", emoji: "🍯", name: "Abundancia y Dulzura (Copa y Miel - Ochún)", animationClass: "animate-bounce" },
  { id: "machete_iron", emoji: "⚔️", name: "Machete de Hierro (Trabajo continuo - Oggún)", animationClass: "animate-pulse" },
  { id: "arrow_hunter", emoji: "🏹", name: "Arco del Cazador (Flecha - Ochosi)", animationClass: "animate-bounce" },
  { id: "wind_whirl", emoji: "🌀", name: "Remolino y Tormenta (Paso de Almas - Oyá)", animationClass: "animate-spin [animation-duration:12s]" },
  { id: "cross_glowing", emoji: "✝️", name: "Cruz de Plata (Misa y Bóveda Espiritual)", animationClass: "animate-pulse" },
  { id: "fish_lucky", emoji: "🐟", name: "Pez de Río Sagrado (Salud y Doctrina - Inle)", animationClass: "animate-bounce" },
  { id: "star_glowing", emoji: "⭐", name: "Estrella del Monte (Guía de Luz)", animationClass: "animate-pulse text-yellow-400" },
  { id: "ghost_avatar", emoji: "💀", name: "Nfumbi / Ancestro (Fuerza de Palo Congo)", animationClass: "animate-pulse" },
  { id: "twin_boys", emoji: "👦👦", name: "Jimaguas de la Suerte (Ibeyis)", animationClass: "animate-bounce" }
];

export const getOrishaStyle = (orisha: Orisha) => {
  const normId = orisha.id.toLowerCase();
  const normColors = (orisha.colores || "").toLowerCase();

  if (orisha.colorSchemeId) {
    const found = COLOR_SCHEMES.find(c => c.id === orisha.colorSchemeId);
    if (found) return found;
  }

  // Backwards compatibility heuristics
  if (normId.includes("eleggua") || normId.includes("lucero") || normColors.includes("rojo y negro")) {
    return COLOR_SCHEMES[0];
  } else if (normId.includes("obatala") || normId.includes("tiembla") || normId.includes("osun") || normColors.includes("blanco")) {
    return COLOR_SCHEMES[1];
  } else if (normId.includes("chango") || normId.includes("siete") || normId.includes("ibeyi") || normColors.includes("rojo y blanco")) {
    return COLOR_SCHEMES[2];
  } else if (normId.includes("yemaya") || normId.includes("madre") || normId.includes("olokun") || normColors.includes("azul")) {
    return COLOR_SCHEMES[3];
  } else if (normId.includes("ochun") || normColors.includes("amarillo") || normColors.includes("oro")) {
    return COLOR_SCHEMES[4];
  } else if (normId.includes("oggun") || normId.includes("sarabanda") || normColors.includes("verde y negro")) {
    return COLOR_SCHEMES[5];
  } else if (normId.includes("orula") || normColors.includes("verde y amarillo")) {
    return COLOR_SCHEMES[6];
  } else if (normId.includes("oya") || normId.includes("centella") || normColors.includes("marrón")) {
    return COLOR_SCHEMES[7];
  } else if (normId.includes("babalu") || normColors.includes("morado")) {
    return COLOR_SCHEMES[8];
  }
  
  return COLOR_SCHEMES[1]; // Fallback to Elegant Silver/White
};

export const getOrishaIcon = (orisha: Orisha) => {
  if (orisha.animatedIconId) {
    const found = ANIMATED_ICONS.find(i => i.id === orisha.animatedIconId);
    if (found) return found;
  }

  const normId = orisha.id.toLowerCase();
  // Backwards compatibility heuristics
  if (normId.includes("eleggua") || normId.includes("lucero")) {
    return ANIMATED_ICONS[0]; // Llave
  } else if (normId.includes("obatala") || normId.includes("tiembla") || normId.includes("osun")) {
    return ANIMATED_ICONS[2]; // Paloma
  } else if (normId.includes("chango") || normId.includes("siete")) {
    return ANIMATED_ICONS[3]; // Rayo
  } else if (normId.includes("yemaya") || normId.includes("madre") || normId.includes("olokun")) {
    return ANIMATED_ICONS[4]; // Ola
  } else if (normId.includes("ochun")) {
    return ANIMATED_ICONS[5]; // Miel
  } else if (normId.includes("oggun") || normId.includes("sarabanda")) {
    return ANIMATED_ICONS[6]; // Machete
  } else if (normId.includes("orula")) {
    return ANIMATED_ICONS[6]; // Green / Tablero
  } else if (normId.includes("oya") || normId.includes("centella")) {
    return ANIMATED_ICONS[8]; // Remolino
  } else if (normId.includes("ochosi")) {
    return ANIMATED_ICONS[7]; // Flecha
  } else if (normId.includes("babalu")) {
    return ANIMATED_ICONS[12]; // Nfumbi or cross
  } else if (normId.includes("inle")) {
    return ANIMATED_ICONS[10]; // Pez
  } else if (normId.includes("ibeyi")) {
    return ANIMATED_ICONS[13]; // twins
  }
  
  return ANIMATED_ICONS[11]; // Glow gold star
};

interface OrishasSectionProps {
  orishas: Orisha[];
  setOrishas: React.Dispatch<React.SetStateAction<Orisha[]>>;
  saveOrishas: (data: Orisha[]) => void;
  isAdmin?: boolean;
}

export default function OrishasSection({ orishas, setOrishas, saveOrishas, isAdmin }: OrishasSectionProps) {
  const [selectedOrisha, setSelectedOrisha] = useState<Orisha | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pantheonFilter, setPantheonFilter] = useState<string>("todos");
  
  // Form State for Adding / Editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrisha, setEditingOrisha] = useState<Orisha | null>(null);

  // Form Fields
  const [nombre, setNombre] = useState("");
  const [sincretismo, setSincretismo] = useState("");
  const [colores, setColores] = useState("");
  const [herramientas, setHerramientas] = useState("");
  const [ofrendas, setOfrendas] = useState("");
  const [numero, setNumero] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [panteon, setPanteon] = useState<"Santería" | "Ifá" | "Palo Mayombe">("Santería");
  const [linea, setLinea] = useState("");
  const [fechaCelebracion, setFechaCelebracion] = useState("");
  const [colorSchemeId, setColorSchemeId] = useState("rojo_negro");
  const [animatedIconId, setAnimatedIconId] = useState("key_pulse");
  const [customIconUrl, setCustomIconUrl] = useState("");

  // Quick Inline Editor Popup state
  const [quickEditOrisha, setQuickEditOrisha] = useState<Orisha | null>(null);
  const [quickColorId, setQuickColorId] = useState("rojo_negro");
  const [quickIconId, setQuickIconId] = useState("key_pulse");
  const [quickUrl, setQuickUrl] = useState("");

  // Sync Quick Edit initial loaded values
  useEffect(() => {
    if (quickEditOrisha) {
      setQuickColorId(quickEditOrisha.colorSchemeId || getOrishaStyle(quickEditOrisha).id);
      setQuickIconId(quickEditOrisha.animatedIconId || getOrishaIcon(quickEditOrisha).id);
      setQuickUrl(quickEditOrisha.customIconUrl || quickEditOrisha.imagenUrl || "");
    }
  }, [quickEditOrisha]);

  const openAddForm = () => {
    setEditingOrisha(null);
    setNombre("");
    setSincretismo("");
    setColores("");
    setHerramientas("");
    setOfrendas("");
    setNumero("");
    setDescripcion("");
    setPanteon("Santería");
    setLinea("");
    setFechaCelebracion("");
    setColorSchemeId("rojo_negro");
    setAnimatedIconId("key_pulse");
    setCustomIconUrl("");
    setIsFormOpen(true);
  };

  const openEditForm = (orisha: Orisha, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingOrisha(orisha);
    setNombre(orisha.nombre);
    setSincretismo(orisha.sincretismo);
    setColores(orisha.colores);
    setHerramientas(orisha.herramientas);
    setOfrendas(orisha.ofrendas);
    setNumero(String(orisha.numero));
    setDescripcion(orisha.descripcion);
    setPanteon(orisha.panteon);
    setLinea(orisha.linea);
    setFechaCelebracion(orisha.fechaCelebracion || "");
    setColorSchemeId(orisha.colorSchemeId || getOrishaStyle(orisha).id);
    setAnimatedIconId(orisha.animatedIconId || getOrishaIcon(orisha).id);
    setCustomIconUrl(orisha.customIconUrl || orisha.imagenUrl || "");
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editingOrisha) {
      // Modify
      const updatedList = orishas.map((o) =>
        o.id === editingOrisha.id
          ? {
              ...o,
              nombre,
              sincretismo,
              colores,
              herramientas,
              ofrendas,
              numero,
              descripcion,
              panteon,
              linea,
              fechaCelebracion,
              colorSchemeId,
              animatedIconId,
              customIconUrl,
            }
          : o
      );
      setOrishas(updatedList);
      saveOrishas(updatedList);
      
      // Update selected orisha view if open
      if (selectedOrisha?.id === editingOrisha.id) {
        setSelectedOrisha({
          ...selectedOrisha,
          nombre,
          sincretismo,
          colores,
          herramientas,
          ofrendas,
          numero,
          descripcion,
          panteon,
          linea,
          fechaCelebracion,
          colorSchemeId,
          animatedIconId,
          customIconUrl,
        });
      }
    } else {
      // Create (mound)
      const newOrisha: Orisha = {
        id: "orisha_" + Date.now(),
        nombre,
        sincretismo,
        colores,
        herramientas,
        ofrendas,
        numero,
        descripcion,
        panteon,
        linea: linea || "Iniciado",
        fechaCelebracion,
        colorSchemeId,
        animatedIconId,
        customIconUrl,
      };
      const updatedList = [newOrisha, ...orishas];
      setOrishas(updatedList);
      saveOrishas(updatedList);
    }
    setIsFormOpen(false);
  };

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditOrisha) return;

    const updatedList = orishas.map((o) =>
      o.id === quickEditOrisha.id
        ? {
            ...o,
            colorSchemeId: quickColorId,
            animatedIconId: quickIconId,
            customIconUrl: quickUrl,
          }
        : o
    );

    setOrishas(updatedList);
    saveOrishas(updatedList);

    // Sync selected panel view
    if (selectedOrisha?.id === quickEditOrisha.id) {
      setSelectedOrisha({
        ...selectedOrisha,
        colorSchemeId: quickColorId,
        animatedIconId: quickIconId,
        customIconUrl: quickUrl,
      });
    }

    setQuickEditOrisha(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este Orisha/Entidad de tu portal educativo?")) {
      const updatedList = orishas.filter((o) => o.id !== id);
      setOrishas(updatedList);
      saveOrishas(updatedList);
      if (selectedOrisha?.id === id) {
        setSelectedOrisha(null);
      }
    }
  };

  const filtered = orishas.filter((o) => {
    const matchesSearch =
      o.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.sincretismo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPantheon =
      pantheonFilter === "todos" || o.panteon === pantheonFilter;
    return matchesSearch && matchesPantheon;
  });

  return (
    <div className="space-y-6" id="orishas-catalog">
      {/* Filters and search Header - Absolute Premium Class */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-[#101010] p-6 rounded-2xl border border-[#242424] shadow-2xl backdrop-blur-xl">
        <div className="flex flex-wrap gap-2.5">
          {["todos", "Santería", "Ifá", "Palo Mayombe"].map((p) => (
            <button
              key={p}
              onClick={() => setPantheonFilter(p)}
              className={`px-5 py-2.5 text-xs font-serif font-bold rounded-xl border custom-transition cursor-pointer ${
                pantheonFilter === p
                  ? "bg-[#181818] text-[#D4AF37] border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                  : "bg-transparent text-[#A0A0A0] border-[#242424] hover:text-white hover:border-[#D4AF37]/35"
              }`}
            >
              {p === "todos" ? "Todos los Cultos" : p}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Buscar por nombre, sincretismo, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black border border-[#242424] rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37] w-full lg:w-72 custom-transition"
          />
          {isAdmin && (
            <button
              onClick={openAddForm}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:opacity-90 active:scale-95 text-black px-5 py-2.5 rounded-xl text-xs font-serif font-black tracking-wider shadow-lg shadow-[#D4AF37]/10 custom-transition cursor-pointer shrink-0"
            >
              <PlusCircle size={15} />
              <span>Montar Deidad / Orisha</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Buttons ("Botonera") */}
        <div className={`lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 lg:h-[650px] lg:overflow-y-auto pr-2 scrollbar-thin ${selectedOrisha ? "hidden lg:grid" : "grid"}`}>
          {filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-14 text-center bg-[#101010] rounded-2xl border border-dashed border-[#242424]">
              <Sparkles className="text-zinc-650 mb-3 animate-pulse" size={36} />
              <p className="text-xs font-medium text-[#A0A0A0]">
                Ninguna deidad o Mpungo coincide con tu búsqueda o filtros actuales.
              </p>
              {isAdmin && (
                <button
                  onClick={openAddForm}
                  className="mt-4 text-xs text-[#D4AF37] hover:brightness-110 font-semibold"
                >
                  Crea uno nuevo ahora
                </button>
              )}
            </div>
          ) : (
            filtered.map((orisha) => {
              const style = getOrishaStyle(orisha);
              const isSelected = selectedOrisha?.id === orisha.id;

              return (
                <div
                  key={orisha.id}
                  onClick={() => setSelectedOrisha(orisha)}
                  className={`group relative p-3.5 rounded-xl border flex items-center justify-center text-center cursor-pointer custom-transition overflow-hidden min-h-[72px] md:min-h-[80px] ${style.bg} ${style.border} ${style.glow} hover:scale-[1.025] ${
                    isSelected ? "ring-2 ring-[#D4AF37] border-transparent shadow-[0_0_20px_rgba(212,175,55,0.25)]" : style.hoverBorder
                  }`}
                >
                  {/* Subtle decorative framing layout inside the button card */}
                  <div className="absolute inset-0 bg-black/35 pointer-events-none"></div>
                  <div className="absolute inset-1.5 border border-white/5 rounded-lg pointer-events-none group-hover:border-white/10 custom-transition"></div>

                  {/* Deidad Name Only on the Button (Sacred Colors text styling) */}
                  <div className="relative z-10 w-full px-2">
                    <span className={`block font-serif font-extrabold tracking-wide text-xs sm:text-xs md:text-sm uppercase leading-tight group-hover:text-white transition-colors duration-200 group-hover:scale-105 transform custom-transition ${style.text}`}>
                      {orisha.nombre}
                    </span>
                  </div>

                  {/* Small Admin Tools Trigger On Hover to Delete/Edit */}
                  {isAdmin && (
                    <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 z-20 custom-transition" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => openEditForm(orisha, e)}
                        title="Editar Deidad"
                        className="p-1 text-zinc-400 hover:text-[#D4AF37] custom-transition rounded bg-black/80 border border-white/5"
                      >
                        <Edit3 size={10} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(orisha.id, e)}
                        title="Eliminar Deidad"
                        className="p-1 text-zinc-400 hover:text-[#E74C3C] custom-transition rounded bg-black/80 border border-white/5"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Selected Orisha Detail Panel */}
        <div className={`bg-[#101010] border border-[#242424] rounded-2xl p-6 lg:h-[650px] lg:overflow-y-auto flex flex-col shadow-2xl relative lg:col-span-1 ${selectedOrisha ? "flex" : "hidden lg:flex"}`}>
          {selectedOrisha && (
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Back button for mobile */}
                <button
                  onClick={() => setSelectedOrisha(null)}
                  className="lg:hidden flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#E8C97A] mb-5 bg-[#181818] border border-[#242424] px-4 py-2 rounded-xl cursor-pointer custom-transition font-bold font-serif"
                >
                  ← Volver a la lista
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] font-bold bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-3 py-1 rounded-full">
                    Ficha de Aprendizaje YAWO
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6E44FF]"></span>
                </div>
                
                <h2 className="text-3xl font-serif text-white font-extrabold mt-4 leading-tight">
                  {selectedOrisha.nombre}
                </h2>

                {/* Animated graphic / Icon presentation container inside the detail file sheet */}
                <div className="flex items-center gap-4 my-5 p-4 bg-[#050505] rounded-2xl border border-[#242424] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none"></div>
                  
                  {/* Current Icon or Image Preview */}
                  <div className="w-14 h-14 rounded-full bg-[#101010] border-2 border-[#D4AF37]/40 flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg shadow-black/80">
                    {selectedOrisha.customIconUrl || selectedOrisha.imagenUrl ? (
                      <img 
                        src={selectedOrisha.customIconUrl || selectedOrisha.imagenUrl} 
                        alt={selectedOrisha.nombre} 
                        className="w-full h-full object-cover rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className={`text-3xl select-none leading-none ${getOrishaIcon(selectedOrisha).animationClass || "animate-pulse"}`}>
                        {getOrishaIcon(selectedOrisha).emoji}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 block font-semibold">Atributos Religiosos</span>
                    {isAdmin ? (
                      <button
                        onClick={() => setQuickEditOrisha(selectedOrisha)}
                        className="bg-[#181818] hover:bg-black border border-[#242424] hover:border-[#D4AF37]/50 text-[#D4AF37] hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold tracking-wide custom-transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>🎨 Personalizar Icono / Color</span>
                        <ArrowUpRight size={10} />
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-400 font-serif">Mundo Iyawo</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 my-5">
                  <div className="bg-[#050505] p-3.5 rounded-xl border border-[#242424] font-sans">
                    <span className="text-[10px] text-[#A0A0A0] uppercase block tracking-wider font-semibold font-mono">Sincretismo</span>
                    <span className="text-xs font-semibold text-white/95 mt-1 block">{selectedOrisha.sincretismo || "Tradic. Hermética"}</span>
                  </div>
                  <div className="bg-[#050505] p-3.5 rounded-xl border border-[#242424] font-sans">
                    <span className="text-[10px] text-[#A0A0A0] uppercase block tracking-wider font-semibold font-mono">Colores Sagrados</span>
                    <span className="text-xs font-semibold text-white/95 mt-1 block">{selectedOrisha.colores || "No especificado"}</span>
                  </div>
                  <div className="bg-[#050505] p-3.5 rounded-xl border border-[#242424] font-sans">
                    <span className="text-[10px] text-[#A0A0A0] uppercase block tracking-wider font-semibold font-mono">Signo / Número</span>
                    <span className="text-xs font-mono font-black text-[#D4AF37] mt-1 block">{selectedOrisha.numero || "No especificado"}</span>
                  </div>
                  <div className="bg-[#050505] p-3.5 rounded-xl border border-[#242424] font-sans">
                    <span className="text-[10px] text-[#A0A0A0] uppercase block tracking-wider font-semibold font-mono">Culto Origen</span>
                    <span className="text-xs font-semibold text-white/95 mt-1 block truncate">{selectedOrisha.panteon} / {selectedOrisha.linea}</span>
                  </div>
                  <div className="bg-[#181818] p-4 rounded-xl border border-[#D4AF37]/30 col-span-2 flex items-center justify-between font-sans shadow-lg shadow-[#D4AF37]/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-xl pointer-events-none"></div>
                    <div>
                      <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-widest block font-extrabold">📅 Día de Celebración</span>
                      <span className="text-sm font-serif font-black text-white mt-1.5 block leading-none">{selectedOrisha.fechaCelebracion || "No especificado o tradicional"}</span>
                    </div>
                    <span className="text-[#D4AF37] text-2xl animate-pulse">✨</span>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="font-serif font-bold text-[#D4AF37] mb-1.5 hover:text-[#E8C97A] flex items-center gap-1.5">
                      <Layers size={13} className="text-[#6E44FF]" /> Herramientas y Atributos:
                    </h4>
                    <p className="text-white/85 leading-relaxed bg-[#050505] p-3 rounded-lg border border-[#242424]">
                      {selectedOrisha.herramientas || "Sin herramientas específicas catalogadas."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-[#D4AF37] mb-1.5 hover:text-[#E8C97A] flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#6E44FF]" /> Ofrendas Comunes (Addimú):
                    </h4>
                    <p className="text-white/85 leading-relaxed bg-[#050505] p-3 rounded-lg border border-[#242424]">
                      {selectedOrisha.ofrendas || "Sin ofrendas sugeridas registradas."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-[#D4AF37] mb-1.5 hover:text-[#E8C97A] flex items-center gap-1.5">
                      <BookOpen size={13} className="text-[#6E44FF]" /> Doctrinas y Significado:
                    </h4>
                    <p className="text-[#A0A0A0] leading-relaxed whitespace-pre-line bg-[#050505] p-3.5 rounded-lg border border-[#242424] font-light">
                      {selectedOrisha.descripcion}
                    </p>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="mt-8 pt-5 border-t border-[#242424] flex gap-4">
                  <button
                    onClick={(e) => openEditForm(selectedOrisha, e)}
                    className="flex-1 py-3 rounded-xl text-center text-xs font-serif font-black tracking-wide bg-[#181818] hover:bg-[#202020] text-[#D4AF37] border border-[#D4AF37]/45 hover:border-[#D4AF37] cursor-pointer shadow-md custom-transition"
                  >
                    Modificar Registro completo
                  </button>
                  <button
                    onClick={(e) => handleDelete(selectedOrisha.id, e)}
                    className="px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#E74C3C]/10 text-[#E74C3C] border border-[#E74C3C]/30 hover:bg-[#E74C3C]/20 hover:text-white cursor-pointer custom-transition"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          )}

          {!selectedOrisha && (
            <div className="flex flex-col items-center justify-center h-full text-center text-[#A0A0A0] py-16 px-4">
              <div className="w-16 h-16 rounded-2xl bg-[#181818] border border-[#242424] flex items-center justify-center mb-4 relative shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#6E44FF]/20 to-[#D4AF37]/15 rounded-2xl blur opacity-30"></div>
                <BookOpen size={22} className="text-[#D4AF37] relative z-10 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold font-serif text-white tracking-widest uppercase">Ningún Orisha Seleccionado</h4>
              <p className="text-xs text-[#A0A0A0] max-w-[240px] mt-2 leading-relaxed font-light">
                Toca cualquier botón de deidad de la botonería para abrir su ficha teológica de estudio interactivo.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QUICK INLINE ATTRIBUTES EDITOR MODAL (POPUP) */}
      {quickEditOrisha && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-[#242424] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setQuickEditOrisha(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-xl font-serif text-white font-black mb-5 flex items-center gap-2">
              <Palette className="text-[#D4AF37]" size={20} />
              <span>Personalizar Botonera: {quickEditOrisha.nombre}</span>
            </h3>

            <form onSubmit={handleQuickSave} className="space-y-5">
              {/* Sacred Colors Grid Selection */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-bold">1. Selecciona su Color Sagrado de Fondo</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                  {COLOR_SCHEMES.map((scheme) => (
                    <button
                      type="button"
                      key={scheme.id}
                      onClick={() => setQuickColorId(scheme.id)}
                      className={`p-2 rounded-xl border text-left text-[11px] font-sans font-semibold flex items-center gap-2 custom-transition cursor-pointer ${scheme.bg} ${scheme.border} ${
                        quickColorId === scheme.id ? "ring-2 ring-[#D4AF37] border-white" : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${scheme.text} bg-black/50 shrink-0 border border-white/10`}></span>
                      <span className="truncate text-white">{scheme.name.replace(/^(🔴|⚫|⚪|🔵|🟡|🟢|🟤|🟣)+/, "").trim()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Animated preset Icons list */}
              <div className="space-y-2">
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-bold">2. Selecciona su Ícono Animado</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                  {ANIMATED_ICONS.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setQuickIconId(item.id)}
                      className={`p-2.5 rounded-xl bg-black border text-center flex flex-col items-center justify-center gap-1.5 custom-transition cursor-pointer hover:bg-[#181818] ${
                        quickIconId === item.id ? "border-[#D4AF37] ring-1 ring-[#D4AF37]" : "border-[#242424]"
                      }`}
                      title={item.name}
                    >
                      <span className={`text-2xl ${item.animationClass}`}>{item.emoji}</span>
                      <span className="text-[8px] font-mono truncate max-w-full text-zinc-400">{item.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Animated URL option */}
              <div className="space-y-1.5">
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-bold">3. ¿O prefieres un GIF o Imagen personalizada? (URL)</label>
                <input
                  type="text"
                  placeholder="Introduce enlace de imagen animada..."
                  value={quickUrl}
                  onChange={(e) => setQuickUrl(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
                <span className="text-[9px] text-zinc-500 font-sans block leading-normal">
                  Pega cualquier URL de imagen o GIF animado de internet. Se mostrará en lugar del ícono seleccionado arriba.
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#242424]/40">
                <button
                  type="button"
                  onClick={() => setQuickEditOrisha(null)}
                  className="px-4 py-2 text-xs font-serif text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-110 active:scale-95 text-black px-6 py-2.5 rounded-xl text-xs font-serif font-black tracking-wider shadow-lg shadow-[#D4AF37]/10 custom-transition cursor-pointer"
                >
                  Guardar Apariencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-over or Modal form for Adding / Editing */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-[#242424] rounded-2xl w-full max-w-xl p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-xl md:text-2xl font-serif text-white font-black mb-4 flex items-center gap-2">
              <Sparkles className="text-[#D4AF37]" size={18} />
              <span>{editingOrisha ? `Modificar Entidad: ${editingOrisha.nombre}` : "Añadir Nuevo Orisha / Mpungo"}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Nombre Religioso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Obatala, Siete Rayos"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Panteón / Tradición</label>
                  <select
                    value={panteon}
                    onChange={(e) => setPanteon(e.target.value as any)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1rem',
                      paddingRight: '2rem'
                    }}
                  >
                    <option value="Santería" className="bg-[#101010]">Santería (Osha)</option>
                    <option value="Ifá" className="bg-[#101010]">Ifá (Oráculo)</option>
                    <option value="Palo Mayombe" className="bg-[#101010]">Palo Mayombe (Congo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Sincretismo Católico</label>
                  <input
                    type="text"
                    placeholder="Ej. Virgen de las Mercedes"
                    value={sincretismo}
                    onChange={(e) => setSincretismo(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Línea o Clasificación</label>
                  <input
                    type="text"
                    placeholder="Ej. Cabecera, Guerreros, Mpungo"
                    value={linea}
                    onChange={(e) => setLinea(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Colores Sagrados (Texto)</label>
                  <input
                    type="text"
                    placeholder="Ej. Rojo y Negro, Blanco"
                    value={colores}
                    onChange={(e) => setColores(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Número Sagrado / Odun</label>
                  <input
                    type="text"
                    placeholder="Ej. 3, 7, 8, 16"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* SACRED PALETTE AND ANIMATION SELECTORS INSIDE FULL FORM */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Perfil de Color de la Botonera</label>
                  <select
                    value={colorSchemeId}
                    onChange={(e) => setColorSchemeId(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1rem',
                      paddingRight: '2rem'
                    }}
                  >
                    {COLOR_SCHEMES.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#101010]">
                        {c.name.split(" ")[1] || c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Ícono Espiritual Animado</label>
                  <select
                    value={animatedIconId}
                    onChange={(e) => setAnimatedIconId(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1rem',
                      paddingRight: '2rem'
                    }}
                  >
                    {ANIMATED_ICONS.map(i => (
                      <option key={i.id} value={i.id} className="bg-[#101010]">
                        {i.emoji} {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">URL de Imagen/GIF personalizado (Ej. Dibujo animado, Altar)</label>
                <input
                  type="text"
                  placeholder="https://ejemplo.com/altar-animado.gif"
                  value={customIconUrl}
                  onChange={(e) => setCustomIconUrl(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Fecha de Celebración (Su Día)</label>
                <input
                  type="text"
                  placeholder="Ej. 24 de Septiembre, Al final del año, etc."
                  value={fechaCelebracion}
                  onChange={(e) => setFechaCelebracion(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Herramientas y Atributos</label>
                <input
                  type="text"
                  placeholder="Ej. Bastón de madera, caracoles, garabato de guayaba"
                  value={herramientas}
                  onChange={(e) => setHerramientas(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Ofrendas Comunes (Addimú)</label>
                <input
                  type="text"
                  placeholder="Ej. Aguardiente, miel de abejas, fruta picada"
                  value={ofrendas}
                  onChange={(e) => setOfrendas(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Descripción / Doctrinas y Teología *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribe aquí toda la información teológica..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg p-3 text-xs text-white focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#242424]/40">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-serif text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-110 active:scale-95 text-black px-6 py-2.5 rounded-xl text-xs font-serif font-black tracking-wider shadow-lg shadow-[#D4AF37]/10 custom-transition cursor-pointer"
                >
                  <span>{editingOrisha ? "Guardar Cambios" : "Guardar e Instalar"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
