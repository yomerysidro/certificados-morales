/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building, ShieldAlert, KeyRound, Mail, AlertTriangle, HelpCircle, ArrowRight, CheckCircle } from 'lucide-react';
import { Usuario, UserRole } from '../types';

interface LoginProps {
  usuarios: Usuario[];
  onLoginSuccess: (user: Usuario) => void;
  onTriggerError?: (msg: string) => void;
}

export default function LoginInstitucional({ usuarios, onLoginSuccess, onTriggerError }: LoginProps) {
  const [view, setView] = useState<'login' | 'recovery'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Recovery States
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (isBlocked) {
      const blockMsg = 'Tu cuenta ha sido bloqueada tras 5 intentos fallidos. Contacta al administrador.';
      setLoginError(blockMsg);
      if (onTriggerError) onTriggerError(blockMsg);
      return;
    }

    // Attempt verification
    const foundUser = usuarios.find(
      (u) => u.correo.toLowerCase() === email.trim().toLowerCase() && u.password_hash === password
    );

    if (foundUser) {
      if (foundUser.estado === 'Inactivo') {
        const inactiveMsg = 'Esta cuenta se encuentra inactiva. Contacte al administrador.';
        setLoginError(inactiveMsg);
        if (onTriggerError) onTriggerError(inactiveMsg);
        return;
      }
      // Success
      setFailedAttempts(0);
      onLoginSuccess(foundUser);
    } else {
      // Failure
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (nextAttempts >= 5) {
        setIsBlocked(true);
        const lockMsg = 'Tu cuenta ha sido bloqueada tras 5 intentos fallidos. Contacta al administrador.';
        setLoginError(lockMsg);
        if (onTriggerError) onTriggerError(lockMsg);
      } else {
        const errorMsg = `Correo o contraseña incorrectos. Intento ${nextAttempts} de 5.`;
        setLoginError(errorMsg);
        if (onTriggerError) onTriggerError(errorMsg);
      }
    }
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;

    // Check if email exists
    const exists = usuarios.some(u => u.correo.toLowerCase() === recoveryEmail.trim().toLowerCase());

    setRecoverySuccess(true);
  };

  // Pre-fill demo login helper
  const handleQuickLogin = (role: UserRole) => {
    const matchedUser = usuarios.find(u => u.id_rol === role && u.estado === 'Activo');
    if (matchedUser) {
      setEmail(matchedUser.correo);
      setPassword(matchedUser.password_hash);
      setLoginError('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-12" id="p-00-login-root">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">

        {/* Banner header with Municipal Logo mockup */}
        <div className="bg-sky-950 text-white p-6 text-center space-y-3 relative">
          <div className="mx-auto w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden p-1">
            <img
              src="/logo/ESCUDO_MDM_2026.png"
              alt="Escudo Oficial de Morales"
              className="w-20 h-20 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
           
            <p className="text-base font-extrabold tracking-tight mt-1">
              SISTEMA DE CERTIFICADOS DIGITALES
            </p>
            <p className="text-[10px] text-sky-200 uppercase font-medium tracking-wider">
              Control de Firmas y Emisiones
            </p>
          </div>
        </div>

        <div className="p-8">
          {view === 'login' ? (
            /* P-00 Login */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-slate-800 text-center border-b border-slate-100 pb-3">
                Ingreso al Panel Institucional
              </h3>

              {/* Error messages */}
              {loginError && (
                <div
                  className={`p-3 rounded-xl flex items-start space-x-2.5 text-xs ${isBlocked ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  id="p-00-error-message"
                >
                  {isBlocked ? (
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{loginError}</span>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Correo Electrónico Institucional
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <Mail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@moralesmuni.org.pe"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-sky-950 focus:outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('recovery');
                      setRecoverySuccess(false);
                      setRecoveryEmail('');
                    }}
                    className="text-xs font-bold text-sky-900 hover:underline"
                    id="link-olvidaste"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <KeyRound className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-sky-950 focus:outline-none transition text-sm"
                  />
                </div>
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                className="w-full bg-sky-950 hover:bg-sky-900 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center space-x-2 text-sm shadow-md"
              >
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* P-01 Recuperar Contraseña */
            <form onSubmit={handleRecoverySubmit} className="space-y-5">
              <h3 className="text-lg font-bold text-slate-800 text-center border-b border-slate-100 pb-3">
                Recuperación de Credenciales
              </h3>

              {recoverySuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3" id="p-01-success">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>Enlace Enviado con Éxito</span>
                  </div>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    Hemos enviado un enlace de recuperación de contraseña al correo{' '}
                    <strong className="text-slate-800 font-mono">{recoveryEmail}</strong>.
                  </p>
                  <p className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
                    Aviso: El enlace expira en 24 horas y es válido para un solo uso.
                  </p>
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="w-full text-center text-xs font-bold text-sky-950 hover:underline mt-2 block"
                  >
                    Volver al login
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 leading-relaxed text-center">
                    Ingrese su correo electrónico registrado. Le enviaremos un correo con un link único y seguro para restablecer sus credenciales.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Correo Electrónico Institucional
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400">
                        <Mail className="w-5 h-5" />
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="ejemplo@moralesmuni.org.pe"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl text-slate-800 focus:border-sky-950 focus:outline-none transition text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-sky-950 hover:bg-sky-900 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center text-sm shadow-md"
                  >
                    <span>Enviar enlace de recuperación</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline block"
                  >
                    Volver al login
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Quick Demo Credentials Panel (For Flow 1 Simulation and testing) */}
      <div className="w-full max-w-md mt-6 bg-slate-50 rounded-2xl border border-slate-200 p-4 shadow-sm text-xs">
        <p className="font-bold text-slate-700 flex items-center space-x-1 mb-2">
          <HelpCircle className="w-4 h-4 text-sky-900" />
          <span>Atajos de Acceso de Prueba (Para evaluar Flujo 1)</span>
        </p>
        <p className="text-slate-500 mb-3 text-[10px]">
          Haga clic en cualquiera para auto-completar el formulario de inicio de sesión según el rol deseado:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleQuickLogin('Administrador')}
            className="bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-900 p-2 rounded-lg text-slate-700 font-semibold text-center transition"
          >
            Administrador
          </button>
          <button
            onClick={() => handleQuickLogin('Digitador')}
            className="bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-900 p-2 rounded-lg text-slate-700 font-semibold text-center transition"
          >
            Digitador
          </button>
          <button
            onClick={() => handleQuickLogin('Gerencial')}
            className="bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-900 p-2 rounded-lg text-slate-700 font-semibold text-center transition"
          >
            Gerencial
          </button>
        </div>
      </div>
    </div>
  );
}
