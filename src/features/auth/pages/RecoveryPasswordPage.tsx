import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { RequestCodeForm } from '../components/recovery-password/RequestCodeForm'
import { EmailCodeForm } from '../components/recovery-password/EmailCodeForm'
import { ResetPasswordForm } from '../components/recovery-password/ResetPasswordForm'

type RecoveryStep = 'request-code' | 'email-code' | 'reset-password'

interface RecoveryData {
  email: string
  userId: string
  code: string
}

const STEP_TITLES: Record<RecoveryStep, string> = {
  'request-code': 'Recuperar senha',
  'email-code': 'Confirme o código',
  'reset-password': 'Crie uma nova senha',
}

export default function RecoveryPasswordPage() {
  const [step, setStep] = useState<RecoveryStep>('request-code')
  const [data, setData] = useState<Partial<RecoveryData>>({})
  const navigate = useNavigate()

  return (
    <AuthLayout>
      <header>
        <h2 className="m-0 font-heading text-3xl font-extrabold tracking-tight text-text">
          {STEP_TITLES[step]}
        </h2>
      </header>

      {step === 'request-code' && (
        <RequestCodeForm
          onSuccess={({ email, userId }) => {
            setData((prev) => ({ ...prev, email, userId }))
            setStep('email-code')
          }}
        />
      )}

      {step === 'email-code' && (
        <EmailCodeForm
          userId={data.userId!}
          email={data.email!}
          onSuccess={(code) => {
            setData((prev) => ({ ...prev, code }))
            setStep('reset-password')
          }}
        />
      )}

      {step === 'reset-password' && (
        <ResetPasswordForm
          userId={data.userId!}
          code={data.code!}
          onSuccess={() => {
            void navigate('/login', {
              state: { successMessage: 'Senha redefinida com sucesso! Faça login com sua nova senha.' },
            })
          }}
        />
      )}

      {step === 'request-code' && (
        <footer className="mt-8">
          <p className="text-center text-sm text-text-muted">
            Lembrou a senha?{' '}
            <Link
              to="/login"
              className="font-bold text-primary transition-colors hover:text-primary-hover"
            >
              Entrar
            </Link>
          </p>
        </footer>
      )}
    </AuthLayout>
  )
}
