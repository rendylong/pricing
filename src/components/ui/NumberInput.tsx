'use client'

import { ChangeEvent, InputHTMLAttributes, useState, KeyboardEvent } from 'react'
import { XCircleIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// 添加一个全局样式到 globals.css
// 或者直接在这里使用 styled-jsx
const styles = `
  /* Chrome, Safari, Edge, Opera */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
`

interface NumberInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onChange: (value: number) => void
  onClear?: () => void
}

export function NumberInput({ 
  value, 
  onChange, 
  onClear,
  className = '', 
  ...props 
}: NumberInputProps) {
  const [isEmpty, setIsEmpty] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === '') {
      setIsEmpty(true)
      onChange(0)
      return
    }
    setIsEmpty(false)
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      onChange(num)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 禁用上下键
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
    }
  }

  const handleClear = () => {
    if (onClear) {
      setIsEmpty(true)
      onClear()
    }
  }

  return (
    <>
      <style jsx global>{styles}</style>
      <div className="relative">
        <input
          type="number"
          value={isEmpty ? '' : value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
            className
          )}
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
    </>
  )
} 