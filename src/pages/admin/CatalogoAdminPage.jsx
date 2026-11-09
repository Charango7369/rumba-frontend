// src/pages/admin/CatalogoAdminPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { api, resolveMediaUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Check, X, Star, DollarSign, Image as ImageIcon } from 'lucide-react';
import CanAccess from '../../components/auth/CanAccess';
import ImageUploader from '../../components/admin/ImageUploader';

export default function CatalogoAdminPage() {
  const { tienePermiso } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Modales
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalPrecioAbierto, setModalPrecioAbierto] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  // Formulario de Precios
  const [precioBase, setPrecioBase] = useState('');
  const [precioPromo, setPrecioPromo] = useState('');

  // Formulario Completo de Servicio
  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    categoria: 'Sonido',
    descripcion_corta: '',
    descripcion_larga: '',
    precio_base: '',
    precio_promocional: '',
    imagen_principal: '',
    especificaciones_tecnicas: '',
    es_extra: false,
    activo: true,
    destacado: false,
    orden_visualizacion: 0,
  });

  const cargarServicios = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await api.getAdminServicios();
      setServicios(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al obtener catálogo.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarServicios();
  }, [cargarServicios]);

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      await api.toggleEstadoServicio(id, !estadoActual);
      setServicios((prev) =>
        prev.map((s) => (s.id === id ? { ...s, activo: !estadoActual } : s))
      );
    } catch (err) {
      alert('Error al cambiar estado: ' + err.message);
    }
  };

  const abrirModalPrecio = (servicio) => {
    setServicioSeleccionado(servicio);
    setPrecioBase(servicio.precio_base);
    setPrecioPromo(servicio.precio_promocional || '');
    setModalPrecioAbierto(true);
  };

  const handleGuardarPrecio = async (e) => {
    e.preventDefault();
    try {
      await api.actualizarPrecio(servicioSeleccionado.id, {
        precio_base: Number(precioBase),
        precio_promocional: precioPromo ? Number(precioPromo) : null,
      });
      setModalPrecioAbierto(false);
      cargarServicios();
    } catch (err) {
      alert('Error al actualizar precios: ' + err.message);
    }
  };

  const abrirModalCrear = () => {
    setServicioSeleccionado(null);
    setFormData({
      nombre: '',
      slug: '',
      categoria: 'Sonido',
      descripcion_corta: '',
      descripcion_larga: '',
      precio_base: '',
      precio_promocional: '',
      imagen_principal: '',
      especificaciones_tecnicas: '',
      es_extra: false,
      activo: true,
      destacado: false,
      orden_visualizacion: 0,
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (servicio) => {
    setServicioSeleccionado(servicio);
    setFormData({
      nombre: servicio.nombre,
      slug: servicio.slug,
      categoria: servicio.categoria,
      descripcion_corta: servicio.descripcion_corta || '',
      descripcion_larga: servicio.descripcion_larga || '',
      precio_base: servicio.precio_base,
      precio_promocional: servicio.precio_promocional || '',
      imagen_principal: servicio.imagen_principal || '',
      especificaciones_tecnicas: (servicio.especificaciones_tecnicas || []).join('\n'),
      es_extra: servicio.es_extra,
      activo: servicio.activo,
      destacado: servicio.destacado,
      orden_visualizacion: servicio.orden_visualizacion || 0,
    });
    setModalAbierto(true);
  };

  const handleGuardarServicio = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      precio_base: Number(formData.precio_base),
      precio_promocional: formData.precio_promocional ? Number(formData.precio_promocional) : null,
      orden_visualizacion: Number(formData.orden_visualizacion),
      especificaciones_tecnicas: formData.especificaciones_tecnicas
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (servicioSeleccionado) {
        await api.actualizarServicio(servicioSeleccionado.id, payload);
      } else {
        await api.crearServicio(payload);
      }
      setModalAbierto(false);
      cargarServicios();
    } catch (err) {
      alert('Error al guardar servicio: ' + err.message);
    }
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Estás seguro de eliminar permanentemente el servicio "${nombre}"?`)) return;
    try {
      await api.eliminarServicio(id);
      setServicios((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra de Título y Botón Crear */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Catálogo de Servicios & Tarifas
          </h2>
          <p className="text-sm text-neutral-400">
            Modifica precios, promociones, fotos de escenario e información técnica en vivo.
          </p>
        </div>

        <CanAccess permission="catalog:create">
          <button
            type="button"
            onClick={abrirModalCrear}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 font-extrabold uppercase text-xs tracking-wider text-white shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Servicio</span>
          </button>
        </CanAccess>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabla de Servicios */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-xs font-bold uppercase text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-4 px-4">Foto</th>
                <th className="py-4 px-4">Servicio / Slug</th>
                <th className="py-4 px-4">Categoría</th>
                <th className="py-4 px-4">Tipo</th>
                <th className="py-4 px-4">Tarifa Base</th>
                <th className="py-4 px-4">Promoción</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-center">Destacado</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {cargando ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    Cargando catálogo desde PostgreSQL...
                  </td>
                </tr>
              ) : servicios.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-neutral-500">
                    No existen servicios en la base de datos.
                  </td>
                </tr>
              ) : (
                servicios.map((s) => (
                  <tr key={s.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={resolveMediaUrl(s.imagen_principal)}
                        alt={s.nombre}
                        className="w-12 h-12 object-cover rounded-lg border border-neutral-700 bg-neutral-950"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white text-base leading-tight">{s.nombre}</p>
                      <p className="font-mono text-xs text-neutral-400 mt-0.5">{s.slug}</p>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-neutral-300">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700">
                        {s.categoria}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {s.es_extra ? (
                        <span className="text-amber-400 font-bold uppercase text-[10px]">Accesorio / Extra</span>
                      ) : (
                        <span className="text-neutral-400 font-semibold text-[10px] uppercase">Paquete Principal</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-black text-amber-400 text-sm">
                      Bs. {Number(s.precio_base).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold">
                      {s.precio_promocional ? (
                        <span className="text-red-400 font-bold">Bs. {Number(s.precio_promocional).toLocaleString()}</span>
                      ) : (
                        <span className="text-neutral-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <CanAccess
                        permission="catalog:toggle"
                        fallback={
                          <span className={`text-xs font-bold ${s.activo ? 'text-emerald-400' : 'text-neutral-500'}`}>
                            {s.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        }
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleEstado(s.id, s.activo)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                            s.activo
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-neutral-800 text-neutral-500 border border-neutral-700 hover:bg-neutral-700'
                          }`}
                        >
                          {s.activo ? 'Activo' : 'Desactivado'}
                        </button>
                      </CanAccess>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {s.destacado ? (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400 mx-auto" />
                      ) : (
                        <span className="text-neutral-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <CanAccess permission="catalog:pricing">
                          <button
                            type="button"
                            title="Modificar Precios"
                            onClick={() => abrirModalPrecio(s)}
                            className="p-2 rounded-lg bg-neutral-800 hover:bg-amber-500/20 text-neutral-300 hover:text-amber-400 transition-colors"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        </CanAccess>

                        <CanAccess permission="catalog:update">
                          <button
                            type="button"
                            title="Editar Servicio"
                            onClick={() => abrirModalEditar(s)}
                            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </CanAccess>

                        <CanAccess permission="catalog:delete">
                          <button
                            type="button"
                            title="Eliminar Servicio"
                            onClick={() => handleEliminar(s.id, s.nombre)}
                            className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </CanAccess>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Rápido de Precios */}
      {modalPrecioAbierto && servicioSeleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
            <h3 className="text-lg font-black uppercase text-white mb-1">
              Ajustar Tarifas: {servicioSeleccionado.nombre}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              El cambio impactará inmediatamente en el cotizador y la landing page.
            </p>

            <form onSubmit={handleGuardarPrecio} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Precio Base (Bs.)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={precioBase}
                  onChange={(e) => setPrecioBase(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-white font-mono text-base outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Precio Promocional (Opcional - Bs.)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioPromo}
                  onChange={(e) => setPrecioPromo(e.target.value)}
                  placeholder="Dejar vacío si no aplica oferta"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-white font-mono text-base outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalPrecioAbierto(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-xs font-bold uppercase text-white shadow-lg hover:brightness-110"
                >
                  Guardar Precios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Completo de Servicio (Crear / Editar) con ImageUploader */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl my-8">
            <h3 className="text-xl font-black uppercase text-white mb-2">
              {servicioSeleccionado ? `Editar Servicio: ${servicioSeleccionado.nombre}` : 'Nuevo Servicio / Extra'}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Completa los datos técnicos y comerciales que se presentarán a los clientes.
            </p>

            <form onSubmit={handleGuardarServicio} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => {
                      const nombre = e.target.value;
                      setFormData((p) => ({
                        ...p,
                        nombre,
                        slug: p.slug || nombre.toLowerCase().replace(/\s+/g, '-'),
                      }));
                    }}
                    placeholder="Ej. Sonido Line Array"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="ej-sonido-line-array"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm font-mono text-amber-400 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Categoría</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData((p) => ({ ...p, categoria: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  >
                    <option value="Sonido">Sonido</option>
                    <option value="Iluminación">Iluminación</option>
                    <option value="Paquetes">Paquetes</option>
                    <option value="Video">Video</option>
                    <option value="Efectos">Efectos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Precio Base (Bs.)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.precio_base}
                    onChange={(e) => setFormData((p) => ({ ...p, precio_base: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Precio Promo (Bs.)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precio_promocional}
                    onChange={(e) => setFormData((p) => ({ ...p, precio_promocional: e.target.value }))}
                    placeholder="Opcional"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Componente Especializado de Carga de Imágenes con Guía de Resolución */}
              <ImageUploader
                value={formData.imagen_principal}
                onChange={(nuevaUrl) => setFormData((p) => ({ ...p, imagen_principal: nuevaUrl }))}
                label="Fotografía Principal del Escenario / Montaje"
                aspectRatioLabel="1200 × 800 píxeles (3:2) o 1920 × 1080 px (16:9 Full HD)"
              />

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Descripción Corta</label>
                <input
                  type="text"
                  maxLength={255}
                  value={formData.descripcion_corta}
                  onChange={(e) => setFormData((p) => ({ ...p, descripcion_corta: e.target.value }))}
                  placeholder="Breve resumen comercial para las tarjetas"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Especificaciones Técnicas (Una por línea)
                </label>
                <textarea
                  rows={3}
                  value={formData.especificaciones_tecnicas}
                  onChange={(e) => setFormData((p) => ({ ...p, especificaciones_tecnicas: e.target.value }))}
                  placeholder="Nexo STM M46&#10;Consola Yamaha CL5&#10;Operador Dedicado"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-sm text-white font-mono outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.es_extra}
                    onChange={(e) => setFormData((p) => ({ ...p, es_extra: e.target.checked }))}
                    className="w-4 h-4 rounded text-red-600 bg-neutral-950 border-neutral-700"
                  />
                  <span>Es accesorio / extra</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.destacado}
                    onChange={(e) => setFormData((p) => ({ ...p, destacado: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-500 bg-neutral-950 border-neutral-700"
                  />
                  <span>Marcar como destacado</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-neutral-300">
                  <input
                    type="checkbox"
                    checked={formData.activo}
                    onChange={(e) => setFormData((p) => ({ ...p, activo: e.target.checked }))}
                    className="w-4 h-4 rounded text-emerald-500 bg-neutral-950 border-neutral-700"
                  />
                  <span>Activo en la web</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-xs font-bold uppercase text-white shadow-lg hover:brightness-110"
                >
                  Guardar Servicio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
