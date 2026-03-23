/**
 * Auth modal: login and register against the Express API (same origin in dev via proxy).
 */

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import api from '../api/client'

/** Minimal valid PNG for Cloudinary upload expected by POST /api/v1/register */
const DEFAULT_AVATAR_DATA_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='

export type AuthMode = 'login' | 'signup'

interface Props {
  open: boolean
  initialMode: AuthMode
  onClose: () => void
}

const AuthModal = ({ open, initialMode, onClose }: Props) => {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('other')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setMode(initialMode)
      setError(null)
    }
  }, [open, initialMode])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  const extractMessage = (err: unknown): string => {
    if (axios.isAxiosError(err) && err.response?.data) {
      const data = err.response.data as { message?: string }
      if (typeof data.message === 'string') return data.message
    }
    if (err instanceof Error) return err.message
    return 'Something went wrong. Please try again.'
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/login', { email, password })
      onClose()
    } catch (err) {
      setError(extractMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/register', {
        name,
        email,
        password,
        gender,
        avatar: DEFAULT_AVATAR_DATA_URI,
      })
      onClose()
    } catch (err) {
      setError(extractMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-whiteColor p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg text-textColor hover:bg-grayColor/40"
          aria-label="Close"
        >
          ×
        </button>

        <h2 id="auth-modal-title" className="mb-6 text-2xl font-semibold text-textColor">
          {mode === 'login' ? 'Log in' : 'Sign up'}
        </h2>

        <div className="mb-6 flex gap-2 rounded-xl bg-offWhiteColor p-1">
          <button
            type="button"
            onClick={() => {
              setMode('login')
              setError(null)
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-blueColor text-whiteColor' : 'text-textColor opacity-70'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError(null)
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-blueColor text-whiteColor' : 'text-textColor opacity-70'
            }`}
          >
            Sign up
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-redColor/10 px-3 py-2 text-sm text-redColor" role="alert">
            {error}
          </p>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm text-textColor">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-borderColor px-4 py-3 outline-none focus:border-blueColor"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-textColor">
              Password
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-borderColor px-4 py-3 outline-none focus:border-blueColor"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-blueColor py-3 font-medium text-whiteColor hover:bg-yellowColor hover:text-textColor disabled:opacity-60"
            >
              {loading ? 'Please wait…' : 'Log in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm text-textColor">
              Name
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-borderColor px-4 py-3 outline-none focus:border-blueColor"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-textColor">
              Email
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-borderColor px-4 py-3 outline-none focus:border-blueColor"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-textColor">
              Gender
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="rounded-xl border border-borderColor px-4 py-3 outline-none focus:border-blueColor"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-textColor">
              Password
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-borderColor px-4 py-3 outline-none focus:border-blueColor"
              />
              <span className="text-xs opacity-60">At least 8 characters</span>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-xl bg-blueColor py-3 font-medium text-whiteColor hover:bg-yellowColor hover:text-textColor disabled:opacity-60"
            >
              {loading ? 'Please wait…' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default AuthModal
