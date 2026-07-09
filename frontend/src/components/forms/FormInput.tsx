import React from 'react'

interface FormInputProps {
  label: string
  type: 'text' | 'email' | 'password'
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

const FormInput = ({ label, type, placeholder, value, onChange, error }: FormInputProps) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-3 py-2.5 rounded-lg text-sm text-text-primary bg-surface border outline-none transition
          focus:ring-2 focus:ring-primary/20 focus:border-border-focus
          ${error ? 'border-error' : 'border-border'}`}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}

export default FormInput