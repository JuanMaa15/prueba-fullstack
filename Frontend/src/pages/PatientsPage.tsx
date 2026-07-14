import { useEffect, useState } from 'react'
import axios from 'axios'
import type { ApiResponse, Patient, PatientForm as PatientFormType, EstadoCita, Prioridad } from '@/types'
import { patientService } from '@/services/patientService'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { PatientForm } from '@/components/PatientForm'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Pagination } from '@/components/ui/Pagination'

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const body = error.response?.data as ApiResponse<unknown> | undefined
    if (body?.errors?.length) {
      return body.errors.map((e) => e.message).join(', ')
    }
    if (body?.message) {
      return body.message
    }
  }
  return 'Ocurrió un error inesperado'
}

export function PatientsPage() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [patients, setPatients] = useState<Patient[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<EstadoCita | ''>('')
  const [prioridadFilter, setPrioridadFilter] = useState<Prioridad | ''>('')
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    let active = true

    patientService
      .getAll({
        search: search || undefined,
        estado: (estadoFilter as EstadoCita) || undefined,
        prioridad: (prioridadFilter as Prioridad) || undefined,
        page,
        limit: 20,
      })
      .then((result) => {
        if (active) {
          setPatients(result.items)
          setTotalPages(result.totalPages)
          setTotal(result.total)
        }
      })
      .catch(() => {
        if (active) addToast('Error al cargar pacientes', 'error')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [search, estadoFilter, prioridadFilter, page, addToast, refreshKey])

  const handleCreate = async (data: PatientFormType) => {
    try {
      await patientService.create(data)
      addToast('Paciente creado correctamente', 'success')
      setShowForm(false)
      setRefreshKey((k) => k + 1)
    } catch (error) {
      addToast(getErrorMessage(error), 'error')
    }
  }

  const handleUpdate = async (data: PatientFormType) => {
    if (!editingPatient) return
    try {
      await patientService.update(editingPatient.id, data)
      addToast('Paciente actualizado correctamente', 'success')
      setEditingPatient(null)
      setRefreshKey((k) => k + 1)
    } catch (error) {
      addToast(getErrorMessage(error), 'error')
    }
  }

  const handleDelete = async () => {
    if (!deletingPatient) return
    try {
      await patientService.remove(deletingPatient.id)
      addToast('Paciente eliminado correctamente', 'success')
      setRefreshKey((k) => k + 1)
    } catch (error) {
      addToast(getErrorMessage(error), 'error')
    } finally {
      setDeletingPatient(null)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setPage(1)
      setRefreshKey((k) => k + 1)
    }
  }

  const estadoBadge = (estado: EstadoCita) => {
    const styles: Record<EstadoCita, string> = {
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      EN_ATENCION: 'bg-blue-100 text-blue-800',
      ATENDIDO: 'bg-green-100 text-green-800',
    }
    const labels: Record<EstadoCita, string> = {
      PENDIENTE: 'Pendiente',
      EN_ATENCION: 'En Atención',
      ATENDIDO: 'Atendido',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[estado]}`}>
        {labels[estado]}
      </span>
    )
  }

  const prioridadBadge = (prioridad: Prioridad) => {
    const styles: Record<Prioridad, string> = {
      ALTA: 'bg-red-100 text-red-800',
      MEDIA: 'bg-orange-100 text-orange-800',
      BAJA: 'bg-gray-100 text-gray-800',
    }
    return (
      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${styles[prioridad]}`}>
        {prioridad}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Pacientes</h1>
          <p className="text-sm text-gray-500 mt-1">{total} registros</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Nuevo Paciente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200 flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            onKeyDown={handleSearchKeyDown}
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={estadoFilter}
            onChange={(e) => { setEstadoFilter(e.target.value as EstadoCita | ''); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_ATENCION">En Atención</option>
            <option value="ATENDIDO">Atendido</option>
          </select>
          <select
            value={prioridadFilter}
            onChange={(e) => { setPrioridadFilter(e.target.value as Prioridad | ''); setPage(1) }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las prioridades</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Cargando...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No se encontraron pacientes</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-600">Nombre</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Documento</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Contacto</th>
                  <th className="px-4 py-3 font-medium text-gray-600">EPS</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Ciudad</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Prioridad</th>
                  <th className="px-4 py-3 font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-3 font-medium text-gray-600 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-medium">{p.nombreCompleto}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.tipoDocumento.nombre} {p.numeroDocumento}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.telefono || p.email || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.eps.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{p.ciudad.nombre}</td>
                    <td className="px-4 py-3">{prioridadBadge(p.prioridad)}</td>
                    <td className="px-4 py-3">{estadoBadge(p.estadoCita)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingPatient(p)}
                          className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          Editar
                        </button>
                        {user?.rol === 'ADMIN' && (
                          <button
                            onClick={() => setDeletingPatient(p)}
                            className="px-2 py-1 text-xs text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 border-t border-gray-200">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {showForm && (
        <PatientForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {editingPatient && (
        <PatientForm
          patient={editingPatient}
          onSubmit={handleUpdate}
          onCancel={() => setEditingPatient(null)}
        />
      )}

      {deletingPatient && (
        <ConfirmDialog
          message={`¿Estás seguro de eliminar a ${deletingPatient.nombreCompleto}?`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPatient(null)}
        />
      )}
    </div>
  )
}
