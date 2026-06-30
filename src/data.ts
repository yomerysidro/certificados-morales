/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Usuario,
  Institucion,
  Actividad,
  Participante,
  ActividadParticipante,
  Practicante,
  Practica,
  Ponente,
  ActividadPonente,
  Firmante,
  ActividadFirmante,
  Certificado,
  Reemision,
  Rol,
  Modulo,
  Permiso,
  Reconocimiento
} from './types';

// Relational tables based on user request schema
export const INITIAL_ROLES: Rol[] = [
  { id_rol: 1, nombre_rol: 'Administrador', descripcion: 'Acceso total al sistema, gestión de usuarios, reemisiones y configuración de accesos a módulos.' },
  { id_rol: 2, nombre_rol: 'Digitador', descripcion: 'Registro de actividades, participantes, ponentes, practicantes y generación/firma de certificados.' },
  { id_rol: 3, nombre_rol: 'Gerencial', descripcion: 'Visualización de reportes estadísticos, auditoría y monitoreo directivo de certificados.' }
];

export const INITIAL_MODULOS: Modulo[] = [
  { id_modulo: 1, nombre_modulo: 'Panel de Administrador', ruta: '2' }, // activeFigmaPage '2'
  { id_modulo: 2, nombre_modulo: 'Panel de Digitador', ruta: '3' }, // activeFigmaPage '3'
  { id_modulo: 3, nombre_modulo: 'Monitoreo Directivo', ruta: '4' },    // activeFigmaPage '4'
  { id_modulo: 4, nombre_modulo: 'Portal Público', ruta: '5' },         // activeFigmaPage '5'
  { id_modulo: 5, nombre_modulo: 'Flujos de Error', ruta: '6' }         // activeFigmaPage '6'
];

export const INITIAL_PERMISOS: Permiso[] = [
  // Administrador has access to all pages (lectura = true)
  { id_permiso: 1, id_rol: 1, id_modulo: 1, permiso_lectura: true, permiso_escritura: true },
  { id_permiso: 2, id_rol: 1, id_modulo: 2, permiso_lectura: true, permiso_escritura: true },
  { id_permiso: 3, id_rol: 1, id_modulo: 3, permiso_lectura: true, permiso_escritura: true },
  { id_permiso: 4, id_rol: 1, id_modulo: 4, permiso_lectura: true, permiso_escritura: true },
  { id_permiso: 5, id_rol: 1, id_modulo: 5, permiso_lectura: true, permiso_escritura: true },

  // Digitador only has access to Digitador workspace and Portal Público
  { id_permiso: 6, id_rol: 2, id_modulo: 1, permiso_lectura: false, permiso_escritura: false },
  { id_permiso: 7, id_rol: 2, id_modulo: 2, permiso_lectura: true, permiso_escritura: true },
  { id_permiso: 8, id_rol: 2, id_modulo: 3, permiso_lectura: false, permiso_escritura: false },
  { id_permiso: 9, id_rol: 2, id_modulo: 4, permiso_lectura: true, permiso_escritura: false },
  { id_permiso: 10, id_rol: 2, id_modulo: 5, permiso_lectura: false, permiso_escritura: false },

  // Gerencial has access to Monitoreo Directivo and Portal Público
  { id_permiso: 11, id_rol: 3, id_modulo: 1, permiso_lectura: false, permiso_escritura: false },
  { id_permiso: 12, id_rol: 3, id_modulo: 2, permiso_lectura: false, permiso_escritura: false },
  { id_permiso: 13, id_rol: 3, id_modulo: 3, permiso_lectura: true, permiso_escritura: false },
  { id_permiso: 14, id_rol: 3, id_modulo: 4, permiso_lectura: true, permiso_escritura: false },
  { id_permiso: 15, id_rol: 3, id_modulo: 5, permiso_lectura: false, permiso_escritura: false }
];

