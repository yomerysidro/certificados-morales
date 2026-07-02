/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Award, ShieldCheck, Download, Printer, QrCode, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { Certificado } from '../types';

interface CertificatePreviewProps {
  certificado: Partial<Certificado>;
  isWatermarked?: boolean;
  onBack?: () => void;
  onDownload?: () => void;
}

export default function CertificatePreview({
  certificado,
  isWatermarked = false,
  onBack,
  onDownload
}: CertificatePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      // Create a temporary print stylesheet and trigger window print
      const style = document.createElement('style');
      style.innerHTML = `
        @media print {
          body { background: white; color: black; }
          .no-print { display: none !important; }
          .print-area { border: 4px double #0d3b66 !important; padding: 2rem !important; }
        }
      `;
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
    }
  };

  const {
    codigo_unico = 'MDM-2026-CAP-XXXXXX',
    nombre_titular = 'JUAN PÉREZ GÓMEZ',
    dni_titular = 'XXXXXXXX',
    nombre_origen = 'NOMBRE DE LA ACTIVIDAD O CAPACITACIÓN',
    fecha_emision = '2026-06-29',
    tipo_origen = 'actividad',
    estado = 'Válido',
    hash_sha256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    horas = 40,
    meta_destacada = '',
    area_colaborador = ''
  } = certificado;

  const isRevoked = estado === 'Revocado';

  const getTipoTag = () => {
    if (tipo_origen === 'practica') return 'Constancia de Prácticas';
    if (tipo_origen === 'reconocimiento') return 'Reconocimiento Institucional';
    return 'Certificado Digital';
  };

  const getDocTitle = () => {
    if (tipo_origen === 'practica') return 'CONSTANCIA DE PRÁCTICAS';
    if (tipo_origen === 'reconocimiento') return 'RESOLUCIÓN DE RECONOCIMIENTO';
    return 'CERTIFICADO DIGITAL';
  };

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto" id="p-25-viewer">
      {/* Viewer Actions Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm no-print">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition"
              id="cert-btn-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h3 className="font-semibold text-slate-800 text-sm md:text-base">
              Visor Oficial de Certificados Digitales
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Código: {codigo_unico}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition"
            id="cert-btn-print"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimir</span>
          </button>
          <button
            onClick={onDownload}
            className="flex items-center space-x-2 px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-white rounded-lg text-sm transition"
            id="cert-btn-download"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Revocation Warning if Revoked */}
      {isRevoked && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start space-x-3 no-print">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-red-800 text-sm">Este certificado ha sido REVOCADO</h4>
            <p className="text-xs text-red-700 mt-0.5">
              La reemisión de este documento o cambios administrativos han invalidado el presente registro. 
              Por favor, consulte la versión más actualizada.
            </p>
          </div>
        </div>
      )}

      {/* Actual Certificate Document Canvas */}
      <div 
        ref={printRef}
        className="relative bg-white aspect-[1.414/1] w-full border-[12px] border-double border-sky-950 p-6 md:p-12 shadow-md rounded-lg overflow-hidden flex flex-col justify-between"
        style={{ contentVisibility: 'auto' }}
        id="certificate-canvas-container"
      >
        {/* Decorative corner borders */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-sky-900"></div>
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-sky-900"></div>
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-sky-900"></div>
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-sky-900"></div>

        {/* WATERMARK */}
        {isWatermarked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 rotate-12 opacity-10">
            <h1 className="text-6xl md:text-8xl font-black tracking-widest text-red-600 border-8 border-red-600 p-4">
              VISTA PREVIA
            </h1>
          </div>
        )}

        {/* Header section */}
        <div className="flex justify-between items-start border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            {/* Elegant Vector Seal Emblem */}
            {/* Elegant Vector Seal Emblem with Official Morales Shield */}
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden p-0.5">
              <img 
                src="/logo/ESCUDO_MDM_2026.png"
                alt="Escudo Oficial de Morales"
                className="w-10 h-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-bold text-sky-950 tracking-tight leading-tight uppercase">
                Municipalidad Distrital de Morales
              </h2>
              <p className="text-[9px] md:text-xs text-slate-600 font-medium">
                San Martín - Tarapoto
              </p>
              <p className="text-[8px] text-slate-400 font-mono">
                R.U.C. 20148202621 • Subdominio: certificados.moralesmuni.org.pe
              </p>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="bg-sky-50 text-sky-950 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-200 uppercase tracking-wider">
              {getTipoTag()}
            </span>
            <span className="text-[8px] md:text-[10px] text-slate-500 font-mono mt-1">
              Código Único: {codigo_unico}
            </span>
            <span className="text-[8px] text-slate-400 font-mono">
              Fecha Emisión: {fecha_emision}
            </span>
          </div>
        </div>

        {/* Main content body */}
        <div className="text-center my-6 md:my-8 flex-grow flex flex-col justify-center">
          <h1 className="text-xl md:text-2xl font-serif text-sky-950 font-bold tracking-tight mb-2 uppercase">
            {getDocTitle()}
          </h1>
          <p className="text-[10px] md:text-xs text-slate-500 italic">
            Otorgado en reconocimiento oficial a:
          </p>
          <h2 className="text-lg md:text-2xl font-bold text-slate-800 my-2 underline decoration-amber-400 decoration-2 underline-offset-4 tracking-wide uppercase">
            {nombre_titular}
          </h2>
          {tipo_origen === 'reconocimiento' ? (
            <div className="space-y-2 max-w-2xl mx-auto">
              <p className="text-[10px] md:text-xs text-slate-600 leading-relaxed">
                Identificado(a) con D.N.I. <strong className="text-slate-800">{dni_titular}</strong>, colaborador(a) en el área de <strong className="text-sky-950">{area_colaborador}</strong>, en mérito a su desempeño laboral sobresaliente y por su invaluable contribución al destacar en la siguiente meta del distrito de Morales:
              </p>
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 text-[11px] md:text-xs text-slate-800 font-medium italic shadow-sm">
                "{meta_destacada}"
              </div>
            </div>
          ) : (
            <p className="text-[10px] md:text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Identificado(a) con D.N.I. <strong className="text-slate-800">{dni_titular}</strong>, por su destacada participación en el{' '}
              <strong className="text-sky-950">{nombre_origen}</strong>, realizado en la sede{' '}
              <span className="italic">Auditorio Municipal de Morales</span>, con una duración lectiva de{' '}
              <strong className="text-slate-800">{horas} horas</strong> cronometradas.
            </p>
          )}
          <p className="text-[9px] md:text-[11px] text-slate-500 mt-3">
            En testimonio de lo cual se emite la presente firma y acreditación digital e institucional.
          </p>
        </div>

        {/* Signatures & Verification footer */}
        <div className="grid grid-cols-3 gap-4 items-end border-t border-slate-200 pt-4 mt-auto">
          {/* Signature 1 */}
          <div className="text-center flex flex-col items-center">
            {/* Signature Box */}
            <div className="relative border border-slate-200 bg-slate-50 rounded p-1.5 w-full max-w-[160px] text-[8px] text-left">
              <div className="absolute -top-1.5 right-1.5 bg-emerald-500 text-white font-mono text-[6px] px-1 rounded-full flex items-center space-x-0.5 shadow-sm">
                <Check className="w-1.5 h-1.5 stroke-[4]" />
                <span>FIRMADO</span>
              </div>
              <p className="font-bold text-slate-700 leading-tight">MUNICIPALIDAD DE MORALES</p>
              <p className="text-[7px] text-slate-500 mt-0.5">Alcalde Distrital</p>
              <p className="text-[6px] text-slate-400 font-mono mt-0.5">Lic. M. A. Torres Silva</p>
              <p className="text-[5px] text-slate-400 truncate">Sello digital: s9Fk2...92m</p>
            </div>
            <p className="text-[9px] font-bold text-slate-700 mt-1">Lic. Marco A. Torres Silva</p>
            <p className="text-[8px] text-slate-500">Alcalde</p>
          </div>

          {/* Signature 2 */}
          <div className="text-center flex flex-col items-center">
            <div className="relative border border-slate-200 bg-slate-50 rounded p-1.5 w-full max-w-[160px] text-[8px] text-left">
              <div className="absolute -top-1.5 right-1.5 bg-emerald-500 text-white font-mono text-[6px] px-1 rounded-full flex items-center space-x-0.5 shadow-sm">
                <Check className="w-1.5 h-1.5 stroke-[4]" />
                <span>FIRMADO</span>
              </div>
              <p className="font-bold text-slate-700 leading-tight">REGISTRO DE RR.HH.</p>
              <p className="text-[7px] text-slate-500 mt-0.5">Gerente de Recursos Humanos</p>
              <p className="text-[6px] text-slate-400 font-mono mt-0.5">Mg. Rosa Flores Díaz</p>
              <p className="text-[5px] text-slate-400 truncate">Sello digital: z1Lm3...81a</p>
            </div>
            <p className="text-[9px] font-bold text-slate-700 mt-1">Mg. Rosa Flores Díaz</p>
            <p className="text-[8px] text-slate-500 font-medium">Gerente de RR.HH.</p>
          </div>

          {/* QR Code and Verification Seal */}
          <div className="flex flex-col items-center justify-end">
            <div className="flex items-center space-x-2 border border-sky-100 bg-sky-50/50 p-1.5 rounded-lg">
              {/* Dynamic QR mockup */}
              <div className="bg-white p-1 rounded border border-slate-200 shadow-sm">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1 text-[8px] font-bold text-emerald-700">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Acreditado</span>
                </div>
                <p className="text-[6px] text-slate-500 font-mono max-w-[80px] break-all leading-normal">
                  certificados.moralesmuni.org.pe/verificar?codigo={codigo_unico}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SHA Hash footer */}
        <div className="text-[7px] md:text-[8px] text-slate-400 font-mono text-center border-t border-slate-100 pt-2 mt-4 flex justify-between items-center">
          <span>Acreditación Gubernamental de Firmas (Ley Nº 27269 - Perú)</span>
          <span className="truncate max-w-[300px] md:max-w-none">
            Hash SHA256: <strong className="text-slate-500">{hash_sha256}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
