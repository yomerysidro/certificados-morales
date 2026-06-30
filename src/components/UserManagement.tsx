/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Award,
  Calendar,
  UserPlus,
  RefreshCcw,
  Search,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  Lock,
  Settings
} from 'lucide-react';
import { Usuario, Certificado, Reemision, UserRole, Rol, Modulo, Permiso } from '../types';

interface UserManagementProps {
  usuarios: Usuario[];
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
  certificados: Certificado[];
  setCertificados: React.Dispatch<React.SetStateAction<Certificado[]>>;
  reemisiones: Reemision[];
  setReemisiones: React.Dispatch<React.SetStateAction<Reemision[]>>;
  actividadesCount: number;
  roles: Rol[];
  modulos: Modulo[];
  setModulos: React.Dispatch<React.SetStateAction<Modulo[]>>;
  permisos: Permiso[];
  setPermisos: React.Dispatch<React.SetStateAction<Permiso[]>>;
  onTriggerError?: (msg: string) => void;
}

export default function UserManagement({
  usuarios,
  setUsuarios,
  certificados,
  setCertificados,
  reemisiones,
  setReemisiones,
  actividadesCount,
  roles,
  modulos,
  setModulos,
  permisos,
  setPermisos,
  onTriggerError
}: UserManagementProps) {
  const [adminView, setAdminView] = useState<'dashboard' | 'users' | 'reissue' | 'permissions'>('dashboard');
  const [selectedRoleId, setSelectedRoleId] = useState<number>(2); // Default to Digitador for quick testing

  // User list state
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [stateFilter, setStateFilter] = useState<string>('');

  // User modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    dni: '',
    nombre_completo: '',
    correo: '',
    password_hash: '',
    estado: 'Activo' as 'Activo' | 'Inactivo',
    id_rol: 'Digitador' as UserRole
  });
  const [modalError, setModalError] = useState('');

  // Reissue state
  const [reissueSearch, setReissueSearch] = useState('');
  const [searchedCert, setSearchedCert] = useState<Certificado | null>(null);
  const [reissueReason, setReissueReason] = useState('');
  const [reissueSuccess, setReissueSuccess] = useState(false);

  // Dynamic Module Creator state
  const [newModuleForm, setNewModuleForm] = useState({
    nombre_modulo: '',
    ruta: ''
  });
  const [moduleError, setModuleError] = useState('');
  const [moduleSuccess, setModuleSuccess] = useState('');

  // Stats calculate
  const activeUsers = usuarios.filter(u => u.estado === 'Activo').length;
  const issuedCertificates = certificados.filter(c => c.estado === 'Válido').length;

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      dni: '',
      nombre_completo: '',
      correo: '',
      password_hash: '',
      estado: 'Activo',
      id_rol: 'Digitador'
    });
    setModalError('');
    setShowUserModal(true);
  };

  const handleOpenEditModal = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      dni: user.dni,
      nombre_completo: user.nombre_completo,
      correo: user.correo,
      password_hash: user.password_hash,
      estado: user.estado,
      id_rol: user.id_rol
    });
    setModalError('');
    setShowUserModal(true);
  };

  const handleToggleState = (dni: string) => {
    setUsuarios(prev => prev.map(u => {
      if (u.dni === dni) {
        return { ...u, estado: u.estado === 'Activo' ? 'Inactivo' : 'Activo' };
      }
      return u;
    }));
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    // DNI 8 digits validation
    if (formData.dni.trim().length !== 8 || !/^\d+$/.test(formData.dni)) {
      const errorMsg = 'El DNI debe tener exactamente 8 dígitos numéricos.';
      setModalError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    // Email format validation
    if (!formData.correo.includes('@') || !formData.correo.includes('.')) {
      const errorMsg = 'Ingresa un correo electrónico válido.';
      setModalError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    // Duplications checks
    if (!editingUser) {
      // Create mode checks
      const dniExists = usuarios.some(u => u.dni === formData.dni);
      if (dniExists) {
        const errorMsg = 'DNI duplicado: Ya existe un usuario registrado con este DNI.';
        setModalError(errorMsg);
        if (onTriggerError) onTriggerError(errorMsg);
        return;
      }

      const emailExists = usuarios.some(u => u.correo.toLowerCase() === formData.correo.toLowerCase());
      if (emailExists) {
        const errorMsg = 'Correo duplicado: Ya existe un usuario registrado con este correo.';
        setModalError(errorMsg);
        if (onTriggerError) onTriggerError(errorMsg);
        return;
      }

      // Add user
      setUsuarios(prev => [...prev, { ...formData }]);
    } else {
      // Edit mode checks (skip own self)
      const dniExists = usuarios.some(u => u.dni === formData.dni && u.dni !== editingUser.dni);
      if (dniExists) {
        const errorMsg = 'DNI duplicado: Ya existe otro usuario registrado con este DNI.';
        setModalError(errorMsg);
        if (onTriggerError) onTriggerError(errorMsg);
        return;
      }

      const emailExists = usuarios.some(u => u.correo.toLowerCase() === formData.correo.toLowerCase() && u.dni !== editingUser.dni);
      if (emailExists) {
        const errorMsg = 'Correo duplicado: Ya existe otro usuario registrado con este correo.';
        setModalError(errorMsg);
        if (onTriggerError) onTriggerError(errorMsg);
        return;
      }

      // Update user
      setUsuarios(prev => prev.map(u => u.dni === editingUser.dni ? { ...formData } : u));
    }

    setShowUserModal(false);
  };

  // Reissuing flow logic
  const handleReissueSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedCert(null);
    setReissueSuccess(false);

    const term = reissueSearch.trim().toLowerCase();
    if (!term) return;

    const matched = certificados.find(
      c => c.codigo_unico.toLowerCase() === term || c.dni_titular === term
    );
    setSearchedCert(matched || null);
  };

  const handleConfirmReissue = () => {
    if (!searchedCert) return;
    if (!reissueReason.trim()) {
      const msg = 'El motivo de reemisión es obligatorio.';
      alert(msg);
      return;
    }

    // Revoke old certificate and spawn a reissued item
    const newCode = `MDM-2026-RE-${Math.floor(100000 + Math.random() * 900000)}`;
    const newHash = 're' + Math.random().toString(16).slice(2, 64);
    
    // Create reissued record
    const newReissue: Reemision = {
      id: `reem-${Date.now()}`,
      codigo_certificado: searchedCert.codigo_unico,
      dni_participante: searchedCert.dni_titular,
      nombre_participante: searchedCert.nombre_titular,
      origen: searchedCert.nombre_origen,
      motivo: reissueReason,
      fecha_reemision: '2026-06-29 16:01',
      usuario_reemisor: 'Ing. Alejandro Reátegui (Admin)'
    };

    // Update certificates array - change searched cert to Revoked and optionally add a new valid one if requested, but prompt says "reemitir certificado" (just mark and show history)
    setCertificados(prev => prev.map(c => {
      if (c.codigo_unico === searchedCert.codigo_unico) {
        return { ...c, estado: 'Válido' }; // Keep/renew validity and document change
      }
      return c;
    }));

    setReemisiones(prev => [newReissue, ...prev]);
    setReissueReason('');
    setReissueSuccess(true);
    // Refresh display
    setSearchedCert(prev => prev ? { ...prev, estado: 'Válido' } : null);
  };

  // Filtered users lists
  const filteredUsuarios = usuarios.filter(u => {
    const rMatch = roleFilter === '' || u.id_rol === roleFilter;
    const sMatch = stateFilter === '' || u.estado === stateFilter;
    return rMatch && sMatch;
  });

  return (
    <div className="space-y-6" id="admin-panel-root">
      {/* Admin Navigation Tab */}
      <div className="flex flex-wrap border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm gap-1">
        <button
          onClick={() => setAdminView('dashboard')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            adminView === 'dashboard'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="admin-tab-dash"
        >
          Dashboard Admin
        </button>
        <button
          onClick={() => setAdminView('users')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            adminView === 'users'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="admin-tab-users"
        >
          Gestión de Usuarios
        </button>
        <button
          onClick={() => setAdminView('reissue')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            adminView === 'reissue'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="admin-tab-reissue"
        >
          Reemitir Certificado
        </button>
        <button
          onClick={() => setAdminView('permissions')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 ${
            adminView === 'permissions'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="admin-tab-permissions"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Control de Accesos</span>
        </button>
      </div>

      {adminView === 'dashboard' && (
        /* P-02 — Dashboard Administrador */
        <div className="space-y-6 animate-fade-in" id="p-02-dashboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-sky-50 text-sky-950 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Usuarios Activos
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {activeUsers} <span className="text-xs text-slate-400 font-normal">de {usuarios.length}</span>
                </h4>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Certificados Emitidos
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {issuedCertificates}
                </h4>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Actividades
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {actividadesCount}
                </h4>
              </div>
            </div>
          </div>

          {/* Quick Access Menu */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 border-b border-slate-100 pb-2">
              Accesos Rápidos del Administrador
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setAdminView('users')}
                className="p-5 border border-slate-200 hover:border-sky-950 bg-slate-50 hover:bg-sky-50/25 rounded-xl text-left transition space-y-2 group"
              >
                <UserPlus className="w-6 h-6 text-sky-950 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-800 text-sm">Gestionar Usuarios</h4>
                <p className="text-xs text-slate-400">Crear directores, digitadores, ajustar roles y estados institucionales.</p>
              </button>
              <button
                onClick={() => setAdminView('reissue')}
                className="p-5 border border-slate-200 hover:border-sky-950 bg-slate-50 hover:bg-sky-50/25 rounded-xl text-left transition space-y-2 group"
              >
                <RefreshCcw className="w-6 h-6 text-sky-950 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-800 text-sm">Reemitir Certificado</h4>
                <p className="text-xs text-slate-400">Corregir, renovar o invalidar firmas de certificados emitidos por DNI.</p>
              </button>
              <button
                onClick={() => setAdminView('permissions')}
                className="p-5 border border-slate-200 hover:border-sky-950 bg-slate-50 hover:bg-sky-50/25 rounded-xl text-left transition space-y-2 group"
              >
                <Lock className="w-6 h-6 text-sky-950 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-800 text-sm">Control de Accesos</h4>
                <p className="text-xs text-slate-400">Administrar permisos de lectura y escritura por rol de usuario para los módulos.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {adminView === 'users' && (
        /* P-03 — Listado de usuarios */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in" id="p-03-users-list">
          
          {/* Header toolbar */}
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/70">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                Directorio General de Usuarios
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Administre las credenciales y permisos del personal municipal en Morales.
              </p>
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center space-x-2 bg-sky-950 hover:bg-sky-900 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-md"
              id="admin-btn-create-user"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>

          {/* Filtering bar */}
          <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-500 block mb-1">Filtrar por Rol</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-medium text-slate-700"
              >
                <option value="">Todos los Roles</option>
                <option value="Administrador">Administrador</option>
                <option value="Digitador">Digitador</option>
                <option value="Gerencial">Gerencial</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-500 block mb-1">Filtrar por Estado</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-medium text-slate-700"
              >
                <option value="">Todos los Estados</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <th className="py-3 px-6">DNI</th>
                  <th className="py-3 px-6">Nombre Completo</th>
                  <th className="py-3 px-6">Correo Institucional</th>
                  <th className="py-3 px-6">Rol de Sistema</th>
                  <th className="py-3 px-6">Estado</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredUsuarios.map((u, idx) => (
                  <tr 
                    key={u.dni} 
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-slate-50 transition`}
                  >
                    <td className="py-3 px-6 font-mono">{u.dni}</td>
                    <td className="py-3 px-6 font-bold text-slate-800">{u.nombre_completo}</td>
                    <td className="py-3 px-6 font-mono">{u.correo}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase border ${
                        u.id_rol === 'Administrador'
                          ? 'bg-rose-50 text-rose-700 border-rose-100'
                          : u.id_rol === 'Gerencial'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-sky-50 text-sky-700 border-sky-100'
                      }`}>
                        {u.id_rol}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.estado === 'Activo'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}>
                        {u.estado}
                      </span>
                    </td>
                    <td className="py-3 px-6 flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="p-1.5 text-slate-500 hover:text-sky-950 hover:bg-slate-100 rounded-lg transition"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleState(u.dni)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg transition ${
                          u.estado === 'Activo'
                            ? 'bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {u.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminView === 'reissue' && (
        /* P-05 — Reemitir certificado */
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in" id="p-05-reissue">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              Módulo de Reemisión de Certificados
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Corrija datos, actualice firmas o revalide documentos emitidos oficialmente.
            </p>
          </div>

          <form onSubmit={handleReissueSearch} className="max-w-md flex space-x-2">
            <div className="relative flex-grow text-xs">
              <input
                type="text"
                placeholder="Ingrese Código Único o DNI de participante"
                value={reissueSearch}
                onChange={(e) => setReissueSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-sky-950 focus:outline-none transition font-medium"
              />
              <span className="absolute left-3.5 top-2.5 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
            </div>
            <button
              type="submit"
              className="bg-sky-950 hover:bg-sky-900 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow"
            >
              Buscar
            </button>
          </form>

          {searchedCert && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-200 pb-3 text-xs">
                <div>
                  <span className="text-[10px] bg-sky-100 text-sky-950 font-bold px-2 py-0.5 rounded uppercase">
                    Certificado Encontrado
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm mt-1">
                    {searchedCert.nombre_titular}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Código: {searchedCert.codigo_unico} • DNI: {searchedCert.dni_titular}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  searchedCert.estado === 'Válido'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {searchedCert.estado}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-bold">Actividad / Origen</p>
                  <p className="text-slate-700 font-medium">{searchedCert.nombre_origen}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold">Fecha Emisión</p>
                  <p className="text-slate-700 font-mono">{searchedCert.fecha_emision}</p>
                </div>
              </div>

              {/* Form motive */}
              <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 block uppercase tracking-wider">
                    Motivo de Reemisión <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Escriba obligatoriamente el motivo administrativo por el cual se procede con la reemisión del certificado..."
                    value={reissueReason}
                    onChange={(e) => setReissueReason(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-3 text-slate-700 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleConfirmReissue}
                    className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition shadow-md"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmar Reemisión</span>
                  </button>
                </div>
              </div>

              {reissueSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center space-x-2 text-xs">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>El certificado ha sido reemitido y acreditado correctamente con estado Válido en el portal.</span>
                </div>
              )}
            </div>
          )}

          {/* History of reissuances of database */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-700 text-sm flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Historial de Reemisiones del Sistema</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    <th className="py-2.5 px-4">Fecha</th>
                    <th className="py-2.5 px-4">Código Certificado</th>
                    <th className="py-2.5 px-4">Titular</th>
                    <th className="py-2.5 px-4">Motivo Administrativo</th>
                    <th className="py-2.5 px-4">Usuario Responsable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {reemisiones.map((rem) => (
                    <tr key={rem.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-4 font-mono text-[10px]">{rem.fecha_reemision}</td>
                      <td className="py-2 px-4 font-mono font-bold text-sky-950">{rem.codigo_certificado}</td>
                      <td className="py-2 px-4 font-bold">{rem.nombre_participante}</td>
                      <td className="py-2 px-4 italic">"{rem.motivo}"</td>
                      <td className="py-2 px-4">{rem.usuario_reemisor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {adminView === 'permissions' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in" id="p-admin-permissions">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-800 flex items-center space-x-2">
                <Lock className="w-5 h-5 text-sky-950" />
                <span>Matriz de Permisos y Control de Accesos</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure las tablas <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">rol</span>, <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">modulo</span> y <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">permiso</span> de forma visual. El menú lateral se actualiza en tiempo real.
              </p>
            </div>
            
            {/* Quick alert to guide the user */}
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] px-3 py-1.5 rounded-xl flex items-center space-x-1.5 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
              <span>Cualquier cambio realizado en los accesos de lectura reconfigura inmediatamente el sidebar del rol correspondiente.</span>
            </div>
          </div>

          {/* Grid: 3 Roles Cards */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">1. Seleccione Rol del Sistema (Tabla: rol)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map(r => {
                const isSelected = selectedRoleId === r.id_rol;
                return (
                  <button
                    key={r.id_rol}
                    type="button"
                    onClick={() => setSelectedRoleId(r.id_rol)}
                    className={`p-4 border text-left rounded-2xl transition duration-150 relative overflow-hidden flex flex-col justify-between ${
                      isSelected 
                        ? 'border-sky-950 bg-sky-50/40 ring-2 ring-sky-950/20' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-0 right-0 bg-sky-950 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                        Activo
                      </span>
                    )}
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                          ID: {r.id_rol}
                        </span>
                        <h5 className="font-extrabold text-slate-800 text-sm">{r.nombre_rol}</h5>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{r.descripcion}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid / Table for Permissions (Tabla: permiso & modulo) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                2. Configurar Accesos de Módulos para: <span className="text-sky-950 font-black">{roles.find(r => r.id_rol === selectedRoleId)?.nombre_rol}</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  // Restore initial permissions for safety
                  if (confirm('¿Está seguro de restablecer los permisos predeterminados de fábrica?')) {
                    // Seed initial permissions
                    setPermisos([
                      { id_permiso: 1, id_rol: 1, id_modulo: 1, permiso_lectura: true, permiso_escritura: true },
                      { id_permiso: 2, id_rol: 1, id_modulo: 2, permiso_lectura: true, permiso_escritura: true },
                      { id_permiso: 3, id_rol: 1, id_modulo: 3, permiso_lectura: true, permiso_escritura: true },
                      { id_permiso: 4, id_rol: 1, id_modulo: 4, permiso_lectura: true, permiso_escritura: true },
                      { id_permiso: 5, id_rol: 1, id_modulo: 5, permiso_lectura: true, permiso_escritura: true },
                      { id_permiso: 6, id_rol: 2, id_modulo: 1, permiso_lectura: false, permiso_escritura: false },
                      { id_permiso: 7, id_rol: 2, id_modulo: 2, permiso_lectura: true, permiso_escritura: true },
                      { id_permiso: 8, id_rol: 2, id_modulo: 3, permiso_lectura: false, permiso_escritura: false },
                      { id_permiso: 9, id_rol: 2, id_modulo: 4, permiso_lectura: true, permiso_escritura: false },
                      { id_permiso: 10, id_rol: 2, id_modulo: 5, permiso_lectura: false, permiso_escritura: false },
                      { id_permiso: 11, id_rol: 3, id_modulo: 1, permiso_lectura: false, permiso_escritura: false },
                      { id_permiso: 12, id_rol: 3, id_modulo: 2, permiso_lectura: false, permiso_escritura: false },
                      { id_permiso: 13, id_rol: 3, id_modulo: 3, permiso_lectura: true, permiso_escritura: false },
                      { id_permiso: 14, id_rol: 3, id_modulo: 4, permiso_lectura: true, permiso_escritura: false },
                      { id_permiso: 15, id_rol: 3, id_modulo: 5, permiso_lectura: false, permiso_escritura: false }
                    ]);
                  }
                }}
                className="text-[10px] text-slate-500 hover:text-sky-950 font-bold uppercase tracking-wider flex items-center space-x-1 hover:underline"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Restablecer Accesos</span>
              </button>
            </div>

            {/* Matrix table representation */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      <th className="py-4 px-6">ID Módulo</th>
                      <th className="py-4 px-6">Módulo Institucional (Tabla: modulo)</th>
                      <th className="py-4 px-6">Ruta / Identificador</th>
                      <th className="py-4 px-6 text-center">Permiso Lectura (Ver en Sidebar)</th>
                      <th className="py-4 px-6 text-center">Permiso Escritura (Guardar/Acciones)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {modulos.map(mod => {
                      // Find the permission record for the current selectedRoleId and current id_modulo
                      const perm = permisos.find(
                        p => p.id_rol === selectedRoleId && p.id_modulo === mod.id_modulo
                      ) || {
                        id_permiso: Math.floor(Math.random() * 100000),
                        id_rol: selectedRoleId,
                        id_modulo: mod.id_modulo,
                        permiso_lectura: false,
                        permiso_escritura: false
                      };

                      const handleToggleLectura = () => {
                        setPermisos(prev => {
                          const exists = prev.some(p => p.id_rol === selectedRoleId && p.id_modulo === mod.id_modulo);
                          if (exists) {
                            return prev.map(p => {
                              if (p.id_rol === selectedRoleId && p.id_modulo === mod.id_modulo) {
                                // If turning off read, also turn off write
                                const nextRead = !p.permiso_lectura;
                                return { 
                                  ...p, 
                                  permiso_lectura: nextRead,
                                  permiso_escritura: nextRead ? p.permiso_escritura : false
                                };
                              }
                              return p;
                            });
                          } else {
                            return [...prev, {
                              id_permiso: Date.now(),
                              id_rol: selectedRoleId,
                              id_modulo: mod.id_modulo,
                              permiso_lectura: true,
                              permiso_escritura: false
                            }];
                          }
                        });
                      };

                      const handleToggleEscritura = () => {
                        setPermisos(prev => {
                          const exists = prev.some(p => p.id_rol === selectedRoleId && p.id_modulo === mod.id_modulo);
                          if (exists) {
                            return prev.map(p => {
                              if (p.id_rol === selectedRoleId && p.id_modulo === mod.id_modulo) {
                                const nextWrite = !p.permiso_escritura;
                                return { 
                                  ...p, 
                                  permiso_escritura: nextWrite,
                                  // If turning on write, automatically turn on read
                                  permiso_lectura: nextWrite ? true : p.permiso_lectura
                                };
                              }
                              return p;
                            });
                          } else {
                            return [...prev, {
                              id_permiso: Date.now(),
                              id_rol: selectedRoleId,
                              id_modulo: mod.id_modulo,
                              permiso_lectura: true,
                              permiso_escritura: true
                            }];
                          }
                        });
                      };

                      return (
                        <tr key={mod.id_modulo} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-6 font-mono text-[11px] font-bold text-slate-400">
                            #{mod.id_modulo}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-800">
                            {mod.nombre_modulo}
                          </td>
                          <td className="py-4 px-6 font-mono text-[10px] text-slate-400">
                            Página Figma: "{mod.ruta}"
                          </td>
                          
                          {/* Permiso Lectura Checkbox */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center">
                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={perm.permiso_lectura}
                                  onChange={handleToggleLectura}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-950"></div>
                              </label>
                            </div>
                          </td>

                          {/* Permiso Escritura Checkbox */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center">
                              <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={perm.permiso_escritura}
                                  onChange={handleToggleEscritura}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dynamic Module Creation Form Section */}
            <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 space-y-4">
              <div>
                <h5 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                  3. Crear y Registrar Nuevo Módulo en el Sistema (Tabla: modulo)
                </h5>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Añada un nuevo módulo administrativo de forma dinámica. Se creará automáticamente un registro para cada rol, permitiéndole regular sus accesos desde la tabla superior.
                </p>
              </div>

              {moduleError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-[11px] font-medium">
                  {moduleError}
                </div>
              )}

              {moduleSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg text-[11px] font-medium">
                  {moduleSuccess}
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setModuleError('');
                  setModuleSuccess('');

                  const name = newModuleForm.nombre_modulo.trim();
                  const route = newModuleForm.ruta.trim().toLowerCase();

                  if (!name || !route) {
                    setModuleError('Todos los campos son obligatorios.');
                    return;
                  }

                  const nameExists = modulos.some(m => m.nombre_modulo.toLowerCase() === name.toLowerCase());
                  const routeExists = modulos.some(m => m.ruta.toLowerCase() === route.toLowerCase());

                  if (nameExists) {
                    setModuleError('Ya existe un módulo registrado con ese nombre.');
                    return;
                  }
                  if (routeExists) {
                    setModuleError('Ya existe un módulo registrado con esa ruta.');
                    return;
                  }

                  const nextId = Math.max(...modulos.map(m => m.id_modulo), 0) + 1;
                  const newModulo = {
                    id_modulo: nextId,
                    nombre_modulo: name,
                    ruta: route
                  };

                  setModulos(prev => [...prev, newModulo]);

                  // Create permissions
                  setPermisos(prev => [
                    ...prev,
                    { id_permiso: Date.now(), id_rol: 1, id_modulo: nextId, permiso_lectura: true, permiso_escritura: true },
                    { id_permiso: Date.now() + 1, id_rol: 2, id_modulo: nextId, permiso_lectura: false, permiso_escritura: false },
                    { id_permiso: Date.now() + 2, id_rol: 3, id_modulo: nextId, permiso_lectura: false, permiso_escritura: false }
                  ]);

                  setModuleSuccess(`¡Módulo "${name}" creado con éxito con ID #${nextId}! Ahora aparece en la matriz superior para asignación.`);
                  setNewModuleForm({ nombre_modulo: '', ruta: '' });
                }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end"
              >
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block text-[9px]">Nombre del Módulo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Reporte de Firmas"
                    value={newModuleForm.nombre_modulo}
                    onChange={(e) => setNewModuleForm(prev => ({ ...prev, nombre_modulo: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block text-[9px]">Ruta / Identificador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: reportes-firmas"
                    value={newModuleForm.ruta}
                    onChange={(e) => setNewModuleForm(prev => ({ ...prev, ruta: e.target.value.replace(/[^a-zA-Z0-9-_]/g, '') }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-sky-950 hover:bg-sky-900 text-white font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg transition text-center shadow-sm w-full"
                >
                  + Registrar Módulo
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* P-04 Modal: Crear / Editar usuario */}
      {showUserModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
              <span>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</span>
              <button onClick={() => setShowUserModal(false)} className="text-white hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4 text-xs">
              {modalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start space-x-1.5" id="p-04-error">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* DNI */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">DNI (8 dígitos) *</label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  disabled={!!editingUser}
                  placeholder="Ej: 42156789"
                  value={formData.dni}
                  onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '') }))}
                  className="w-full border border-slate-200 rounded-lg p-2 font-mono focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Nombre Completo */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Nombres y Apellidos"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Correo */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Correo Institucional *</label>
                <input
                  type="email"
                  required
                  placeholder="nombre.apellido@moralesmuni.org.pe"
                  value={formData.correo}
                  onChange={(e) => setFormData(prev => ({ ...prev, correo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 font-mono focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">
                  Contraseña {editingUser ? '(Opcional)' : '*'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? 'Dejar vacío para no cambiar' : 'Contraseña de acceso'}
                  value={formData.password_hash}
                  onChange={(e) => setFormData(prev => ({ ...prev, password_hash: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Rol */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Rol asignado *</label>
                  <select
                    value={formData.id_rol}
                    onChange={(e) => setFormData(prev => ({ ...prev, id_rol: e.target.value as UserRole }))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Digitador">Digitador</option>
                    <option value="Gerencial">Gerencial</option>
                  </select>
                </div>

                {/* Estado */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Estado *</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value as 'Activo' | 'Inactivo' }))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-950 hover:bg-sky-900 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
