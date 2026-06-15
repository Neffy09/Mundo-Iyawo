import React, { useState } from "react";
import { GuiaEspiritual } from "../types";
import { PlusCircle, Edit3, Trash2, X, Sparkles, BookOpen, Heart, Eye, Copy, Check, MessageSquare } from "lucide-react";

interface EspiritismoSectionProps {
  guias: GuiaEspiritual[];
  setGuias: React.Dispatch<React.SetStateAction<GuiaEspiritual[]>>;
  saveGuias: (data: GuiaEspiritual[]) => void;
  isAdmin?: boolean;
}

export default function EspiritismoSection({ guias, setGuias, saveGuias, isAdmin }: EspiritismoSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<"cuadro" | "boveda" | "oraciones">("cuadro");
  
  // Spirit guides states
  const [selectedGuia, setSelectedGuia] = useState<GuiaEspiritual | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  
  // Form State for Adding / Editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGuia, setEditingGuia] = useState<GuiaEspiritual | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form Fields
  const [nombre, setNombre] = useState("");
  const [sincretismo, setSincretismo] = useState("");
  const [tipo, setTipo] = useState<"Congos" | "Gitanas" | "Madamas" | "Indios" | "Médicos" | "Familiares" | "Otros">("Congos");
  const [colores, setColores] = useState("");
  const [atributos, setAtributos] = useState("");
  const [ofrendas, setOfrendas] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [oracion, setOracion] = useState("");

  // Bóveda interaction states
  const [selectedVaultCup, setSelectedVaultCup] = useState<number | null>(null);

  const openAddForm = () => {
    setEditingGuia(null);
    setNombre("");
    setSincretismo("");
    setTipo("Congos");
    setColores("");
    setAtributos("");
    setOfrendas("");
    setDescripcion("");
    setOracion("");
    setIsFormOpen(true);
  };

  const openEditForm = (guia: GuiaEspiritual, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingGuia(guia);
    setNombre(guia.nombre);
    setSincretismo(guia.sincretismo);
    setTipo(guia.tipo);
    setColores(guia.colores);
    setAtributos(guia.atributos);
    setOfrendas(guia.ofrendas);
    setDescripcion(guia.descripcion);
    setOracion(guia.oracion);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editingGuia) {
      const updatedList = guias.map((g) =>
        g.id === editingGuia.id
          ? {
              ...g,
              nombre,
              sincretismo,
              tipo,
              colores,
              atributos,
              ofrendas,
              descripcion,
              oracion,
            }
          : g
      );
      setGuias(updatedList);
      saveGuias(updatedList);
      
      if (selectedGuia?.id === editingGuia.id) {
        setSelectedGuia({
          ...selectedGuia,
          nombre,
          sincretismo,
          tipo,
          colores,
          atributos,
          ofrendas,
          descripcion,
          oracion,
        });
      }
    } else {
      const newGuia: GuiaEspiritual = {
        id: "guia_" + Date.now(),
        nombre,
        sincretismo,
        tipo,
        colores,
        atributos,
        ofrendas,
        descripcion,
        oracion,
      };
      const updatedList = [newGuia, ...guias];
      setGuias(updatedList);
      saveGuias(updatedList);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este Guía Espiritual de tu portal educativo?")) {
      const updatedList = guias.filter((g) => g.id !== id);
      setGuias(updatedList);
      saveGuias(updatedList);
      if (selectedGuia?.id === id) {
        setSelectedGuia(null);
      }
    }
  };

  const handleCopyOracion = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = guias.filter((g) => {
    const matchesSearch =
      g.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.sincretismo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.tipo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "todos" || g.tipo === typeFilter;
    return matchesSearch && matchesType;
  });

  // Bóveda glass information database
  const vaultElements = [
    {
      id: 1,
      title: "Copa Superior Central (Santísimo)",
      meaning: "Representa la conexión divina directa con Dios, la Providencia Divina supremo y el Ángel de la Guarda personal. Usualmente es una copa de cristal grande con un crucifijo de madera adentro.",
      tips: "Coloca siempre el crucifijo de forma horizontal o vertical asomándose al frente. Es la copa que atrae las corrientes más elevadas de luz."
    },
    {
      id: 2,
      title: "Vaso de la Salud y Sanación",
      meaning: "Dedicado a los espíritus de la corriente médica (como el Dr. José Gregorio Hernández) que asisten en el alivio de tensiones corporales y la purificación de fluidos áuricos.",
      tips: "Ofrenda flores blancas a su lado para guiar las energías sanadoras en caso de convalecencia familiar."
    },
    {
      id: 3,
      title: "Vaso de los Ancestros Guías (Congos y Africanos)",
      meaning: "Dedicado a las almas congas antiguas (el cordón Bantú), especialistas en la fuerza física, protección, botánica curativa del monte y defensa contra maleficios.",
      tips: "Acompaña este vaso soplando un poco de humo de tabaco y rocía unas gotas de aguardiente a sus pies."
    },
    {
      id: 4,
      title: "Vaso de los Espíritus Clari-Clarividentes (Gitanas)",
      meaning: "Representa la corriente gitana que aporta premoniciones, intuición fina, lectura del porvenir y despojo de pensamientos tristes.",
      tips: "Coloca una pequeña copa con vino dulce de uvas o una rosa roja al lado de este vaso para incentivar la clarividencia espiritual."
    },
    {
      id: 5,
      title: "Vaso de los Espíritus de Servicio (Madamas y Criollas)",
      meaning: "Dedicado a las comadronas, nodrizas y abnegadas protectoras del hogar físico. Ideal para atraer unión de la familia y barrer las amarguras cotidianas del hogar.",
      tips: "Rocía perfume dulce floral o colonia clásica de lavanda fina alrededor de la bóveda para complacer su presencia limpia."
    },
    {
      id: 6,
      title: "Vaso de los Espíritus de la Fuerza Terrestre (Indios)",
      meaning: "Representa a los espíritus indígenas originarios. Otorgan orgullo digno, coraje para enfrentar traiciones de enemigos, firmeza en el cordón y dominio místico del bosque.",
      tips: "Sírveles agua de manantial cristalina y enciende incienso natural de mirra o copal en su honor."
    },
    {
      id: 7,
      title: "El Vaso de la Claridad Colectiva",
      meaning: "Dedicado a unificar las mentes de los que asisten a la misa. Sirve para balancear el humor colectivo, alejar discusiones estériles y calentar los canales mediumnísticos.",
      tips: "Mantén este vaso siempre limpio y claro, cambiándole el agua cada 7 días obligatoriamente."
    },
    {
      id: 8,
      title: "La Vela (El Cirio de Luz)",
      meaning: "Es la luz mística que abre los portales entre planos cósmicos. Sirve para calentar de energía celestial a las almas sedientas de luz y progreso espiritual.",
      tips: "Enciende velas blancas puras. Nunca dejes una vela encendida sin supervisión o colócala en un plato metálico seguro con agua."
    },
    {
      id: 9,
      title: "Las Flores Blancas (La Purificación de fluidos)",
      meaning: "Las flores atrapan y absorben naturalmente las vibraciones frías o larvas espirituales estancadas en el aire de la habitación antes de que entren al aura de los devotos.",
      tips: "Usa claveles blancos o margaritas. Cuando las flores se marchiten rápidamente, indica que han absorbido carga negativa pesada; arrójalas de inmediato fuera del hogar."
    }
  ];

  return (
    <div className="space-y-6" id="espiritismo-module">
      {/* Module Title and Subnavigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-[#242424] pb-6">
        <div>
          <h2 className="text-xl lg:text-2xl font-serif font-black text-white flex items-center gap-2.5">
            <Heart className="text-[#D4AF37] fill-[#D4AF37]/10 shrink-0 animate-pulse" size={26} />
            Mesa de Espiritismo Cruzado y Cordón de Luz
          </h2>
          <p className="text-xs text-[#A0A0A0] leading-relaxed max-w-2xl mt-1 font-light gap-2.5">
            Espacio litúrgico educativo sobre las prácticas devocionales místicas del Espiritismo en Cuba y el Caribe. Explora el cuadro familiar, la mística de la Bóveda Espiritual, rezos protectores de Kardec y herencias ancestrales.
          </p>
        </div>
        
        {/* Sub menu tabs */}
        <div className="flex bg-[#101010] p-1.5 rounded-xl border border-[#242424] w-full md:w-auto overflow-x-auto shrink-0 self-end">
          <button
            onClick={() => setActiveSubTab("cuadro")}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-serif font-black tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap ${
              activeSubTab === "cuadro"
                ? "bg-[#181818] text-[#D4AF37] border border-[#D4AF37]/30 shadow-md"
                : "text-[#A0A0A0] hover:text-white border border-transparent"
            }`}
          >
            Cuadro Espiritual
          </button>
          <button
            onClick={() => setActiveSubTab("boveda")}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-serif font-black tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap ${
              activeSubTab === "boveda"
                ? "bg-[#181818] text-[#D4AF37] border border-[#D4AF37]/30 shadow-md"
                : "text-[#A0A0A0] hover:text-white border border-transparent"
            }`}
          >
            Bóveda Interactiva
          </button>
          <button
            onClick={() => setActiveSubTab("oraciones")}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-xs font-serif font-black tracking-wider uppercase cursor-pointer transition-all whitespace-nowrap ${
              activeSubTab === "oraciones"
                ? "bg-[#181818] text-[#D4AF37] border border-[#D4AF37]/30 shadow-md"
                : "text-[#A0A0A0] hover:text-white border border-transparent"
            }`}
          >
            Oraciones y Misas
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CUADRO ESPIRITUAL (LIST AND CRUD) */}
      {activeSubTab === "cuadro" && (
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-[#101010] p-5 rounded-2xl border border-[#242424] shadow-2xl backdrop-blur-md">
            <div className="flex flex-wrap gap-2">
              {["todos", "Congos", "Gitanas", "Madamas", "Indios", "Médicos", "Familiares"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-serif font-bold border custom-transition cursor-pointer ${
                    typeFilter === t
                      ? "bg-[#181818] text-[#D4AF37] border-[#D4AF37]/45 shadow-sm"
                      : "bg-[#050505]/40 text-[#A0A0A0] border-[#242424] hover:border-[#D4AF37]/25 hover:text-white"
                  }`}
                >
                  {t === "todos" ? "Todo el Cordón" : `Comisión de ${t}`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Buscar Guía, ofrendas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#050505] border border-[#242424] text-white px-4.5 py-2.5 rounded-xl text-xs w-full lg:w-60 focus:outline-none focus:border-[#D4AF37] placeholder-zinc-650 custom-transition"
              />
              {isAdmin && (
                <button
                  onClick={openAddForm}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] text-black hover:opacity-90 px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-serif font-black tracking-wider uppercase shadow-lg shadow-[#D4AF37]/10 shrink-0 cursor-pointer"
                >
                  <PlusCircle size={15} />
                  <span>Invocar Guía</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List Column */}
            <div className={`lg:col-span-1 space-y-4.5 ${selectedGuia ? "hidden lg:block" : "block"}`}>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#A0A0A0] font-mono px-1">
                GUÍAS ESPIRITUALES Y CORDÓN ({filtered.length})
              </div>
              
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {filtered.map((guia) => (
                  <div
                    key={guia.id}
                    onClick={() => setSelectedGuia(guia)}
                    className={`p-5 bg-[#101010] hover:bg-[#181818] border rounded-2xl cursor-pointer transition-all flex flex-col justify-between ${
                      selectedGuia?.id === guia.id
                        ? "border-[#D4AF37] bg-[#121212] shadow-xl shadow-[#D4AF37]/5"
                        : "border-[#242424] hover:border-[#D4AF37]/30"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#242424] mb-3">
                        <span className="text-[9px] font-mono uppercase font-bold text-[#D4AF37] block">
                          Comisión {guia.tipo}
                        </span>
                        {isAdmin && (
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => openEditForm(guia, e)}
                              className="p-1 text-zinc-400 hover:text-[#D4AF37] rounded transition-all cursor-pointer"
                              title="Editar guía"
                            >
                              <Edit3 size={11} />
                            </button>
                            <button
                              onClick={(e) => handleDelete(guia.id, e)}
                              className="p-1 text-zinc-400 hover:text-[#E74C3C] rounded transition-all cursor-pointer"
                              title="Eliminar guía"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <h4 className="font-serif font-black text-white text-base leading-tight group-hover:text-[#D4AF37]">
                        {guia.nombre}
                      </h4>
                      <p className="text-[#A0A0A0] text-xs mt-1.5 font-light line-clamp-2 leading-relaxed">
                        {guia.descripcion}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-550 pt-3 mt-3 border-t border-[#242424]/45">
                      <span className="font-mono">Sincr: {guia.sincretismo || "Ninguno"}</span>
                      <span className="text-[#D4AF37] font-serif font-bold tracking-wider uppercase text-[9px]">Ver Ficha &rarr;</span>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="text-center py-16 bg-[#101010] rounded-2xl border border-[#242424] border-dashed text-[#A0A0A0] text-xs">
                    Ningún guía místico encontrado con ese nombre.
                  </div>
                )}
              </div>
            </div>

            {/* Detail Panel Column */}
            <div className={`lg:col-span-2 ${selectedGuia ? "flex flex-col" : "hidden lg:flex flex-col justify-center items-center text-center text-[#A0A0A0] py-36 bg-[#101010]/50 rounded-2xl border border-[#242424]"}`}>
              {selectedGuia ? (
                <div className="bg-[#101010] rounded-2xl border border-[#242424] shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden animate-fade-in w-full">
                  <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setSelectedGuia(null)}
                    className="lg:hidden flex items-center gap-1.5 text-xs text-[#D4AF37] font-serif font-bold mb-4 cursor-pointer"
                  >
                    &larr; Volver a Catálogo
                  </button>

                  {/* Header info */}
                  <div className="border-b border-[#242424] pb-5 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-md text-[9px] uppercase font-bold tracking-widest text-[#D4AF37] font-mono">
                        COMISIÓN ESPIRITUAL: {selectedGuia.tipo}
                      </span>
                      <span className="text-[10px] text-[#A0A0A0]/60 font-mono">
                        COD: {selectedGuia.id}
                      </span>
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-serif font-black text-white">
                      {selectedGuia.nombre}
                    </h3>
                  </div>

                  {/* Metadata Fields grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#050505] p-4.5 rounded-xl border border-[#242424]">
                      <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest block font-mono">
                        Sincretismo Católico:
                      </span>
                      <p className="text-xs text-[#E8C97A] mt-1.5 font-serif font-bold">
                        {selectedGuia.sincretismo || "Espíritu de devoción directa (sin sincretizar)"}
                      </p>
                    </div>

                    <div className="bg-[#050505] p-4.5 rounded-xl border border-[#242424]">
                      <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest block font-mono">
                        Colores de Fluidos:
                      </span>
                      <p className="text-xs text-[#E8C97A] mt-1.5 font-mono">
                        {selectedGuia.colores || "Blanco Divino Universal"}
                      </p>
                    </div>

                    <div className="bg-[#050505] p-4.5 rounded-xl border border-[#242424]">
                      <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest block font-mono">
                        Atributos Materiales (Herramientas):
                      </span>
                      <p className="text-xs text-zinc-300 mt-1.5 italic font-light leading-relaxed">
                        {selectedGuia.atributos}
                      </p>
                    </div>

                    <div className="bg-[#050505] p-4.5 rounded-xl border border-[#242424]">
                      <span className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest block font-mono">
                        Ofrendas Predilectas:
                      </span>
                      <p className="text-xs text-zinc-300 mt-1.5 italic font-light leading-relaxed">
                        {selectedGuia.ofrendas}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#A0A0A0] font-bold tracking-widest uppercase">DESCRIPCIÓN DE SU ROL ESPIRITUAL:</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light bg-[#050505] p-4.5 rounded-xl border border-[#242424]">
                      {selectedGuia.descripcion}
                    </p>
                  </div>

                  {/* Prayer - Plegaria Invocation */}
                  {selectedGuia.oracion && (
                    <div className="bg-[#181818]/60 border border-[#D4AF37]/30 rounded-xl p-5 space-y-3 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                      <div className="flex items-center justify-between border-b border-[#242424]/80 pb-3">
                        <span className="text-xs font-serif font-black text-[#D4AF37] uppercase tracking-wider block">
                          Oración de Conexión y Despojo
                        </span>
                        <button
                          onClick={() => handleCopyOracion(selectedGuia.oracion, selectedGuia.id)}
                          className="text-[10px] bg-black hover:bg-[#101010] text-[#D4AF37] hover:text-white py-1.5 px-3.5 rounded-lg border border-[#242424] transition-all flex items-center gap-1.5 cursor-pointer font-bold"
                        >
                          {copiedId === selectedGuia.id ? (
                            <>
                              <Check size={11} className="text-[#2ECC71] animate-pulse" />
                              <span className="text-[#2ECC71]">Copiada</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copiar Rezo</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs italic text-[#D8D8D8] leading-relaxed font-serif whitespace-pre-line text-center px-4 py-2 font-light">
                        {selectedGuia.oracion}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 p-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#101010] border border-[#242424] flex items-center justify-center mx-auto relative shadow-inner animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#6E44FF]/20 to-[#D4AF37]/15 rounded-2xl blur opacity-30"></div>
                    <Heart size={22} className="text-[#D4AF37] relative z-10" />
                  </div>
                  <p className="font-serif text-sm font-extrabold text-white tracking-widest uppercase">
                    CONSULTAR CORDÓN ESPIRITUAL
                  </p>
                  <p className="text-[#A0A0A0] text-xs max-w-xs mx-auto leading-relaxed font-light">
                    Los guías espirituales componen tu cordón de luz, balancean tu cuadro astral y te defienden de malas vibraciones terrestres.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LA BÓVEDA INTERACTIVA */}
      {activeSubTab === "boveda" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Explanation panel */}
          <div className="lg:col-span-2 bg-[#101010] p-6 rounded-2xl border border-[#242424] shadow-2xl space-y-5">
            <div className="flex items-center gap-2 text-[#D4AF37] pb-3 border-b border-[#242424] font-serif font-black text-sm uppercase tracking-wider">
              <Sparkles size={16} className="text-[#6E44FF]" />
              <span>¿Qué es la Bóveda Espiritual?</span>
            </div>
            <p className="text-xs text-[#A0A0A0] leading-relaxed font-light">
              La Bóveda Espiritual es un sagrado altar sincrético muy arraigado en Cuba que sirve como un portal focalizador de energías. Consiste en una mesa cubierta con un paño blanco sobre la que se colocan vasos de agua clara y una copa central, acompañados de un crucifijo de madera, flores y ofrendas.
            </p>

            <div className="space-y-2 bg-[#050505] p-5 rounded-xl border border-[#242424]">
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest font-mono">Estaciones Celestiales de Luz</span>
              <p className="text-[11px] text-[#A0A0A0] leading-relaxed font-light">
                Selecciona cualquiera de los elementos numerados del altar místico de la Bóveda de la derecha para aprender su significado litúrgico y sus consejos de ordenación.
              </p>
            </div>

            <div className="p-4 bg-[#D4AF37]/5 border border-[#D4AF37]/25 rounded-xl space-y-1 text-center font-light">
              <span className="text-[9px] font-bold text-[#E8C97A] block uppercase tracking-widest font-mono">Regla Fundamental</span>
              <p className="text-[11px] text-[#D8D8D8] italic font-serif leading-relaxed">
                "El agua es el conductor supremo de los fluidos de las almas. Debe estar siempre fresca, enérgica, clara y libre de impurezas."
              </p>
            </div>
          </div>

          {/* Visual Interactive grid */}
          <div className="lg:col-span-3 bg-[#101010] p-6 border border-[#242424] rounded-2xl shadow-2xl flex flex-col justify-between space-y-6">
            <div className="text-center">
              <span className="text-[9px] font-mono uppercase font-black tracking-widest text-[#D4AF37] block">MAPA DE ORDENACIÓN MÍSTICA (9 POSICIONES)</span>
              <h4 className="text-sm font-serif text-white font-extrabold mt-1">Diagrama del Altar de Bóveda Espiritual</h4>
            </div>

            {/* Visual Grid representing glasses and elements */}
            <div className="bg-[#050505] p-6 rounded-2xl border border-[#242424] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Table setup visualizer */}
              <div className="w-full max-w-sm border border-[#242424] shadow-2xl p-6 rounded-2xl bg-gradient-to-b from-[#101010] to-black relative">
                {/* Altar Cloth accent */}
                <div className="absolute top-0 inset-x-5 h-1 bg-white rounded-b-md shadow-lg opacity-85"></div>
                
                {/* Visual Glass arrangement: 3 rows */}
                <div className="grid grid-cols-3 gap-y-8 gap-x-4 text-center">
                  
                  {/* Row 1 */}
                  {/* Cup 2 */}
                  <div
                    onClick={() => setSelectedVaultCup(2)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 2
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white scale-105 shadow-md shadow-[#D4AF37]/10"
                        : "bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30 text-zinc-400"
                    }`}
                  >
                    <div className="w-6 h-8 border border-zinc-500 rounded-b-xl flex items-center justify-center text-[9px] font-mono font-bold bg-[#050505]">2</div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-wide">Salud</span>
                  </div>

                  {/* Cup 1 - The Centerpiece */}
                  <div
                    onClick={() => setSelectedVaultCup(1)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 1
                        ? "bg-[#D4AF37]/20 border-[#D4AF37] text-white scale-105 shadow-xl shadow-[#D4AF37]/15"
                        : "bg-[#181818]/95 border-[#D4AF37]/30 text-[#D4AF37]"
                    }`}
                  >
                    <div className="w-8 h-10 border-2 border-[#D4AF37] rounded-b-2xl flex items-center justify-center text-[10px] font-mono font-black bg-[#D4AF37]/20">1</div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-widest text-[#D4AF37] uppercase">Santísimo</span>
                  </div>

                  {/* Cup 3 */}
                  <div
                    onClick={() => setSelectedVaultCup(3)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 3
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white scale-105 shadow-md shadow-[#D4AF37]/10"
                        : "bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30 text-zinc-400"
                    }`}
                  >
                    <div className="w-6 h-8 border border-zinc-500 rounded-b-xl flex items-center justify-center text-[9px] font-mono font-bold bg-[#050505]">3</div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-wide">Congos</span>
                  </div>

                  {/* Row 2 */}
                  {/* Cup 4 */}
                  <div
                    onClick={() => setSelectedVaultCup(4)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 4
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white scale-105 shadow-md shadow-[#D4AF37]/10"
                        : "bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30 text-zinc-400"
                    }`}
                  >
                    <div className="w-6 h-8 border border-zinc-500 rounded-b-xl flex items-center justify-center text-[9px] font-mono font-bold bg-[#050505]">4</div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-wide">Gitanas</span>
                  </div>

                  {/* Cup 7 (Center middle) */}
                  <div
                    onClick={() => setSelectedVaultCup(7)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 7
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white scale-105 shadow-md shadow-[#D4AF37]/10"
                        : "bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30 text-zinc-400"
                    }`}
                  >
                    <div className="w-6 h-8 border border-zinc-500 rounded-b-xl flex items-center justify-center text-[9px] font-mono font-bold bg-[#050505]">7</div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-wide">Claridad</span>
                  </div>

                  {/* Cup 5 */}
                  <div
                    onClick={() => setSelectedVaultCup(5)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 5
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white scale-105 shadow-md shadow-[#D4AF37]/10"
                        : "bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30 text-zinc-400"
                    }`}
                  >
                    <div className="w-6 h-8 border border-zinc-500 rounded-b-xl flex items-center justify-center text-[9px] font-mono font-bold bg-[#050505]">5</div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-wide">Madamas</span>
                  </div>

                  {/* Row 3 */}
                  {/* Cup 6 */}
                  <div
                    onClick={() => setSelectedVaultCup(6)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 6
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white scale-105 shadow-md shadow-[#D4AF37]/10"
                        : "bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30 text-zinc-400"
                    }`}
                  >
                    <div className="w-6 h-8 border border-zinc-500 rounded-b-xl flex items-center justify-center text-[9px] font-mono font-bold bg-[#050505]">6</div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-wide">Indios</span>
                  </div>

                  {/* Element 8 - Candle */}
                  <div
                    onClick={() => setSelectedVaultCup(8)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 8
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white scale-105 shadow-md shadow-[#D4AF37]/10"
                        : "bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30 text-zinc-400"
                    }`}
                  >
                    <div className="w-3 h-8 border bg-transparent border-[#D4AF37] rounded-sm flex items-center justify-center text-[9px] font-mono font-bold relative">
                      <div className="absolute -top-1.5 w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-ping"></div>
                      8
                    </div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-wide text-zinc-400">Cirio</span>
                  </div>

                  {/* Element 9 - Flowers */}
                  <div
                    onClick={() => setSelectedVaultCup(9)}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                      selectedVaultCup === 9
                        ? "bg-[#D4AF37]/15 border-[#D4AF37] text-white scale-105 shadow-md shadow-[#D4AF37]/10"
                        : "bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30 text-zinc-400"
                    }`}
                  >
                    <div className="w-6 h-8 border border-zinc-500 rounded-t-xl bg-[#2ECC71]/10 flex items-center justify-center text-[9px] font-mono font-bold">9</div>
                    <span className="text-[9px] mt-1.5 font-serif font-black tracking-wide text-zinc-400">Flores</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Display Detail of Selected glass element */}
            <div className="bg-[#050505] p-5 border border-[#242424] rounded-xl">
              {selectedVaultCup !== null ? (
                <div className="space-y-2 animate-fade-in-up">
                  <span className="text-[10px] uppercase font-bold text-[#E8C97A] font-mono tracking-widest block">
                    Posición {vaultElements[selectedVaultCup - 1].id}: {vaultElements[selectedVaultCup - 1].title}
                  </span>
                  <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed font-light">
                    {vaultElements[selectedVaultCup - 1].meaning}
                  </p>
                  <div className="mt-3.5 pt-3.5 border-t border-[#242424] text-[11px] text-[#A0A0A0] leading-relaxed font-light">
                    <span className="text-[#D4AF37] font-serif font-black uppercase tracking-wider text-[9px] mr-1.5">CONSEJO LITÚRGICO:</span>
                    {vaultElements[selectedVaultCup - 1].tips}
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#A0A0A0] text-xs py-4 font-serif font-light italic">
                  * Haz clic en cualquiera de las 9 vasijas/luces del altar superior para ver su función sagrada *
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ORACIONES Y MISAS */}
      {activeSubTab === "oraciones" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spiritualism Liturgical Phases */}
          <div className="bg-[#101010] p-6 rounded-2xl border border-[#242424] shadow-2xl space-y-5">
            <div className="flex items-center gap-2 text-[#D4AF37] pb-3 border-b border-[#242424] font-serif font-black text-sm uppercase tracking-wider">
              <BookOpen size={16} className="text-[#6E44FF]" />
              <span>Etapas de una Misa Espiritual tradicional</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-[10px] font-bold py-1 shrink-0 mt-0.5">1</div>
                <div>
                  <h5 className="text-xs font-serif font-bold text-zinc-200">Apertura y Oraciones del Santísimo</h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                    Se inicia frotando colonia en las manos, encendiendo el cirio y leyendo el libro "Colección de Oraciones" de Allan Kardec (Padre Nuestro, Ave María, Oración por los Guías y Espíritus Protectores).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-[10px] font-bold py-1 shrink-0 mt-0.5">2</div>
                <div>
                  <h5 className="text-xs font-serif font-bold text-zinc-200">Cánticos de Llamamiento (Cantos Espirituales)</h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                    Se cantan bellos himnos tradicionales a capela para elevar la vibración astral como "Oh venid protectores", "Madama Dolores" o "Se llama Francisco". Esto desaloja cualquier perturbación.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-[10px] font-bold py-1 shrink-0 mt-0.5">3</div>
                <div>
                  <h5 className="text-xs font-serif font-bold text-zinc-200">Trance y Consulta de los Médiums</h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                    Con la atmósfera caliente de luz, las deidades del cordón comienzan a manifestar sus consejos a través de las mentes mediumnísticas de los devotos, recomendando baños, despojos o rogaciones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-[10px] font-bold py-1 shrink-0 mt-0.5">4</div>
                <div>
                  <h5 className="text-xs font-serif font-bold text-zinc-200">Cierre y Agradecimiento</h5>
                  <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                    Se cantan coros de despedida, se pide la bendición universal y se agradece a todos los espíritus asistentes. Los presentes se limpian colectivamente con agua de perfume e hisopos de albahaca.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Golden Rule Prayers collection */}
          <div className="bg-[#101010] p-6 rounded-2xl border border-[#242424] shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[#D4AF37] pb-3 border-b border-[#242424] font-serif font-black text-sm uppercase tracking-wider">
              <MessageSquare size={16} className="text-[#6E44FF]" />
              <span>Plegarias Fundamentales (Allan Kardec)</span>
            </div>

            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {/* Prayer 1 */}
              <div className="bg-[#050505] p-5 border border-[#242424] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <h6 className="text-[11px] font-serif font-black text-[#E8C97A] uppercase tracking-wide">Oración para los Espíritus Guardianes</h6>
                  <button
                    onClick={() => handleCopyOracion(`Espíritus muy amados, ángeles guardianes que velan sobre mi existencia. Derramen su luz bienhechora para calmar mis miedos y aumentar mi fe. Sosténganme en los días de tropiezo terrenal, guíen mis intenciones y alejen de mi materia a los espíritus malvados que buscan inducirme a la tristeza. ¡Que mi luz sea fuerte para complacer a Dios!`, "orac_guard")}
                    className="p-1 text-zinc-400 hover:text-[#D4AF37] rounded cursor-pointer transition-all"
                  >
                    {copiedId === "orac_guard" ? <Check size={11} className="text-[#2ECC71] animate-pulse" /> : <Copy size={11} />}
                  </button>
                </div>
                <p className="text-[11px] text-[#A0A0A0] leading-normal font-serif italic text-justify font-light">
                  "Espíritus muy amados, ángeles guardianes que velan sobre mi existencia. Derramen su luz bienhechora para calmar mis miedos y aumentar mi fe. Sosténganme en los días de tropiezo..."
                </p>
              </div>

              {/* Prayer 2 */}
              <div className="bg-[#050505] p-5 border border-[#242424] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <h6 className="text-[11px] font-serif font-black text-[#E8C97A] uppercase tracking-wide">Oración de Evocación y Luz</h6>
                  <button
                    onClick={() => handleCopyOracion(`Te rogamos Señor Dios todopoderoso, conceder luz de progreso a los espíritus sufrientes que penan sin rumbo espiritual. Acepta nuestro fervoroso deseo de guiar sus conciencias débiles. Encomienda a tus mensajeros de paz asistirlos en su despertar eterno fuera de las ataduras mundanas. ¡Luz eterna y descanso provechoso para todas las almas!`, "orac_evoc")}
                    className="p-1 text-zinc-450 hover:text-[#D4AF37] rounded cursor-pointer transition-all"
                  >
                    {copiedId === "orac_evoc" ? <Check size={11} className="text-[#2ECC71] animate-pulse" /> : <Copy size={11} />}
                  </button>
                </div>
                <p className="text-[11px] text-[#A0A0A0] leading-normal font-serif italic text-justify font-light">
                  "Te rogamos Señor Dios todopoderoso, conceder luz de progreso a los espíritus sufrientes que penan sin rumbo espiritual. Acepta nuestro fervoroso deseo de guiar..."
                </p>
              </div>

              {/* Prayer 3 */}
              <div className="bg-[#050505] p-5 border border-[#242424] rounded-xl space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <h6 className="text-[11px] font-serif font-black text-[#E8C97A] uppercase tracking-wide font-mono">Canto Fiel: Al Divino Salvador</h6>
                  <button
                    onClick={() => handleCopyOracion(`Al Divino Salvador pedimos de corazón, derrame su bendición sobre nuestra congregación. Oh venid protectores, oh venid guías de luz, que la bóveda nos cubra bajo el manto de la cruz. Despejen las malas olas de este rincón de oración y colmen a todos los hijos de pureza y de despojo bendito.`, "orac_canto")}
                    className="p-1 text-zinc-400 hover:text-[#D4AF37] rounded cursor-pointer transition-all"
                  >
                    {copiedId === "orac_canto" ? <Check size={11} className="text-[#2ECC71] animate-pulse" /> : <Copy size={11} />}
                  </button>
                </div>
                <p className="text-[11px] text-[#A0A0A0] leading-normal font-serif italic text-justify font-light">
                  "Al Divino Salvador pedimos de corazón, derrame su bendición sobre nuestra congregación. Oh venid protectores, oh venid guías de luz, que la bóveda nos cubra..."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM MODAL FOR ADDING / EDITING SPIRITS */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-[#101010] border border-[#242424] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            {/* Modal Header */}
            <div className="bg-[#101010] p-5 border-b border-[#242424] flex items-center justify-between">
              <h4 className="text-sm font-serif font-black text-white uppercase tracking-wider">
                {editingGuia ? `Editar Guía: ${editingGuia.nombre}` : "Inscribir Nuevo Guía Espiritual"}
              </h4>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 hover:bg-[#181818] rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">Nombre / Título:</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Congo Francisco"
                    className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 placeholder-zinc-650"
                  />
                </div>

                {/* Tipo de Guía */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">Comisión Espiritual:</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  >
                    <option value="Congos">Congos (Africanistas)</option>
                    <option value="Gitanas">Gitanas (Línea de Ritmos y Claridad)</option>
                    <option value="Madamas">Madamas (Comadronas y Sanadoras)</option>
                    <option value="Indios">Indios (Fuerza de Monte)</option>
                    <option value="Médicos">Médicos (Corriente de Ciencia)</option>
                    <option value="Familiares">Familiares (Ancestros Directos)</option>
                    <option value="Otros">Otros (Protectores de Luz)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sincretismo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">Sincretismo Católico:</label>
                  <input
                    type="text"
                    value={sincretismo}
                    onChange={(e) => setSincretismo(e.target.value)}
                    placeholder="Ej. San Benito"
                    className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 placeholder-zinc-650"
                  />
                </div>

                {/* Colores */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">Colores del Guía:</label>
                  <input
                    type="text"
                    value={colores}
                    onChange={(e) => setColores(e.target.value)}
                    placeholder="Ej. Rojo y Negro"
                    className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 placeholder-zinc-650"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Atributos */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">Atributos Materiales (Herramientas):</label>
                  <input
                    type="text"
                    value={atributos}
                    onChange={(e) => setAtributos(e.target.value)}
                    placeholder="Ej. Bastón, tabaco, pañuelo"
                    className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 placeholder-zinc-650"
                  />
                </div>

                {/* Ofrendas */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">Ofrendas Predilectas:</label>
                  <input
                    type="text"
                    value={ofrendas}
                    onChange={(e) => setOfrendas(e.target.value)}
                    placeholder="Ej. Café amargo caliente, aguardiente"
                    className="w-full bg-[#050505] border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 placeholder-zinc-650"
                  />
                </div>
              </div>

              {/* Descripcion */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">Descripción / Historia:</label>
                <textarea
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe la personalidad del espíritu, cómo ayuda y su rol espiritual..."
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 placeholder-zinc-600 resize-none font-light"
                />
              </div>

              {/* Oracion */}
              <div className="space-y-1.5 font-sans">
                <label className="text-[10px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">Oración / Plegaria Especial:</label>
                <textarea
                  rows={3}
                  value={oracion}
                  onChange={(e) => setOracion(e.target.value)}
                  placeholder="Oración mística para invocarle o pedir su limpieza espiritual..."
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 placeholder-zinc-600 resize-none font-light"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#242424] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-[#181818] hover:bg-[#1c1c1c] border border-[#242424] text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-serif font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#D4AF37] hover:bg-[#E8C97A] text-black px-5 py-2.5 rounded-xl text-xs font-serif font-bold uppercase tracking-wider cursor-pointer transition-all shadow-md shadow-[#D4AF37]/10"
                >
                  {editingGuia ? "Guardar Modificación" : "Consagrar Guía"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
