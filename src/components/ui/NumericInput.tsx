'use client'

interface NumericInputProps {
  value: number | ''
  onChange: (value: number | '') => void
  label?: string
  unit?: string
  className?: string
}

export function NumericInput({
  value,
  onChange,
  label,
  unit,
  className = ''
}: NumericInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '') {
      onChange('')
    } else {
      const newValue = Number(inputValue)
      if (!isNaN(newValue)) {
        onChange(newValue)
      }
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur()
    e.stopPropagation()
  }

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          onWheel={handleWheel}
          className={`block w-full px-3 py-2 bg-white border border-gray-300 
                     rounded-md shadow-sm focus:ring-1 focus:ring-primary-500 
                     focus:border-primary-500 sm:text-sm
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                     [&::-webkit-inner-spin-button]:appearance-none ${className}`}
        />
        {unit && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">{unit}</span>
          </div>
        )}
      </div>
      {label && (
        <p className="mt-1 text-xs text-gray-500">{label}</p>
      )}
    </div>
  )
} 