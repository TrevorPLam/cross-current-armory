import React from 'react'

interface InputProps {
  type: 'text' | 'email' | 'password' | 'search' | 'tel'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  'aria-label'?: string
  'aria-describedby'?: string
  error?: boolean
  className?: string
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  error = false,
  className = ''
}) => {
  const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const stateClasses = error 
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-600 focus:border-red-600'
    : 'border-gray-300 focus:ring-red-600 focus:border-transparent'
  const disabledClasses = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
  
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-invalid={error}
      className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
    />
  )
}

export default Input
