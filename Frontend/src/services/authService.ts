import { httpClient } from './httpClient'
import type { ApiResponse, LoginRequest, LoginResponse } from '@/types'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await httpClient.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/login',
      credentials,
    )
    return data.data
  },

  async logout(): Promise<void> {
    await httpClient.post<ApiResponse<object>>('/api/v1/auth/logout')
  },
}
