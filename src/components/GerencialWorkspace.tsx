/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  BarChart4,
  PieChart,
  Download,
  Building,
  TrendingUp,
  FileSpreadsheet,
  Award,
  Users,
  Calendar,
  Layers
} from 'lucide-react';
import { Actividad, Certificado, Practica } from '../types';

interface GerencialWorkspaceProps {
  actividades: Actividad[];
  certificados: Certificado[];
  practicas: Practica[];
}

export default function GerencialWorkspace({
  actividades,
  certificados,
  practicas
}: GerencialWorkspaceProps) {
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports'>('dashboard');
  const [reportTab, setReportTab] = useState<'actividades' | 'certificados'>('actividades');

  // Filters
  const [filterType, setFilterType] = useState('');

  // Statistics
  const totalCertsThisMonth = certificados.length;
  const totalActs = actividades.length;
  const activePractices = practicas.filter(pr => pr.estado === 'En curso').length;

  // Custom Chart Data: Certificates Issued last 6 months (mock)
  const monthlyData = [
    { month: 'Ene', count: 18 },
    { month: 'Feb', count: 25 },
    { month: 'Mar', count: 42 },
    { month: 'Abr', count: 35 },
    { month: 'May', count: 58 },
    { month: 'Jun', count: totalCertsThisMonth }
  ];

  const maxCount = Math.max(...monthlyData.map(d => d.count), 60);

  // Custom Pie Data: Type distribution
  const typeDistribution = [
    { name: 'Capacitación', count: certificados.filter(c => c.tipo_origen === 'actividad' && c.nombre_origen.toLowerCase().includes('taller')).length, color: 'bg-sky-950' },
    { name: 'Reconocimiento', count: certificados.filter(c => c.tipo_origen === 'actividad' && c.nombre_origen.toLowerCase().includes('reconocimiento')).length, color: 'bg-amber-500' },
    { name: 'Prácticas', count: certificados.filter(c => c.tipo_origen === 'practica').length, color: 'bg-emerald-600' }
  ];

  const handleExport = (format: string) => {
    alert(`Exportando reporte gerencial de ${reportTab} en formato ${format}...`);
  };

  return (
    <div className="space-y-6" id="gerencial-root-panel">
      
      {/* Gerencial Section Menu */}
      <div className="flex border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm space-x-1">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            currentView === 'dashboard'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="gerencial-tab-dash"
        >
          Dashboard Directivo
        </button>
        <button
          onClick={() => setCurrentView('reports')}
          className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
            currentView === 'reports'
              ? 'bg-sky-950 text-white'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          id="gerencial-tab-reports"
        >
          Reportes de Control
        </button>
      </div>

      {currentView === 'dashboard' ? (
        /* P-21 — Dashboard Gerencial (Read Only) */
        <div className="space-y-6 animate-fade-in" id="p-21-dashboard">
          
          {/* Read only Warning banner */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center space-x-3 text-xs text-amber-900">
            <Building className="w-5 h-5 text-amber-700 shrink-0" />
            <p className="font-medium">
              Usted ha ingresado con perfil de <strong>Monitoreo y Lectura Directiva (Gerencial)</strong>. No cuenta con permisos para editar registros ni generar firmas digitales directas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-sky-50 text-sky-950 rounded-xl">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Certificados Emitidos
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {totalCertsThisMonth}
                </h4>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Actividades Realizadas
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {totalActs}
                </h4>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Prácticas Activas hoy
                </p>
                <h4 className="text-2xl font-black text-slate-800">
                  {activePractices}
                </h4>
              </div>
            </div>
          </div>

          {/* Graphics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Bar Chart of emission trend */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-950" />
                  <span>Tendencia de Certificados Emitidos</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Últimos 6 meses</span>
              </div>

              {/* Bar render */}
              <div className="h-64 flex items-end justify-between px-4 pt-6 pb-2">
                {monthlyData.map((d, i) => {
                  const percent = (d.count / maxCount) * 100;
                  return (
                    <div key={i} className="flex flex-col items-center space-y-2 flex-grow mx-1 group">
                      <div className="text-[10px] font-bold text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition duration-150">
                        {d.count}
                      </div>
                      <div 
                        className="w-full bg-sky-950 hover:bg-amber-400 rounded-t-md transition duration-150" 
                        style={{ height: `${percent}%`, minHeight: '4px' }}
                      ></div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">{d.month}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chart 2: Pie/Donut breakdown of certification types */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-sky-950" />
                  <span>Distribución por Tipo de Actividad</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Emisiones 2026</span>
              </div>

              {/* Pie legend breakdown layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center pt-4">
                {/* Visual donut bars representation */}
                <div className="space-y-3 text-xs">
                  {typeDistribution.map((t, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-center font-semibold text-slate-600">
                        <span className="flex items-center space-x-1.5">
                          <span className={`w-3 h-3 rounded-full ${t.color}`}></span>
                          <span>{t.name}</span>
                        </span>
                        <span className="font-mono font-bold text-slate-800">{t.count}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${t.color}`} style={{ width: `${t.count ? (t.count / totalCertsThisMonth) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Analytical recap box */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1.5">
                  <p className="font-bold text-slate-700">Resumen Ejecutivo:</p>
                  <p>La mayor concentración de emisiones corresponde a las constancias preprofesionales con convenios educativos vigentes en Morales.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* P-22 — Reportes Gerencial (solo lectura, sin creación) */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6 animate-fade-in" id="p-22-reports-read">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                Mesa Directiva de Reportes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Consulte la tabla acumulada de actividades municipales y descárguela en formato oficial.
              </p>
            </div>
            {/* Export buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('PDF')}
                className="flex items-center space-x-1.5 bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
              >
                <Download className="w-4 h-4" />
                <span>PDF Directivo</span>
              </button>
              <button
                onClick={() => handleExport('Excel')}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
              >
                <Download className="w-4 h-4" />
                <span>Excel Directivo</span>
              </button>
            </div>
          </div>

          {/* Filtering selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-500 block mb-1">Filtrar Tipo Actividad</label>
              <select 
                value={filterType} 
                onChange={e => setFilterType(e.target.value)} 
                className="w-full border border-slate-200 rounded-lg p-2.5 bg-white font-medium text-slate-700 focus:outline-none"
              >
                <option value="">Todas</option>
                <option value="Capacitación">Capacitaciones</option>
                <option value="Reconocimiento">Reconocimientos</option>
              </select>
            </div>
          </div>

          {/* Activities Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  <th className="py-3 px-6">Actividad</th>
                  <th className="py-3 px-6">Tipo</th>
                  <th className="py-3 px-6">Fechas</th>
                  <th className="py-3 px-6">Sede</th>
                  <th className="py-3 px-6">Área Organizadora</th>
                  <th className="py-3 px-6">Certificados Emitidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {actividades
                  .filter(a => filterType === '' || a.tipo_actividad === filterType)
                  .map((a, idx) => (
                    <tr 
                      key={a.id} 
                      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-slate-50 transition`}
                    >
                      <td className="py-3 px-6 font-bold text-slate-800">{a.nombre}</td>
                      <td className="py-3 px-6 font-semibold text-slate-500">{a.tipo_actividad}</td>
                      <td className="py-3 px-6 font-mono text-slate-500">{a.fecha_inicio} al {a.fecha_fin}</td>
                      <td className="py-3 px-6 italic">{a.sede}</td>
                      <td className="py-3 px-6">{a.area_organizadora}</td>
                      <td className="py-3 px-6 font-bold text-sky-950">
                        {a.estado === 'Cerrada' ? '2 certificados' : '0 (Activa)'}
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
