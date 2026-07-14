import { httpClient } from './httpClient'
import type { ApiResponse, TipoDocumento, Eps, Ciudad, Genero } from '@/types'

export const catalogService = {
  async getTipoDocumentos(): Promise<TipoDocumento[]> {
    const { data } = await httpClient.get<ApiResponse<TipoDocumento[]>>(
      '/api/v1/catalogos/tipo-documentos'
    )
    return data.data
  },

  async getGeneros(): Promise<Genero[]> {
    const { data } = await httpClient.get<ApiResponse<Genero[]>>(
      '/api/v1/catalogos/generos'
    )
    return data.data
  },

  async getEps(): Promise<Eps[]> {
    const { data } = await httpClient.get<ApiResponse<Eps[]>>(
      '/api/v1/catalogos/eps'
    )
    return data.data
  },

  async getCiudades(): Promise<Ciudad[]> {
    const { data } = await httpClient.get<ApiResponse<Ciudad[]>>(
      '/api/v1/catalogos/ciudades'
    )
    return data.data
  },
}
