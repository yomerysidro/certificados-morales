/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  Award,
  CheckCircle,
  FileText,
  Clock,
  Trash2,
  X,
  FileSpreadsheet,
  Download,
  Check,
  Loader2,
  AlertTriangle,
  Building
} from 'lucide-react';
import { Reconocimiento, Certificado, Firmante } from '../types';
import CertificatePreview from './CertificatePreview';

interface PersonalReconocimientoProps {
  reconocimientos: Reconocimiento[];
  setReconocimientos: React.Dispatch<React.SetStateAction<Reconocimiento[]>>;
  firmantes: Firmante[];
  certificados: Certificado[];
  setCertificados: React.Dispatch<React.SetStateAction<Certificado[]>>;
  onTriggerError?: (msg: string) => void;
}

export default function PersonalReconocimientoManagement({
  reconocimientos,
  setReconocimientos,
  firmantes,
  certificados,
  setCertificados,
  onTriggerError
}: PersonalReconocimientoProps) {
  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<'list' | 'preview'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedRecForCert, setSelectedRecForCert] = useState<Reconocimiento | null>(null);
  const [previewCert, setPreviewCert] = useState<Certificado | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    dni_colaborador: '',
    nombre_completo: '',
    area_origen: '',
    logro_destacado: '',
    fecha_reconocimiento: new Date().toISOString().split('T')[0],
    id_firmante: firmantes[0]?.id || ''
  });
  const [formError, setFormError] = useState('');

  // Signature simulation states
  const [selectedSignerId, setSelectedSignerId] = useState(() => firmantes[0]?.id || '');
  const [passphrase, setPassphrase] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Areas predefinidas de la municipalidad de Morales para autocompletar o sugerir
  const SUGGESTED_AREAS = [
    'Gerencia de Administración y Finanzas',
    'Oficina de Tecnologías de la Información',
    'Subgerencia de Registro Civil',
    'Oficina de Imagen Institucional',
    'Gerencia de Servicios Municipales',
    'Subgerencia de Recaudación Tributaria',
    'Oficina de Asesoría Jurídica',
    'Gerencia de Desarrollo Social'
  ];

  // Filtered recognitions list
  const filteredRecs = reconocimientos.filter(r =>
    r.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.dni_colaborador.includes(searchTerm) ||
    r.area_origen.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle adding a new recognition
  const handleAddRecognition = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const { dni_colaborador, nombre_completo, area_origen, logro_destacado, fecha_reconocimiento, id_firmante } = formData;

    if (!dni_colaborador || !nombre_completo || !area_origen || !logro_destacado || !id_firmante) {
      setFormError('Por favor complete todos los campos obligatorios (*)');
      return;
    }

    if (dni_colaborador.length !== 8 || isNaN(Number(dni_colaborador))) {
      setFormError('El D.N.I. debe contener exactamente 8 dígitos numéricos.');
      return;
    }

    const newRec: Reconocimiento = {
      id: `rec-${Date.now()}`,
      dni_colaborador,
      nombre_completo,
      area_origen,
      logro_destacado,
      fecha_reconocimiento,
      id_firmante,
      certificado_generado: false
    };

    setReconocimientos(prev => [newRec, ...prev]);
    setShowAddModal(false);
    // Reset form
    setFormData({
      dni_colaborador: '',
      nombre_completo: '',
      area_origen: '',
      logro_destacado: '',
      fecha_reconocimiento: new Date().toISOString().split('T')[0],
      id_firmante: firmantes[0]?.id || ''
    });
  };

  // Open the digital signature modal
  const openSignatureModal = (rec: Reconocimiento) => {
    setSelectedRecForCert(rec);
    setSelectedSignerId(rec.id_firmante || firmantes[0]?.id || '');
    setPassphrase('');
    setIsGenerating(false);
    setGenSuccess(false);
    setGeneratedCode('');
    setShowSignModal(true);
  };

  // Simulate signing & certificate generation
  const handleSignCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecForCert) return;

    const signer = firmantes.find(f => f.id === selectedSignerId);
    if (!signer) {
      alert('Error: Debe seleccionar un firmante válido.');
      return;
    }

    if (!signer.ruta_archivo_pfx) {
      if (onTriggerError) onTriggerError(`El firmante ${signer.nombre_completo} no tiene cargado su archivo de firma .pfx.`);
      alert(`Error: El firmante ${signer.nombre_completo} no tiene configurado su archivo .pfx en el sistema.`);
      return;
    }

    if (!passphrase) {
      alert('Error: Por favor introduzca la contraseña (passphrase) de la clave privada .pfx.');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const code = `MDM-2026-REC-${Math.floor(100000 + Math.random() * 900000)}`;
      const certHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const newCert: Certificado = {
        codigo_unico: code,
        fecha_emision: selectedRecForCert.fecha_reconocimiento,
        hash_sha256: certHash,
        ruta_archivo_pdf: `certificado_${selectedRecForCert.dni_colaborador}_reconocimiento.pdf`,
        tipo_origen: 'reconocimiento',
        id_origen: selectedRecForCert.id,
        nombre_origen: 'Reconocimiento de Mérito Institucional',
        dni_titular: selectedRecForCert.dni_colaborador,
        nombre_titular: selectedRecForCert.nombre_completo,
        estado: 'Válido',
        meta_destacada: selectedRecForCert.logro_destacado,
        area_colaborador: selectedRecForCert.area_origen
      };

      // Update state
      setCertificados(prev => [newCert, ...prev]);
      setReconocimientos(prev => prev.map(r => {
        if (r.id === selectedRecForCert.id) {
          return { ...r, certificado_generado: true, codigo_certificado: code };
        }
        return r;
      }));

      setGeneratedCode(code);
      setIsGenerating(false);
      setGenSuccess(true);
    }, 1500);
  };

  // Delete a recognition
  const handleDeleteRec = (id: string, code?: string) => {
    if (confirm('¿Está seguro de eliminar este registro de reconocimiento de personal?')) {
      setReconocimientos(prev => prev.filter(r => r.id !== id));
      if (code) {
        setCertificados(prev => prev.filter(c => c.codigo_unico !== code));
      }
    }
  };

  // View generated certificate preview
  const handleViewCertificate = (code: string) => {
    const cert = certificados.find(c => c.codigo_unico === code);
    if (cert) {
      setPreviewCert(cert);
      setActiveTab('preview');
    } else {
      alert('Certificado no encontrado en los registros.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12" id="personal-reconocimiento-root">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden mb-6">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
            <span>Colaboradores Destacados</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black tracking-tight">
            Reconocimiento al Mérito Institucional
          </h2>
          <p className="text-xs md:text-sm text-sky-200 max-w-2xl leading-relaxed">
            Módulo oficial para registrar, calificar y certificar digitalmente al personal de la Municipalidad Distrital de Morales que destaque por el cumplimiento excepcional de metas y logros sobresalientes.
          </p>
        </div>
        <div className="absolute top-1/2 -right-12 -translate-y-1/2 opacity-10 pointer-events-none">
          <Building className="w-64 h-64" />
        </div>
      </div>

      {activeTab === 'preview' && previewCert ? (
        <div className="space-y-4 animate-fade-in">
          <button
            onClick={() => setActiveTab('list')}
            className="inline-flex items-center space-x-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-700 bg-white shadow-sm font-bold text-xs uppercase transition"
          >
            <X className="w-4 h-4" />
            <span>Volver al Listado</span>
          </button>
          <CertificatePreview
            certificado={previewCert}
            onBack={() => setActiveTab('list')}
            onDownload={() => alert(`Descargando certificado oficial ${previewCert.codigo_unico} en formato PDF...`)}
          />
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Controls toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Colaborador, D.N.I. o Área..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-950 bg-slate-50/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <button
                onClick={() => alert('Exportando listado de personal destacado a formato Excel...')}
                className="flex items-center space-x-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-bold uppercase transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Exportar Excel</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-sky-950 hover:bg-sky-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Registrar Reconocimiento</span>
              </button>
            </div>
          </div>

          {/* Grid de Colaboradores Destacados (Visual Hero Section) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecs.slice(0, 3).map((rec, index) => (
              <div 
                key={rec.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition relative flex flex-col justify-between overflow-hidden group"
              >
                {/* Decorative background circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-400/5 group-hover:scale-110 transition pointer-events-none"></div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl">
                      <Award className="w-5 h-5" />
                    </div>
                    {rec.certificado_generado ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center space-x-1 uppercase">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Firmado Digital</span>
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-amber-100 flex items-center space-x-1 uppercase">
                        <Clock className="w-3 h-3" />
                        <span>Pendiente Firma</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{rec.nombre_completo}</h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">D.N.I. {rec.dni_colaborador}</p>
                    <p className="text-xs text-sky-950 font-bold mt-1 uppercase text-[10px]">{rec.area_origen}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 italic">
                    "{rec.logro_destacado}"
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-mono">{rec.fecha_reconocimiento}</span>
                  <div className="flex space-x-1.5">
                    {rec.certificado_generado ? (
                      <button
                        onClick={() => handleViewCertificate(rec.codigo_certificado!)}
                        className="text-[10px] font-bold bg-sky-950 hover:bg-sky-900 text-white px-3 py-1.5 rounded-lg transition"
                      >
                        Ver Certificado
                      </button>
                    ) : (
                      <button
                        onClick={() => openSignatureModal(rec)}
                        className="text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition"
                      >
                        Firmar y Emitir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed list table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                Listado General de Reconocimientos Distritales ({reconocimientos.length})
              </h3>
              <div className="flex items-center space-x-1 text-slate-400 text-xs">
                <span>Total de registros</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-6">Colaborador / D.N.I.</th>
                    <th className="py-3 px-6">Área / Oficina</th>
                    <th className="py-3 px-6">Logro e Impacto Institucional</th>
                    <th className="py-3 px-6">Fecha Registro</th>
                    <th className="py-3 px-6">Estado Certificado</th>
                    <th className="py-3 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecs.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{item.nombre_completo}</div>
                        <div className="text-[10px] text-slate-400 font-mono">D.N.I. {item.dni_colaborador}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">
                        {item.area_origen}
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <div className="text-slate-600 truncate" title={item.logro_destacado}>
                          {item.logro_destacado}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-500">
                        {item.fecha_reconocimiento}
                      </td>
                      <td className="py-4 px-6">
                        {item.certificado_generado ? (
                          <div className="inline-flex items-center space-x-1 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-bold text-[9px] uppercase">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>Código: {item.codigo_certificado}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-bold text-[9px] uppercase">
                            <Clock className="w-3 h-3" />
                            <span>Firma Pendiente</span>
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                        {item.certificado_generado ? (
                          <button
                            onClick={() => handleViewCertificate(item.codigo_certificado!)}
                            className="bg-sky-50 text-sky-950 border border-sky-100 hover:bg-sky-100/70 font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition"
                            title="Ver Certificado Digital"
                          >
                            Ver
                          </button>
                        ) : (
                          <button
                            onClick={() => openSignatureModal(item)}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] uppercase transition"
                            title="Firmar digitalmente constancia"
                          >
                            Firmar
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteRec(item.id, item.codigo_certificado)}
                          className="text-red-500 hover:text-red-700 border border-transparent hover:border-red-100 hover:bg-red-50 p-1.5 rounded-lg transition inline-block"
                          title="Eliminar Reconocimiento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredRecs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                        No se encontraron registros de reconocimiento de personal que coincidan con la búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR RECONOCIMIENTO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col my-8">
            <div className="bg-sky-950 text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Nuevo Registro de Reconocimiento</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRecognition} className="p-6 space-y-4 overflow-y-auto flex-grow max-h-[75vh]">
              {formError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-xs text-red-700 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Colaborador */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">D.N.I. del Colaborador *</label>
                  <input
                    type="text"
                    maxLength={8}
                    required
                    placeholder="Ejem: 45821943"
                    value={formData.dni_colaborador}
                    onChange={(e) => setFormData(prev => ({ ...prev, dni_colaborador: e.target.value.replace(/\D/g, '') }))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-950 bg-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Nombre del Colaborador *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ejem: Abg. Diana Carolina Vela"
                    value={formData.nombre_completo}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre_completo: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-950 bg-white text-xs"
                  />
                </div>
              </div>

              {/* Área */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Área / Oficina de Origen *</label>
                <input
                  type="text"
                  required
                  list="suggested-areas"
                  placeholder="Ejem: Subgerencia de Registro Civil"
                  value={formData.area_origen}
                  onChange={(e) => setFormData(prev => ({ ...prev, area_origen: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-950 bg-white text-xs"
                />
                <datalist id="suggested-areas">
                  {SUGGESTED_AREAS.map(area => (
                    <option key={area} value={area} />
                  ))}
                </datalist>
              </div>

              {/* Logro / Meta Destacada */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Logro / Meta Destacada (Para el Certificado) *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escriba detalladamente el logro obtenido. Ejem: Lograr la digitalización e indexación del 100% de actas matrimoniales históricas (periodo 1980-2025)..."
                  value={formData.logro_destacado}
                  onChange={(e) => setFormData(prev => ({ ...prev, logro_destacado: e.target.value }))}
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-950 bg-white text-xs"
                />
              </div>

              {/* Fecha y Firmante */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Fecha de Otorgamiento *</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha_reconocimiento}
                    onChange={(e) => setFormData(prev => ({ ...prev, fecha_reconocimiento: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-sky-950 bg-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Asignar Firmante Oficial *</label>
                  <select
                    value={formData.id_firmante}
                    onChange={(e) => setFormData(prev => ({ ...prev, id_firmante: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg p-2.5 bg-white text-slate-700 font-medium text-xs focus:outline-none focus:border-sky-950"
                  >
                    <option value="">Seleccione firmante...</option>
                    {firmantes.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.nombre_completo} ({f.cargo})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-sky-950 hover:bg-sky-900 text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm"
                >
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DIGITAL SIGNATURE WORKFLOW (P-14) */}
      {showSignModal && selectedRecForCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-8">
            <div className="bg-sky-950 text-white p-4 flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Flujo de Emisión de Certificado con Firma Digital</h3>
              </div>
              <button 
                onClick={() => setShowSignModal(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-300 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* Preview certificate mockup */}
              <div className="space-y-2">
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">Vista Previa del Documento Distrital</span>
                <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 flex flex-col items-center">
                  
                  {/* Dynamic mini preview */}
                  <div className="transform scale-[0.7] origin-top w-full md:w-[130%] aspect-[1.414/1] bg-white border-2 border-double border-sky-950 rounded p-4 flex flex-col justify-between shadow-md">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-1">
                      <div className="flex items-center space-x-1">
                        <img 
                          src="/logo/ESCUDO_MDM_2026.png" 
                          alt="Logo Morales"
                          className="w-5 h-5 object-contain"
                          referrerPolicy="no-referrer"
                        />
                        <h4 className="text-[6px] font-black uppercase text-sky-950 leading-tight">MUNICIPALIDAD DE MORALES</h4>
                      </div>
                      <span className="text-[4px] font-mono text-slate-400">MDM-2026-REC-SAMPLE</span>
                    </div>
                    <div className="text-center my-1.5 flex-grow flex flex-col justify-center">
                      <h3 className="text-[8px] font-serif text-sky-950 font-bold uppercase leading-tight">RESOLUCIÓN DE RECONOCIMIENTO</h3>
                      <p className="text-[4px] text-slate-400 italic mt-0.5">Otorgado en reconocimiento oficial a:</p>
                      <h2 className="text-[9px] font-black text-slate-800 my-0.5 underline decoration-amber-400">
                        {selectedRecForCert.nombre_completo}
                      </h2>
                      <p className="text-[5px] text-slate-500 max-w-[210px] mx-auto leading-tight italic">
                        "{selectedRecForCert.logro_destacado}"
                      </p>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-100 pt-1">
                      <span className="text-[4px] text-slate-400 font-mono">Firma Digital Autorizada</span>
                      <span className="text-[4px] text-slate-400 font-mono">Sello Digital Morales</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password signature block */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-extrabold text-slate-700 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Autorización Criptográfica del Firmante</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Para estampar digitalmente la firma institucional, se debe seleccionar el firmante responsable con su archivo <strong className="font-mono text-indigo-950">.pfx</strong> y validar la contraseña de su certificado.
                </p>

                <form onSubmit={handleSignCertificate} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Firmante Oficial *</label>
                    <select
                      value={selectedSignerId}
                      onChange={(e) => setSelectedSignerId(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
                      disabled={isGenerating || genSuccess}
                    >
                      {firmantes.map(f => (
                        <option key={f.id} value={f.id}>
                          {f.nombre_completo} ({f.cargo})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Contraseña (.pfx Passphrase) *</label>
                    <input
                      type="password"
                      required
                      placeholder="Introduzca contraseña"
                      value={passphrase}
                      onChange={(e) => setPassphrase(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700 font-medium"
                      disabled={isGenerating || genSuccess}
                    />
                  </div>

                  {!isGenerating && !genSuccess && (
                    <div className="col-span-1 md:col-span-2 flex justify-end space-x-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowSignModal(false)}
                        className="border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-xl font-bold uppercase text-slate-600"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl uppercase transition shadow-sm"
                      >
                        Sellar y Generar Certificado
                      </button>
                    </div>
                  )}
                </form>
              </div>

              {/* Status overlays */}
              {isGenerating && (
                <div className="bg-sky-50 border border-sky-100 p-5 rounded-2xl flex items-center justify-center space-x-2.5 text-sky-950 font-bold text-xs animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin text-sky-950" />
                  <span>Cifrando sello criptográfico SHA256 y estampando firma digital .pfx...</span>
                </div>
              )}

              {genSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-emerald-800 space-y-3">
                  <div className="flex items-center space-x-2 font-extrabold uppercase text-xs">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>¡Certificado de reconocimiento firmado con éxito!</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Se ha generado la firma electrónica y se asignó el Código Único <strong className="font-mono text-slate-800">{generatedCode}</strong> para <strong>{selectedRecForCert.nombre_completo}</strong>. El documento se encuentra registrado y visible en el Portal de Búsqueda Pública de Morales.
                  </p>
                  <div className="flex space-x-2 pt-1">
                    <button
                      onClick={() => {
                        setShowSignModal(false);
                        handleViewCertificate(generatedCode);
                      }}
                      className="bg-sky-950 hover:bg-sky-900 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition"
                    >
                      Visualizar Certificado
                    </button>
                    <button
                      onClick={() => alert(`Descargando archivo: certificado_${selectedRecForCert.dni_colaborador}_reconocimiento.pdf`)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[10px] uppercase transition"
                    >
                      Descargar PDF
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowSignModal(false)}
                className="border border-slate-200 hover:bg-slate-100 px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-slate-600 text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
