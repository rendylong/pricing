'use client'

interface NumericInputProps {
  value: number | '';
  onChange: (value: number | '') => void;
  placeholder?: string;
  className?: string;
}

export function NumericInput({
  value,
  onChange,
  placeholder,
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
          placeholder={placeholder}
          className={`block w-full px-3 py-2 bg-white border border-gray-300 
                     rounded-md shadow-sm focus:ring-1 focus:ring-primary-500 
                     focus:border-primary-500 sm:text-sm
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none 
                     [&::-webkit-inner-spin-button]:appearance-none ${className}`}
        />
      </div>
    </div>
  )
} 