/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Administrador' | 'Digitador' | 'Gerencial';

export interface Rol {
  id_rol: number;
  nombre_rol: UserRole;
  descripcion: string;
}

export interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
  ruta: string; // references activeFigmaPage or route string
}

export interface Permiso {
  id_permiso: number;
  id_rol: number; // references Rol.id_rol
  id_modulo: number; // references Modulo.id_modulo
  permiso_lectura: boolean;
  permiso_escritura: boolean;
}

export interface Usuario {
  dni: string;
  nombre_completo: string;
  correo: string;
  password_hash: string;
  estado: 'Activo' | 'Inactivo';
  id_rol: UserRole;
}

export interface Institucion {
  id: string;
  nombre_institucion: string;
  pais: string;
  tipo: 'Pública' | 'Privada' | 'Educativa';
}

export interface Actividad {
  id: string;
  nombre: string;
  descripcion: string;
  tipo_actividad: 'Capacitación' | 'Reconocimiento';
  fecha_inicio: string;
  fecha_fin: string;
  sede: string;
  area_organizadora: string;
  estado: 'Activa' | 'Cerrada';
}

export interface Participante {
  dni: string;
  nombre_completo: string;
  correo: string;
  tipo_participante: 'Municipal' | 'Externo';
  area_origen?: string;
}

export interface ActividadParticipante {
  id_actividad: string;
  id_participante: string; // DNI
  fecha_inscripcion: string;
  asistencia: boolean;
  certificado_generado: boolean;
  codigo_certificado?: string;
}

export interface Practicante {
  dni: string;
  nombre_completo: string;
  correo: string;
  carrera: string;
  jefe_supervisor: string;
  id_institucion: string; // references Institucion.id
}

export interface Practica {
  id: string;
  dni_practicante: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'En curso' | 'Concluida';
  certificado_generado: boolean;
  codigo_certificado?: string;
}

export interface Ponente {
  id: string;
  dni: string;
  nombre: string;
  institucion_ponente: string;
  cargo: string;
  especialidad: string;
}

export interface ActividadPonente {
  id_actividad: string;
  id_ponente: string; // references Ponente.id
}

export interface Firmante {
  id: string;
  cargo: string;
  ruta_archivo_pfx: string; // path or file name
  pfx_nombre?: string;
  passphrase_cifrada: string;
  id_usuario: string; // references Usuario.dni
  nombre_completo: string; // cached for UI convenience
}

export interface ActividadFirmante {
  id_actividad: string;
  id_firmante: string; // references Firmante.id
  orden_firma: number;
}

export interface Certificado {
  codigo_unico: string;
  fecha_emision: string;
  hash_sha256: string;
  ruta_archivo_pdf: string;
  tipo_origen: 'actividad' | 'practica' | 'reconocimiento';
  id_origen: string; // references Actividad.id or Practica.id or Reconocimiento.id
  nombre_origen: string;
  dni_titular: string;
  nombre_titular: string;
  estado: 'Válido' | 'Revocado';
  horas?: number;
  meta_destacada?: string; // Specific field for recognition achievements
  area_colaborador?: string; // Specific field for recognition department
}

export interface Reconocimiento {
  id: string;
  dni_colaborador: string;
  nombre_completo: string;
  area_origen: string;
  logro_destacado: string;
  fecha_reconocimiento: string;
  id_firmante: string;
  certificado_generado: boolean;
  codigo_certificado?: string;
}

export interface Reemision {
  id: string;
  codigo_certificado: string;
  dni_participante: string;
  nombre_participante: string;
  origen: string;
  motivo: string;
  fecha_reemision: string;
  usuario_reemisor: string;
}
