import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Patient, PatientForm as PatientFormType, TipoDocumento, Eps, Ciudad, Genero } from '@/types'
import { catalogService } from '@/services/catalogService'

const PatientFormSchema = z.object({
  tipoDocumentoId: z.string().min(1, 'Tipo de documento requerido'),
  numeroDocumento: z.string().min(1, 'Número de documento requerido'),
  nombreCompleto: z.string().min(1, 'Nombre completo requerido'),
  fechaNacimiento: z.string().min(1, 'Fecha de nacimiento requerida'),
  generoId: z.string().min(1, 'Género requerido'),
  telefono: z.string().nullable(),
  email: z.string().nullable(),
  epsId: z.string().min(1, 'EPS requerida'),
  ciudadId: z.string().min(1, 'Ciudad requerida'),
  prioridad: z.enum(['ALTA', 'MEDIA', 'BAJA']),
  estadoCita: z.enum(['PENDIENTE', 'EN_ATENCION', 'ATENDIDO']).optional(),
}).refine(
  (data) => data.telefono || data.email,
  { message: 'Al menos un teléfono o email es requerido', path: ['telefono'] },
)

type PatientFormValues = z.infer<typeof PatientFormSchema>

interface PatientFormProps {
  patient?: Patient
  onSubmit: (data: PatientFormType) => Promise<void>
  onCancel: () => void
}

export function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const [tipoDocumentos, setTipoDocumentos] = useState<TipoDocumento[]>([])
  const [generos, setGeneros] = useState<Genero[]>([])
  const [epsList, setEpsList] = useState<Eps[]>([])
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: patient
      ? {
          tipoDocumentoId: patient.tipoDocumento.id,
          numeroDocumento: patient.numeroDocumento,
          nombreCompleto: patient.nombreCompleto,
          fechaNacimiento: patient.fechaNacimiento.split('T')[0],
          generoId: patient.genero.id,
          telefono: patient.telefono,
          email: patient.email,
          epsId: patient.eps.id,
          ciudadId: patient.ciudad.id,
          prioridad: patient.prioridad,
          estadoCita: patient.estadoCita,
        }
      : {
          prioridad: 'MEDIA',
          estadoCita: 'PENDIENTE',
          telefono: '',
          email: '',
        },
  })

  useEffect(() => {
    Promise.all([
      catalogService.getTipoDocumentos(),
      catalogService.getGeneros(),
      catalogService.getEps(),
      catalogService.getCiudades(),
    ]).then(([td, g, e, c]) => {
      setTipoDocumentos(td)
      setGeneros(g)
      setEpsList(e)
      setCiudades(c)
    })
  }, [])

  const handleFormSubmit = async (data: PatientFormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        ...data,
        telefono: data.telefono || null,
        email: data.email || null,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Documento
              </label>
              <select
                {...register('tipoDocumentoId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                {tipoDocumentos.map((td) => (
                  <option key={td.id} value={td.id}>{td.nombre}</option>
                ))}
              </select>
              {errors.tipoDocumentoId && (
                <p className="text-xs text-red-600 mt-1">{errors.tipoDocumentoId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Documento
              </label>
              <input
                type="text"
                {...register('numeroDocumento')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.numeroDocumento && (
                <p className="text-xs text-red-600 mt-1">{errors.numeroDocumento.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                {...register('nombreCompleto')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.nombreCompleto && (
                <p className="text-xs text-red-600 mt-1">{errors.nombreCompleto.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                {...register('fechaNacimiento')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fechaNacimiento && (
                <p className="text-xs text-red-600 mt-1">{errors.fechaNacimiento.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género
              </label>
              <select
                {...register('generoId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                {generos.map((g) => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </select>
              {errors.generoId && (
                <p className="text-xs text-red-600 mt-1">{errors.generoId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                {...register('telefono')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EPS
              </label>
              <select
                {...register('epsId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                {epsList.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
              {errors.epsId && (
                <p className="text-xs text-red-600 mt-1">{errors.epsId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad
              </label>
              <select
                {...register('ciudadId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              {errors.ciudadId && (
                <p className="text-xs text-red-600 mt-1">{errors.ciudadId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                {...register('prioridad')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BAJA">Baja</option>
                <option value="MEDIA">Media</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado Cita
              </label>
              <select
                {...register('estadoCita')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_ATENCION">En Atención</option>
                <option value="ATENDIDO">Atendido</option>
              </select>
            </div>
          </div>

          {errors.telefono && (
            <p className="text-xs text-red-600">{errors.telefono.message}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Guardando...' : patient ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
