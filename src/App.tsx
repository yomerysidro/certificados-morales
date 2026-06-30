/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Figma,
  Layers,
  Sparkles,
  Building,
  Users,
  Award,
  Activity,
  FileText,
  LogOut,
  AlertTriangle,
  HelpCircle,
  Clock,
  ShieldCheck,
  CheckCircle,
  AlertOctagon,
  Lock,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

import {
  Usuario,
  Actividad,
  Participante,
  ActividadParticipante,
  Ponente,
  Firmante,
  Practicante,
  Practica,
  Certificado,
  Reemision,
  Rol,
  Modulo,
  Permiso,
  Reconocimiento
} from './types';

import {
  INITIAL_USUARIOS,
  INITIAL_INSTITUCIONES,
  INITIAL_ACTIVIDADES,
  INITIAL_PARTICIPANTES,
  INITIAL_ACTIVIDAD_PARTICIPANTES,
  INITIAL_PONENTES,
  INITIAL_FIRMANTES,
  INITIAL_PRACTICANTES,
  INITIAL_PRACTICAS,
  INITIAL_CERTIFICADOS,
  INITIAL_REEMISIONES,
  INITIAL_ROLES,
  INITIAL_MODULOS,
  INITIAL_PERMISOS,
  INITIAL_RECONOCIMIENTOS,
  getStoredState,
  saveStoredState
} from './data';

import LoginInstitucional from './components/LoginInstitucional';
import PortalPublico from './components/PortalPublico';
import UserManagement from './components/UserManagement';
import DigitadorWorkspace from './components/DigitadorWorkspace';
import GerencialWorkspace from './components/GerencialWorkspace';
import CustomModuleView from './components/CustomModuleView';

