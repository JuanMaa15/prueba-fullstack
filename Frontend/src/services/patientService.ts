import { httpClient } from './httpClient'
import type {
  ApiResponse,
  PaginatedResponse,
  Patient,
  PatientForm,
  PatientQueryParams,
} from '@/types'

export const patientService = {
  async getAll(params: PatientQueryParams): Promise<PaginatedResponse<Patient>> {
    const { data } = await httpClient.get<ApiResponse<PaginatedResponse<Patient>>>(
      '/api/v1/patients',
      { params },
    )
    return data.data
  },

  async getById(id: string): Promise<Patient> {
    const { data } = await httpClient.get<ApiResponse<Patient>>(
      `/api/v1/patients/${id}`,
    )
    return data.data
  },

  async create(payload: PatientForm): Promise<Patient> {
    const { data } = await httpClient.post<ApiResponse<Patient>>(
      '/api/v1/patients',
      payload,
    )
    return data.data
  },

  async update(id: string, payload: Partial<PatientForm>): Promise<Patient> {
    const { data } = await httpClient.patch<ApiResponse<Patient>>(
      `/api/v1/patients/${id}`,
      payload,
    )
    return data.data
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete<ApiResponse<object>>(`/api/v1/patients/${id}`)
  },
}
