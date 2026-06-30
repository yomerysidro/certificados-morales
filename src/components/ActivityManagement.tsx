/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Users,
  Award,
  UserCheck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Upload,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Check
} from 'lucide-react';
import {
  Actividad,
  Participante,
  ActividadParticipante,
  Ponente,
  Firmante,
  ActividadFirmante,
  Certificado
} from '../types';
import CertificatePreview from './CertificatePreview';

interface ActivityManagementProps {
  actividades: Actividad[];
  setActividades: React.Dispatch<React.SetStateAction<Actividad[]>>;
  participantes: Participante[];
  setParticipantes: React.Dispatch<React.SetStateAction<Participante[]>>;
  actividadParticipantes: ActividadParticipante[];
  setActividadParticipantes: React.Dispatch<React.SetStateAction<ActividadParticipante[]>>;
  ponentes: Ponente[];
  setPonentes: React.Dispatch<React.SetStateAction<Ponente[]>>;
  firmantes: Firmante[];
  certificados: Certificado[];
  setCertificados: React.Dispatch<React.SetStateAction<Certificado[]>>;
  onTriggerError?: (msg: string) => void;
}

export default function ActivityManagement({
  actividades,
  setActividades,
  participantes,
  setParticipantes,
  actividadParticipantes,
  setActividadParticipantes,
  ponentes,
  setPonentes,
  firmantes,
  certificados,
  setCertificados,
  onTriggerError
}: ActivityManagementProps) {
  // Navigation
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'participantes' | 'ponentes' | 'firmantes' | 'certificados'>('participantes');

  // Modals
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Actividad | null>(null);

  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participante | null>(null);

  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Ponente | null>(null);

  const [showSignerModal, setShowSignerModal] = useState(false);

  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Forms states
  const [actForm, setActForm] = useState({
    nombre: '',
    descripcion: '',
    tipo_actividad: 'Capacitación' as 'Capacitación' | 'Reconocimiento',
    fecha_inicio: '',
    fecha_fin: '',
    sede: 'Auditorio Municipal de Morales',
    area_organizadora: 'Gerencia Municipal'
  });
  const [actError, setActError] = useState('');

  const [partForm, setPartForm] = useState({
    dni: '',
    nombre_completo: '',
    correo: '',
    tipo_participante: 'Externo' as 'Municipal' | 'Externo',
    area_origen: ''
  });
  const [partError, setPartError] = useState('');

  const [spkForm, setSpkForm] = useState({
    dni: '',
    nombre: '',
    institucion_ponente: '',
    cargo: '',
    especialidad: ''
  });

  const [sigForm, setSigForm] = useState({
    id_firmante: '',
    orden_firma: 1
  });

  // Excel Import simulations
  const [showImportLogs, setShowImportLogs] = useState(false);
  const [importLogs, setImportLogs] = useState<{ dni: string; nombre: string; estado: 'Exitoso' | 'Error'; motivo?: string }[]>([]);

  // Gen State
  const [selectedParticipantsForCert, setSelectedParticipantsForCert] = useState<string[]>([]); // DNI list
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationResult, setGenerationResult] = useState<{ success: boolean; count: number } | null>(null);

  // Active activity
  const activeActivity = actividades.find(a => a.id === selectedActivityId);

  // Filter lists
  const [typeFilter, setTypeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  const handleOpenNewActivity = () => {
    setEditingActivity(null);
    setActForm({
      nombre: '',
      descripcion: '',
      tipo_actividad: 'Capacitación',
      fecha_inicio: '',
      fecha_fin: '',
      sede: 'Auditorio Municipal de Morales',
      area_organizadora: 'Gerencia Municipal'
    });
    setActError('');
    setShowActivityModal(true);
  };

  const handleOpenEditActivity = (a: Actividad) => {
    setEditingActivity(a);
    setActForm({
      nombre: a.nombre,
      descripcion: a.descripcion,
      tipo_actividad: a.tipo_actividad,
      fecha_inicio: a.fecha_inicio,
      fecha_fin: a.fecha_fin,
      sede: a.sede,
      area_organizadora: a.area_organizadora
    });
    setActError('');
    setShowActivityModal(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    setActError('');

    // End date check
    if (new Date(actForm.fecha_fin) < new Date(actForm.fecha_inicio)) {
      const errorMsg = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
      setActError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    if (editingActivity) {
      setActividades(prev => prev.map(a => a.id === editingActivity.id ? { ...a, ...actForm } : a));
    } else {
      const newAct: Actividad = {
        id: `act-${Date.now()}`,
        ...actForm,
        estado: 'Activa'
      };
      setActividades(prev => [newAct, ...prev]);
    }

    setShowActivityModal(false);
  };

  // Close activity trigger
  const handleCloseActivity = () => {
    if (!activeActivity) return;
    const confirm = window.confirm('¿Estás seguro que deseas CERRAR esta actividad? Esta acción no se puede deshacer y permitirá la emisión de certificados.');
    if (confirm) {
      setActividades(prev => prev.map(a => a.id === activeActivity.id ? { ...a, estado: 'Cerrada' } : a));
    }
  };

  // --- PARTICIPANTS CRUD ---
  const handleOpenNewParticipant = () => {
    setEditingParticipant(null);
    setPartForm({
      dni: '',
      nombre_completo: '',
      correo: '',
      tipo_participante: 'Externo',
      area_origen: ''
    });
    setPartError('');
    setShowParticipantModal(true);
  };

  const handleSaveParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    setPartError('');

    if (partForm.dni.length !== 8 || !/^\d+$/.test(partForm.dni)) {
      const errorMsg = 'El DNI debe tener exactamente 8 dígitos numéricos.';
      setPartError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    if (partForm.correo && (!partForm.correo.includes('@') || !partForm.correo.includes('.'))) {
      const errorMsg = 'Ingresa un correo electrónico válido.';
      setPartError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    // Check if DNI registered in this activity
    const alreadyReg = actividadParticipantes.some(
      ap => ap.id_actividad === selectedActivityId && ap.id_participante === partForm.dni
    );

    if (!editingParticipant && alreadyReg) {
      const errorMsg = 'DNI ya registrado: Este participante ya se encuentra registrado en esta actividad.';
      setPartError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    // Add or Update global participant dictionary
    const pExists = participantes.some(p => p.dni === partForm.dni);
    if (!pExists) {
      setParticipantes(prev => [...prev, { ...partForm }]);
    }

    // Associate
    if (!editingParticipant) {
      const newAp: ActividadParticipante = {
        id_actividad: selectedActivityId!,
        id_participante: partForm.dni,
        fecha_inscripcion: '2026-06-29',
        asistencia: false,
        certificado_generado: false
      };
      setActividadParticipantes(prev => [...prev, newAp]);
    } else {
      // update details in primary directory
      setParticipantes(prev => prev.map(p => p.dni === editingParticipant.dni ? { ...partForm } : p));
    }

    setShowParticipantModal(false);
  };

  const handleToggleAttendance = (dni: string) => {
    setActividadParticipantes(prev => prev.map(ap => {
      if (ap.id_actividad === selectedActivityId && ap.id_participante === dni) {
        return { ...ap, asistencia: !ap.asistencia };
      }
      return ap;
    }));
  };

  const handleDeleteParticipantAssociation = (dni: string) => {
    // Check if certificate already generated
    const ap = actividadParticipantes.find(item => item.id_actividad === selectedActivityId && item.id_participante === dni);
    if (ap?.certificado_generado) {
      const errorMsg = 'No se puede eliminar un participante que ya tiene certificado emitido.';
      alert(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    const confirm = window.confirm('¿Desea desvincular a este participante de la actividad?');
    if (confirm) {
      setActividadParticipantes(prev => prev.filter(
        item => !(item.id_actividad === selectedActivityId && item.id_participante === dni)
      ));
    }
  };

  // --- MOCK IMPORT EXCEL ---
  const handleSimulateImport = () => {
    const mockImports = [
      { dni: '44556677', nombre: 'Eduardo Vásquez Trigoso', estado: 'Exitoso' as const },
      { dni: '9922', nombre: 'Invalido DNI', estado: 'Error' as const, motivo: 'DNI con menos de 8 dígitos' },
      { dni: '42156789', nombre: 'Carlos Mendoza Ruiz', estado: 'Error' as const, motivo: 'DNI duplicado en la actividad' },
      { dni: '88776655', nombre: 'Gisella Pinedo Flores', estado: 'Exitoso' as const }
    ];

    setImportLogs(mockImports);
    setShowImportLogs(true);

    // Apply the successful ones
    mockImports.forEach(m => {
      if (m.estado === 'Exitoso') {
        const pExists = participantes.some(p => p.dni === m.dni);
        if (!pExists) {
          setParticipantes(prev => [...prev, {
            dni: m.dni,
            nombre_completo: m.nombre,
            correo: `${m.nombre.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            tipo_participante: 'Externo'
          }]);
        }

        const apExists = actividadParticipantes.some(ap => ap.id_actividad === selectedActivityId && ap.id_participante === m.dni);
        if (!apExists) {
          setActividadParticipantes(prev => [...prev, {
            id_actividad: selectedActivityId!,
            id_participante: m.dni,
            fecha_inscripcion: '2026-06-29',
            asistencia: true,
            certificado_generado: false
          }]);
        }
      }
    });
  };

  // --- SPEAKERS GRID ---
  const handleOpenSpeakerModal = () => {
    setEditingSpeaker(null);
    setSpkForm({
      dni: '',
      nombre: '',
      institucion_ponente: '',
      cargo: '',
      especialidad: ''
    });
    setShowSpeakerModal(true);
  };

  const handleSaveSpeaker = (e: React.FormEvent) => {
    e.preventDefault();
    const newSpk: Ponente = {
      id: `pon-${Date.now()}`,
      ...spkForm
    };
    setPonentes(prev => [...prev, newSpk]);
    setShowSpeakerModal(false);
  };

  // --- SIGNERS GRID ---
  const handleSaveSigner = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate linking signer ordering
    setShowSignerModal(false);
    alert('Firmante registrado para esta actividad en el orden seleccionado.');
  };

  // --- BULK CERTIFICATE GENERATION ---
  const handleOpenGenerateCertificates = () => {
    if (!activeActivity) return;
    if (activeActivity.estado !== 'Cerrada') {
      const errorMsg = 'Debes cerrar la actividad antes de generar certificados.';
      alert(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    // Gather attendees who don't have certs generated
    const attendees = activityAttendees.filter(a => !a.certificado_generado);
    setSelectedParticipantsForCert(attendees.map(a => a.dni));
    setGenerationResult(null);
    setGenerationProgress(0);
    setIsGenerating(false);
    setShowGenerateModal(true);
  };

  const handleStartBulkGeneration = () => {
    if (selectedParticipantsForCert.length === 0) return;
    setIsGenerating(true);
    setGenerationProgress(10);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Complete generation
          const newCerts: Certificado[] = [];
          
          selectedParticipantsForCert.forEach(dni => {
            const part = participantes.find(p => p.dni === dni);
            if (part) {
              const code = `MDM-2026-CAP-${Math.floor(100100 + Math.random() * 90000)}`;
              const certHash = 'sha256_' + Math.random().toString(16).slice(2, 64);
              newCerts.push({
                codigo_unico: code,
                fecha_emision: '2026-06-29',
                hash_sha256: certHash,
                ruta_archivo_pdf: `certificado_${dni}_${activeActivity?.id}.pdf`,
                tipo_origen: 'actividad',
                id_origen: activeActivity!.id,
                nombre_origen: activeActivity!.nombre,
                dni_titular: dni,
                nombre_titular: part.nombre_completo,
                estado: 'Válido',
                horas: 30
              });

              // Mark as generated
              setActividadParticipantes(prev => prev.map(ap => {
                if (ap.id_actividad === activeActivity!.id && ap.id_participante === dni) {
                  return { ...ap, certificado_generado: true, codigo_certificado: code };
                }
                return ap;
              }));
            }
          });

          setCertificados(prev => [...newCerts, ...prev]);
          setIsGenerating(false);
          setGenerationResult({ success: true, count: newCerts.length });
          return 100;
        }
        return prev + 30;
      });
    }, 400);
  };

  // List calculations
  const filteredActividades = actividades.filter(a => {
    const tMatch = typeFilter === '' || a.tipo_actividad === typeFilter;
    const sMatch = stateFilter === '' || a.estado === stateFilter;
    return tMatch && sMatch;
  });

  // Active activity associations
  const activityAttendees = actividadParticipantes
    .filter(ap => ap.id_actividad === selectedActivityId)
    .map(ap => {
      const part = participantes.find(p => p.dni === ap.id_participante);
      return {
        dni: ap.id_participante,
        nombre: part?.nombre_completo || 'Participante Desconocido',
        correo: part?.correo || '',
        tipo: part?.tipo_participante || 'Externo',
        asistencia: ap.asistencia,
        certificado_generado: ap.certificado_generado,
        codigo_certificado: ap.codigo_certificado
      };
    });

  const activitySpeakers = ponentes; // Simplify display all speakers

  return (
    <div className="space-y-6" id="digitador-workspace-root">
      {!selectedActivityId ? (
        /* P-07 — Listado de actividades */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden animate-fade-in" id="p-07-activities">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/70">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                Gestión de Actividades Institucionales
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Registre capacitaciones, cursos y eventos oficiales de la Municipalidad.
              </p>
            </div>
            <button
              onClick={handleOpenNewActivity}
              className="flex items-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-md"
              id="digitador-btn-new-activity"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Actividad</span>
            </button>
          </div>

          {/* Filtering bar */}
          <div className="p-4 border-b border-slate-100 bg-white grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-500 block mb-1">Tipo de Actividad</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
              >
                <option value="">Todas</option>
                <option value="Capacitación">Capacitación</option>
                <option value="Reconocimiento">Reconocimiento</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-500 block mb-1">Estado</label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
              >
                <option value="">Todos</option>
                <option value="Activa">Activa</option>
                <option value="Cerrada">Cerrada</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <th className="py-3 px-6">Actividad</th>
                  <th className="py-3 px-6">Tipo</th>
                  <th className="py-3 px-6">Inicio</th>
                  <th className="py-3 px-6">Fin</th>
                  <th className="py-3 px-6">Sede</th>
                  <th className="py-3 px-6">Estado</th>
                  <th className="py-3 px-6 text-center">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredActividades.map((a, idx) => (
                  <tr 
                    key={a.id} 
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} hover:bg-slate-50/80 transition`}
                  >
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-slate-800">{a.nombre}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{a.area_organizadora}</p>
                    </td>
                    <td className="py-3.5 px-6 font-semibold">{a.tipo_actividad}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-500">{a.fecha_inicio}</td>
                    <td className="py-3.5 px-6 font-mono text-slate-500">{a.fecha_fin}</td>
                    <td className="py-3.5 px-6 italic text-slate-600">{a.sede}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        a.estado === 'Activa'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {a.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <button
                        onClick={() => setSelectedActivityId(a.id)}
                        className="inline-flex items-center space-x-1 bg-sky-50 text-sky-950 font-bold px-2.5 py-1 rounded-lg hover:bg-sky-950 hover:text-white transition"
                      >
                        <span>Ver</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* P-09 — Detalle de actividad */
        <div className="space-y-6 animate-fade-in" id="p-09-activity-detail">
          <button
            onClick={() => setSelectedActivityId(null)}
            className="flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al listado de actividades</span>
          </button>

          {activeActivity && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-sky-50 text-sky-950 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-sky-200">
                      {activeActivity.tipo_actividad}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      activeActivity.estado === 'Activa'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {activeActivity.estado}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">
                    {activeActivity.nombre}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Área Organizadora: <span className="font-semibold">{activeActivity.area_organizadora}</span>
                  </p>
                </div>

                {/* Actions close or generate */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEditActivity(activeActivity)}
                    disabled={activeActivity.estado === 'Cerrada'}
                    className="border border-slate-200 hover:border-sky-950 disabled:opacity-50 text-slate-700 disabled:cursor-not-allowed hover:bg-slate-50 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                    title={activeActivity.estado === 'Cerrada' ? 'No se puede editar una actividad cerrada' : ''}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  {activeActivity.estado === 'Activa' ? (
                    <button
                      onClick={handleCloseActivity}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1 shadow-md"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cerrar Actividad</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenGenerateCertificates}
                      className="bg-sky-950 hover:bg-sky-900 text-white px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1 shadow-md"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Generar Certificados</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sub Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Sede</p>
                  <p className="font-semibold text-slate-700 mt-0.5">{activeActivity.sede}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Fechas de Desarrollo</p>
                  <p className="font-semibold text-slate-700 font-mono mt-0.5">{activeActivity.fecha_inicio} al {activeActivity.fecha_fin}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Descripción</p>
                  <p className="font-semibold text-slate-600 mt-0.5">{activeActivity.descripcion || 'Sin descripción.'}</p>
                </div>
              </div>

              {/* Detail Navigation tabs */}
              <div className="flex border-b border-slate-200 pb-px">
                <button
                  onClick={() => setActiveDetailTab('participantes')}
                  className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition ${
                    activeDetailTab === 'participantes'
                      ? 'border-sky-950 text-sky-950'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Participantes ({activityAttendees.length})
                </button>
                <button
                  onClick={() => setActiveDetailTab('ponentes')}
                  className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition ${
                    activeDetailTab === 'ponentes'
                      ? 'border-sky-950 text-sky-950'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Ponentes
                </button>
                <button
                  onClick={() => setActiveDetailTab('firmantes')}
                  className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition ${
                    activeDetailTab === 'firmantes'
                      ? 'border-sky-950 text-sky-950'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Firmantes
                </button>
              </div>

              {/* TAB CONTENT: PARTICIPANTES */}
              {activeDetailTab === 'participantes' && (
                /* P-10 — Gestión de participantes */
                <div className="space-y-4 animate-fade-in" id="p-10-participants">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="font-bold text-slate-700 text-sm">Personal e Invitados Inscritos</h4>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        onClick={handleSimulateImport}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 border border-slate-200 hover:border-sky-950 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Importar Excel</span>
                      </button>
                      <button
                        onClick={handleOpenNewParticipant}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Registrar Participante</span>
                      </button>
                    </div>
                  </div>

                  {showImportLogs && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                      <p className="font-bold text-slate-700">Resultados de la Importación Masiva:</p>
                      <div className="grid gap-2">
                        {importLogs.map((log, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded bg-white border border-slate-100">
                            <span className="font-mono text-slate-500">{log.dni}</span>
                            <span className="font-bold text-slate-800 flex-grow px-3">{log.nombre}</span>
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              log.estado === 'Exitoso' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {log.estado} {log.motivo && ` - ${log.motivo}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Attendees Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          <th className="py-2.5 px-4">DNI</th>
                          <th className="py-2.5 px-4">Nombre Completo</th>
                          <th className="py-2.5 px-4">Tipo</th>
                          <th className="py-2.5 px-4 text-center">Asistencia</th>
                          <th className="py-2.5 px-4">Certificado</th>
                          <th className="py-2.5 px-4 text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {activityAttendees.map((att) => (
                          <tr key={att.dni} className="hover:bg-slate-50/50 transition">
                            <td className="py-2 px-4 font-mono text-slate-500">{att.dni}</td>
                            <td className="py-2 px-4 font-bold text-slate-800">{att.nombre}</td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-0.5 rounded font-bold text-[9px] ${
                                att.tipo === 'Municipal' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {att.tipo}
                              </span>
                            </td>
                            <td className="py-2 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={att.asistencia}
                                onChange={() => handleToggleAttendance(att.dni)}
                                className="w-4 h-4 rounded text-sky-950 focus:ring-sky-900 border-slate-300"
                              />
                            </td>
                            <td className="py-2 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                att.certificado_generado
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}>
                                {att.certificado_generado ? 'Generado' : 'Pendiente'}
                              </span>
                              {att.codigo_certificado && (
                                <p className="text-[9px] font-mono text-slate-400 mt-0.5">{att.codigo_certificado}</p>
                              )}
                            </td>
                            <td className="py-2 px-4 text-center">
                              <button
                                onClick={() => handleDeleteParticipantAssociation(att.dni)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                                title="Desvincular"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB CONTENT: PONENTES */}
              {activeDetailTab === 'ponentes' && (
                /* P-12 — Gestión de ponentes */
                <div className="space-y-4 animate-fade-in" id="p-12-speakers">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-700 text-sm">Ponentes y Conferencistas</h4>
                    <button
                      onClick={handleOpenSpeakerModal}
                      className="flex items-center space-x-1 bg-sky-950 hover:bg-sky-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Ponente</span>
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {activitySpeakers.map((spk) => (
                      <div key={spk.id} className="border border-slate-200 bg-slate-50/50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-slate-800 text-sm">{spk.nombre}</h5>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">DNI: {spk.dni}</p>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 divide-y divide-slate-100">
                          <p className="py-1">Institución: <span className="font-bold text-slate-700">{spk.institucion_ponente}</span></p>
                          <p className="py-1">Cargo: <span className="font-bold text-slate-700">{spk.cargo}</span></p>
                          <p className="py-1">Especialidad: <span className="font-bold text-slate-700">{spk.especialidad}</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: FIRMANTES */}
              {activeDetailTab === 'firmantes' && (
                /* P-14 — Gestión de firmantes */
                <div className="space-y-4 animate-fade-in" id="p-14-signers">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-700 text-sm">Firmantes Acreditados del Certificado</h4>
                    <button
                      onClick={() => setShowSignerModal(true)}
                      className="flex items-center space-x-1 bg-sky-950 hover:bg-sky-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Registrar Firmante</span>
                    </button>
                  </div>

                  <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex items-start space-x-3 text-xs">
                    <Info className="w-4 h-4 text-sky-900 shrink-0 mt-0.5" />
                    <p className="text-sky-950 font-medium">
                      Los firmantes seleccionados deben tener cargados sus archivos <strong className="font-mono text-indigo-950">.pfx</strong> y sus passphrases configuradas en su perfil gerencial para firmar digitalmente las credenciales.
                    </p>
                  </div>

                  {/* Signers list */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          <th className="py-2.5 px-4">Cargo</th>
                          <th className="py-2.5 px-4">Nombre Completo</th>
                          <th className="py-2.5 px-4">Archivo .pfx</th>
                          <th className="py-2.5 px-4">Orden</th>
                          <th className="py-2.5 px-4 text-center">Estado Firma</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {firmantes.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-50/50">
                            <td className="py-2 px-4 font-bold">{f.cargo}</td>
                            <td className="py-2 px-4">{f.nombre_completo}</td>
                            <td className="py-2 px-4 font-mono text-[10px] text-slate-400">{f.ruta_archivo_pfx}</td>
                            <td className="py-2 px-4 font-bold text-center">1</td>
                            <td className="py-2 px-4 text-center">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center justify-center space-x-1 max-w-[100px] mx-auto">
                                <Check className="w-3 h-3" />
                                <span>Cargado</span>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* P-08 Modal: Nueva / Editar Actividad */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
              <span>{editingActivity ? 'Editar Actividad' : 'Registrar Actividad'}</span>
              <button onClick={() => setShowActivityModal(false)} className="text-white hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-6 space-y-4 text-xs">
              {actError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start space-x-1.5" id="p-08-error">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{actError}</span>
                </div>
              )}

              {/* Nombre de la actividad */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Nombre de la actividad *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Taller de Gestión Pública..."
                  value={actForm.nombre}
                  onChange={(e) => setActForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Tipo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Tipo de actividad *</label>
                  <select
                    value={actForm.tipo_actividad}
                    onChange={(e) => setActForm(prev => ({ ...prev, tipo_actividad: e.target.value as 'Capacitación' | 'Reconocimiento' }))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
                  >
                    <option value="Capacitación">Capacitación</option>
                    <option value="Reconocimiento">Reconocimiento</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Sede *</label>
                  <input
                    type="text"
                    required
                    value={actForm.sede}
                    onChange={(e) => setActForm(prev => ({ ...prev, sede: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Fecha Inicio *</label>
                  <input
                    type="date"
                    required
                    value={actForm.fecha_inicio}
                    onChange={(e) => setActForm(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Fecha Fin *</label>
                  <input
                    type="date"
                    required
                    value={actForm.fecha_fin}
                    onChange={(e) => setActForm(prev => ({ ...prev, fecha_fin: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Area organizadora */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Área Organizadora *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Gerencia Municipal"
                  value={actForm.area_organizadora}
                  onChange={(e) => setActForm(prev => ({ ...prev, area_organizadora: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Descripcion */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Descripción</label>
                <textarea
                  rows={3}
                  placeholder="Breve reseña o notas adicionales..."
                  value={actForm.descripcion}
                  onChange={(e) => setActForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  className="border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-950 hover:bg-sky-900 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider transition"
                >
                  Guardar Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* P-11 Modal: Registrar / Editar Participante */}
      {showParticipantModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
              <span>{editingParticipant ? 'Editar Participante' : 'Registrar Participante'}</span>
              <button onClick={() => setShowParticipantModal(false)} className="text-white hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParticipant} className="p-6 space-y-4 text-xs">
              {partError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start space-x-1.5" id="p-11-error">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{partError}</span>
                </div>
              )}

              {/* DNI */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">DNI (8 dígitos) *</label>
                <input
                  type="text"
                  required
                  maxLength={8}
                  placeholder="Ej: 42156789"
                  disabled={!!editingParticipant}
                  value={partForm.dni}
                  onChange={(e) => setPartForm(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '') }))}
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
                  value={partForm.nombre_completo}
                  onChange={(e) => setPartForm(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Correo */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  value={partForm.correo}
                  onChange={(e) => setPartForm(prev => ({ ...prev, correo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 font-mono focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              {/* Tipo de participante */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Tipo de participante *</label>
                  <select
                    value={partForm.tipo_participante}
                    onChange={(e) => setPartForm(prev => ({ ...prev, tipo_participante: e.target.value as 'Municipal' | 'Externo' }))}
                    className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
                  >
                    <option value="Municipal">Municipal</option>
                    <option value="Externo">Externo</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Área o Institución de origen</label>
                  <input
                    type="text"
                    placeholder="Ejem: Subgerencia de Obras"
                    value={partForm.area_origen}
                    onChange={(e) => setPartForm(prev => ({ ...prev, area_origen: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowParticipantModal(false)}
                  className="border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-950 hover:bg-sky-900 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider transition"
                >
                  Guardar Participante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* P-13 Modal: Registrar Ponente */}
      {showSpeakerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
              <span>Registrar Ponente</span>
              <button onClick={() => setShowSpeakerModal(false)} className="text-white hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSpeaker} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={spkForm.nombre}
                  onChange={(e) => setSpkForm(prev => ({ ...prev, nombre: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">DNI</label>
                  <input
                    type="text"
                    value={spkForm.dni}
                    onChange={(e) => setSpkForm(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '') }))}
                    className="w-full border border-slate-200 rounded-lg p-2 font-mono focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Institución</label>
                  <input
                    type="text"
                    value={spkForm.institucion_ponente}
                    onChange={(e) => setSpkForm(prev => ({ ...prev, institucion_ponente: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Cargo</label>
                  <input
                    type="text"
                    value={spkForm.cargo}
                    onChange={(e) => setSpkForm(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Especialidad</label>
                  <input
                    type="text"
                    value={spkForm.especialidad}
                    onChange={(e) => setSpkForm(prev => ({ ...prev, especialidad: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSpeakerModal(false)}
                  className="border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl font-bold uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-950 hover:bg-sky-900 text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider transition"
                >
                  Guardar Ponente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* P-15 Modal: Registrar Firmante */}
      {showSignerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
              <span>Registrar Firmante de Actividad</span>
              <button onClick={() => setShowSignerModal(false)} className="text-white hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSigner} className="p-6 space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Funcionario Gerencial *</label>
                <select className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium">
                  <option value="1">Lic. Marco Antonio Torres Silva (Alcalde)</option>
                  <option value="2">Mg. Rosa Flores Díaz (Gerente de RR.HH.)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Cargo Oficial *</label>
                <input
                  type="text"
                  required
                  defaultValue="Alcalde"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-medium"
                />
              </div>

              {/* Upload PFX */}
              <div className="border-2 border-dashed border-slate-200 hover:border-sky-950 p-6 rounded-xl text-center space-y-2 cursor-pointer transition">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-bold text-slate-700 text-xs">Subir archivo .pfx de firma digital</p>
                <p className="text-[10px] text-slate-400">Haga clic o arrastre su certificado aquí para cargarlo.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Passphrase del Certificado *</label>
                  <input
                    type="password"
                    required
                    defaultValue="passphrase123"
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block">Orden de Firma (Entero positivo) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={sigForm.orden_firma}
                    onChange={(e) => setSigForm(prev => ({ ...prev, orden_firma: parseInt(e.target.value) || 1 }))}
                    className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSignerModal(false)}
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

      {/* P-16 Modal: Generar Certificados (Masivo) */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col justify-between">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider shrink-0">
              <span>Módulo de Emisión y Firma Masiva de Certificados</span>
              <button onClick={() => setShowGenerateModal(false)} className="text-white hover:text-slate-300">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-grow">
              
              {/* Activity Info Summary */}
              {activeActivity && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Actividad</span>
                    <h5 className="font-bold text-slate-800 text-xs truncate">{activeActivity.nombre}</h5>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Fechas</span>
                    <p className="font-medium text-slate-700 font-mono mt-0.5">{activeActivity.fecha_inicio} al {activeActivity.fecha_fin}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Tipo de Certificación</span>
                    <p className="font-medium text-slate-700 mt-0.5 uppercase tracking-wide text-[10px]">
                      {activeActivity.tipo_actividad} Oficial
                    </p>
                  </div>
                </div>
              )}

              {/* Grid 2 Columns: Participants selector & Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                
                {/* Selector */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                      Asistentes Aptos para Certificar
                    </h5>
                    <button
                      onClick={() => {
                        const allDnis = activityAttendees.filter(a => !a.certificado_generado).map(a => a.dni);
                        setSelectedParticipantsForCert(
                          selectedParticipantsForCert.length === allDnis.length ? [] : allDnis
                        );
                      }}
                      className="text-sky-950 hover:underline font-bold text-xs"
                    >
                      {selectedParticipantsForCert.length === activityAttendees.filter(a => !a.certificado_generado).length
                        ? 'Deseleccionar Todos'
                        : 'Seleccionar Todos'}
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl max-h-[220px] overflow-y-auto divide-y divide-slate-100 bg-white">
                    {activityAttendees.filter(a => !a.certificado_generado).map((att) => (
                      <label key={att.dni} className="flex items-center space-x-3 p-3 hover:bg-slate-50 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedParticipantsForCert.includes(att.dni)}
                          onChange={() => {
                            setSelectedParticipantsForCert(prev =>
                              prev.includes(att.dni) ? prev.filter(d => d !== att.dni) : [...prev, att.dni]
                            );
                          }}
                          className="w-4 h-4 text-sky-950 focus:ring-sky-900 border-slate-300 rounded"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-slate-800">{att.nombre}</p>
                          <p className="text-[10px] text-slate-400 font-mono">DNI: {att.dni}</p>
                        </div>
                      </label>
                    ))}
                    {activityAttendees.filter(a => !a.certificado_generado).length === 0 && (
                      <div className="p-6 text-center text-slate-400">
                        No hay más participantes con asistencia registrada pendientes de certificar.
                      </div>
                    )}
                  </div>
                </div>

                {/* Micro preview container */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-700 text-xs uppercase tracking-wider">
                      Previsualización del Documento
                    </span>
                    <span className="bg-red-100 text-red-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">
                      Borrador
                    </span>
                  </div>

                  <div className="transform scale-[0.6] origin-top-left w-[166%] aspect-[1.414/1] bg-white border-4 border-sky-950 rounded p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-1">
                      <h4 className="text-[8px] font-black uppercase text-sky-950 leading-tight">MUNICIPALIDAD DE MORALES</h4>
                      <span className="text-[6px] font-mono font-bold text-slate-400">MDM-2026-CAP-SAMPLE</span>
                    </div>
                    <div className="text-center my-2 flex-grow flex flex-col justify-center">
                      <h3 className="text-[10px] font-serif text-sky-950 font-bold uppercase">CERTIFICADO DIGITAL</h3>
                      <p className="text-[6px] text-slate-400 italic">Otorgado en reconocimiento oficial a:</p>
                      <h2 className="text-[11px] font-black text-slate-800 my-1 underline decoration-amber-400">
                        {participantes.find(p => p.dni === selectedParticipantsForCert[0])?.nombre_completo || 'JUAN PÉREZ GÓMEZ'}
                      </h2>
                      <p className="text-[6px] text-slate-500 max-w-xs mx-auto">
                        Por su participación en {activeActivity?.nombre || 'Taller de Gestión'} con una duración de 30 horas.
                      </p>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-100 pt-1">
                      <span className="text-[5px] text-slate-400">Firma digital Alcalde</span>
                      <span className="text-[5px] text-slate-400">Firma digital RR.HH.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bars or Status logs */}
              {isGenerating && (
                <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl space-y-2 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sky-950 font-bold">
                    <Loader2 className="w-5 h-5 animate-spin text-sky-950" />
                    <span>Firmando y encriptando certificados con .pfx municipal...</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-sky-950 h-2 rounded-full transition-all duration-300" style={{ width: `${generationProgress}%` }}></div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">Procesando {selectedParticipantsForCert.length} registros...</p>
                </div>
              )}

              {generationResult && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800 flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-sm uppercase">¡Generación Exitosa!</h5>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Se han generado, firmado y registrado un total de <strong>{generationResult.count} certificados digitales</strong> en Morales. Los beneficiarios ya pueden buscarlos en el portal público por su número de DNI.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal actions footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Cerrar
              </button>
              <button
                type="button"
                disabled={selectedParticipantsForCert.length === 0 || isGenerating}
                onClick={handleStartBulkGeneration}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl text-xs uppercase tracking-wider transition flex items-center space-x-2 shadow-md"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Generar {selectedParticipantsForCert.length} Certificados</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
