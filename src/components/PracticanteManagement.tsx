/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  FileText,
  Briefcase,
  Plus,
  Edit2,
  CheckCircle,
  XCircle,
  Award,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Practicante, Practica, Institucion, Certificado, Firmante } from '../types';

interface PracticanteManagementProps {
  practicantes: Practicante[];
  setPracticantes: React.Dispatch<React.SetStateAction<Practicante[]>>;
  practicas: Practica[];
  setPracticas: React.Dispatch<React.SetStateAction<Practica[]>>;
  instituciones: Institucion[];
  firmantes: Firmante[];
  certificados: Certificado[];
  setCertificados: React.Dispatch<React.SetStateAction<Certificado[]>>;
  onTriggerError?: (msg: string) => void;
}

export default function PracticanteManagement({
  practicantes,
  setPracticantes,
  practicas,
  setPracticas,
  instituciones,
  firmantes,
  certificados,
  setCertificados,
  onTriggerError
}: PracticanteManagementProps) {
  // Navigation inside practicantes
  const [activeTab, setActiveTab] = useState<'list' | 'catalog'>('list');

  // Modals
  const [showPracticanteModal, setShowPracticanteModal] = useState(false);
  const [editingPracticante, setEditingPracticante] = useState<Practicante | null>(null);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedPracticanteForCert, setSelectedPracticanteForCert] = useState<{ p: Practicante; pr: Practica } | null>(null);

  // Forms
  const [partForm, setPartForm] = useState({
    dni: '',
    nombre_completo: '',
    correo: '',
    carrera: '',
    jefe_supervisor: '',
    id_institucion: 'inst-1',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'En curso' as 'En curso' | 'Concluida'
  });
  const [formError, setFormError] = useState('');

  // Generation Modal Form
  const [selectedSignerId, setSelectedSignerId] = useState(() => firmantes[0]?.id || 'firm-1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Filter lists
  const [stateFilter, setStateFilter] = useState('');
  const [instFilter, setInstFilter] = useState('');

  const handleOpenNewPracticante = () => {
    setEditingPracticante(null);
    setPartForm({
      dni: '',
      nombre_completo: '',
      correo: '',
      carrera: '',
      jefe_supervisor: '',
      id_institucion: instituciones[0]?.id || 'inst-1',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'En curso'
    });
    setFormError('');
    setShowPracticanteModal(true);
  };

  const handleOpenEditPracticante = (p: Practicante, pr: Practica) => {
    setEditingPracticante(p);
    setPartForm({
      dni: p.dni,
      nombre_completo: p.nombre_completo,
      correo: p.correo,
      carrera: p.carrera,
      jefe_supervisor: p.jefe_supervisor,
      id_institucion: p.id_institucion,
      fecha_inicio: pr.fecha_inicio,
      fecha_fin: pr.fecha_fin,
      estado: pr.estado
    });
    setFormError('');
    setShowPracticanteModal(true);
  };

  const handleSavePracticante = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (partForm.dni.length !== 8 || !/^\d+$/.test(partForm.dni)) {
      const errorMsg = 'El DNI debe tener exactamente 8 dígitos.';
      setFormError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    if (new Date(partForm.fecha_fin) < new Date(partForm.fecha_inicio)) {
      const errorMsg = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
      setFormError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    if (editingPracticante) {
      // Update
      setPracticantes(prev => prev.map(p => p.dni === editingPracticante.dni ? {
        dni: partForm.dni,
        nombre_completo: partForm.nombre_completo,
        correo: partForm.correo,
        carrera: partForm.carrera,
        jefe_supervisor: partForm.jefe_supervisor,
        id_institucion: partForm.id_institucion
      } : p));

      setPracticas(prev => prev.map(pr => pr.dni_practicante === editingPracticante.dni ? {
        ...pr,
        fecha_inicio: partForm.fecha_inicio,
        fecha_fin: partForm.fecha_fin,
        estado: partForm.estado
      } : pr));
    } else {
      // Create
      const newP: Practicante = {
        dni: partForm.dni,
        nombre_completo: partForm.nombre_completo,
        correo: partForm.correo,
        carrera: partForm.carrera,
        jefe_supervisor: partForm.jefe_supervisor,
        id_institucion: partForm.id_institucion
      };

      const newPr: Practica = {
        id: `prac-${Date.now()}`,
        dni_practicante: partForm.dni,
        fecha_inicio: partForm.fecha_inicio,
        fecha_fin: partForm.fecha_fin,
        estado: partForm.estado,
        certificado_generado: false
      };

      setPracticantes(prev => [...prev, newP]);
      setPracticas(prev => [...prev, newPr]);
    }

    setShowPracticanteModal(false);
  };

  // --- GENERATE CERTIFICATE ---
  const handleOpenGenerateModal = (p: Practicante, pr: Practica) => {
    setSelectedPracticanteForCert({ p, pr });
    setGenSuccess(false);
    setIsGenerating(false);
    setGeneratedCode('');
    setShowGenerateModal(true);
  };

  const handleGeneratePracticaCert = () => {
    if (!selectedPracticanteForCert) return;
    setIsGenerating(true);

    setTimeout(() => {
      const code = `MDM-2026-PRAC-${Math.floor(100010 + Math.random() * 90000)}`;
      const certHash = 'sha256_' + Math.random().toString(16).slice(2, 64);
      
      const newCert: Certificado = {
        codigo_unico: code,
        fecha_emision: '2026-06-29',
        hash_sha256: certHash,
        ruta_archivo_pdf: `certificado_${selectedPracticanteForCert.p.dni}_practicas.pdf`,
        tipo_origen: 'practica',
        id_origen: selectedPracticanteForCert.pr.id,
        nombre_origen: `Prácticas Preprofesionales - ${selectedPracticanteForCert.p.carrera}`,
        dni_titular: selectedPracticanteForCert.p.dni,
        nombre_titular: selectedPracticanteForCert.p.nombre_completo,
        estado: 'Válido',
        horas: 360
      };

      // Add to global certificates
      setCertificados(prev => [newCert, ...prev]);

      // Mark practice as certificate_generado
      setPracticas(prev => prev.map(pr => {
        if (pr.id === selectedPracticanteForCert.pr.id) {
          return { ...pr, certificado_generado: true, codigo_certificado: code };
        }
        return pr;
      }));

      setGeneratedCode(code);
      setIsGenerating(false);
      setGenSuccess(true);
    }, 1500);
  };

  // List processing
  const practicanteList = practicantes.map(p => {
    const pr = practicas.find(item => item.dni_practicante === p.dni);
    const inst = instituciones.find(i => i.id === p.id_institucion);
    return {
      p,
      pr: pr || {
        id: '',
        dni_practicante: p.dni,
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'En curso' as const,
        certificado_generado: false
      },
      institucion_nombre: inst?.nombre_institucion || 'Externa'
    };
  });

  const filteredPracticantes = practicanteList.filter(item => {
    const sMatch = stateFilter === '' || item.pr.estado === stateFilter;
    const iMatch = instFilter === '' || item.p.id_institucion === instFilter;
    return sMatch && iMatch;
  });

  return (
    <div className="space-y-6" id="practicante-panel-root">
      
      {/* P-17 — Listado de practicantes */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in" id="p-17-practicantes">
        
        {/* Header Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/70">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              Control y Acreditación de Prácticas Preprofesionales
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervise el ingreso de practicantes y la emisión de constancias finales firmadas digitalmente.
            </p>
          </div>
          <button
            onClick={handleOpenNewPracticante}
            className="flex items-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md"
            id="digitador-btn-new-practicante"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Practicante</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-500 block mb-1">Filtrar por Estado</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
            >
              <option value="">Todos los Estados</option>
              <option value="En curso">En curso</option>
              <option value="Concluida">Concluida</option>
            </select>
          </div>
          <div>
            <label className="font-bold text-slate-500 block mb-1">Filtrar por Institución</label>
            <select
              value={instFilter}
              onChange={(e) => setInstFilter(e.target.value)}
              className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
            >
              <option value="">Todas las Instituciones</option>
              {instituciones.map(i => (
                <option key={i.id} value={i.id}>{i.nombre_institucion}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <th className="py-3 px-6">Practicante</th>
                <th className="py-3 px-6">Carrera / Institución</th>
                <th className="py-3 px-6">Supervisor</th>
                <th className="py-3 px-6">Periodo</th>
                <th className="py-3 px-6">Estado</th>
                <th className="py-3 px-6">Certificado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredPracticantes.map((item, idx) => (
                <tr 
                  key={item.p.dni}
                  className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-slate-50/80 transition`}
                >
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-800">{item.p.nombre_completo}</p>
                    <p className="text-[10px] text-slate-400 font-mono">DNI: {item.p.dni}</p>
                  </td>
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-800">{item.p.carrera}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]">{item.institucion_nombre}</p>
                  </td>
                  <td className="py-3.5 px-6 italic text-slate-600">{item.p.jefe_supervisor || 'No asignado'}</td>
                  <td className="py-3.5 px-6 font-mono text-slate-500 text-[11px]">
                    {item.pr.fecha_inicio} al {item.pr.fecha_fin}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.pr.estado === 'En curso'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      {item.pr.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      item.pr.certificado_generado
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {item.pr.certificado_generado ? 'Sí (Generado)' : 'No'}
                    </span>
                    {item.pr.codigo_certificado && (
                      <p className="text-[9px] font-mono text-slate-400 mt-0.5">{item.pr.codigo_certificado}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center space-x-1 flex items-center justify-center">
                    <button
                      onClick={() => handleOpenEditPracticante(item.p, item.pr)}
                      className="p-1.5 text-slate-500 hover:text-sky-950 hover:bg-slate-100 rounded-lg transition"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!item.pr.certificado_generado && item.pr.estado === 'Concluida' && (
                      <button
                        onClick={() => handleOpenGenerateModal(item.p, item.pr)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded text-[10px] uppercase transition flex items-center space-x-0.5"
                      >
                        <Award className="w-3 h-3" />
                        <span>Constancia</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* P-18 Modal: Registrar / Editar Practicante */}
      {showPracticanteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
              <span>{editingPracticante ? 'Editar Ficha de Prácticas' : 'Registrar Nuevo Practicante'}</span>
              <button onClick={() => setShowPracticanteModal(false)} className="text-white hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePracticante} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start space-x-1.5" id="p-18-error">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* DNI */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">DNI (8 dígitos) *</label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  disabled={!!editingPracticante}
                  placeholder="Ej: 73456821"
                  value={partForm.dni}
                  onChange={(e) => setPartForm(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '') }))}
                  className="w-full border border-slate-200 rounded-lg p-2 font-mono focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Nombre completo */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Nombres y Apellidos"
                  value={partForm.nombre_completo}
                  onChange={(e) => setPartForm(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Carrera & Institucion */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Carrera Profesional *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ingeniería de Sistemas"
                    value={partForm.carrera}
                    onChange={(e) => setPartForm(prev => ({ ...prev, carrera: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Institución Educativa *</label>
                  <select
                    value={partForm.id_institucion}
                    onChange={(e) => setPartForm(prev => ({ ...prev, id_institucion: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
                  >
                    {instituciones.map(i => (
                      <option key={i.id} value={i.id}>{i.nombre_institucion}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Supervisor & Correo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Jefe Supervisor</label>
                  <input
                    type="text"
                    placeholder="Ejem: Ing. Antonio Talián"
                    value={partForm.jefe_supervisor}
                    onChange={(e) => setPartForm(prev => ({ ...prev, jefe_supervisor: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Correo Electrónico</label>
                  <input
                    type="email"
                    placeholder="practicante@upeu.pe"
                    value={partForm.correo}
                    onChange={(e) => setPartForm(prev => ({ ...prev, correo: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Fecha Inicio Práctica *</label>
                  <input
                    type="date"
                    required
                    value={partForm.fecha_inicio}
                    onChange={(e) => setPartForm(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Fecha Fin Práctica *</label>
                  <input
                    type="date"
                    required
                    value={partForm.fecha_fin}
                    onChange={(e) => setPartForm(prev => ({ ...prev, fecha_fin: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Estado de Prácticas *</label>
                <select
                  value={partForm.estado}
                  onChange={(e) => setPartForm(prev => ({ ...prev, estado: e.target.value as 'En curso' | 'Concluida' }))}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
                >
                  <option value="En curso">En curso</option>
                  <option value="Concluida">Concluida</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPracticanteModal(false)}
                  className="border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-950 hover:bg-sky-900 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider transition"
                >
                  Guardar Ficha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* P-19 Modal: Generar Certificado de Práctica (Modal) */}
      {showGenerateModal && selectedPracticanteForCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col justify-between">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider shrink-0">
              <span>Emisión de Constancia de Prácticas Preprofesionales</span>
              <button onClick={() => setShowGenerateModal(false)} className="text-white hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-grow">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Practicante Summary and Selectors */}
                <div className="space-y-4">
                  <div>
                    <h5 className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px]">Ficha de Practicante</h5>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-1.5 space-y-2">
                      <p className="font-extrabold text-slate-800 text-base">{selectedPracticanteForCert.p.nombre_completo}</p>
                      <p className="text-slate-600">Carrera: <span className="font-bold">{selectedPracticanteForCert.p.carrera}</span></p>
                      <p className="text-slate-600">Institución: <span className="font-bold">{instituciones.find(i => i.id === selectedPracticanteForCert.p.id_institucion)?.nombre_institucion || 'Externa'}</span></p>
                      <p className="text-slate-500 font-mono text-[10px] pt-1">Periodo: {selectedPracticanteForCert.pr.fecha_inicio} al {selectedPracticanteForCert.pr.fecha_fin}</p>
                    </div>
                  </div>

                  {/* Signers selection */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Asignar Firmante de Constancia *</label>
                    <select
                      value={selectedSignerId}
                      onChange={(e) => setSelectedSignerId(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-slate-700 font-medium text-xs"
                    >
                      {firmantes.map((f, idx) => (
                        <option key={f.id} value={f.id}>
                          {f.nombre_completo} ({f.cargo}) - Orden {idx + 1}
                        </option>
                      ))}
                      {firmantes.length === 0 && (
                        <option value="none">No hay firmantes registrados en el sistema. Vaya a la sección "Firmantes" para registrarlos.</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Doc preview block */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-700 text-xs uppercase tracking-wider">
                      Previsualización de Constancia
                    </span>
                    <span className="bg-red-100 text-red-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
                      Borrador
                    </span>
                  </div>

                  <div className="transform scale-[0.6] origin-top-left w-[166%] aspect-[1.414/1] bg-white border-4 border-sky-950 rounded p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-1">
                      <h4 className="text-[7px] font-black uppercase text-sky-950 leading-tight">MUNICIPALIDAD DE MORALES</h4>
                      <span className="text-[5px] font-mono text-slate-400">MDM-2026-PRAC-SAMPLE</span>
                    </div>
                    <div className="text-center my-2 flex-grow flex flex-col justify-center">
                      <h3 className="text-[9px] font-serif text-sky-950 font-bold uppercase">CONSTANCIA DE PRÁCTICAS</h3>
                      <p className="text-[5px] text-slate-400 italic">Otorgado en reconocimiento oficial a:</p>
                      <h2 className="text-[10px] font-black text-slate-800 my-0.5 underline decoration-amber-400">
                        {selectedPracticanteForCert.p.nombre_completo}
                      </h2>
                      <p className="text-[5px] text-slate-500 max-w-[190px] mx-auto leading-tight">
                        Por haber culminado con éxito sus prácticas preprofesionales en el área informática de la municipalidad, completando un total de 360 horas registradas.
                      </p>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-100 pt-1">
                      <span className="text-[5px] text-slate-400">Firma digital Alcalde</span>
                      <span className="text-[5px] text-slate-400">Firma digital RR.HH.</span>
                    </div>
                  </div>
                </div>

              </div>

              {isGenerating && (
                <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex items-center justify-center space-x-2 text-sky-950 font-bold">
                  <Loader2 className="w-5 h-5 animate-spin text-sky-950" />
                  <span>Cifrando código SHA256 y sellando constancia final...</span>
                </div>
              )}

              {genSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 space-y-2">
                  <div className="flex items-center space-x-2 font-extrabold uppercase text-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>¡Constancia de prácticas emitida con éxito!</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Se ha generado el certificado único número <strong className="font-mono text-slate-800">{generatedCode}</strong> para <strong>{selectedPracticanteForCert.p.nombre_completo}</strong>. Ya está cargado en el Portal de Búsqueda Pública de Morales.
                  </p>
                  <button
                    onClick={() => alert(`Descargando archivo: certificado_${selectedPracticanteForCert.p.dni}_practicas.pdf`)}
                    className="mt-2 inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition"
                  >
                    <span>Descargar Constancia Generada (PDF)</span>
                  </button>
                </div>
              )}

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-slate-600"
              >
                Cerrar
              </button>
              {!genSuccess && (
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGeneratePracticaCert}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow-md"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Firmando...</span>
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4" />
                      <span>Generar Constancia</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
