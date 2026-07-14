export interface TipoDocumentoResponseDto {
  id: string;
  nombre: string;
}

export interface GeneroResponseDto {
  id: string;
  nombre: string;
}

export interface EpsResponseDto {
  id: string;
  codigo: string;
  nombre: string;
}

export interface CiudadResponseDto {
  id: string;
  nombre: string;
  codigoPostal: string | null;
}
