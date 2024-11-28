'use client'

import { useCallback, useRef, useEffect } from 'react'

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  className?: string
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  className = '',
  ...props
}: NumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // 选择全部文本的函数
  const selectAll = useCallback(() => {
    if (inputRef.current) {
      // 使用 setTimeout 确保在所有事件处理完成后执行
      setTimeout(() => {
        inputRef.current?.select()
      }, 0)
    }
  }, [])

  // 处理点击事件
  const handleClick = useCallback(() => {
    selectAll()
  }, [selectAll])

  // 处理焦点事件
  const handleFocus = useCallback(() => {
    selectAll()
  }, [selectAll])

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    if (document.activeElement === inputRef.current) {
      // 如果输入框已经获得焦点，阻止默认行为以保持选中状态
      e.preventDefault()
    }
  }, [])

  // 处理值的变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value === '' ? 0 : Number(e.target.value)
    if (!isNaN(newValue)) {
      onChange(newValue)
    }
  }, [onChange])

  // 组件挂载时添加事件监听
  useEffect(() => {
    const input = inputRef.current
    if (!input) return

    const handleMouseUp = (e: MouseEvent) => {
      if (document.activeElement === input) {
        e.preventDefault()
        selectAll()
      }
    }

    input.addEventListener('mouseup', handleMouseUp)
    return () => {
      input.removeEventListener('mouseup', handleMouseUp)
    }
  }, [selectAll])

  return (
    <input
      ref={inputRef}
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
      className={`block w-full rounded-md border-gray-300 shadow-sm 
                 focus:border-primary-500 focus:ring-primary-500 ${className}`}
      onClick={handleClick}
      onFocus={handleFocus}
      onMouseDown={handleMouseDown}
      {...props}
    />
  )
} 