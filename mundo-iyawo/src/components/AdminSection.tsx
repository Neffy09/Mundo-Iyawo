import React, { useState } from "react";
import { UserAccount } from "../types";
import {
  UserPlus,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  ShieldAlert,
  Users,
  Clock,
  CheckCircle,
  Shield,
  Briefcase,
  Mail,
  Lock,
  ChevronRight,
  Info
} from "lucide-react";

interface AdminSectionProps {
  users: UserAccount[];
  onUpdateUsers: (updated: UserAccount[]) => void;
  currentUserEmail: string;
}

export default function AdminSection({ users, onUpdateUsers, currentUserEmail }: AdminSectionProps) {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all");
  
  // Custom dialog or expandable panel state to manually add user
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNombre, setNewNombre] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"admin" | "user">("user");
  const [newStatus, setNewStatus] = useState<"approved" | "pending">("approved");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Statistics calculations
  const totalUsers = users.length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;
  const approvedUsers = users.filter((u) => u.status === "approved" && u.role !== "admin").length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  // Search filter implementation
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && user.status === statusFilter;
  });

  // Action: Approve/Accept User
  const handleApproveUser = (userId: string) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: "approved" as const };
      }
      return u;
    });
    onUpdateUsers(updated);
  };

  // Action: Add user manually
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newNombre.trim() || !newEmail.trim() || !newPassword.trim()) {
      setFormError("Por favor complete todos los campos sagrados obligatorios.");
      return;
    }

    // Check duplicate
    if (users.some((u) => u.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      setFormError("Este correo ya está registrado en el portal de iniciación.");
      return;
    }

    const newUser: UserAccount = {
      id: "u_" + Date.now(),
      nombre: newNombre.trim(),
      email: newEmail.trim().toLowerCase(),
      password: newPassword.trim(),
      role: newRole,
      status: newStatus,
      fechaRegistro: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    const updated = [...users, newUser];
    onUpdateUsers(updated);

    // Reset
    setNewNombre("");
    setNewEmail("");
    setNewPassword("");
    setNewRole("user");
    setNewStatus("approved");
    setFormSuccess("¡El adepto ha sido registrado exitosamente!");
    
    setTimeout(() => {
      setFormSuccess("");
      setShowAddForm(false);
    }, 1500);
  };

  // Action: Delete/Remove user
  const handleDeleteUser = (userId: string, email: string) => {
    // Critical protection
    if (email.toLowerCase() === "neftali.pn.25@gmail.com") {
      alert("No es posible eliminar al Administrador Principal.");
      return;
    }
    if (email.toLowerCase() === currentUserEmail.toLowerCase()) {
      alert("No puedes eliminar tu propia cuenta en sesión activa.");
      return;
    }

    if (confirm(`¿Está seguro de que desea revocar el acceso de ${email}?`)) {
      const updated = users.filter((u) => u.id !== userId);
      onUpdateUsers(updated);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101010] border border-[#242424] p-5 rounded-2xl flex items-center gap-4 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono font-bold">Total Adeptos</span>
            <span className="text-2xl font-serif font-black text-white">{totalUsers}</span>
          </div>
        </div>

        <div className="bg-[#101010] border border-[#242424] p-5 rounded-2xl flex items-center gap-4 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Clock size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono font-bold">Solicitudes Pendientes</span>
            <span className="text-2xl font-serif font-black text-amber-400">
              {pendingUsers}
            </span>
          </div>
        </div>

        <div className="bg-[#101010] border border-[#242424] p-5 rounded-2xl flex items-center gap-4 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono font-bold">Estudiantes Activos</span>
            <span className="text-2xl font-serif font-black text-emerald-450">{approvedUsers}</span>
          </div>
        </div>

        <div className="bg-[#101010] border border-[#242424] p-5 rounded-2xl flex items-center gap-4 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#6E44FF]/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="w-12 h-12 rounded-xl bg-[#6E44FF]/10 flex items-center justify-center text-[#6E44FF]">
            <Shield size={20} />
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-mono font-bold">Administradores</span>
            <span className="text-2xl font-serif font-black text-white">{adminUsers}</span>
          </div>
        </div>
      </div>

      {/* Main control table and helper elements */}
      <div className="bg-[#101010] border border-[#242424] rounded-3xl overflow-hidden shadow-xl">
        {/* Header container with action controls */}
        <div className="p-6 border-b border-[#242424]/80 bg-black/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Shield size={16} className="text-[#D4AF37]" />
              <span>Portal de Control de Iniciados</span>
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Administra privilegios rituales, añade nuevos estudiantes y audita accesos pendientes.
            </p>
          </div>

          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setFormError("");
              setFormSuccess("");
            }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#E8C97A] hover:brightness-110 text-black px-5 py-2.5 rounded-xl text-xs font-serif font-black uppercase tracking-wider custom-transition cursor-pointer"
          >
            {showAddForm ? <X size={14} /> : <UserPlus size={14} />}
            <span>{showAddForm ? "Cancelar Registro" : "Añadir Adepto"}</span>
          </button>
        </div>

        {/* Manually Add User Form (Collapsible container) */}
        {showAddForm && (
          <form onSubmit={handleAddUserSubmit} className="p-6 border-b border-[#242424] bg-zinc-950/45 space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#E8C97A] font-serif font-bold uppercase tracking-wider pb-2 border-b border-[#242424]/40">
              <UserPlus size={14} />
              <span>Ingresar Nuevo Estudiante</span>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
                <ShieldAlert size={14} />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
                <CheckCircle size={14} />
                <span>{formSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Nombre de Iniciación</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Iyawo Nelson"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="w-full bg-black border border-[#242424] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] custom-transition"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Correo Electrónico</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
                    <Mail size={12} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="email@ejemplo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-black border border-[#242424] rounded-xl pl-9.5 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] custom-transition font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Contraseña temporal</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600">
                    <Lock size={12} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Escriba clave ritual"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black border border-[#242424] rounded-xl pl-9.5 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] custom-transition font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Rol del Portal</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as "admin" | "user")}
                  className="w-full bg-black border border-[#242424] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="user">Usuario (Estudiante / Iyawo / Practicante)</option>
                  <option value="admin">Administrador (Director del Templo)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400">Estado Inicial</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as "approved" | "pending")}
                  className="w-full bg-black border border-[#242424] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="approved">Aprobado / Acceso Inmediato</option>
                  <option value="pending">Pendiente / Espera de Aprobación</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-transparent text-zinc-400 hover:text-white text-xs font-semibold rounded-xl custom-transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-zinc-900 border border-[#242424] hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] text-[#D4AF37] text-xs font-serif font-black uppercase tracking-wider rounded-xl custom-transition cursor-pointer"
              >
                Confirmar Registro
              </button>
            </div>
          </form>
        )}

        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-[#242424] bg-black/20 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-650">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Buscar adepto por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/60 border border-[#242424] focus:border-[#D4AF37]/50 rounded-xl pl-9.5 pr-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none custom-transition"
            />
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto w-full md:w-auto">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold hidden sm:inline flex-shrink-0">
              Filtrar por:
            </span>
            <div className="grid grid-cols-3 sm:flex bg-black border border-[#242424] p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg custom-transition cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-[#1c1c1c] text-white"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                Todos ({totalUsers})
              </button>
              <button
                onClick={() => setStatusFilter("approved")}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg custom-transition cursor-pointer ${
                  statusFilter === "approved"
                    ? "bg-[#1c1c1c] text-emerald-400"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                Aprobados ({users.filter(u=>u.status==='approved').length})
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg custom-transition cursor-pointer ${
                  statusFilter === "pending"
                    ? "bg-[#1c1c1c] text-amber-500"
                    : "text-zinc-500 hover:text-zinc-350"
                }`}
              >
                En Espera ({pendingUsers})
              </button>
            </div>
          </div>
        </div>

        {/* User Table panel */}
        <div className="overflow-x-auto">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-zinc-650 flex flex-col items-center justify-center gap-2">
              <Users size={32} className="stroke-1 opacity-60" />
              <p className="text-xs">No se encontraron adeptos registrados con el filtro actual.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-[#242424] bg-zinc-950 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-4 px-6">Estudiante / Adepto</th>
                  <th className="py-4 px-3">Correo ritual</th>
                  <th className="py-4 px-3">Fecha de Ingreso</th>
                  <th className="py-4 px-3">Rol</th>
                  <th className="py-4 px-3">Acceso</th>
                  <th className="py-4 px-6 text-right">Acciones de Templo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]/40">
                {filteredUsers.map((user) => {
                  const isMainAdmin = user.email.toLowerCase() === "neftali.pn.25@gmail.com";
                  const isSelf = user.email.toLowerCase() === currentUserEmail.toLowerCase();
                  
                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-zinc-900/20 custom-transition ${
                        user.status === "pending" ? "bg-amber-500/[0.015]" : ""
                      }`}
                    >
                      <td className="py-4.5 px-6 font-medium text-white flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-serif text-sm border ${
                          isMainAdmin 
                            ? "bg-[#6E44FF]/10 text-[#6E44FF] border-[#6E44FF]/30" 
                            : user.role === "admin"
                              ? "bg-purple-950/20 text-purple-400 border-purple-500/20"
                              : "bg-[#181818] text-[#D4AF37] border-zinc-800"
                        }`}>
                          {user.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="block font-semibold text-zinc-200">{user.nombre}</span>
                          <span className="text-[10px] text-zinc-500 block font-light">Id: {user.id}</span>
                        </div>
                      </td>

                      <td className="py-4.5 px-3 font-mono text-zinc-350 text-[11px] font-medium">
                        {user.email}
                      </td>

                      <td className="py-4.5 px-3 text-zinc-450 font-medium">
                        {user.fechaRegistro}
                      </td>

                      <td className="py-4.5 px-3">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#6E44FF]/15 text-[#6E44FF] border border-[#6E44FF]/25">
                            <Shield size={10} />
                            <span>Admin</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-zinc-400 border border-zinc-800">
                            <Briefcase size={10} />
                            <span>Adeptos</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4.5 px-3">
                        {user.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Aprobado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/25 animate-pulse">
                            <span>Espera</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4.5 px-6 text-right space-x-2">
                        {user.status === "pending" && (
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-450 text-black px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider custom-transition cursor-pointer"
                            title="Aceptar y habilitar acceso en la página"
                          >
                            <Check size={11} strokeWidth={3} />
                            <span>Aceptar</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteUser(user.id, user.email)}
                          disabled={isMainAdmin || isSelf}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider custom-transition ${
                            isMainAdmin || isSelf
                              ? "bg-zinc-900 text-zinc-650 cursor-not-allowed opacity-35"
                              : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 cursor-pointer"
                          }`}
                          title={isMainAdmin ? "No se puede retirar al administrador principal" : "Cerrar acceso al templo para este usuario"}
                        >
                          <Trash2 size={11} />
                          <span>Retirar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Info helper banner */}
      <div className="bg-[#101010]/50 border border-zinc-900 p-5 rounded-2xl flex items-start gap-3.5">
        <Info size={16} className="text-[#D4AF37] shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-450 space-y-1 font-light">
          <p className="font-serif font-black uppercase text-[#D4AF37] text-[10px] tracking-widest block">
            Guía de Acceso para Advenedizos
          </p>
          <p className="leading-relaxed">
            Cuando nuevas personas intenten registrarse en la pantalla de bienvenida utilizando el enlace de inscripción, su cuenta se creará con el estado <strong className="text-amber-500 font-bold">"Espera"</strong>. Podrás ver sus nombres inmediatamente arriba y hacer clic en <span className="text-emerald-400 font-bold">"Aceptar"</span> para permitirles el acceso formal al portal educativo místico.
          </p>
        </div>
      </div>
    </div>
  );
}
