import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormInput from './FormInput'
import Button from '../ui/Button'

interface AuthFormValues {
  name?: string
  email: string
  password: string
  confirmPassword?: string
}

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSubmit: (values: AuthFormValues) => Promise<void> | void
}

const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  const isSignup = mode === 'signup'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (isSignup && !name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (isSignup && password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (isSignup && confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    try {
      await onSubmit({
        name: isSignup ? name : undefined,
        email,
        password,
        confirmPassword: isSignup ? confirmPassword : undefined,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold text-text-primary">
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {isSignup ? 'Start building boards with your team.' : 'Log in to continue to sync-board.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {isSignup && (
          <FormInput
            label="Full name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
        )}

        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {isSignup && (
          <FormInput
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        )}

        <Button
          label={isSignup ? 'Sign up' : 'Log in'}
          type="submit"
          isLoading={isLoading}
          onClick={() => {}}
        />
      </form>

      <p className="mt-6 text-center text-sm text-text-secondary">
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <Link
          to={isSignup ? '/login' : '/signup'}
          className="font-medium text-primary hover:text-primary-hover"
        >
          {isSignup ? 'Log in' : 'Sign up'}
        </Link>
      </p>
    </div>
  )
}

export default AuthForm