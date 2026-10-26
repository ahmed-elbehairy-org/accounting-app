interface AppLogoProps {
  className?: string
}

export function AppLogo({ className = 'w-10 h-10' }: AppLogoProps) {
  return (
    <img
      src="/favicon.svg"
      alt="شعار المحاسبة والاستثمار"
      className={`rounded-xl shadow-lg shadow-indigo-500/20 object-contain ${className}`}
    />
  )
}
