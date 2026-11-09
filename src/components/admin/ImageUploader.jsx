// src/components/admin/ImageUploader.jsx
import { useState, useRef, useEffect } from 'react';
import { api, resolveMediaUrl } from '../../services/api';
import { UploadCloud, Link as LinkIcon, CheckCircle2, AlertTriangle, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({
  value = '',
  onChange,
  label = 'Imagen Principal del Servicio',
  aspectRatioLabel = '1200 × 800 px (3:2) o 1920 × 1080 px (16:9)',
}) {
  const [modo, setModo] = useState('archivo'); // 'archivo' | 'url'
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState(null);
  const [infoDimensiones, setInfoDimensiones] = useState(null);
  const fileInputRef = useRef(null);

  // Analizar dimensiones cuando cambia el valor
  useEffect(() => {
    if (!value) {
      setInfoDimensiones(null);
      return;
    }
    const img = new Image();
    img.src = resolveMediaUrl(value);
    img.onload = () => {
      const ancho = img.naturalWidth;
      const alto = img.naturalHeight;
      const esHorizontal = ancho >= alto;
      const esBuenaResolucion = ancho >= 1000;
      setInfoDimensiones({
        ancho,
        alto,
        esHorizontal,
        esBuenaResolucion,
      });
    };
    img.onerror = () => {
      setInfoDimensiones(null);
    };
  }, [value]);

  const procesarArchivo = async (file) => {
    if (!file) return;
    setError(null);

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError('El archivo seleccionado no es una imagen válida.');
      return;
    }

    // Validar peso (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen es demasiado pesada. El tamaño máximo permitido es 5 MB.');
      return;
    }

    setSubiendo(true);
    try {
      const data = await api.subirImagen(file);
      onChange(data.url);
    } catch (err) {
      console.error('Error al subir:', err);
      setError(err.message || 'Error al subir la imagen al servidor.');
    } finally {
      setSubiendo(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) procesarArchivo(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) procesarArchivo(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleEliminar = () => {
    onChange('');
    setInfoDimensiones(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Cabecera y Selector de Modo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
          {label}
        </label>
        <div className="flex items-center gap-1 p-0.5 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setModo('archivo')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              modo === 'archivo' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Subir Archivo
          </button>
          <button
            type="button"
            onClick={() => setModo('url')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              modo === 'url' ? 'bg-red-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Enlace Web (URL)
          </button>
        </div>
      </div>

      {/* Guía Visual de Dimensiones y Calidad Requerida */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-neutral-300 space-y-1">
        <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wide">
          <ImageIcon className="w-4 h-4 shrink-0" />
          <span>Guía de Tamaño & Calidad Recomendada:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-neutral-400 pl-6">
          • <strong>Medida sugerida:</strong> <span className="text-white font-mono">{aspectRatioLabel}</span>
          <br />
          • <strong>Formatos:</strong> JPG, PNG o WEBP (máx. 5 MB) • <strong>Proporción:</strong> Apaisada / Horizontal
        </p>
      </div>

      {/* Vista Previa Si ya existe imagen cargada */}
      {value ? (
        <div className="relative rounded-2xl border border-neutral-700 bg-neutral-950 overflow-hidden group">
          <div className="aspect-[16/9] w-full max-h-56 bg-neutral-900 flex items-center justify-center overflow-hidden">
            <img
              src={resolveMediaUrl(value)}
              alt="Vista previa del servicio"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Barra inferior de estado de la imagen */}
          <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
            {infoDimensiones ? (
              <div className="flex items-center gap-2 text-xs">
                {infoDimensiones.esBuenaResolucion && infoDimensiones.esHorizontal ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolución: {infoDimensiones.ancho} × {infoDimensiones.alto} px (Óptima)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>
                      {infoDimensiones.ancho} × {infoDimensiones.alto} px
                      {!infoDimensiones.esHorizontal ? ' (Sugerido formato apaisado)' : ' (Baja resolución)'}
                    </span>
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-neutral-400 font-mono truncate max-w-xs">{value}</span>
            )}

            <button
              type="button"
              onClick={handleEliminar}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 hover:underline transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cambiar o Quitar</span>
            </button>
          </div>
        </div>
      ) : (
        /* Zona de Carga Cuando no hay imagen */
        <div>
          {modo === 'archivo' ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-2xl border-2 border-dashed border-neutral-700 bg-neutral-950/60 p-8 text-center transition-all hover:border-red-500 hover:bg-neutral-900/50 flex flex-col items-center justify-center gap-3"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="p-3.5 rounded-full bg-red-600/10 text-red-500 border border-red-500/20">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  {subiendo ? 'Subiendo imagen al servidor...' : 'Haz clic para seleccionar o arrastra tu imagen aquí'}
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  Recomendado: 1200x800 px o 1920x1080 px (JPG, PNG, WEBP)
                </p>
              </div>

              <button
                type="button"
                disabled={subiendo}
                className="mt-1 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 uppercase tracking-wider transition-colors"
              >
                {subiendo ? 'Procesando...' : 'Examinar en mi Equipo'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-red-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-neutral-500">
                Pega la dirección web completa de una imagen pública alojada en la nube.
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-bold text-red-500 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
