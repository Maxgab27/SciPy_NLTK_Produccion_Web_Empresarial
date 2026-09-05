import { apiRequest } from './api';
import type { Comentario } from '../types';

export async function getComentarios(fechaFiltro?: string) {
  const endpoint = fechaFiltro ? `/comentarios?fecha=${encodeURIComponent(fechaFiltro)}` : '/comentarios';
  return apiRequest<Comentario[]>(endpoint);
}

export async function registrarComentario(nuevo: Pick<Comentario, 'cliente_nombre' | 'fecha' | 'tiempo_atencion_minutos' | 'comentario'>) {
  return apiRequest<Comentario>('/comentarios', { method: 'POST', body: JSON.stringify(nuevo) });
}
