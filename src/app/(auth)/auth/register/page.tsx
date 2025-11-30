import { RegisterForm } from '@/components/auth/register-form'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="mt-2 text-slate-400">
          Join COC-SaaS and manage your clan
        </p>
      </div>
      
      <RegisterForm />
      
      <div className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-white hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  )
}