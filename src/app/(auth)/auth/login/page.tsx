import { LoginForm } from '@/components/auth/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mt-2 text-slate-400">
          Sign in to your COC-SaaS account
        </p>
      </div>
      
      <LoginForm />
      
      <div className="text-center text-sm text-slate-400">
        Don't have an account?{' '}
        <Link href="/auth/register" className="font-medium text-white hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  )
}