// Mock Initial Data according to USER_REQUEST
export const INITIAL_USUARIOS: Usuario[] = [
  {
    dni: '11111111',
    nombre_completo: 'Ing. Alejandro Reátegui Ríos',
    correo: 'alejandro.admin@moralesmuni.org.pe',
    password_hash: 'admin123',
    estado: 'Activo',
    id_rol: 'Administrador'
  },
  {
    dni: '22222222',
    nombre_completo: 'Lic. Beatriz Arévalo Torres',
    correo: 'beatriz.rrhh@moralesmuni.org.pe',
    password_hash: 'digitador123',
    estado: 'Activo',
    id_rol: 'Digitador'
  },
  {
    dni: '00000001',
    nombre_completo: 'Lic. Marco Antonio Torres Silva',
    correo: 'marco.torres@moralesmuni.org.pe',
    password_hash: 'alcalde123',
    estado: 'Activo',
    id_rol: 'Gerencial' // Alcalde
  },
  {
    dni: '00000002',
    nombre_completo: 'Mg. Rosa Flores Díaz',
    correo: 'rosa.flores@moralesmuni.org.pe',
    password_hash: 'gerente123',
    estado: 'Activo',
    id_rol: 'Gerencial' // Gerente de RR.HH.
  },
  {
    dni: '88888888',
    nombre_completo: 'Sandra Marina Ruiz',
    correo: 'sandra.rrhh@moralesmuni.org.pe',
    password_hash: 'password',
    estado: 'Inactivo',
    id_rol: 'Digitador'
  }
];

export const INITIAL_INSTITUCIONES: Institucion[] = [
  {
    id: 'inst-1',
    nombre_institucion: 'Universidad Peruana Unión (UPeU)',
    pais: 'Perú',
    tipo: 'Educativa'
  },
  {
    id: 'inst-2',
    nombre_institucion: 'Universidad Nacional de San Martín (UNSM)',
    pais: 'Perú',
    tipo: 'Educativa'
  },
  {
    id: 'inst-3',
    nombre_institucion: 'Servicio Nacional de Adiestramiento en Trabajo Industrial (SENATI)',
    pais: 'Perú',
    tipo: 'Educativa'
  }
];

export const INITIAL_ACTIVIDADES: Actividad[] = [
  {
    id: 'act-1',
    nombre: 'Taller de Gestión Pública y Gobierno Digital 2026',
    descripcion: 'Capacitación en normativas de interoperabilidad, ciberseguridad y atención digital en gobiernos locales.',
    tipo_actividad: 'Capacitación',
    fecha_inicio: '2026-06-15',
    fecha_fin: '2026-06-19',
    sede: 'Auditorio Municipal de Morales',
    area_organizadora: 'Gerencia Municipal',
    estado: 'Cerrada'
  },
  {
    id: 'act-2',
    nombre: 'Reconocimiento al Mérito de Servicio Comunitario 2026',
    descripcion: 'Homenaje a los servidores civiles con destacada labor en las brigadas de respuesta rápida distritales.',
    tipo_actividad: 'Reconocimiento',
    fecha_inicio: '2026-06-25',
    fecha_fin: '2026-06-25',
    sede: 'Plaza de Armas de Morales',
    area_organizadora: 'Gerencia de Recursos Humanos',
    estado: 'Activa'
  }
];

export const INITIAL_PARTICIPANTES: Participante[] = [
  {
    dni: '42156789',
    nombre_completo: 'Carlos Mendoza Ruiz',
    correo: 'carlos.mendoza@gmail.com',
    tipo_participante: 'Municipal',
    area_origen: 'Subgerencia de Obras'
  },
  {
    dni: '75432198',
    nombre_completo: 'María Elena Saavedra Torres',
    correo: 'maria.saavedra@outlook.com',
    tipo_participante: 'Externo',
    area_origen: 'Vecino Distrital'
  },
  {
    dni: '56321478',
    nombre_completo: 'Juan Pablo García López',
    correo: 'juan.garcia@gmail.com',
    tipo_participante: 'Municipal',
    area_origen: 'Oficina de Imagen Institucional'
  },
  {
    dni: '33334444',
    nombre_completo: 'Patricia Alván Meléndez',
    correo: 'patricia.alvan@gmail.com',
    tipo_participante: 'Externo',
    area_origen: 'Municipalidad de Tarapoto'
  }
];

