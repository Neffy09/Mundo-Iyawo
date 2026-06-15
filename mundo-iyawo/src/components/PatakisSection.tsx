import React, { useState } from "react";
import { Pataki } from "../types";
import { PlusCircle, Edit3, Trash2, X, BookOpen, Search, Sparkles } from "lucide-react";

interface PatakisSectionProps {
  patakis: Pataki[];
  setPatakis: React.Dispatch<React.SetStateAction<Pataki[]>>;
  savePatakis: (data: Pataki[]) => void;
  isAdmin?: boolean;
}

export default function PatakisSection({ patakis, setPatakis, savePatakis, isAdmin }: PatakisSectionProps) {
  const [selectedPataki, setSelectedPataki] = useState<Pataki | null>(patakis[0] || null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPataki, setEditingPataki] = useState<Pataki | null>(null);

  // Form Fields
  const [titulo, setTitulo] = useState("");
  const [orishaRelacionado, setOrishaRelacionado] = useState("");
  const [descripcionBreve, setDescripcionBreve] = useState("");
  const [contenido, setContenido] = useState("");

  const openAddForm = () => {
    setEditingPataki(null);
    setTitulo("");
    setOrishaRelacionado("");
    setDescripcionBreve("");
    setContenido("");
    setIsFormOpen(true);
  };

  const openEditForm = (pataki: Pataki, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPataki(pataki);
    setTitulo(pataki.titulo);
    setOrishaRelacionado(pataki.orishaRelacionado);
    setDescripcionBreve(pataki.descripcionBreve);
    setContenido(pataki.contenido);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) return;

    if (editingPataki) {
      // Modify
      const updatedList = patakis.map((p) =>
        p.id === editingPataki.id
          ? {
              ...p,
              titulo,
              orishaRelacionado,
              descripcionBreve,
              contenido,
            }
          : p
      );
      setPatakis(updatedList);
      savePatakis(updatedList);

      if (selectedPataki?.id === editingPataki.id) {
        setSelectedPataki({
          ...selectedPataki,
          titulo,
          orishaRelacionado,
          descripcionBreve,
          contenido,
        });
      }
    } else {
      // Create (mound)
      const newPataki: Pataki = {
        id: "pataki_" + Date.now(),
        titulo,
        orishaRelacionado,
        descripcionBreve,
        contenido,
      };
      const updatedList = [newPataki, ...patakis];
      setPatakis(updatedList);
      savePatakis(updatedList);
      // Select the newly created pataki
      setSelectedPataki(newPataki);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este Patakí (Historia Sagrada)?")) {
      const updatedList = patakis.filter((p) => p.id !== id);
      setPatakis(updatedList);
      savePatakis(updatedList);
      if (selectedPataki?.id === id) {
        setSelectedPataki(updatedList[0] || null);
      }
    }
  };

  const filtered = patakis.filter((p) => {
    return (
      p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcionBreve.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orishaRelacionado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="patakis-module">
      {/* Search and List Column (1/3 size) */}
      <div className={`lg:col-span-1 bg-[#101010] border border-[#242424] rounded-2xl p-6 flex flex-col lg:h-[650px] shadow-2xl ${selectedPataki ? "hidden lg:flex" : "flex"}`}>
        <div className="flex items-center justify-between mb-5 border-b border-[#242424] pb-4">
          <h3 className="text-base font-serif font-black uppercase tracking-wider text-white flex items-center gap-2">
            <BookOpen size={16} className="text-[#D4AF37]" />
            <span>Historias y Patakis</span>
          </h3>
          {isAdmin && (
            <button
              onClick={openAddForm}
              className="p-1.5 hover:text-white bg-[#181818] hover:bg-[#1c1c1c] border border-[#242424] rounded-xl text-[#D4AF37] custom-transition cursor-pointer"
              title="Añadir nuevo Patakí"
            >
              <PlusCircle size={15} />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar relatos ancestrales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505] border border-[#242424] rounded-xl px-9 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
          />
          <Search className="absolute left-3.5 top-3.5 text-zinc-500" size={13} />
        </div>

        {/* List of tales */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs italic">
              No hay patakis disponibles para la búsqueda.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPataki(item)}
                className={`p-4 rounded-xl border custom-transition cursor-pointer text-left transition-all ${
                  selectedPataki?.id === item.id
                    ? "bg-[#181818] border-[#D4AF37]/50 shadow-[0_4px_12px_rgba(212,175,55,0.06)]"
                    : "bg-black/40 hover:bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs lg:text-sm font-serif font-bold text-white line-clamp-1 group-hover:text-[#D4AF37]">
                    {item.titulo}
                  </h4>
                  <span className="text-[8px] tracking-wider font-mono font-bold uppercase rounded-md bg-[#D4AF37]/10 text-[#E8C97A] border border-[#D4AF37]/25 px-2 py-0.5 shrink-0">
                    {item.orishaRelacionado || "Osha"}
                  </span>
                </div>
                <p className="text-[11px] text-[#A0A0A0] mt-2 line-clamp-2 leading-relaxed font-light">
                  {item.descripcionBreve || "Un relato sagrado sobre la creación y los Orishas..."}
                </p>
                {isAdmin && (
                  <div className="mt-3 flex justify-end gap-3 text-[10px] text-zinc-400 pt-2 border-t border-[#242424]">
                    <button
                      onClick={(e) => openEditForm(item, e)}
                      className="hover:text-[#D4AF37] transition-all"
                    >
                      Editar
                    </button>
                    <span className="text-zinc-700">•</span>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="hover:text-red-400 transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reader Panel Column (2/3 size) */}
      <div className={`lg:col-span-2 bg-[#101010] border border-[#242424] rounded-2xl p-6 lg:p-8 lg:h-[650px] lg:overflow-y-auto flex flex-col justify-between shadow-2xl ${selectedPataki ? "flex" : "hidden lg:flex"}`}>
        {selectedPataki ? (
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Back button for mobile */}
              <button
                onClick={() => setSelectedPataki(null)}
                className="lg:hidden flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#E8C97A] mb-5 bg-[#181818] border border-[#242424] px-4 py-2 rounded-xl cursor-pointer self-start transition-all"
              >
                ← Volver a la lista
              </button>
              {/* Reader Header */}
              <div className="border-b border-[#242424] pb-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-[#D4AF37]/10 text-[#E8C97A] border border-[#D4AF37]/25 px-2.5 py-0.5 rounded-full">
                      Relacionado: {selectedPataki.orishaRelacionado || "General Lucumí"}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-serif text-white font-bold leading-tight">
                    {selectedPataki.titulo}
                  </h2>
                </div>
                {isAdmin && (
                  <div className="flex items-center gap-2 self-start shrink-0">
                    <button
                      onClick={(e) => openFormWithPresetForEdit(selectedPataki)}
                      className="flex items-center gap-1.5 bg-[#181818] hover:bg-black border border-[#242424] hover:border-[#D4AF37]/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-[#D4AF37] custom-transition cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Editar Relato</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Reader Body */}
              <div className="prose prose-invert max-w-none text-[#D0D0D0] leading-relaxed text-sm whitespace-pre-line space-y-4 font-light">
                {selectedPataki.contenido}
              </div>
            </div>

            {/* Quote of the end */}
            <div className="mt-8 pt-4 border-t border-[#242424] text-center">
              <p className="text-[11px] text-zinc-500 font-serif italic pb-1">
                “Todo Patakí es una herencia sagrada que encierra una verdad moral y una medicina para el espíritu de los hombres.”
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 py-12">
            <BookOpen size={42} className="text-zinc-700 mb-2" />
            <p className="text-sm font-serif">Biblioteca de Sabiduría Vacía</p>
            <p className="text-xs text-zinc-650 max-w-xs mt-1">
              No tienes ningún patakí guardado. Haz clic en el botón de agregar para montar la primera historia sagrada.
            </p>
            {isAdmin && (
              <button
                onClick={openAddForm}
                className="mt-4 bg-[#D4AF37]/10 text-[#E8C97A] border border-[#D4AF37]/25 text-xs px-4 py-2 rounded-xl hover:bg-[#D4AF37]/20 custom-transition cursor-pointer"
              >
                Añadir Primer Patakí
              </button>
            )}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#101010] border border-[#242424] rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
            
            <h3 className="text-xl md:text-2xl font-serif text-white font-black mb-4 flex items-center gap-2">
              <Sparkles className="text-[#D4AF37]" size={18} />
              <span>{editingPataki ? "Editar Historia Sagrada" : "Montar Nuevo Patakí"}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Título del Patakí *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Por qué Elegguá abre los caminos"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Orisha / Mpungo Relacionado</label>
                  <input
                    type="text"
                    placeholder="Ej. Elegguá, Santería, Ifá, Changó"
                    value={orishaRelacionado}
                    onChange={(e) => setOrishaRelacionado(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Resumen / Descripción Breve</label>
                <input
                  type="text"
                  placeholder="Ej. La curación ancestral y el pacto divino de Olofin..."
                  value={descripcionBreve}
                  onChange={(e) => setDescripcionBreve(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Cuerpo e Historia del Patakí (Contenido) *</label>
                <textarea
                  required
                  rows={9}
                  placeholder="Cuenta la historia aquí... Puedes estructurarlo por párrafos y usar un lenguaje solemne."
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
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
                  <span>{editingPataki ? "Guardar Relato" : "Publicar Patakí"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function openFormWithPresetForEdit(p: Pataki) {
    setEditingPataki(p);
    setTitulo(p.titulo);
    setOrishaRelacionado(p.orishaRelacionado || "");
    setDescripcionBreve(p.descripcionBreve || "");
    setContenido(p.contenido);
    setIsFormOpen(true);
  }
}
