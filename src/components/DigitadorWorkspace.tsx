/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Activity,
  Award,
  Users,
  PlusCircle,
  FileSpreadsheet,
  Download,
  CheckCircle,
  Clock,
  Sparkles,
  PenTool,
  ShieldCheck,
  Trash2,
  Plus,
  Key,
  Upload
} from 'lucide-react';
import {
  Actividad,
  Participante,
  ActividadParticipante,
  Ponente,
  Firmante,
  Practicante,
  Practica,
  Certificado,
  Reconocimiento
} from '../types';
import ActivityManagement from './ActivityManagement';
import PracticanteManagement from './PracticanteManagement';
import PersonalReconocimientoManagement from './PersonalReconocimientoManagement';

interface DigitadorWorkspaceProps {
  actividades: Actividad[];
  setActividades: React.Dispatch<React.SetStateAction<Actividad[]>>;
  participantes: Participante[];
  setParticipantes: React.Dispatch<React.SetStateAction<Participante[]>>;
  actividadParticipantes: ActividadParticipante[];
  setActividadParticipantes: React.Dispatch<React.SetStateAction<ActividadParticipante[]>>;
  ponentes: Ponente[];
  setPonentes: React.Dispatch<React.SetStateAction<Ponente[]>>;
  firmantes: Firmante[];
  setFirmantes: React.Dispatch<React.SetStateAction<Firmante[]>>;
  practicantes: Practicante[];
  setPracticantes: React.Dispatch<React.SetStateAction<Practicante[]>>;
  practicas: Practica[];
  setPracticas: React.Dispatch<React.SetStateAction<Practica[]>>;
  reconocimientos: Reconocimiento[];
  setReconocimientos: React.Dispatch<React.SetStateAction<Reconocimiento[]>>;
  instituciones: any[];
  certificados: Certificado[];
  setCertificados: React.Dispatch<React.SetStateAction<Certificado[]>>;
  onTriggerError?: (msg: string) => void;
}