export const INITIAL_ACTIVIDAD_PARTICIPANTES: ActividadParticipante[] = [
  {
    id_actividad: 'act-1',
    id_participante: '42156789',
    fecha_inscripcion: '2026-06-10',
    asistencia: true,
    certificado_generado: true,
    codigo_certificado: 'MDM-2026-CAP-000142'
  },
  {
    id_actividad: 'act-1',
    id_participante: '75432198',
    fecha_inscripcion: '2026-06-11',
    asistencia: true,
    certificado_generado: true,
    codigo_certificado: 'MDM-2026-CAP-000143'
  },
  {
    id_actividad: 'act-1',
    id_participante: '56321478',
    fecha_inscripcion: '2026-06-12',
    asistencia: false,
    certificado_generado: false
  },
  {
    id_actividad: 'act-2',
    id_participante: '42156789',
    fecha_inscripcion: '2026-06-26',
    asistencia: true,
    certificado_generado: false
  },
  {
    id_actividad: 'act-2',
    id_participante: '33334444',
    fecha_inscripcion: '2026-06-26',
    asistencia: true,
    certificado_generado: false
  }
];

export const INITIAL_PONENTES: Ponente[] = [
  {
    id: 'pon-1',
    dni: '38877665',
    nombre: 'Dr. Roberto Alvarado Campos',
    institucion_ponente: 'INDECOPI',
    cargo: 'Consultor Senior',
    especialidad: 'Gobierno Digital'
  },
  {
    id: 'pon-2',
    dni: '48877662',
    nombre: 'Mg. Carmen Saldaña Ríos',
    institucion_ponente: 'PCM - Secretaría de Gobierno Digital',
    cargo: 'Especialista en Modernización',
    especialidad: 'Gestión Pública'
  }
];

export const INITIAL_ACTIVIDAD_PONENTES: ActividadPonente[] = [
  {
    id_actividad: 'act-1',
    id_ponente: 'pon-1'
  },
  {
    id_actividad: 'act-2',
    id_ponente: 'pon-2'
  }
];

export const INITIAL_FIRMANTES: Firmante[] = [
  {
    id: 'firm-1',
    cargo: 'Alcalde',
    ruta_archivo_pfx: 'firma_alcalde_torres.pfx',
    pfx_nombre: 'firma_alcalde_torres.pfx',
    passphrase_cifrada: '********',
    id_usuario: '00000001',
    nombre_completo: 'Lic. Marco Antonio Torres Silva'
  },
  {
    id: 'firm-2',
    cargo: 'Gerente de Recursos Humanos',
    ruta_archivo_pfx: 'firma_gerente_flores.pfx',
    pfx_nombre: 'firma_gerente_flores.pfx',
    passphrase_cifrada: '********',
    id_usuario: '00000002',
    nombre_completo: 'Mg. Rosa Flores Díaz'
  }
];

export const INITIAL_ACTIVIDAD_FIRMANTES: ActividadFirmante[] = [
  {
    id_actividad: 'act-1',
    id_firmante: 'firm-1',
    orden_firma: 1
  },
  {
    id_actividad: 'act-1',
    id_firmante: 'firm-2',
    orden_firma: 2
  },
  {
    id_actividad: 'act-2',
    id_firmante: 'firm-1',
    orden_firma: 1
  }
];

export const INITIAL_PRACTICANTES: Practicante[] = [
  {
    dni: '73456821',
    nombre_completo: 'Linder Saavedra Pérez',
    correo: 'linder.saavedra@upeu.pe',
    carrera: 'Ingeniería de Sistemas',
    jefe_supervisor: 'Ing. Antonio Talián',
    id_institucion: 'inst-1'
  }
];

export const INITIAL_PRACTICAS: Practica[] = [
  {
    id: 'prac-1',
    dni_practicante: '73456821',
    fecha_inicio: '2026-03-01',
    fecha_fin: '2026-06-30',
    estado: 'Concluida',
    certificado_generado: true,
    codigo_certificado: 'MDM-2026-PRAC-000084'
  }
];

