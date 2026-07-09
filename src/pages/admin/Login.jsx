import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/schemas/auth.schema';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

export default function Login() {
  const isAuthed = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (isAuthed) {
    const to = location.state?.from?.pathname || '/admin';
    return <Navigate to={to} replace />;
  }

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(' ')[0]} 👋`);
      const to = location.state?.from?.pathname || '/admin';
      navigate(to, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || 'Sign in failed';
      toast.error(msg);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin sign in — DigiSwarm</title>
      </Helmet>
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 via-white to-ink-50 p-4">
        <div className="card w-full max-w-md p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <img src="/logo.png" alt="DigiSwarm" className="h-14 w-auto object-contain" />
            <h1 className="mt-4 text-2xl font-extrabold text-ink-900">Welcome back</h1>
            <p className="mt-1 text-sm text-ink-500">Sign in to the DigiSwarm admin</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-700">Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type="email"
                  autoComplete="email"
                  className="input pl-9"
                  placeholder="you@digiswarm.com"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs font-semibold text-ink-700">Password</label>
                <Link
                  to="/admin/forgot-password"
                  className="text-xs font-medium text-brand-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="input pl-9 pr-10"
                  placeholder="••••••••"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-400 hover:text-ink-700"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-500">
            <Link to="/" className="hover:text-brand-700">
              ← Back to site
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