export default function App() {
  // --- CORE DATABASE STATES (PERSISTED IN LOCALSTORAGE) ---
  const [usuarios, setUsuarios] = useState<Usuario[]>(() =>
    getStoredState('usuarios', INITIAL_USUARIOS)
  );
  const [actividades, setActividades] = useState<Actividad[]>(() =>
    getStoredState('actividades', INITIAL_ACTIVIDADES)
  );
  const [participantes, setParticipantes] = useState<Participante[]>(() =>
    getStoredState('participantes', INITIAL_PARTICIPANTES)
  );
  const [actividadParticipantes, setActividadParticipantes] = useState<ActividadParticipante[]>(() =>
    getStoredState('actividadParticipantes', INITIAL_ACTIVIDAD_PARTICIPANTES)
  );
  const [ponentes, setPonentes] = useState<Ponente[]>(() =>
    getStoredState('ponentes', INITIAL_PONENTES)
  );
  const [certificados, setCertificados] = useState<Certificado[]>(() =>
    getStoredState('certificados', INITIAL_CERTIFICADOS)
  );
  const [reemisiones, setReemisiones] = useState<Reemision[]>(() =>
    getStoredState('reemisiones', INITIAL_REEMISIONES)
  );
  const [practicantes, setPracticantes] = useState<Practicante[]>(() =>
    getStoredState('practicantes', INITIAL_PRACTICANTES)
  );
  const [practicas, setPracticas] = useState<Practica[]>(() =>
    getStoredState('practicas', INITIAL_PRACTICAS)
  );
  const [reconocimientos, setReconocimientos] = useState<Reconocimiento[]>(() =>
    getStoredState('reconocimientos', INITIAL_RECONOCIMIENTOS)
  );
  const [instituciones] = useState(INITIAL_INSTITUCIONES);
  const [firmantes, setFirmantes] = useState<Firmante[]>(() =>
    getStoredState('firmantes', INITIAL_FIRMANTES)
  );

  const [roles, setRoles] = useState<Rol[]>(() =>
    getStoredState('roles', INITIAL_ROLES)
  );
  const [modulos, setModulos] = useState<Modulo[]>(() =>
    getStoredState('modulos', INITIAL_MODULOS)
  );
  const [permisos, setPermisos] = useState<Permiso[]>(() =>
    getStoredState('permisos', INITIAL_PERMISOS)
  );

  // Save changes to localStorage
  useEffect(() => {
    saveStoredState('usuarios', usuarios);
  }, [usuarios]);
  useEffect(() => {
    saveStoredState('actividades', actividades);
  }, [actividades]);
  useEffect(() => {
    saveStoredState('participantes', participantes);
  }, [participantes]);
  useEffect(() => {
    saveStoredState('actividadParticipantes', actividadParticipantes);
  }, [actividadParticipantes]);
  useEffect(() => {
    saveStoredState('ponentes', ponentes);
  }, [ponentes]);
  useEffect(() => {
    saveStoredState('certificados', certificados);
  }, [certificados]);
  useEffect(() => {
    saveStoredState('reemisiones', reemisiones);
  }, [reemisiones]);
  useEffect(() => {
    saveStoredState('practicantes', practicantes);
  }, [practicantes]);
  useEffect(() => {
    saveStoredState('practicas', practicas);
  }, [practicas]);
  useEffect(() => {
    saveStoredState('reconocimientos', reconocimientos);
  }, [reconocimientos]);
  useEffect(() => {
    saveStoredState('roles', roles);
  }, [roles]);
  useEffect(() => {
    saveStoredState('modulos', modulos);
  }, [modulos]);
  useEffect(() => {
    saveStoredState('permisos', permisos);
  }, [permisos]);

  useEffect(() => {
    saveStoredState('firmantes', firmantes);
  }, [firmantes]);

  // --- FIGMA SIMULATOR NAVIGATION ---
  const [activeFigmaPage, setActiveFigmaPage] = useState<string>('3'); // Default to Digitador panel as it is the most active
  const [activeFlowId, setActiveFlowId] = useState<string>('none');
  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => {
    // Default logged in user matches default Page
    return INITIAL_USUARIOS[1]; // Beatriz Digitador
  });

  // Log of simulated events
  const [simulatorLogs, setSimulatorLogs] = useState<string[]>([
    'Simulador inicializado. Paleta: Azul municipal Morales.',
    'Dato precargado: Taller de Gestión Pública (Cerrada, listo para consultar).'
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setSimulatorLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 8)]);
  };

  // Synchronize user login when figma page shifts
  const handleFigmaPageChange = (pageId: string) => {
    setActiveFigmaPage(pageId);
    setActiveFlowId('none');

    if (pageId === '1') {
      setCurrentUser(null);
      addLog('Vista cambiada a: 1. Login (Login & Recuperación)');
    } else if (pageId === '2') {
      const adminUser = usuarios.find(u => u.id_rol === 'Administrador') || INITIAL_USUARIOS[0];
      setCurrentUser(adminUser);
      addLog('Vista cambiada a: 2. Administrador. Auto-login: Alejandro Reátegui.');
    } else if (pageId === '3') {
      const digUser = usuarios.find(u => u.id_rol === 'Digitador' && u.estado === 'Activo') || INITIAL_USUARIOS[1];
      setCurrentUser(digUser);
      addLog('Vista cambiada a: 3. Digitador. Auto-login: Beatriz Arévalo (RR.HH.).');
    } else if (pageId === '4') {
      const gerUser = usuarios.find(u => u.id_rol === 'Gerencial') || INITIAL_USUARIOS[2];
      setCurrentUser(gerUser);
      addLog('Vista cambiada a: 4. Gerencial. Auto-login: Lic. Marco Antonio (Alcalde).');
    } else if (pageId === '5') {
      setCurrentUser(null);
      addLog('Vista cambiada a: 5. Portal Público (Búsqueda por DNI & QR)');
    } else if (pageId === '6') {
      addLog('Vista cambiada a: 6. Flujos de Error (Casos de prueba & validaciones)');
    }
  };

  // Simulate complete user flows automatically
  const handleTriggerFlow = (flowId: string) => {
    setActiveFlowId(flowId);

    if (flowId === 'flow-1') {
      setCurrentUser(null);
      setActiveFigmaPage('1');
      addLog('Flujo 1 (Autenticación): Use el atajo de login para ingresar al Dashboard.');
    } else if (flowId === 'flow-2') {
      const adminUser = usuarios.find(u => u.id_rol === 'Administrador') || INITIAL_USUARIOS[0];
      setCurrentUser(adminUser);
      setActiveFigmaPage('2');
      addLog('Flujo 2 (Gestión Usuarios): Diríjase a la pestaña "Gestión de Usuarios" y presione "Nuevo Usuario".');
    } else if (flowId === 'flow-3') {
      const digUser = usuarios.find(u => u.id_rol === 'Digitador') || INITIAL_USUARIOS[1];
      setCurrentUser(digUser);
      setActiveFigmaPage('3');
      addLog('Flujo 3 (Ciclo Capacitación): Ingrese a "Actividades", pulse "Ver" en la cerrada e inicie la generación.');
    } else if (flowId === 'flow-4') {
      const digUser = usuarios.find(u => u.id_rol === 'Digitador') || INITIAL_USUARIOS[1];
      setCurrentUser(digUser);
      setActiveFigmaPage('3');
      addLog('Flujo 4 (Prácticas): Ingrese a "Practicantes" para registrar o emitir constancias.');
    } else if (flowId === 'flow-5') {
      setCurrentUser(null);
      setActiveFigmaPage('5');
      addLog('Flujo 5 (Consulta Pública): Ingrese un DNI (ej: 42156789) en el buscador para ver sus certificados.');
    } else if (flowId === 'flow-6') {
      setCurrentUser(null);
      setActiveFigmaPage('5');
      addLog('Flujo 6 (Verificación QR): Use los atajos de la pestaña "Verificación QR" para escanear y autenticar.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveFigmaPage('1');
    addLog('Sesión cerrada por el usuario.');
  };

  const handleLoginSuccess = (user: Usuario) => {
    setCurrentUser(user);
    addLog(`Inicio de sesión exitoso. Rol: ${user.id_rol}.`);
    if (user.id_rol === 'Administrador') {
      setActiveFigmaPage('2');
    } else if (user.id_rol === 'Digitador') {
      setActiveFigmaPage('3');
    } else if (user.id_rol === 'Gerencial') {
      setActiveFigmaPage('4');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800" id="main-app-container">
      
      {/* 1. TOP INTERACTIVE FIGMA SIMULATOR CONTROLLER BAR */}
      <div className="bg-slate-900 text-white border-b border-slate-800 shrink-0 no-print" id="figma-simulator-topbar">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs">
          
          {/* Logo brand */}
          <div className="flex items-center space-x-2">
            <div className="bg-amber-400 p-1 rounded text-slate-900">
              <Figma className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-extrabold tracking-wider text-amber-400 uppercase text-[10px]">PROTOTIPO NAVEGABLE FIGMA</span>
              </div>
              <h2 className="font-bold text-slate-300 text-[11px]">Sistema de Certificados Digitales - Morales</h2>
            </div>
          </div>

          {/* Figma Pages Switcher */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-slate-400 font-bold uppercase text-[9px] mr-1 block">Páginas Figma:</span>
            {[
              { id: '1', name: '1. Login' },
              { id: '2', name: '2. Administrador' },
              { id: '3', name: '3. Digitador' },
              { id: '4', name: '4. Gerencial' },
              { id: '5', name: '5. Portal Público' },
              { id: '6', name: '6. Flujos de Error' }
            ].map(page => (
              <button
                key={page.id}
                onClick={() => handleFigmaPageChange(page.id)}
                className={`px-2.5 py-1 rounded font-bold transition text-[10px] ${
                  activeFigmaPage === page.id
                    ? 'bg-amber-400 text-slate-900 shadow-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                id={`figma-btn-page-${page.id}`}
              >
                {page.name}
              </button>
            ))}
          </div>

          {/* Interactive Flows Shortcuts */}
          <div className="flex flex-wrap gap-1.5 items-center border-t lg:border-t-0 lg:border-l border-slate-700 pt-2 lg:pt-0 lg:pl-4">
            <span className="text-slate-400 font-bold uppercase text-[9px] mr-1 block">Flujos de Interacción:</span>
            {[
              { id: 'flow-1', num: 'F1', name: 'Autenticación' },
              { id: 'flow-2', num: 'F2', name: 'Usuarios' },
              { id: 'flow-3', num: 'F3', name: 'Capacitación' },
              { id: 'flow-4', num: 'F4', name: 'Práctica' },
              { id: 'flow-5', num: 'F5', name: 'Consulta' },
              { id: 'flow-6', num: 'F6', name: 'QR' }
            ].map(flow => (
              <button
                key={flow.id}
                onClick={() => handleTriggerFlow(flow.id)}
                className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold transition border ${
                  activeFlowId === flow.id
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title={flow.name}
              >
                {flow.num}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 2. PRIMARY APPLICATION BAR (INSTITUTIONAL HEADER) */}
      <header className="bg-white border-b border-slate-200 shadow-sm shrink-0" id="muni-institutional-header">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow overflow-hidden p-0.5 border border-slate-200">
              <img 
                src="/logo/ESCUDO_MDM_2026.png" 
                alt="Escudo de Morales"
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <h1 className="text-xs font-bold uppercase tracking-wider text-sky-950">
                  Municipalidad Distrital de Morales
                </h1>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                Plataforma de Control e Identidad de Firmas Digitales
              </p>
            </div>
          </div>

          {/* User Profile display/logout */}
          {currentUser ? (
            <div className="flex items-center space-x-3 text-xs">
              <div className="text-right hidden sm:block">
                <p className="font-extrabold text-slate-800">{currentUser.nombre_completo}</p>
                <span className="text-[10px] bg-sky-50 text-sky-950 px-2 py-0.5 rounded-full font-bold border border-sky-100 uppercase tracking-wide">
                  {currentUser.id_rol}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-sky-950 text-white flex items-center justify-center font-bold">
                {currentUser.nombre_completo[0]}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                title="Cerrar sesión"
                id="btn-logout-institucional"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
              Acceso Público
            </span>
          )}

        </div>
      </header>

      {/* ==================== ESTRUCTURA CORREGIDA (SIDEBAR ESTÁTICO + SCROLL SOLO EN MAIN) ==================== */}
      <div className="flex-grow flex flex-col md:flex-row w-full h-[calc(100vh-110px)] overflow-hidden" id="workspace-wrapper">
        
        {/* SIDEBAR FOR REGISTERED USERS */}
        {currentUser && (
          <aside className="w-full md:w-64 bg-sky-950 text-slate-200 border-r border-sky-900 p-4 shrink-0 no-print overflow-y-auto" id="muni-sidebar">
            <div className="space-y-6">
              
              {/* Header profile section */}
              <div className="border-b border-sky-900 pb-4">
                <p className="text-[10px] font-bold uppercase text-amber-400 tracking-widest">Panel Activo</p>
                <p className="font-extrabold text-white text-sm mt-1 truncate">{currentUser.nombre_completo}</p>
                <span className="text-[9px] text-sky-300 font-mono font-bold uppercase">{currentUser.id_rol}</span>
              </div>

              {/* Navigation list according to rol - DYNAMICALLY PERMITTED MODULOS */}
              <nav className="space-y-1.5 text-xs font-bold uppercase tracking-wider">
                {(() => {
                  const currentNumericRoleId = currentUser.id_rol === 'Administrador' ? 1 : currentUser.id_rol === 'Gerencial' ? 3 : 2;
                  const allowedPermissions = permisos.filter(p => p.id_rol === currentNumericRoleId && p.permiso_lectura);
                  const allowedModules = allowedPermissions
                    .map(p => modulos.find(m => m.id_modulo === p.id_modulo))
                    .filter(Boolean) as Modulo[];

                  const getModuleIcon = (id_modulo: number) => {
                    switch (id_modulo) {
                      case 1: return <Users className="w-4 h-4" />;
                      case 2: return <Activity className="w-4 h-4" />;
                      case 3: return <Award className="w-4 h-4" />;
                      case 4: return <Layers className="w-4 h-4" />;
                      case 5: return <AlertTriangle className="w-4 h-4" />;
                      default: return <FileText className="w-4 h-4" />;
                    }
                  };

                  if (allowedModules.length === 0) {
                    return (
                      <p className="text-[10px] text-rose-300 italic p-2 bg-rose-950/40 rounded-xl border border-rose-900/30">
                        Sin módulos asignados. Contacte al Administrador.
                      </p>
                    );
                  }

                  return allowedModules.map(mod => (
                    <button
                      key={mod.id_modulo}
                      onClick={() => handleFigmaPageChange(mod.ruta)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center space-x-2.5 transition ${
                        activeFigmaPage === mod.ruta ? 'bg-amber-400 text-sky-950' : 'hover:bg-sky-900'
                      }`}
                    >
                      {getModuleIcon(mod.id_modulo)}
                      <span>{mod.nombre_modulo}</span>
                    </button>
                  ));
                })()}
              </nav>

            </div>
          </aside>
        )}

        {/* PRIMARY DISPLAY VIEWPORT COMPONENT (CON SCROLL INDEPENDIENTE) */}
        <main className="flex-grow p-4 md:p-8 overflow-y-auto h-full w-full max-w-7xl mx-auto">
          
          {/* FIGMA PAGE 1: COMPARTIDO (LOGIN & RECOVERY) */}
          {activeFigmaPage === '1' && (
            <LoginInstitucional
              usuarios={usuarios}
              onLoginSuccess={handleLoginSuccess}
              onTriggerError={(msg) => addLog(`[VALIDACIÓN ERROR] ${msg}`)}
            />
          )}

          {/* FIGMA PAGE 2: ADMINISTRADOR WORKSPACE */}
          {activeFigmaPage === '2' && (
            <UserManagement
              usuarios={usuarios}
              setUsuarios={setUsuarios}
              certificados={certificados}
              setCertificados={setCertificados}
              reemisiones={reemisiones}
              setReemisiones={setReemisiones}
              actividadesCount={actividades.length}
              roles={roles}
              modulos={modulos}
              setModulos={setModulos}
              permisos={permisos}
              setPermisos={setPermisos}
              onTriggerError={(msg) => addLog(`[VALIDACIÓN ERROR] ${msg}`)}
            />
          )}

          {/* FIGMA PAGE 3: DIGITADOR WORKSPACE */}
          {activeFigmaPage === '3' && (
            <DigitadorWorkspace
              actividades={actividades}
              setActividades={setActividades}
              participantes={participantes}
              setParticipantes={setParticipantes}
              actividadParticipantes={actividadParticipantes}
              setActividadParticipantes={setActividadParticipantes}
              ponentes={ponentes}
              setPonentes={setPonentes}
              firmantes={firmantes}
              setFirmantes={setFirmantes}
              practicantes={practicantes}
              setPracticantes={setPracticantes}
              practicas={practicas}
              setPracticas={setPracticas}
              reconocimientos={reconocimientos}
              setReconocimientos={setReconocimientos}
              instituciones={instituciones}
              certificados={certificados}
              setCertificados={setCertificados}
              onTriggerError={(msg) => addLog(`[VALIDACIÓN ERROR] ${msg}`)}
            />
          )}

          {/* FIGMA PAGE 4: GERENCIAL WORKSPACE */}
          {activeFigmaPage === '4' && (
            <GerencialWorkspace
              actividades={actividades}
              certificados={certificados}
              practicas={practicas}
            />
          )}

          {/* FIGMA PAGE 5: PORTAL PÚBLICO */}
          {activeFigmaPage === '5' && (
            <PortalPublico
              certificados={certificados}
              onTriggerError={(msg) => addLog(`[VALIDACIÓN ERROR] ${msg}`)}
            />
          )}

          {/* FIGMA PAGE 6: FLUJOS DE ERROR SHOWCASE PANEL */}
          {activeFigmaPage === '6' && (
            <div className="space-y-6 animate-fade-in" id="error-showcase-panel">
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  Panel de Evaluación de Errores y Validaciones
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Evalúe cada uno de los flujos de error requeridos por el pliego del prototipo navegable de Morales.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Error Card 1 */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>DNI con formato inválido (&lt; 8 dígitos)</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Ocurre en la búsqueda del portal público y en la creación de participantes/usuarios.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFigmaPage('5');
                      addLog('Para probar DNI < 8 dígitos, escriba un número corto en el portal de búsqueda pública.');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition"
                  >
                    Simular en Portal Público
                  </button>
                </div>

                {/* Error Card 2 */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>Fecha de fin anterior a fecha de inicio</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Bloquea el guardado en la creación de actividades e internships de practicantes.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFigmaPage('3');
                      addLog('Ingrese a Actividades -> presione "Nueva Actividad" -> ingrese una fecha fin anterior a la de inicio.');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition"
                  >
                    Simular en Digitador Panel
                  </button>
                </div>

                {/* Error Card 3 */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>Editar Actividad Cerrada</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    El botón editar se deshabilita para actividades en estado "Cerrada" para proteger las firmas.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFigmaPage('3');
                      addLog('Seleccione la actividad cerrada "Taller de Gestión" en el Digitador, verá el botón Editar deshabilitado.');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition"
                  >
                    Ver en listado de Actividades
                  </button>
                </div>

                {/* Error Card 4 */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>Eliminar Participante con Certificado</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Se protege a los usuarios con certificados de ser eliminados por accidente administrativo.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFigmaPage('3');
                      addLog('Seleccione la actividad "Taller de Gestión Pública", ingrese a participantes e intente eliminar a Carlos Mendoza.');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition"
                  >
                    Simular en Participantes
                  </button>
                </div>

                {/* Error Card 5 */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>Login Incorrecto & Lockout</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Muestra mensajes rojos tras errores y bloquea la cuenta tras 5 intentos fallidos acumulados.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFigmaPage('1');
                      addLog('Escriba credenciales incorrectas 5 veces en el login para verificar el bloqueo de seguridad.');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition"
                  >
                    Simular en Login
                  </button>
                </div>

                {/* Error Card 6 */}
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                    <AlertOctagon className="w-5 h-5 shrink-0" />
                    <span>Generar Certificados en Actividad Activa</span>
                  </div>
                  <p className="text-slate-500 text-xs">
                    Evita la firma prematura de certificados mientras la actividad sigue abierta.
                  </p>
                  <button
                    onClick={() => {
                      setActiveFigmaPage('3');
                      addLog('Abra la actividad "Reconocimiento al Mérito" (Activa) e intente pulsar el botón generar.');
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-lg transition"
                  >
                    Verificar Restricción
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* DYNAMIC DEDICATED VIEW FOR ADMINISTRATOR REGISTERED CUSTOM MODULES */}
          {!['1', '2', '3', '4', '5', '6'].includes(activeFigmaPage) && (
            (() => {
              const matchedModule = modulos.find(m => m.ruta === activeFigmaPage);
              return matchedModule ? (
                <CustomModuleView 
                  moduleName={matchedModule.nombre_modulo} 
                  moduleRoute={matchedModule.ruta} 
                />
              ) : (
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
                  <h4 className="font-bold text-sm uppercase tracking-wider">Módulo no encontrado o no autorizado</h4>
                  <p className="text-xs mt-1">
                    La ruta especificada para este módulo no corresponde a ninguna vista o recurso disponible.
                  </p>
                </div>
              );
            })()
          )}

        </main>
      </div>

     
    </div>
  );
}