export default function DigitadorWorkspace({
  actividades,
  setActividades,
  participantes,
  setParticipantes,
  actividadParticipantes,
  setActividadParticipantes,
  ponentes,
  setPonentes,
  firmantes,
  setFirmantes,
  practicantes,
  setPracticantes,
  practicas,
  setPracticas,
  reconocimientos,
  setReconocimientos,
  instituciones,
  certificados,
  setCertificados,
  onTriggerError
}: DigitadorWorkspaceProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'activities' | 'interns' | 'recognitions' | 'reports' | 'signers'>('dashboard');

  // Firmantes management states
  const [showSignerModal, setShowSignerModal] = useState(false);
  const [editingSigner, setEditingSigner] = useState<Firmante | null>(null);
  const [signerForm, setSignerForm] = useState({
    cargo: '',
    nombre_completo: '',
    pfx_nombre: '',
    passphrase_cifrada: '',
    id_usuario: ''
  });
  const [signerError, setSignerError] = useState('');

  // Reports internal tabs
  const [reportTab, setReportTab] = useState<'actividades' | 'certificados' | 'participantes'>('actividades');

  // Reports filters
  const [repType, setRepType] = useState('');
  const [repArea, setRepArea] = useState('');
  const [repPeriod, setRepPeriod] = useState('2026');

  const [repCertAct, setRepCertAct] = useState('');
  const [repCertPartType, setRepCertPartType] = useState('');

  const [repPartAct, setRepPartAct] = useState('');
  const [repPartAsis, setRepPartAsis] = useState('');

  // Stats Digitador
  const activeActivitiesCount = actividades.filter(a => a.estado === 'Activa').length;
  const registeredTodayCount = participantes.length; // mock today registrations
  const certificatesThisMonth = certificados.length;

  const handleExport = (format: 'PDF' | 'Excel') => {
    alert(`Exportando reporte de ${reportTab} en formato ${format}...`);
  };

  return (
    <div className="space-y-6" id="digitador-parent-view">
      
      {/* Tab Navigation Menu Digitador */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm space-x-1">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            currentView === 'dashboard'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="digitador-tab-dash"
        >
          Dashboard RR.HH.
        </button>
        <button
          onClick={() => setCurrentView('activities')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            currentView === 'activities'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="digitador-tab-activities"
        >
          Actividades ({actividades.length})
        </button>
        <button
          onClick={() => setCurrentView('interns')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            currentView === 'interns'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="digitador-tab-interns"
        >
          Practicantes ({practicantes.length})
        </button>
        <button
          onClick={() => setCurrentView('recognitions')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            currentView === 'recognitions'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="digitador-tab-recognitions"
        >
          Reconocimientos ({reconocimientos.length})
        </button>
        <button
          onClick={() => setCurrentView('reports')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            currentView === 'reports'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="digitador-tab-reports"
        >
          Generar Reportes
        </button>
        <button
          onClick={() => setCurrentView('signers')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            currentView === 'signers'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="digitador-tab-signers"
        >
          Firmantes ({firmantes.length})
        </button>
      </div>

      {currentView === 'dashboard' && (
        /* P-06 — Dashboard Digitador */
        <div className="space-y-6 animate-fade-in" id="p-06-dashboard">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-sky-50 text-sky-950 rounded-xl">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Actividades Activas
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {activeActivitiesCount} <span className="text-xs text-slate-400 font-normal">de {actividades.length}</span>
                </h4>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Participantes Registrados
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {registeredTodayCount}
                </h4>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Certificados del Mes
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {certificatesThisMonth}
                </h4>
              </div>
            </div>
          </div>

          {/* Quick links digitador */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-lg mb-4 border-b border-slate-100 pb-2">
              Panel Operativo de Recursos Humanos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => setCurrentView('activities')}
                className="p-5 border border-slate-200 hover:border-sky-950 bg-slate-50 hover:bg-sky-50/25 rounded-xl text-left transition space-y-2 group"
              >
                <PlusCircle className="w-6 h-6 text-sky-950 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-800 text-sm">Gestionar Actividades</h4>
                <p className="text-xs text-slate-400">Ver listado, inscribir participantes, registrar ponentes y cerrar actividades.</p>
              </button>
              <button
                onClick={() => setCurrentView('interns')}
                className="p-5 border border-slate-200 hover:border-sky-950 bg-slate-50 hover:bg-sky-50/25 rounded-xl text-left transition space-y-2 group"
              >
                <PlusCircle className="w-6 h-6 text-emerald-700 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-800 text-sm">Registrar Practicante</h4>
                <p className="text-xs text-slate-400">Inscribir estudiantes externos, supervisar su periodo y emitir constancias.</p>
              </button>
              <button
                onClick={() => setCurrentView('recognitions')}
                className="p-5 border border-slate-200 hover:border-sky-950 bg-slate-50 hover:bg-sky-50/25 rounded-xl text-left transition space-y-2 group"
              >
                <PlusCircle className="w-6 h-6 text-indigo-700 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-800 text-sm">Reconocimiento Personal</h4>
                <p className="text-xs text-slate-400">Registrar méritos del personal destacado, asignar firmantes y certificar logros.</p>
              </button>
              <button
                onClick={() => setCurrentView('reports')}
                className="p-5 border border-slate-200 hover:border-sky-950 bg-slate-50 hover:bg-sky-50/25 rounded-xl text-left transition space-y-2 group"
              >
                <FileSpreadsheet className="w-6 h-6 text-amber-600 group-hover:scale-110 transition" />
                <h4 className="font-bold text-slate-800 text-sm">Ver Reportes RR.HH.</h4>
                <p className="text-xs text-slate-400">Exportar estadísticas de asistencia y firmas a formatos oficiales PDF/Excel.</p>
              </button>
            </div>
          </div>
        </div>
      )}

      {currentView === 'activities' && (
        <ActivityManagement
          actividades={actividades}
          setActividades={setActividades}
          participantes={participantes}
          setParticipantes={setParticipantes}
          actividadParticipantes={actividadParticipantes}
          setActividadParticipantes={setActividadParticipantes}
          ponentes={ponentes}
          setPonentes={setPonentes}
          firmantes={firmantes}
          certificados={certificados}
          setCertificados={setCertificados}
          onTriggerError={onTriggerError}
        />
      )}

      {currentView === 'interns' && (
        <PracticanteManagement
          practicantes={practicantes}
          setPracticantes={setPracticantes}
          practicas={practicas}
          setPracticas={setPracticas}
          instituciones={instituciones}
          firmantes={firmantes}
          certificados={certificados}
          setCertificados={setCertificados}
          onTriggerError={onTriggerError}
        />
      )}

      {currentView === 'recognitions' && (
        <PersonalReconocimientoManagement
          reconocimientos={reconocimientos}
          setReconocimientos={setReconocimientos}
          firmantes={firmantes}
          certificados={certificados}
          setCertificados={setCertificados}
          onTriggerError={onTriggerError}
        />
      )}

      {currentView === 'reports' && (
        /* P-20 — Reportes (Digitador) */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6 animate-fade-in" id="p-20-reports">
          <div>
            <h3 className="text-lg font-black text-slate-800">
              Centro de Reportes y Descargas
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Genere, filtre y exporte la información de firmas y beneficiarios registrados en Morales.
            </p>
          </div>

          {/* Tab reports switcher */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setReportTab('actividades')}
              className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition ${
                reportTab === 'actividades'
                  ? 'border-sky-950 text-sky-950'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Reporte de Actividades
            </button>
            <button
              onClick={() => setReportTab('certificados')}
              className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition ${
                reportTab === 'certificados'
                  ? 'border-sky-950 text-sky-950'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Reporte de Certificados
            </button>
            <button
              onClick={() => setReportTab('participantes')}
              className={`px-4 py-2 border-b-2 text-xs font-bold uppercase tracking-wider transition ${
                reportTab === 'participantes'
                  ? 'border-sky-950 text-sky-950'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Reporte de Participantes
            </button>
          </div>

          {/* REPORT TAB: ACTIVIDADES */}
          {reportTab === 'actividades' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Tipo de Actividad</label>
                  <select value={repType} onChange={e => setRepType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="">Todas</option>
                    <option value="Capacitación">Capacitaciones</option>
                    <option value="Reconocimiento">Reconocimientos</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Área Organizadora</label>
                  <select value={repArea} onChange={e => setRepArea(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="">Todas las áreas</option>
                    <option value="Gerencia Municipal">Gerencia Municipal</option>
                    <option value="Gerencia de Recursos Humanos">Gerencia de RR.HH.</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Periodo Anual</label>
                  <select value={repPeriod} onChange={e => setRepPeriod(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="2026">Año 2026</option>
                    <option value="2025">Año 2025</option>
                  </select>
                </div>
              </div>

              {/* Action exports */}
              <div className="flex justify-end space-x-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => handleExport('PDF')}
                  className="flex items-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </button>
                <button
                  onClick={() => handleExport('Excel')}
                  className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar Excel</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      <th className="py-2.5 px-4">Actividad</th>
                      <th className="py-2.5 px-4">Tipo</th>
                      <th className="py-2.5 px-4">Área Organizadora</th>
                      <th className="py-2.5 px-4">Periodo</th>
                      <th className="py-2.5 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {actividades.map(a => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-4 font-bold">{a.nombre}</td>
                        <td className="py-2 px-4 font-semibold text-slate-500">{a.tipo_actividad}</td>
                        <td className="py-2 px-4 italic">{a.area_organizadora}</td>
                        <td className="py-2 px-4 font-mono">{a.fecha_inicio} al {a.fecha_fin}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            a.estado === 'Activa' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {a.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORT TAB: CERTIFICADOS */}
          {reportTab === 'certificados' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Filtrar por Actividad de Origen</label>
                  <select value={repCertAct} onChange={e => setRepCertAct(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="">Todas las Actividades</option>
                    {actividades.map(a => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Tipo de Participante</label>
                  <select value={repCertPartType} onChange={e => setRepCertPartType(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="">Todos</option>
                    <option value="Municipal">Personal Municipal</option>
                    <option value="Externo">Externos / Ciudadanos</option>
                  </select>
                </div>
              </div>

              {/* Action exports */}
              <div className="flex justify-end space-x-2 border-t border-slate-100 pt-4">
                <button onClick={() => handleExport('PDF')} className="flex items-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
                  <Download className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </button>
                <button onClick={() => handleExport('Excel')} className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
                  <Download className="w-4 h-4" />
                  <span>Exportar Excel</span>
                </button>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      <th className="py-2.5 px-4">Código Único</th>
                      <th className="py-2.5 px-4">Titular del Certificado</th>
                      <th className="py-2.5 px-4">Origen / Actividad</th>
                      <th className="py-2.5 px-4">Fecha Emisión</th>
                      <th className="py-2.5 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {certificados.map(c => (
                      <tr key={c.codigo_unico} className="hover:bg-slate-50/50">
                        <td className="py-2 px-4 font-mono font-bold text-sky-950">{c.codigo_unico}</td>
                        <td className="py-2 px-4">
                          <p className="font-bold">{c.nombre_titular}</p>
                          <p className="text-[10px] text-slate-400 font-mono">DNI: {c.dni_titular}</p>
                        </td>
                        <td className="py-2 px-4 truncate max-w-[200px]">{c.nombre_origen}</td>
                        <td className="py-2 px-4 font-mono text-slate-500">{c.fecha_emision}</td>
                        <td className="py-2 px-4">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                            {c.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORT TAB: PARTICIPANTES */}
          {reportTab === 'participantes' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Filtrar por Actividad</label>
                  <select value={repPartAct} onChange={e => setRepPartAct(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="">Todas</option>
                    {actividades.map(a => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Estado de Asistencia</label>
                  <select value={repPartAsis} onChange={e => setRepPartAsis(e.target.value)} className="w-full border border-slate-200 rounded-lg p-2 bg-white">
                    <option value="">Todos</option>
                    <option value="true">Presentes</option>
                    <option value="false">Ausentes</option>
                  </select>
                </div>
              </div>

              {/* Action exports */}
              <div className="flex justify-end space-x-2 border-t border-slate-100 pt-4">
                <button onClick={() => handleExport('PDF')} className="flex items-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
                  <Download className="w-4 h-4" />
                  <span>Exportar PDF</span>
                </button>
                <button onClick={() => handleExport('Excel')} className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition">
                  <Download className="w-4 h-4" />
                  <span>Exportar Excel</span>
                </button>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                      <th className="py-2.5 px-4">DNI</th>
                      <th className="py-2.5 px-4">Participante</th>
                      <th className="py-2.5 px-4">Correo</th>
                      <th className="py-2.5 px-4">Tipo</th>
                      <th className="py-2.5 px-4">Asistencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {participantes.map(p => (
                      <tr key={p.dni} className="hover:bg-slate-50/50">
                        <td className="py-2 px-4 font-mono">{p.dni}</td>
                        <td className="py-2 px-4 font-bold">{p.nombre_completo}</td>
                        <td className="py-2 px-4 font-mono text-slate-500">{p.correo || 'Sin correo.'}</td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            p.tipo_participante === 'Municipal' ? 'bg-sky-50 text-sky-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {p.tipo_participante}
                          </span>
                        </td>
                        <td className="py-2 px-4">
                          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">
                            Presente
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

      {currentView === 'signers' && (
        <div className="space-y-6 animate-fade-in" id="p-06-signers">
          {/* Header section with top stats and register trigger */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 text-sky-950">
                <ShieldCheck className="w-6 h-6" />
                <h3 className="text-lg font-black uppercase tracking-wider">
                  Gestión de Firmantes Municipales (Tabla: firmante)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Administre los certificados digitales (.pfx) y credenciales de los funcionarios autorizados. Estas rúbricas son reutilizables tanto para certificados de capacitaciones de estudiantes como para constancias de prácticas preprofesionales de egresados.
              </p>
            </div>
            
            <button
              onClick={() => {
                setEditingSigner(null);
                setSignerForm({
                  cargo: '',
                  nombre_completo: '',
                  pfx_nombre: '',
                  passphrase_cifrada: '',
                  id_usuario: ''
                });
                setSignerError('');
                setShowSignerModal(true);
              }}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-widest py-2.5 px-4 rounded-xl transition shadow-md whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Firmante</span>
            </button>
          </div>

          {/* Grid list of Firmantes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firmantes.map((signer) => (
              <div
                key={signer.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                {/* Header card banner */}
                <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-sky-50 text-sky-900 py-1 px-2.5 rounded-full border border-sky-100">
                    {signer.cargo}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ID: {signer.id}
                  </span>
                </div>

                {/* Body card content */}
                <div className="p-5 space-y-4 flex-1">
                  <div>
                    <h4 className="text-sm font-black text-slate-800">
                      {signer.nombre_completo}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      DNI Asociado: {signer.id_usuario || 'No asignado'}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Archivo Certificado:</span>
                      <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        {signer.pfx_nombre || signer.ruta_archivo_pfx || 'firma_municipal.pfx'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Estado de Clave:</span>
                      <span className="flex items-center text-slate-500 font-mono text-[10px]">
                        <Key className="w-3 h-3 mr-1 text-slate-400" />
                        ******** (Cifrada)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Garantía Legal:</span>
                      <span className="text-[9px] font-extrabold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Ley N° 27269 (Perú)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer card actions */}
                <div className="bg-slate-50/50 border-t border-slate-100 p-3 px-4 flex justify-between items-center">
                  <div className="flex items-center space-x-1.5 text-[10px] text-emerald-600 font-extrabold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>FIRMA LISTA PARA REUTILIZAR</span>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingSigner(signer);
                        setSignerForm({
                          cargo: signer.cargo,
                          nombre_completo: signer.nombre_completo,
                          pfx_nombre: signer.pfx_nombre || signer.ruta_archivo_pfx,
                          passphrase_cifrada: signer.passphrase_cifrada,
                          id_usuario: signer.id_usuario
                        });
                        setSignerError('');
                        setShowSignerModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-sky-900 hover:bg-slate-100 rounded-lg transition"
                      title="Editar Firmante"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Está seguro de eliminar el registro de firma para ${signer.nombre_completo}?`)) {
                          setFirmantes(prev => prev.filter(f => f.id !== signer.id));
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar Firmante"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed explanation for reusable sigs */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
            <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              ¿Por qué los Firmantes se administran en una sección independiente?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              El Reglamento de la Ley de Firmas y Certificados Digitales exige que los certificados digitales pertenezcan a personas naturales en representación de la municipalidad. Al desvincular las firmas de las actividades o prácticas individuales, logramos que la misma firma (por ejemplo, del Jefe de Recursos Humanos o el Alcalde) sea <strong>100% reutilizable</strong> para cualquier lote de certificados de capacitación o para constancias individuales de egresados de prácticas, garantizando rapidez y validez jurídica sin redundancia de datos.
            </p>
          </div>
        </div>
      )}

      {/* Reusable Signer Modal Form */}
      {showSignerModal && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-xs uppercase tracking-widest">
              <span>{editingSigner ? 'Editar Firmante Municipal' : 'Registrar Firmante Municipal'}</span>
              <button 
                onClick={() => setShowSignerModal(false)}
                className="text-white hover:text-slate-300 font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSignerError('');

                const form = {
                  cargo: signerForm.cargo.trim(),
                  nombre_completo: signerForm.nombre_completo.trim(),
                  pfx_nombre: signerForm.pfx_nombre.trim(),
                  passphrase_cifrada: signerForm.passphrase_cifrada.trim(),
                  id_usuario: signerForm.id_usuario.trim()
                };

                if (!form.cargo || !form.nombre_completo || !form.passphrase_cifrada) {
                  setSignerError('Cargo, Nombre del Funcionario y Contraseña son obligatorios.');
                  return;
                }

                if (!form.pfx_nombre) {
                  setSignerError('Debe cargar un archivo de certificado digital .pfx');
                  return;
                }

                if (editingSigner) {
                  // edit
                  setFirmantes(prev => prev.map(f => {
                    if (f.id === editingSigner.id) {
                      return {
                        ...f,
                        cargo: form.cargo,
                        nombre_completo: form.nombre_completo,
                        ruta_archivo_pfx: form.pfx_nombre,
                        pfx_nombre: form.pfx_nombre,
                        passphrase_cifrada: form.passphrase_cifrada,
                        id_usuario: form.id_usuario
                      };
                    }
                    return f;
                  }));
                } else {
                  // add
                  const newId = `firm-${Math.max(...firmantes.map(f => parseInt(f.id.replace('firm-', '')) || 0), 0) + 1}`;
                  setFirmantes(prev => [
                    ...prev,
                    {
                      id: newId,
                      cargo: form.cargo,
                      nombre_completo: form.nombre_completo,
                      ruta_archivo_pfx: form.pfx_nombre,
                      pfx_nombre: form.pfx_nombre,
                      passphrase_cifrada: form.passphrase_cifrada,
                      id_usuario: form.id_usuario
                    }
                  ]);
                }

                setShowSignerModal(false);
              }}
              className="p-5 space-y-4"
            >
              {signerError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold">
                  {signerError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                  Cargo / Rol Institucional *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Alcalde Distrital, Gerente Municipal"
                  value={signerForm.cargo}
                  onChange={(e) => setSignerForm(prev => ({ ...prev, cargo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                  Nombre Completo del Funcionario *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ing. Jorge Flores Meléndez"
                  value={signerForm.nombre_completo}
                  onChange={(e) => setSignerForm(prev => ({ ...prev, nombre_completo: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-950 bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                  DNI del Funcionario (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: 45678912"
                  value={signerForm.id_usuario}
                  onChange={(e) => setSignerForm(prev => ({ ...prev, id_usuario: e.target.value.replace(/\D/g, '') }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-950 bg-white font-mono"
                  maxLength={8}
                />
              </div>

              {/* simulated uploader */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                  Certificado Digital (.PFX / .P12 PKCS#12) *
                </label>
                
                {signerForm.pfx_nombre ? (
                  <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-3 flex justify-between items-center text-xs">
                    <span className="font-mono text-emerald-800 font-bold flex items-center">
                      ✓ {signerForm.pfx_nombre}
                    </span>
                    <button 
                      type="button"
                      onClick={() => setSignerForm(prev => ({ ...prev, pfx_nombre: '' }))}
                      className="text-red-700 hover:underline text-[10px] font-extrabold uppercase tracking-wider"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      // simulate file upload
                      const fileNames = ['firma_morales_alcaldia.pfx', 'secretario_firmadigital.p12', 'rrhh_morales_jorge.pfx', 'gerente_morales_firma.pfx'];
                      const randomFile = fileNames[Math.floor(Math.random() * fileNames.length)];
                      setSignerForm(prev => ({ ...prev, pfx_nombre: randomFile }));
                    }}
                    className="border-2 border-dashed border-slate-200 hover:border-sky-950 rounded-xl p-5 text-center cursor-pointer hover:bg-slate-50 transition"
                  >
                    <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                    <p className="text-[10px] text-slate-600 font-extrabold uppercase tracking-wider">Haga clic aquí para simular carga</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Soporta formatos PKCS#12 (.pfx, .p12)</p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">
                  Clave de Acceso del Certificado Digital (Passphrase) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Introduzca contraseña para proteger llave privada"
                  value={signerForm.passphrase_cifrada}
                  onChange={(e) => setSignerForm(prev => ({ ...prev, passphrase_cifrada: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-950 bg-white font-mono"
                />
                <p className="text-[9px] text-slate-400">La clave se almacena de forma encriptada bajo estándares AES-256 localmente.</p>
              </div>

              <button
                type="submit"
                className="w-full bg-sky-950 hover:bg-sky-900 text-white font-extrabold text-xs uppercase tracking-widest py-3 rounded-lg transition mt-2 shadow-sm"
              >
                {editingSigner ? 'Guardar Cambios' : 'Registrar Rúbrica Municipal'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
