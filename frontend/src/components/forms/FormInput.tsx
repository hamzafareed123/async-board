import React from 'react'

interface FormInputProps {
  label: string
  type: 'text' | 'email' | 'password'
  placeholder?: string
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
        className={`w-full rounded-xl border bg-surface px-3.5 py-3 text-sm text-text-primary shadow-sm outline-none transition
          placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/15
          ${error ? 'border-error' : 'border-border'}`}
      />
      {error && <span className="text-xs text-error">{error}</span>}
    </div>
  )
}

export default FormInput