export const INITIAL_CERTIFICADOS: Certificado[] = [
  {
    codigo_unico: 'MDM-2026-CAP-000142',
    fecha_emision: '2026-06-20',
    hash_sha256: 'a5f6b7c8901234567890abcdef1234567890abcdef1234567890abcdef12345',
    ruta_archivo_pdf: 'certificado_42156789_act-1.pdf',
    tipo_origen: 'actividad',
    id_origen: 'act-1',
    nombre_origen: 'Taller de Gestión Pública y Gobierno Digital 2026',
    dni_titular: '42156789',
    nombre_titular: 'Carlos Mendoza Ruiz',
    estado: 'Válido',
    horas: 40
  },
  {
    codigo_unico: 'MDM-2026-CAP-000143',
    fecha_emision: '2026-06-20',
    hash_sha256: 'b8e9c0d1234567890abcdef1234567890abcdef1234567890abcdef12345678',
    ruta_archivo_pdf: 'certificado_75432198_act-1.pdf',
    tipo_origen: 'actividad',
    id_origen: 'act-1',
    nombre_origen: 'Taller de Gestión Pública y Gobierno Digital 2026',
    dni_titular: '75432198',
    nombre_titular: 'María Elena Saavedra Torres',
    estado: 'Válido',
    horas: 40
  },
  {
    codigo_unico: 'MDM-2026-PRAC-000084',
    fecha_emision: '2026-06-30',
    hash_sha256: 'f5d4c3b2109876543210fedcba9876543210fedcba9876543210fedcba987654',
    ruta_archivo_pdf: 'certificado_73456821_prac-1.pdf',
    tipo_origen: 'practica',
    id_origen: 'prac-1',
    nombre_origen: 'Prácticas Preprofesionales - Ingeniería de Sistemas',
    dni_titular: '73456821',
    nombre_titular: 'Linder Saavedra Pérez',
    estado: 'Válido',
    horas: 360
  },
  {
    codigo_unico: 'MDM-2026-REC-000001',
    fecha_emision: '2026-06-15',
    hash_sha256: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
    ruta_archivo_pdf: 'certificado_45821943_rec-1.pdf',
    tipo_origen: 'reconocimiento',
    id_origen: 'rec-1',
    nombre_origen: 'Reconocimiento de Mérito Institucional',
    dni_titular: '45821943',
    nombre_titular: 'Abg. Diana Carolina Vela Ruiz',
    estado: 'Válido',
    meta_destacada: 'Lograr la digitalización e indexación del 100% de actas matrimoniales históricas (periodo 1980-2025) antes del plazo institucional establecido.',
    area_colaborador: 'Subgerencia de Registro Civil'
  }
];

export const INITIAL_RECONOCIMIENTOS: Reconocimiento[] = [
  {
    id: 'rec-1',
    dni_colaborador: '45821943',
    nombre_completo: 'Abg. Diana Carolina Vela Ruiz',
    area_origen: 'Subgerencia de Registro Civil',
    logro_destacado: 'Lograr la digitalización e indexación del 100% de actas matrimoniales históricas (periodo 1980-2025) antes del plazo institucional establecido.',
    fecha_reconocimiento: '2026-06-15',
    id_firmante: 'firm-1',
    certificado_generado: true,
    codigo_certificado: 'MDM-2026-REC-000001'
  },
  {
    id: 'rec-2',
    dni_colaborador: '33445566',
    nombre_completo: 'Ing. Carlos Alberto Rengifo Ríos',
    area_origen: 'Oficina de Tecnologías de la Información',
    logro_destacado: 'Liderar el desarrollo y despliegue de la Infraestructura de Firma Digital (Firma.pe) de la municipalidad, optimizando el tiempo de respuesta ciudadano.',
    fecha_reconocimiento: '2026-06-25',
    id_firmante: 'firm-2',
    certificado_generado: false
  }
];

export const INITIAL_REEMISIONES: Reemision[] = [
  {
    id: 'reem-1',
    codigo_certificado: 'MDM-2026-CAP-000142',
    dni_participante: '42156789',
    nombre_participante: 'Carlos Mendoza Ruiz',
    origen: 'Taller de Gestión Pública y Gobierno Digital 2026',
    motivo: 'Corrección ortográfica en el segundo apellido',
    fecha_reemision: '2026-06-22 14:35',
    usuario_reemisor: 'Alejandro Reátegui (Admin)'
  }
];

// Helper to load/save state from localStorage
export function getStoredState<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(`morales_cert_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return defaultValue;
  }
}

export function saveStoredState<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`morales_cert_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving localStorage key', key, e);
  }
}
