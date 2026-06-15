import React, { useState } from "react";
import { Libro } from "../types";
import { PlusCircle, Edit3, Trash2, X, BookOpen, Search, Download, HelpCircle, Sparkles } from "lucide-react";

interface BooksSectionProps {
  libros: Libro[];
  setLibros: React.Dispatch<React.SetStateAction<Libro[]>>;
  saveLibros: (data: Libro[]) => void;
  isAdmin?: boolean;
}

export default function BooksSection({ libros, setLibros, saveLibros, isAdmin }: BooksSectionProps) {
  const [selectedBook, setSelectedBook] = useState<Libro | null>(libros[0] || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("todos");

  // Dialog State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Libro | null>(null);

  // Form Fields
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<Libro["categoria"]>("General");
  const [linkDescarga, setLinkDescarga] = useState("");
  const [pdfData, setPdfData] = useState("");
  const [pdfNombre, setPdfNombre] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const processFile = (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Por favor, sube únicamente archivos en formato PDF.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) { // 8MB limit
      alert("El archivo PDF supera los 8MB. Para evitar saturar el almacenamiento local de tu navegador, utiliza un enlace de descarga externo o comprime tu PDF.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPdfData(reader.result as string);
      setPdfNombre(file.name);
    };
    reader.onerror = () => {
      alert("Error al procesar el archivo PDF.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadPdf = (book: Libro) => {
    if (!book.pdfData) return;
    try {
      const link = document.createElement("a");
      link.href = book.pdfData;
      link.download = book.pdfNombre || `${book.titulo.replace(/[^a-z0-0]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Error al descargar el archivo PDF de la memoria local.");
    }
  };

  const openAddForm = () => {
    setEditingBook(null);
    setTitulo("");
    setAutor("");
    setDescripcion("");
    setCategoria("General");
    setLinkDescarga("");
    setPdfData("");
    setPdfNombre("");
    setIsFormOpen(true);
  };

  const openEditForm = (book: Libro, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBook(book);
    setTitulo(book.titulo);
    setAutor(book.autor);
    setDescripcion(book.descripcion);
    setCategoria(book.categoria);
    setLinkDescarga(book.linkDescarga || "");
    setPdfData(book.pdfData || "");
    setPdfNombre(book.pdfNombre || "");
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !autor.trim()) return;

    if (editingBook) {
      const updatedList = libros.map((l) =>
        l.id === editingBook.id
          ? {
              ...l,
              titulo,
              autor,
              descripcion,
              categoria,
              linkDescarga: linkDescarga || undefined,
              pdfData: pdfData || undefined,
              pdfNombre: pdfNombre || undefined,
            }
          : l
      );
      setLibros(updatedList);
      saveLibros(updatedList);

      if (selectedBook?.id === editingBook.id) {
        setSelectedBook({
          ...selectedBook,
          titulo,
          autor,
          descripcion,
          categoria,
          linkDescarga: linkDescarga || undefined,
          pdfData: pdfData || undefined,
          pdfNombre: pdfNombre || undefined,
        });
      }
    } else {
      const newBook: Libro = {
        id: "libro_" + Date.now(),
        titulo,
        autor,
        descripcion,
        categoria,
        linkDescarga: linkDescarga || undefined,
        pdfData: pdfData || undefined,
        pdfNombre: pdfNombre || undefined,
      };
      const updatedList = [newBook, ...libros];
      setLibros(updatedList);
      saveLibros(updatedList);
      setSelectedBook(newBook);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Estás seguro de eliminar este Libro/Manuscrito de la lista?")) {
      const updatedList = libros.filter((l) => l.id !== id);
      setLibros(updatedList);
      saveLibros(updatedList);
      if (selectedBook?.id === id) {
        setSelectedBook(updatedList[0] || null);
      }
    }
  };

  const filtered = libros.filter((l) => {
    const matchesSearch =
      l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "todos" || l.categoria === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="libros-module">
      {/* List of Books Grid Card view (2/3 area) */}
      <div className={`lg:col-span-2 space-y-6 ${selectedBook ? "hidden lg:block" : "block"}`}>
        {/* Books filter header - Absolute Premium Class */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-[#101010] p-6 rounded-2xl border border-[#242424] shadow-2xl backdrop-blur-xl">
          <div className="flex flex-wrap gap-2.5">
            {["todos", "General", "Santería", "Ifá", "Palo Mayombe"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setCategoryFilter(lvl)}
                className={`px-4 py-2 text-xs font-serif font-bold rounded-xl border transition-all duration-300 cursor-pointer ${
                  categoryFilter === lvl
                    ? "bg-[#181818] text-[#D4AF37] border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                    : "bg-transparent text-[#A0A0A0] border-[#242424] hover:text-white hover:border-[#D4AF37]/35"
                }`}
              >
                {lvl === "todos" ? "Todos los Libros" : lvl}
              </button>
            ))}
          </div>

          <div className="relative flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <input
                type="text"
                placeholder="Buscar título o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black border border-[#242424] rounded-xl px-4 py-2.5 pl-9 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-[#D4AF37] w-full custom-transition"
              />
              <Search className="absolute left-3 top-3 text-zinc-500" size={12} />
            </div>
            
            {isAdmin && (
              <button
                onClick={openAddForm}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:opacity-90 active:scale-95 text-black px-5 py-2.5 rounded-xl text-xs font-serif font-black tracking-wider shadow-lg shadow-[#D4AF37]/10 custom-transition cursor-pointer shrink-0"
              >
                <PlusCircle size={15} />
                <span>Añadir</span>
              </button>
            )}
          </div>
        </div>

        {/* Catalog of books */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:h-[550px] lg:overflow-y-auto pr-2 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center p-14 text-center bg-[#101010] rounded-2xl border border-dashed border-[#242424]">
              <BookOpen className="text-zinc-650 mb-3 animate-pulse" size={36} />
              <p className="text-sm font-medium text-[#A0A0A0]">
                Ningún libro, guía o tratado registrado en esta sección educativa.
              </p>
              {isAdmin && (
                <button
                  onClick={openAddForm}
                  className="mt-4 text-xs text-[#D4AF37] hover:brightness-110 font-semibold"
                >
                  Registrar uno nuevo ahora
                </button>
              )}
            </div>
          ) : (
            filtered.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className={`group rounded-2xl border overflow-hidden cursor-pointer bg-[#101010] hover:bg-[#181818] transform hover:-translate-y-1.5 hover:scale-[1.015] custom-transition flex flex-col justify-between ${
                  selectedBook?.id === book.id
                    ? "border-[#D4AF37]/80 shadow-[0_0_20px_rgba(212,175,55,0.12)] bg-[#121212]"
                    : "border-[#242424] hover:border-[#D4AF37]/40 hover:shadow-[0_12px_30px_rgba(212,175,55,0.06)]"
                }`}
              >
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[9px] font-mono tracking-widest uppercase font-bold px-2 py-0.5 rounded-md bg-[#050505]/80 text-[#D4AF37] border border-[#242424]">
                        {book.categoria}
                      </span>
                      {book.pdfData && (
                        <span className="text-[8px] font-mono font-bold tracking-widest uppercase bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20 px-2 py-0.5 rounded-md">
                          PDF
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-base font-serif font-extrabold text-white group-hover:text-[#D4AF37] leading-tight custom-transition line-clamp-2">
                      {book.titulo}
                    </h4>
                    
                    <p className="text-[11px] text-[#A0A0A0] font-light italic flex items-center gap-1.5">
                      <span className="text-[#6E44FF] font-bold">Por:</span>
                      {book.autor}
                    </p>
                    
                    <p className="text-xs text-[#A0A0A0] font-light leading-relaxed line-clamp-3 pt-1">
                      {book.descripcion}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#242424]/40 flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase text-[#A0A0A0] flex items-center gap-1">
                      <BookOpen size={11} className="text-[#D4AF37]" /> Manual Doctrinario
                    </span>
                    {isAdmin && (
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => openEditForm(book, e)}
                          className="p-1.5 text-zinc-400 hover:text-[#D4AF37] custom-transition rounded-md hover:bg-[#181818]"
                          title="Editar"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(book.id, e)}
                          className="p-1.5 text-zinc-400 hover:text-[#E74C3C] custom-transition rounded-md hover:bg-[#181818]"
                          title="Eliminar"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Book Detail Panel Side Desk (1/3 area) */}
      <div className={`bg-[#101010] border border-[#242424] rounded-2xl p-6 lg:h-[636px] lg:overflow-y-auto flex flex-col justify-between shadow-2xl relative ${selectedBook ? "block" : "hidden lg:flex"}`}>
        {selectedBook ? (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-5">
              {/* Back button for mobile */}
              <button
                onClick={() => setSelectedBook(null)}
                className="lg:hidden flex items-center gap-1.5 text-xs text-[#D4AF37] hover:text-[#E8C97A] mb-5 bg-[#181818] border border-[#242424] px-4 py-2 rounded-xl cursor-pointer self-start"
              >
                ← Volver al estante
              </button>
              
              <div className="text-center pb-5 border-b border-[#242424]">
                <div className="w-20 h-24 bg-gradient-to-br from-[#181818] to-black border border-[#D4AF37]/35 rounded mx-auto flex items-center justify-center mb-4 shadow-xl border-t-4 border-t-[#D4AF37] relative">
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <BookOpen size={28} className="text-[#D4AF37]" />
                </div>
                
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 px-3 py-1 rounded-full font-bold">
                  {selectedBook.categoria}
                </span>
                
                <h3 className="text-lg lg:text-xl font-serif text-white font-extrabold mt-3 leading-snug">
                  {selectedBook.titulo}
                </h3>
                
                <p className="text-xs text-[#A0A0A0] italic mt-1 font-light">Autor: {selectedBook.autor}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] uppercase font-bold text-[#A0A0A0] tracking-widest font-mono">
                  Guía de Estudio y Reseña
                </h4>
                <p className="text-xs text-[#D8D8D8] leading-relaxed whitespace-pre-line bg-[#050505] p-4 rounded-xl border border-[#242424] font-light">
                  {selectedBook.descripcion || "No hay una sinopsis de estudio cargada para este libro religioso."}
                </p>
              </div>

              {selectedBook.pdfData && (
                <div className="bg-[#181818] p-4 rounded-xl border border-[#D4AF37]/25 space-y-3 relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#D4AF37]/5 rounded-full blur-lg"></div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-[#D4AF37] flex items-center gap-1.5 tracking-wider font-mono text-[10px]">
                      <Download size={13} className="text-[#6E44FF]" /> PDF INTEGRADO MUNDO IYAWÓ
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 truncate max-w-[110px]" title={selectedBook.pdfNombre}>
                      {selectedBook.pdfNombre || "libro_yawo.pdf"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDownloadPdf(selectedBook)}
                    className="w-full text-center bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-105 text-black py-2.5 rounded-lg text-xs font-serif font-black tracking-wider shadow-md shadow-[#D4AF37]/15 custom-transition block cursor-pointer"
                  >
                    DESCARGAR LIBRO PDF
                  </button>
                </div>
              )}

              {selectedBook.linkDescarga && (
                <div className="bg-[#050505] p-4 rounded-xl border border-[#242424] space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#A0A0A0] flex items-center gap-1.5 tracking-wider font-mono text-[9px]">
                      <Download size={13} className="text-[#6E44FF]" /> RECURSO WEB EXTERNO
                    </span>
                    <span className="text-[9px] font-mono text-zinc-650">Tratado Externo</span>
                  </div>
                  <a
                    href={selectedBook.linkDescarga}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center bg-transparent hover:bg-white/5 text-white py-2.5 rounded-lg text-xs font-serif font-bold tracking-wider custom-transition block cursor-pointer border border-[#242424] hover:border-[#D4AF37]/40"
                  >
                    CONSULTAR TRATADO ONLINE
                  </a>
                </div>
              )}
            </div>

            {isAdmin && (
              <div className="mt-8 pt-5 border-t border-[#242424] flex gap-3">
                <button
                  onClick={(e) => openEditForm(selectedBook, e)}
                  className="flex-1 py-3 bg-[#181818] hover:bg-[#202020] border border-[#D4AF37]/45 text-[#D4AF37] hover:text-white rounded-xl text-center text-xs font-serif font-black tracking-wide custom-transition cursor-pointer"
                >
                  Editar Manual
                </button>
                <button
                  onClick={() => openAddForm()}
                  className="px-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] text-black hover:opacity-90 rounded-xl text-xs font-serif font-black tracking-widest uppercase custom-transition cursor-pointer"
                >
                  Añadir Otro
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-[#A0A0A0] py-16 px-4">
            <div className="w-16 h-16 rounded-2xl bg-[#181818] border border-[#242424] flex items-center justify-center mb-4 relative shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#6E44FF]/20 to-[#D4AF37]/15 rounded-2xl blur opacity-30"></div>
              <HelpCircle size={22} className="text-[#D4AF37] relative z-10 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold font-serif text-white tracking-widest uppercase">Ningún Libro Seleccionado</h4>
            <p className="text-xs text-[#A0A0A0] max-w-[240px] mt-2 leading-relaxed">
              Presiona sobre cualquier libro del estante para ver su ficha literaria y acceder a los recursos de descarga.
            </p>
          </div>
        )}
      </div>

      {/* Book Creator/Editor Dialog */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-[#101010] border border-[#242424] rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 text-[#A0A0A0] hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-2xl font-serif text-white font-extrabold mb-5 flex items-center gap-2">
              <Sparkles className="text-[#D4AF37] animate-pulse" size={20} />
              {editingBook ? "Modificar Ficha de Tratado" : "Registrar Tratado en el Estante"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest text-[#A0A0A0] uppercase font-mono font-bold mb-1.5">Título del Libro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. El Diloggun: Oráculo del Santero"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none custom-transition placeholder-zinc-750"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest text-[#A0A0A0] uppercase font-mono font-bold mb-1.5">Autor o Recopilador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Lydia Cabrera"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none custom-transition placeholder-zinc-750"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-widest text-[#A0A0A0] uppercase font-mono font-bold mb-1.5">Categoría Teológica</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none custom-transition cursor-pointer"
                  >
                    <option value="General">General / Etnográfico</option>
                    <option value="Santería">Santería (Osha)</option>
                    <option value="Ifá">Ifá (Babalaos)</option>
                    <option value="Palo Mayombe">Palo Mayombe (Regla Congo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-widest text-[#A0A0A0] uppercase font-mono font-bold mb-1.5">Enlace de Descarga (Opcional)</label>
                  <input
                    type="text"
                    placeholder="https://ejemplo.com/archivo.pdf"
                    value={linkDescarga}
                    onChange={(e) => setLinkDescarga(e.target.value)}
                    className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl px-4.5 py-3 text-xs text-white focus:outline-none custom-transition placeholder-zinc-750"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest text-[#A0A0A0] uppercase font-mono font-bold mb-1.5">
                  Archivo PDF del Libro (Almacenamiento Local)
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-5 text-center custom-transition relative ${
                    dragActive
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-white"
                      : pdfData
                      ? "border-[#2ECC71]/40 bg-[#2ECC71]/5 text-white animate-pulse"
                      : "border-[#242424] hover:border-[#D4AF37]/45 bg-[#050505] text-[#A0A0A0]"
                  }`}
                >
                  <input
                    type="file"
                    id="pdf-file-upload"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {pdfData ? (
                    <div className="flex items-center justify-between gap-3 text-xs bg-black/50 p-3 rounded-xl border border-[#242424]">
                      <div className="flex items-center gap-2.5 text-zinc-200 truncate pr-4">
                        <BookOpen size={16} className="text-[#2ECC71] shrink-0" />
                        <span className="truncate text-xs font-mono font-semibold text-white/95" title={pdfNombre}>{pdfNombre || "libro.pdf"}</span>
                      </div>
                      <div className="flex items-center gap-2 font-sans">
                        <span className="text-[9px] text-[#2ECC71] font-bold bg-[#2ECC71]/10 px-2 py-0.5 rounded border border-[#2ECC71]/20">Listo</span>
                        <button
                          type="button"
                          onClick={() => {
                            setPdfData("");
                            setPdfNombre("");
                          }}
                          className="p-1 hover:text-[#E74C3C] text-zinc-500 hover:bg-[#101010] rounded transition-colors cursor-pointer"
                          title="Eliminar archivo"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="pdf-file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center py-3 space-y-2 group"
                    >
                      <Download size={22} className="text-zinc-600 group-hover:text-[#D4AF37] mb-1 custom-transition" />
                      <span className="text-xs text-[#D8D8D8] font-bold group-hover:text-white custom-transition">
                        {dragActive ? "¡Suelte el PDF ahora!" : "Arrastre su PDF aquí o presione para buscar"}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Límite sugerido: 8MB para memoria del navegador
                      </span>
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-widest text-[#A0A0A0] uppercase font-mono font-bold mb-1.5">Descripción, Reseña o Sinopsis</label>
                <textarea
                  rows={4}
                  placeholder="Detalla de qué trata este libro sacrosanto, qué capítulos importantes tiene o por qué es clave en el estudio de las religiones..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] focus:border-[#D4AF37] rounded-xl p-4 text-xs text-white focus:outline-none resize-none leading-relaxed placeholder-zinc-750"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 text-xs font-serif font-bold text-zinc-400 hover:text-white custom-transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] text-black px-6 py-2.5 rounded-xl text-xs font-serif font-black tracking-widest uppercase shadow-lg shadow-[#D4AF37]/10 cursor-pointer"
                >
                  {editingBook ? "GUARDAR CAMBIOS" : "MONTAR TRATADO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
