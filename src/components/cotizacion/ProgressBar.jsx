export default function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200" role="progressbar"
         aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Avance del formulario">
      <div className="h-full rounded-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300" style={{ width: `${value}%` }} />
    </div>
  );
}
