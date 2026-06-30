/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Download, 
  Filter, 
  Calendar, 
  CheckCircle, 
  Clock, 
  BarChart4, 
  RefreshCw, 
  TrendingUp, 
  Plus, 
  FileSpreadsheet, 
  ExternalLink 
} from 'lucide-react';

interface CustomModuleViewProps {
  moduleName: string;
  moduleRoute: string;
}

export default function CustomModuleView({ moduleName, moduleRoute }: CustomModuleViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);
  
  // Custom mock reports inside this module
  const [reports, setReports] = useState([
    { id: 'REP-001', nombre: 'Reporte Consolidado de Firmas Electrónicas - Junio 2026', categoria: 'Firma Digital', fecha: '2026-06-29', autor: 'Ing. Alejandro Reátegui', estado: 'Aprobado', registros: 142 },
    { id: 'REP-002', nombre: 'Auditoría de Certificados Emitidos por Área Organizadora', categoria: 'Auditoría', fecha: '2026-06-28', autor: 'Mg. Rosa Flores', estado: 'Aprobado', registros: 89 },
    { id: 'REP-003', nombre: 'Asistencia y Participantes de Capacitaciones Distritales', categoria: 'Asistencia', fecha: '2026-06-26', autor: 'Lic. Beatriz Arévalo', estado: 'Aprobado', registros: 215 },
    { id: 'REP-004', nombre: 'Constancias de Prácticas Preprofesionales Concluidas', categoria: 'Practicantes', fecha: '2026-06-20', autor: 'Lic. Beatriz Arévalo', estado: 'Aprobado', registros: 12 },
    { id: 'REP-005', nombre: 'Informe de Autenticidad QR y Accesos al Portal de Verificación', categoria: 'Auditoría', fecha: '2026-06-15', autor: 'Ing. Alejandro Reátegui', estado: 'Aprobado', registros: 532 },
    { id: 'REP-006', nombre: 'Certificados Pendientes de Firma por Sello Presidencial/Alcaldía', categoria: 'Firma Digital', fecha: '2026-06-10', autor: 'Lic. Marco A. Torres', estado: 'Pendiente', registros: 24 }
  ]);

  const [newReportName, setNewReportName] = useState('');
  const [newReportCategory, setNewReportCategory] = useState('Auditoría');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReportName.trim()) return;

    const newRep = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      nombre: newReportName,
      categoria: newReportCategory,
      fecha: new Date().toISOString().split('T')[0],
      autor: 'Usuario de Morales',
      estado: 'Pendiente',
      registros: Math.floor(10 + Math.random() * 150)
    };

    setReports([newRep, ...reports]);
    setNewReportName('');
    setShowAddReport(false);
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.autor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'Todos' || r.estado === statusFilter;
    const matchesCategory = categoryFilter === 'Todos' || r.categoria === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="custom-module-root">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-slate-200 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
            <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Módulo Administrativo</span>
            <span>Ruta: /{moduleRoute}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-black text-slate-800 mt-1 uppercase">
            {moduleName}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Módulo dinámico generado por el Administrador. Datos sincronizados con el servidor en tiempo real.
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={handleRefresh}
            className="p-2 border border-slate-200 text-slate-500 hover:text-sky-950 hover:bg-slate-50 rounded-xl transition shrink-0"
            title="Sincronizar Datos"
            id="btn-refresh-custom-module"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddReport(true)}
            className="flex items-center justify-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition shadow-sm w-full md:w-auto"
            id="btn-add-custom-report"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Reporte</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Reportes Emitidos</span>
            <FileText className="w-5 h-5 text-sky-950" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">{reports.length}</h3>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center space-x-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% este mes</span>
          </p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Registros Procesados</span>
            <BarChart4 className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            {reports.reduce((acc, curr) => acc + curr.registros, 0)}
          </h3>
          <p className="text-[10px] text-slate-400">Certificados y firmas auditadas</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aprobados Oficialmente</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-800">
            {reports.filter(r => r.estado === 'Aprobado').length}
          </h3>
          <p className="text-[10px] text-slate-400">Firmados digitalmente con PFX</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pendientes de Firma</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-amber-600">
            {reports.filter(r => r.estado === 'Pendiente').length}
          </h3>
          <p className="text-[10px] text-slate-400">Requiere passphrase del firmante</p>
        </div>
      </div>

      {/* Main Filter and Table Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
            Listado General de Informes de Certificados
          </h3>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar informe..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full md:w-60 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-sky-950 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-500 font-bold uppercase tracking-wider mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros Rápidos:</span>
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="Todos">Todas las categorías</option>
            <option value="Firma Digital">Firma Digital</option>
            <option value="Auditoría">Auditoría</option>
            <option value="Asistencia">Asistencia</option>
            <option value="Practicantes">Practicantes</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-lg p-1.5 bg-white text-slate-700 font-medium"
          >
            <option value="Todos">Todos los estados</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="border border-slate-100 rounded-xl overflow-hidden bg-white text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Nombre del Informe</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4">Responsable</th>
                  <th className="py-3 px-4 text-center">Registros</th>
                  <th className="py-3 px-4 text-center">Firma PFX</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                      No se encontraron reportes con los criterios de búsqueda especificados.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                        {rep.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {rep.nombre}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10px]">
                          {rep.categoria}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {rep.fecha}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {rep.autor}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        {rep.registros}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {rep.estado === 'Aprobado' ? (
                          <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-bold uppercase tracking-wide text-[9px]">
                            <CheckCircle className="w-3 h-3" />
                            <span>Acreditado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-bold uppercase tracking-wide text-[9px]">
                            <Clock className="w-3 h-3" />
                            <span>Firma Pendiente</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => alert(`Visualizando PDF en el visor del informe ${rep.id}`)}
                            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-sky-950 rounded transition"
                            title="Ver en Visor"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => alert(`Descargando reporte oficial ${rep.id} en PDF`)}
                            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-emerald-600 rounded transition"
                            title="Descargar PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full shadow-2xl overflow-hidden animate-scale-up">
            <div className="bg-sky-950 text-white p-4 font-bold flex justify-between items-center text-sm uppercase tracking-wider">
              <span>Registrar Informe en Módulo</span>
              <button onClick={() => setShowAddReport(false)} className="text-white hover:text-slate-300">
                <Clock className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Nombre del Informe *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Análisis de Emisión Semestral de Morales"
                  value={newReportName}
                  onChange={e => setNewReportName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-950 bg-white text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase tracking-wider block">Categoría de Auditoría *</label>
                <select
                  value={newReportCategory}
                  onChange={e => setNewReportCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2 bg-white text-slate-700"
                >
                  <option value="Firma Digital">Firma Digital</option>
                  <option value="Auditoría">Auditoría</option>
                  <option value="Asistencia">Asistencia</option>
                  <option value="Practicantes">Practicantes</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddReport(false)}
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
