import { useEffect, useState } from 'react'
import type { DashboardData, EstadoCita, Prioridad } from '@/types'
import { dashboardService } from '@/services/dashboardService'
import { useToast } from '@/contexts/ToastContext'

const estadoLabels: Record<EstadoCita, string> = {
  PENDIENTE: 'Pendiente',
  EN_ATENCION: 'En Atención',
  ATENDIDO: 'Atendido',
}

const estadoColors: Record<EstadoCita, string> = {
  PENDIENTE: 'bg-yellow-500',
  EN_ATENCION: 'bg-blue-500',
  ATENDIDO: 'bg-green-500',
}

const prioridadLabels: Record<Prioridad, string> = {
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
}

const prioridadColors: Record<Prioridad, string> = {
  ALTA: 'bg-red-500',
  MEDIA: 'bg-orange-500',
  BAJA: 'bg-gray-400',
}

export function DashboardPage() {
  const { addToast } = useToast()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    dashboardService
      .getIndicators()
      .then(setData)
      .catch(() => addToast('Error al cargar dashboard', 'error'))
      .finally(() => setIsLoading(false))
  }, [addToast])

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Cargando indicadores...</div>
  }

  if (!data) {
    return (
      <div className="p-12 text-center text-gray-500">
        No se pudieron cargar los indicadores. El endpoint aún no está disponible.
      </div>
    )
  }

  const maxEstado = Math.max(...Object.values(data.porEstado))
  const maxPrioridad = Math.max(...Object.values(data.porPrioridad))

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Total Pacientes</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{data.totalPacientes}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">En Atención</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {data.porEstado.EN_ATENCION || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Prioridad Alta</p>
          <p className="text-3xl font-bold text-red-600 mt-1">
            {data.porPrioridad.ALTA || 0}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Por Estado</h2>
          <div className="space-y-3">
            {(Object.keys(data.porEstado) as EstadoCita[]).map((key) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{estadoLabels[key]}</span>
                  <span className="font-medium text-gray-800">{data.porEstado[key]}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${estadoColors[key]} h-2 rounded-full transition-all`}
                    style={{ width: `${maxEstado ? (data.porEstado[key] / maxEstado) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Por Prioridad</h2>
          <div className="space-y-3">
            {(Object.keys(data.porPrioridad) as Prioridad[]).map((key) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{prioridadLabels[key]}</span>
                  <span className="font-medium text-gray-800">{data.porPrioridad[key]}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${prioridadColors[key]} h-2 rounded-full transition-all`}
                    style={{ width: `${maxPrioridad ? (data.porPrioridad[key] / maxPrioridad) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
