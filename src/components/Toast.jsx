import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

const toastStyles = {
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: CheckCircle2,
  },
  error: {
    wrapper: 'border-red-200 bg-red-50 text-red-900',
    icon: AlertCircle,
  },
  info: {
    wrapper: 'border-blue-200 bg-blue-50 text-blue-900',
    icon: Info,
  },
}

function Toast({ message, onClose, type = 'info' }) {
  useEffect(() => {
    if (!message) return undefined

    const timeoutId = window.setTimeout(onClose, 3000)
    return () => window.clearTimeout(timeoutId)
  }, [message, onClose])

  if (!message) return null

  const config = toastStyles[type] || toastStyles.info
  const Icon = config.icon

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-[slideIn_0.2s_ease-out_forwards]">
      <div className={`flex items-center gap-2 border px-4 py-2 shadow-lg ${config.wrapper}`}>
        <Icon className="h-4 w-4" />
        <span className="text-[12px] font-semibold">{message}</span>
      </div>
    </div>
  )
}

export default Toast
