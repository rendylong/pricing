'use client'

import { ChangeEvent, InputHTMLAttributes, useState } from 'react'
import { XCircleIcon } from '@heroicons/react/24/outline'

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onChange: (value: number) => void
  onClear?: () => void
  min?: number
}

export function NumberInput({ 
  value, 
  onChange, 
  onClear,
  min,
  className = '', 
  ...props 
}: NumberInputProps) {
  const [isEmpty, setIsEmpty] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      setIsEmpty(true)
      onChange(min || 0)
      return
    }
    setIsEmpty(false)
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      onChange(num)
    }
  }

  const handleClear = () => {
    if (onClear) {
      setIsEmpty(true)
      onClear()
    }
  }

  return (
    <div className="relative">
      <input
        type="number"
        value={isEmpty ? '' : value}
        onChange={handleChange}
        className={`block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-primary-500 focus:ring-primary-500 
          [appearance:textfield] 
          [&::-webkit-outer-spin-button]:appearance-none 
          [&::-webkit-inner-spin-button]:appearance-none
          ${className}`}
        {...props}
      />
      {!isEmpty && value > 0 && onClear && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 
            hover:text-gray-600 transition-colors"
        >
          <XCircleIcon className="h-5 w-5" />
        </button>
      )}
    </div>
  )
} 