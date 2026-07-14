import { httpClient } from './httpClient'
import type { ApiResponse, DashboardData } from '@/types'

export const dashboardService = {
  async getIndicators(): Promise<DashboardData> {
    const { data } = await httpClient.get<ApiResponse<DashboardData>>(
      '/api/v1/dashboard',
    )
    return data.data
  },
}
