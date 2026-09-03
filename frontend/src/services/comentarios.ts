import { apiRequest } from './api';
import { Comentario } from '../types';

// Almacén inicial de demostración para el Reto Final
let comentariosMemoria: Comentario[] = [
  {
    id: '1',
    cliente_nombre: 'Carlos Mendoza',
    fecha: '2026-09-01',
    tiempo_atencion_minutos: 15,
    comentario: 'Excelente atención y resolución rápida de la incidencia en los servidores.',
    categoria: 'soporte',
    sentimiento: 'positivo',
  },
  {
    id: '2',
    cliente_nombre: 'Mariana Silva',
    fecha: '2026-09-01',
    tiempo_atencion_minutos: 25,
    comentario: 'Demora en la entrega del reporte mensual, hubo retrasos en el canal de atención.',
    categoria: 'reclamo',
    sentimiento: 'negativo',
  },
  {
    id: '3',
    cliente_nombre: 'Tech Corp S.A.C.',
    fecha: '2026-09-02',
    tiempo_atencion_minutos: 12,
    comentario: 'Quisiera cotizar la ampliación de licencias para el área de desarrollo.',
    categoria: 'ventas',
    sentimiento: 'neutral',
  },
  {
    id: '4',
    cliente_nombre: 'Roberto Gómez',
    fecha: '2026-09-02',
    tiempo_atencion_minutos: 18,
    comentario: 'El equipo brindó una excelente atención durante la configuración del sistema.',
    categoria: 'soporte',
    sentimiento: 'positivo',
  },
  {
    id: '5',
    cliente_nombre: 'Lucía Fernández',
    fecha: '2026-09-03',
    tiempo_atencion_minutos: 20,
    comentario: 'Buen servicio pero tardaron un poco en responder la llamada de soporte.',
    categoria: 'soporte',
    sentimiento: 'neutral',
  },
];

// Obtener comentarios con filtro por fecha opcional (Reto Final)
export async function getComentarios(fechaFiltro?: string) {
  let filtrados = [...comentariosMemoria];
  if (fechaFiltro && fechaFiltro.trim() !== '') {
    filtrados = filtrados.filter((c) => c.fecha === fechaFiltro);
  }

  const endpoint = fechaFiltro ? `/comentarios?fecha=${encodeURIComponent(fechaFiltro)}` : '/comentarios';
  return apiRequest<Comentario[]>(endpoint, { method: 'GET' }, filtrados);
}

// Registrar nuevo comentario y tiempo de atención (Reto Final)
export async function registrarComentario(nuevo: Omit<Comentario, 'id'>) {
  const itemCreado: Comentario = {
    ...nuevo,
    id: String(Date.now()),
  };
  comentariosMemoria.unshift(itemCreado);

  return apiRequest<Comentario>(
    '/comentarios',
    {
      method: 'POST',
      body: JSON.stringify(itemCreado),
    },
    itemCreado
  );
}
