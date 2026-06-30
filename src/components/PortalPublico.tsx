/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, BadgeCheck, FileText, Download, QrCode, Building, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Certificado } from '../types';
import CertificatePreview from './CertificatePreview';

interface PortalPublicoProps {
  certificados: Certificado[];
  onTriggerError?: (msg: string) => void;
}

export default function PortalPublico({ certificados, onTriggerError }: PortalPublicoProps) {
  const [activeTab, setActiveTab] = useState<'search' | 'verification'>('search');
  const [dniQuery, setDniQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [foundCertificados, setFoundCertificados] = useState<Certificado[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificado | null>(null);

  // QR Verification Code
  const [qrCodeQuery, setQrCodeQuery] = useState('');
  const [verifiedCert, setVerifiedCert] = useState<Certificado | null>(null);
  const [hasVerified, setHasVerified] = useState(false);

  // Check URL query parameters for QR simulation on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('codigo');
    if (code) {
      setActiveTab('verification');
      setQrCodeQuery(code);
      const match = certificados.find(c => c.codigo_unico.toLowerCase() === code.toLowerCase());
      if (match) {
        setVerifiedCert(match);
      } else {
        setVerifiedCert(null);
      }
      setHasVerified(true);
    }
  }, [certificados]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    setIsSearched(false);

    const cleanDni = dniQuery.trim();
    if (cleanDni.length !== 8 || !/^\d+$/.test(cleanDni)) {
      const errorMsg = 'El DNI debe tener exactamente 8 dígitos numéricos';
      setSearchError(errorMsg);
      if (onTriggerError) onTriggerError(errorMsg);
      return;
    }

    const results = certificados.filter(c => c.dni_titular === cleanDni);
    setFoundCertificados(results);
    setIsSearched(true);
    setSelectedCert(null);
  };

  const handleVerifyQR = (e: React.FormEvent) => {
    e.preventDefault();
    setHasVerified(false);

    const code = qrCodeQuery.trim();
    if (!code) return;

    const match = certificados.find(c => c.codigo_unico.toLowerCase() === code.toLowerCase());
    setVerifiedCert(match || null);
    setHasVerified(true);
  };

  const handleDemoQRClick = (code: string) => {
    setActiveTab('verification');
    setQrCodeQuery(code);
    const match = certificados.find(c => c.codigo_unico === code);
    setVerifiedCert(match || null);
    setHasVerified(true);
    setSelectedCert(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="portal-publico-root">
      {/* Portal Header */}
      <header className="bg-sky-950 text-white border-b border-sky-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sky-950 shadow">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-wider uppercase text-amber-400">
                Municipalidad Distrital de Morales
              </h1>
              <h2 className="text-lg font-extrabold tracking-tight">
                Portal Público de Certificados Digitales
              </h2>
            </div>
          </div>
          <div className="flex space-x-2 text-xs md:text-sm">
            <button
              onClick={() => {
                setActiveTab('search');
                setIsSearched(false);
                setSelectedCert(null);
                setDniQuery('');
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'search'
                  ? 'bg-amber-400 text-sky-950 shadow-sm'
                  : 'text-white hover:bg-sky-900'
              }`}
            >
              Consulta por DNI
            </button>
            <button
              onClick={() => {
                setActiveTab('verification');
                setHasVerified(false);
                setQrCodeQuery('');
              }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'verification'
                  ? 'bg-amber-400 text-sky-950 shadow-sm'
                  : 'text-white hover:bg-sky-900'
              }`}
            >
              Verificación QR / Código
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8">
        {selectedCert ? (
          <div>
            <CertificatePreview
              certificado={selectedCert}
              isWatermarked={false}
              onBack={() => setSelectedCert(null)}
              onDownload={() => alert(`Simulando descarga de: ${selectedCert.ruta_archivo_pdf}`)}
            />
          </div>
        ) : activeTab === 'search' ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* P-23 — Search Section */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm text-center space-y-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-900 mb-4">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">
                  Acreditación Inmediata de Certificados
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Consulta de forma directa y segura. No necesitas crear una cuenta. Solo ingresa tu DNI para descargar tus constancias.
                </p>
              </div>

              {/* Form Search DNI */}
              <form onSubmit={handleSearch} className="max-w-md mx-auto space-y-4">
                <div>
                  <label htmlFor="dniInput" className="sr-only">Ingresa tu DNI</label>
                  <div className="relative">
                    <input
                      id="dniInput"
                      type="text"
                      maxLength={8}
                      placeholder="Ingresa tu DNI (8 dígitos)"
                      value={dniQuery}
                      onChange={(e) => setDniQuery(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-4 pr-12 py-3.5 border-2 border-slate-200 rounded-xl text-slate-800 font-medium text-center text-lg focus:border-sky-900 focus:outline-none transition font-mono tracking-widest"
                    />
                    <div className="absolute right-3.5 top-3.5 text-slate-400">
                      <Search className="w-6 h-6" />
                    </div>
                  </div>
                  {searchError && (
                    <div className="text-red-600 text-xs text-left mt-2 flex items-center space-x-1.5" id="p-23-error">
                      <AlertCircle className="w-4 h-4" />
                      <span>{searchError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-sky-950 hover:bg-sky-900 text-white font-bold py-3.5 px-6 rounded-xl transition duration-150 shadow-md flex items-center justify-center space-x-2 text-base"
                >
                  <span>Buscar Certificados</span>
                </button>
              </form>

              {/* Helper Links / Instructions */}
              <div className="border-t border-slate-100 pt-6 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>¿Problemas con tus datos? Contacta a RR.HH.</span>
                <span className="flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Acreditado mediante Firma Digital Ley Nº 27269</span>
                </span>
              </div>
            </div>

            {/* P-24 — Search Results */}
            {isSearched && (
              <div className="space-y-4 animate-fade-in" id="p-24-results">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-bold text-slate-700 uppercase tracking-wider text-xs">
                    Resultados de Búsqueda
                  </h4>
                  <span className="text-xs bg-sky-50 text-sky-950 px-2 py-0.5 rounded-full font-bold">
                    {foundCertificados.length} certificados encontrados
                  </span>
                </div>

                {foundCertificados.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-sky-950 text-white font-bold text-xs flex items-center justify-center">
                        {foundCertificados[0].nombre_titular[0]}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          Titular Registrado
                        </p>
                        <h4 className="font-extrabold text-slate-800 text-base">
                          {foundCertificados[0].nombre_titular}
                        </h4>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                      {foundCertificados.map((cert) => (
                        <div
                          key={cert.codigo_unico}
                          className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-sky-900 hover:shadow transition flex flex-col justify-between space-y-4"
                        >
                          <div>
                            <div className="flex justify-between items-start">
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                cert.tipo_origen === 'practica' 
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : cert.tipo_origen === 'reconocimiento'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              }`}>
                                {cert.tipo_origen === 'practica' ? 'Práctica' : cert.tipo_origen === 'reconocimiento' ? 'Reconocimiento' : 'Capacitación'}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                cert.estado === 'Válido'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-red-50 text-red-700 border border-red-100'
                              }`}>
                                {cert.estado}
                              </span>
                            </div>
                            <h5 className="font-bold text-slate-800 text-sm mt-3 line-clamp-2">
                              {cert.nombre_origen}
                            </h5>
                            <p className="text-[11px] text-slate-400 mt-1 font-mono">
                              Código: {cert.codigo_unico}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-2">
                              Emisión: {cert.fecha_emision}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                            <button
                              onClick={() => setSelectedCert(cert)}
                              className="flex items-center justify-center space-x-1 px-3 py-2 border border-slate-200 hover:border-sky-950 text-sky-950 text-xs font-semibold rounded-lg transition"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver</span>
                            </button>
                            <button
                              onClick={() => alert(`Descargando certificado ${cert.codigo_unico}.pdf`)}
                              className="flex items-center justify-center space-x-1 px-3 py-2 bg-sky-950 hover:bg-sky-900 text-white text-xs font-semibold rounded-lg transition"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Descargar</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-3" id="p-23-empty">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-700 font-bold">No se encontraron certificados</p>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      No encontramos ningún certificado asociado al DNI <strong className="text-slate-600">{dniQuery}</strong>. Por favor verifique el número o consulte con el área organizadora de su actividad.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* P-26 — Verification Page */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                  <BadgeCheck className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Verificar Autenticidad de Certificado
                </h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Escanee el código QR o ingrese el Código de Verificación Único para confirmar la firma digital del documento.
                </p>
              </div>

              <form onSubmit={handleVerifyQR} className="flex space-x-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Ejm: MDM-2026-CAP-000142"
                    value={qrCodeQuery}
                    onChange={(e) => setQrCodeQuery(e.target.value.toUpperCase())}
                    className="w-full pl-4 pr-10 py-2.5 border-2 border-slate-200 rounded-xl text-slate-800 font-semibold focus:border-emerald-600 focus:outline-none transition text-sm font-mono"
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-400">
                    <QrCode className="w-4 h-4" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center space-x-1.5 shrink-0"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Validar</span>
                </button>
              </form>

              {/* QR Verification Results */}
              {hasVerified && (
                <div className="border-t border-slate-100 pt-6 space-y-6 animate-fade-in" id="p-26-verification-result">
                  {verifiedCert ? (
                    <div className="space-y-6">
                      {/* Big Seal Badge Stamp */}
                      <div className={`p-4 rounded-xl flex items-center space-x-3 border ${
                        verifiedCert.estado === 'Válido'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-red-50 border-red-200 text-red-800'
                      }`}>
                        {verifiedCert.estado === 'Válido' ? (
                          <>
                            <BadgeCheck className="w-10 h-10 text-emerald-600 shrink-0" />
                            <div>
                              <h4 className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                                CERTIFICADO VÁLIDO & ACREDITADO
                              </h4>
                              <p className="text-xs text-emerald-700">
                                Emitido con firmas digitales vigentes por la Municipalidad Distrital de Morales.
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-10 h-10 text-red-600 shrink-0" />
                            <div>
                              <h4 className="font-extrabold text-sm sm:text-base tracking-wide uppercase">
                                CERTIFICADO ANULADO / REVOCADO
                              </h4>
                              <p className="text-xs text-red-700">
                                Este registro ha sido invalidado de forma permanente en el sistema central.
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Certificate details table */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs">
                        <div className="p-3 bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                          Acreditación de Identidad
                        </div>
                        <div className="divide-y divide-slate-200">
                          <div className="grid grid-cols-3 p-3">
                            <span className="text-slate-400 font-medium">Código Único</span>
                            <span className="col-span-2 font-mono font-bold text-slate-800">
                              {verifiedCert.codigo_unico}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 p-3">
                            <span className="text-slate-400 font-medium">Titular</span>
                            <span className="col-span-2 font-bold text-slate-800">
                              {verifiedCert.nombre_titular}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 p-3">
                            <span className="text-slate-400 font-medium font-mono">DNI Titular</span>
                            <span className="col-span-2 font-mono text-slate-800">
                              {verifiedCert.dni_titular}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 p-3">
                            <span className="text-slate-400 font-medium">Actividad / Origen</span>
                            <span className="col-span-2 text-slate-800 font-medium">
                              {verifiedCert.nombre_origen}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 p-3">
                            <span className="text-slate-400 font-medium">Tipo Actividad</span>
                            <span className="col-span-2 text-slate-800 font-medium">
                              {verifiedCert.tipo_origen === 'practica' ? 'Prácticas Preprofesionales' : verifiedCert.tipo_origen === 'reconocimiento' ? 'Reconocimiento de Personal Destacado' : 'Capacitación Oficial'}
                            </span>
                          </div>
                          {verifiedCert.meta_destacada && (
                            <div className="grid grid-cols-3 p-3">
                              <span className="text-slate-400 font-medium">Logro / Meta</span>
                              <span className="col-span-2 text-slate-800 font-medium italic">
                                "{verifiedCert.meta_destacada}"
                              </span>
                            </div>
                          )}
                          <div className="grid grid-cols-3 p-3">
                            <span className="text-slate-400 font-medium">Fecha Emisión</span>
                            <span className="col-span-2 text-slate-800 font-mono">
                              {verifiedCert.fecha_emision}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 p-3">
                            <span className="text-slate-400 font-medium">Firma Digital</span>
                            <span className="col-span-2 text-emerald-700 font-medium flex items-center space-x-1">
                              <BadgeCheck className="w-4 h-4" />
                              <span>Firma Acreditada ID-IND-MDM</span>
                            </span>
                          </div>
                          <div className="grid grid-cols-3 p-3">
                            <span className="text-slate-400 font-medium">Hash SHA256</span>
                            <span className="col-span-2 font-mono text-slate-500 break-all leading-normal text-[10px]">
                              {verifiedCert.hash_sha256}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Display PDF viewer direct access */}
                      <div className="flex justify-center">
                        <button
                          onClick={() => setSelectedCert(verifiedCert)}
                          className="flex items-center space-x-2 bg-sky-950 hover:bg-sky-900 text-white font-bold py-2.5 px-6 rounded-xl transition duration-150 text-xs sm:text-sm shadow-md"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Ver Certificado Digital Completo</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-xl text-center space-y-2 text-red-800">
                      <ShieldAlert className="w-10 h-10 text-red-600 mx-auto" />
                      <h4 className="font-bold text-sm">Código No Encontrado</h4>
                      <p className="text-xs text-red-600 max-w-sm mx-auto">
                        El código de verificación <strong className="font-mono text-slate-800">{qrCodeQuery}</strong> no se encuentra registrado en nuestra base de datos. Verifique si el formato es correcto o contacte al emisor del documento.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Demo QR Links helper */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Enlaces Demo de Prueba (Simula Escanear QR)
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDemoQRClick('MDM-2026-CAP-000142')}
                    className="bg-white hover:bg-slate-100 text-sky-950 font-mono text-[10px] border border-slate-200 px-2 py-1 rounded"
                  >
                    Escanear QR: Carlos Mendoza (Válido)
                  </button>
                  <button
                    onClick={() => handleDemoQRClick('MDM-2026-PRAC-000084')}
                    className="bg-white hover:bg-slate-100 text-sky-950 font-mono text-[10px] border border-slate-200 px-2 py-1 rounded"
                  >
                    Escanear QR: Linder Saavedra (Válido)
                  </button>
                  <button
                    onClick={() => handleDemoQRClick('MDM-2026-CAP-999999')}
                    className="bg-white hover:bg-slate-100 text-red-700 font-mono text-[10px] border border-red-200 px-2 py-1 rounded"
                  >
                    Escanear QR: Inexistente/Erróneo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Portal Footer */}
      <footer className="bg-sky-950 text-slate-300 border-t border-sky-900 py-6 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold uppercase tracking-wide text-amber-400">
            Municipalidad Distrital de Morales
          </p>
          <p>© 2026 Morales Distrito Digital • Oficina de Informática y Telecomunicaciones</p>
          <p className="text-slate-400">
            De conformidad con la Ley Nº 27269 de Firmas y Certificados Digitales y su Reglamento en el Perú.
          </p>
        </div>
      </footer>
    </div>
  );
}
