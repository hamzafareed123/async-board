import React from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  type?: 'button' | 'submit'
  isLoading?: boolean
}

const variantClasses = {
  primary: 'bg-primary text-white hover:bg-primary-hover border border-transparent',
  secondary: 'bg-surface text-text-primary border border-border hover:bg-surface-2',
  danger: 'bg-error text-white hover:bg-red-600 border border-transparent',
}

const Button = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  isLoading = false,
}: ButtonProps) => {
  const isDisabled = disabled || isLoading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
        transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]}`}
    >
      {isLoading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {label}
    </button>
  )
}

export default Button