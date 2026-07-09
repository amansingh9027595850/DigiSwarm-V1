import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

import { authApi } from '@/api/auth.api';
import { resetSchema } from '@/schemas/auth.schema';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: (vals) => authApi.resetPassword({ token, password: vals.password }),
    onSuccess: (res) => {
      toast.success(res?.message || 'Password updated. Please sign in.');
      navigate('/admin/login', { replace: true });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Reset failed');
    },
  });

  return (
    <>
      <Helmet>
        <title>Reset password — DigiSwarm</title>
      </Helmet>
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 via-white to-ink-50 p-4">
        <div className="card w-full max-w-md p-8">
          <div className="flex flex-col items-center text-center">
            <img src="/logo.png" alt="DigiSwarm" className="h-14 w-auto object-contain" />
            <h1 className="mt-4 text-2xl font-extrabold text-ink-900">Choose a new password</h1>
            <p className="mt-1 text-sm text-ink-500">
              Make it strong — at least 8 characters with upper, lower, and a number.
            </p>
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={handleSubmit((vals) => mutation.mutate(vals))}
            noValidate
          >
            <PasswordField
              label="New password"
              register={register('password')}
              error={errors.password?.message}
              show={showPw}
              onToggle={() => setShowPw((v) => !v)}
            />
            <PasswordField
              label="Confirm password"
              register={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              show={showPw}
              onToggle={() => setShowPw((v) => !v)}
            />

            <button type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-500">
            <Link to="/admin/login" className="hover:text-brand-700">
              ← Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

function PasswordField({ label, register, error, show, onToggle }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>
      <div className="relative">
        <Lock
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        />
        <input
          type={show ? 'text' : 'password'}
          className="input pl-9 pr-10"
          placeholder="••••••••"
          {...register}
          aria-invalid={!!error}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-400 hover:text-ink-700"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
