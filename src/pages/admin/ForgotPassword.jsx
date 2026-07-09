import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Mail, KeyRound } from 'lucide-react';

import { authApi } from '@/api/auth.api';
import { forgotSchema } from '@/schemas/auth.schema';

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotSchema), defaultValues: { email: '' } });

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (res) => {
      toast.success(res?.message || 'Check your email for a reset link');
      reset();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Could not send reset email');
    },
  });

  return (
    <>
      <Helmet>
        <title>Forgot password — DigiSwarm</title>
      </Helmet>
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-brand-50 via-white to-ink-50 p-4">
        <div className="card w-full max-w-md p-8">
          <div className="flex flex-col items-center text-center">
            <img src="/logo.png" alt="DigiSwarm" className="h-14 w-auto object-contain" />
            <h1 className="mt-4 text-2xl font-extrabold text-ink-900">Forgot your password?</h1>
            <p className="mt-1 text-sm text-ink-500">
              Enter your admin email and we&apos;ll send you a reset link.
            </p>
          </div>

          <form
            className="mt-8 space-y-4"
            onSubmit={handleSubmit((vals) => mutation.mutate(vals))}
            noValidate
          >
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-700">Email</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type="email"
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

            <button type="submit" className="btn-primary w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Sending…' : 'Send reset link'}
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
