import React, { useState } from "react";
import { VideoItem } from "../types";
import { PlusCircle, Edit3, Trash2, X, Play, Search, Video, Sparkles } from "lucide-react";

interface VideosSectionProps {
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
  saveVideos: (data: VideoItem[]) => void;
  isAdmin?: boolean;
}

export default function VideosSection({ videos, setVideos, saveVideos, isAdmin }: VideosSectionProps) {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(videos[0] || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");

  // Modal form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  // Form Fields
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<VideoItem["categoria"]>("General");
  const [videoUrl, setVideoUrl] = useState("");

  const openAddForm = () => {
    setEditingVideo(null);
    setTitulo("");
    setDescripcion("");
    setCategoria("General");
    setVideoUrl("");
    setIsFormOpen(true);
  };

  const openEditForm = (video: VideoItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingVideo(video);
    setTitulo(video.titulo);
    setDescripcion(video.descripcion);
    setCategoria(video.categoria);
    setVideoUrl(video.videoUrl);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !videoUrl.trim()) return;

    // Detect if it is youtube
    const isYt = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    
    // Transform normal watch URL to embed URL if possible
    let finalUrl = videoUrl;
    if (isYt && !videoUrl.includes("/embed/")) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = videoUrl.match(regExp);
      if (match && match[2].length === 11) {
        finalUrl = `https://www.youtube.com/embed/${match[2]}`;
      }
    }

    if (editingVideo) {
      const updatedList = videos.map((v) =>
        v.id === editingVideo.id
          ? {
              ...v,
              titulo,
              descripcion,
              categoria,
              videoUrl: finalUrl,
              esYoutube: isYt,
            }
          : v
      );
      setVideos(updatedList);
      saveVideos(updatedList);

      if (activeVideo?.id === editingVideo.id) {
        setActiveVideo({
          ...activeVideo,
          titulo,
          descripcion,
          categoria,
          videoUrl: finalUrl,
          esYoutube: isYt,
        });
      }
    } else {
      const newVideo: VideoItem = {
        id: "video_" + Date.now(),
        titulo,
        descripcion,
        categoria,
        videoUrl: finalUrl,
        esYoutube: isYt,
      };
      const updatedList = [newVideo, ...videos];
      setVideos(updatedList);
      saveVideos(updatedList);
      setActiveVideo(newVideo);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de quitar este video educativo?")) {
      const updatedList = videos.filter((v) => v.id !== id);
      setVideos(updatedList);
      saveVideos(updatedList);
      if (activeVideo?.id === id) {
        setActiveVideo(updatedList[0] || null);
      }
    }
  };

  const filtered = videos.filter((v) => {
    const matchesSearch =
      v.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "todas" || v.categoria === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="videos-module">
      {/* Video Player + Detail (2/3 area) */}
      <div className={`lg:col-span-2 space-y-4 ${activeVideo ? "block" : "hidden lg:block"}`}>
        {activeVideo ? (
          <div className="bg-[#101010] border border-[#242424] rounded-2xl overflow-hidden p-5 shadow-2xl relative">
            {/* Back button for mobile */}
            <button
              onClick={() => setActiveVideo(null)}
              className="lg:hidden flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#E8C97A] mb-4 bg-[#181818] border border-[#242424] px-4 py-2 rounded-xl cursor-pointer"
            >
              ← Ver galería de videos
            </button>
            {/* Embed or Link Player Frame */}
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border border-[#242424] relative">
              {activeVideo.esYoutube ? (
                <iframe
                  title={activeVideo.titulo}
                  src={activeVideo.videoUrl}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/80 relative">
                  <Play size={44} className="text-[#D4AF37] mb-4 animate-pulse" />
                  <p className="text-sm font-semibold text-zinc-250 font-serif mb-2">{activeVideo.titulo}</p>
                  <p className="text-xs text-zinc-500 text-center max-w-sm mb-4 leading-relaxed font-light">
                    Este video es un enlace externo o transmisión directa.
                  </p>
                  <a
                    href={activeVideo.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-110 active:scale-95 text-black px-6 py-2.5 rounded-xl text-xs font-serif font-black tracking-wider shadow-lg shadow-[#D4AF37]/10 custom-transition cursor-pointer"
                  >
                    Abrir en nueva pestaña
                  </a>
                </div>
              )}
            </div>

            {/* Video detail details */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-3 border-t border-[#242424]/40">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-[#E8C97A] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-3 py-1 rounded-full">
                    {activeVideo.categoria}
                  </span>
                </div>
                <h2 className="text-xl lg:text-2xl font-serif text-white font-black leading-tight">
                  {activeVideo.titulo}
                </h2>
                <p className="text-xs text-[#A0A0A0] max-w-2xl leading-relaxed whitespace-pre-line mt-2 font-light">
                  {activeVideo.descripcion || "No hay una descripción ingresada para este material audiovisual."}
                </p>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={(e) => openEditForm(activeVideo, e)}
                    className="p-2.5 bg-[#181818] hover:bg-[#080808] border border-[#242424] hover:border-[#D4AF37]/35 rounded-xl text-zinc-400 hover:text-[#D4AF37] custom-transition cursor-pointer"
                    title="Editar Detalles del Video"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(activeVideo.id, e)}
                    className="p-2.5 bg-red-950/15 hover:bg-red-900/20 border border-red-950/40 rounded-xl text-red-400 hover:text-red-300 custom-transition cursor-pointer"
                    title="Eliminar Video"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#101010] border border-[#242424] rounded-2xl p-12 text-center aspect-video flex flex-col items-center justify-center shadow-xl">
            <Video size={42} className="text-zinc-700 mb-2" />
            <p className="text-sm font-serif">No hay ningún video activo</p>
            <p className="text-xs text-[#A0A0A0] max-w-xs mt-1 font-light">
              Agrega links de YouTube o URLs de videos multimedia para verlos en tu portal escolar.
            </p>
          </div>
        )}
      </div>

      {/* Videos List / Column Directory (1/3 size) */}
      <div className={`bg-[#101010] border border-[#242424] rounded-2xl p-6 flex flex-col lg:h-[650px] shadow-2xl ${activeVideo ? "hidden lg:flex" : "flex"}`}>
        <div className="flex items-center justify-between mb-5 border-b border-[#242424] pb-4">
          <h3 className="text-base font-serif font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Video size={16} className="text-[#D4AF37]" />
            <span>Galería Escolar</span>
          </h3>
          {isAdmin && (
            <button
              onClick={openAddForm}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-110 active:scale-95 text-black text-[10px] uppercase font-serif font-black tracking-wide px-3.5 py-2 rounded-xl custom-transition cursor-pointer shadow-md shadow-[#D4AF37]/5"
            >
              <PlusCircle size={12} />
              <span>Subir</span>
            </button>
          )}
        </div>

        {/* Categories filters inside directory list */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {["todas", "Cantos y Tambor", "Santería", "Ifá", "Palo Mayombe"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-[10px] rounded-lg border font-serif font-semibold tracking-wide custom-transition cursor-pointer ${
                categoryFilter === cat
                  ? "bg-[#D4AF37]/10 text-[#E8C97A] border-[#D4AF37]/45"
                  : "bg-[#181818]/60 text-zinc-400 border-[#242424] hover:text-[#D4AF37] hover:border-[#D4AF37]/30"
              }`}
            >
              {cat === "todas" ? "Todos" : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Buscar videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#050505] border border-[#242424] rounded-xl px-9 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
          />
          <Search className="absolute left-3.5 top-3.5 text-zinc-500" size={13} />
        </div>

        {/* Videos list scroll view */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-650 text-xs italic">
              Ningún video disponible
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveVideo(item)}
                className={`p-3 rounded-xl border custom-transition cursor-pointer flex gap-3 items-center text-left ${
                  activeVideo?.id === item.id
                    ? "bg-[#181818] border-[#D4AF37]/55 shadow-[0_4px_12px_rgba(212,175,55,0.06)]"
                    : "bg-black/40 hover:bg-[#181818]/60 border-[#242424] hover:border-[#D4AF37]/30"
                }`}
              >
                {/* Thumb placeholder */}
                <div className={`w-14 h-10 shrink-0 rounded-lg bg-black border border-[#242424] flex items-center justify-center relative overflow-hidden`}>
                  <Play size={11} className={activeVideo?.id === item.id ? "text-[#D4AF37] scale-125 transition-transform" : "text-zinc-500"} />
                  {item.esYoutube && (
                    <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-red-600 text-white font-mono font-bold px-1 rounded-sm">YT</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-serif font-bold text-white truncate leading-tight">
                    {item.titulo}
                  </h4>
                  <span className="text-[9px] text-[#A0A0A0] font-mono mt-1 block uppercase tracking-wider">{item.categoria}</span>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => openEditForm(item, e)}
                      className="p-1 hover:text-[#D4AF37] text-zinc-500 hover:bg-zinc-850/40 rounded transition-all cursor-pointer"
                      title="Editar"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1 hover:text-red-400 text-zinc-500 hover:bg-zinc-850/40 rounded transition-all cursor-pointer"
                      title="Borrar"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

       {/* Video Creator/Editor Dialog */}
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
              <span>{editingVideo ? "Modificar Video" : "Añadir Nuevo Video Educativo"}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Título del Video *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Toque de Tambor Oru Seco a Elegguá"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Categoría del Video</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23D4AF37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '1rem',
                      paddingRight: '2rem'
                    }}
                  >
                    <option value="General" className="bg-[#101010]">General / Instructivo</option>
                    <option value="Santería" className="bg-[#101010]">Santería (Regla de Osha)</option>
                    <option value="Ifá" className="bg-[#101010]">Ifá (Orunmila)</option>
                    <option value="Palo Mayombe" className="bg-[#101010]">Palo Mayombe (Congo)</option>
                    <option value="Cantos y Tambor" className="bg-[#101010]">Cantos, Rezos y Tambores</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">URL del Video (YouTube o Enlace) *</label>
                  <input
                    type="text"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                  <span className="text-[9px] text-zinc-500 mt-1 block leading-normal">Ejemplo: Pegue una URL de YouTube para reproducirlo de inmediato</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-wider text-zinc-400 uppercase font-semibold mb-1">Descripción de Estudio o Notas de Clase</label>
                <textarea
                  rows={4}
                  placeholder="Escribe un breve resumen de los conceptos hablados en el video..."
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
                  <span>{editingVideo ? "Guardar Cambios" : "Guardar Video"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
