// ─── Catálogos ────────────────────────────────────────────────
export interface CatalogItem {
  id: string
  nombre: string
}

export interface Eps extends CatalogItem {
  codigo: string
}

export interface TipoDocumento extends CatalogItem {
  estado: 'ACTIVO' | 'INACTIVO'
}

export interface Ciudad extends CatalogItem {
  codigoPostal: string | null
}

export interface Genero extends CatalogItem {
  estado: 'ACTIVO' | 'INACTIVO'
}

// ─── Paciente ─────────────────────────────────────────────────
export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA'
export type EstadoCita = 'PENDIENTE' | 'EN_ATENCION' | 'ATENDIDO'

export interface Patient {
  id: string
  numeroDocumento: string
  nombreCompleto: string
  fechaNacimiento: string
  telefono: string | null
  email: string | null
  prioridad: Prioridad
  estadoCita: EstadoCita
  tipoDocumento: TipoDocumento
  genero: Genero
  eps: Eps
  ciudad: Ciudad
  createdAt: string
  updatedAt: string
}

export interface PatientForm {
  tipoDocumentoId: string
  numeroDocumento: string
  nombreCompleto: string
  fechaNacimiento: string
  generoId: string
  telefono: string | null
  email: string | null
  epsId: string
  ciudadId: string
  prioridad: Prioridad
  estadoCita?: EstadoCita
}

// ─── Paginación ───────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

// ─── Respuesta API ────────────────────────────────────────────
export interface ApiResponse<T> {
  status: 'success' | 'error'
  message: string
  code: number
  data: T
  errors?: ApiError[]
}

export interface ApiError {
  file: string
  message: string
}

// ─── Auth ─────────────────────────────────────────────────────
export type Rol = 'ADMIN' | 'OPERADOR'

export interface User {
  id: string
  usuario: string
  nombre: string
  rol: Rol
}

export interface LoginRequest {
  usuario: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

// ─── Query Params ─────────────────────────────────────────────
export interface PatientQueryParams {
  search?: string
  estado?: EstadoCita
  prioridad?: Prioridad
  page?: number
  limit?: number
}

// ─── Toast ────────────────────────────────────────────────────
export type ToastType = 'success' | 'error'

// ─── Dashboard (endpoint pendiente) ───────────────────────────
export interface DashboardData {
  totalPacientes: number
  porEstado: Record<EstadoCita, number>
  porPrioridad: Record<Prioridad, number>
}
