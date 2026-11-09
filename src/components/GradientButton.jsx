// Botón con gradiente que se desplaza en hover. Úsalo como <GradientButton>Texto</GradientButton> o as="a".
export default function GradientButton({ as: Tag = "button", className = "", ...props }) {
  return (
    <Tag
      className={`inline-block rounded-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-[length:200%_100%] px-7 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-right hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
