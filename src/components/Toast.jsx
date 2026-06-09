import { useEffect } from 'react'
import { AlertCircleIcon, CheckCircleIcon, InfoIcon } from './Icons'

const toastStyles = {
  success: {
    wrapper: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: CheckCircleIcon,
  },
  error: {
    wrapper: 'border-red-200 bg-red-50 text-red-900',
    icon: AlertCircleIcon,
  },
  info: {
    wrapper: 'border-blue-200 bg-blue-50 text-blue-900',
    icon: InfoIcon,
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
    <div className="pointer-events-none fixed bottom-10 left-1/2 z-50 -translate-x-1/2 animate-[slideIn_0.3s_ease-out_forwards]">
      <div className={`flex items-center gap-3 rounded-2xl border px-6 py-3 shadow-2xl ${config.wrapper}`}>
        <Icon className="h-5 w-5" />
        <span className="text-sm font-bold uppercase tracking-wide">{message}</span>
      </div>
    </div>
  )
}

export default Toast
