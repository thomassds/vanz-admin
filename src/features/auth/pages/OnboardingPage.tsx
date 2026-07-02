import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { useAppDispatch } from '@/app/hooks'
import { useLoginMutation } from '../store/authApi'
import { setCredentials } from '../store/authSlice'
import type { OnboardingResumeState, OnboardingStep } from '../types/onboarding.types'
import { StepIndicator } from '../components/onboarding/StepIndicator'
import { AccountForm } from '../components/onboarding/AccountForm'
import { EmailCodeForm } from '../components/onboarding/EmailCodeForm'
import { PersonalDataForm } from '../components/onboarding/PersonalDataForm'
import { PhoneCodeForm } from '../components/onboarding/PhoneCodeForm'
import { CompanyDataForm } from '../components/onboarding/CompanyDataForm'

interface OnboardingData {
  name: string
  email: string
  password: string
  phone: string
  userId: string
}

interface OnboardingPageProps {
  isAdmin?: boolean
}

const STEP_TITLES: Record<OnboardingStep, string> = {
  account: 'Crie sua conta',
  'email-code': 'Confirme seu e-mail',
  'personal-data': 'Seus dados pessoais',
  'phone-code': 'Confirme seu telefone',
  'company-data': 'Dados da empresa',
}

export default function OnboardingPage({ isAdmin = true }: OnboardingPageProps = {}) {
  const location = useLocation()
  const resumeState = (location.state ?? {}) as OnboardingResumeState

  const [step, setStep] = useState<OnboardingStep>(resumeState.resumeStep ?? 'account')
  const [data, setData] = useState<Partial<OnboardingData>>({
    userId: resumeState.userId,
    email: resumeState.email,
    password: resumeState.password,
    phone: resumeState.phone,
  })
  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const steps: OnboardingStep[] = isAdmin
    ? ['account', 'email-code', 'personal-data', 'phone-code', 'company-data']
    : ['account', 'email-code', 'personal-data', 'phone-code']

  const currentIndex = steps.indexOf(step)

  const finishOnboarding = async () => {
    const result = await login({ email: data.email!, password: data.password! }).unwrap()
    dispatch(setCredentials(result))
    void navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <header>
        <h2 className="m-0 font-heading text-3xl font-extrabold tracking-tight text-text">
          {STEP_TITLES[step]}
        </h2>
      </header>

      <StepIndicator current={currentIndex + 1} total={steps.length} />

      {step === 'account' && (
        <AccountForm
          onSuccess={({ name, email, password, userId }) => {
            setData((prev) => ({ ...prev, name, email, password, userId }))
            setStep('email-code')
          }}
        />
      )}

      {step === 'email-code' && (
        <EmailCodeForm
          userId={data.userId!}
          email={data.email!}
          onSuccess={() => setStep('personal-data')}
        />
      )}

      {step === 'personal-data' && (
        <PersonalDataForm
          userId={data.userId!}
          onSuccess={(phone) => {
            setData((prev) => ({ ...prev, phone }))
            setStep('phone-code')
          }}
        />
      )}

      {step === 'phone-code' && (
        <PhoneCodeForm
          userId={data.userId!}
          phone={data.phone}
          onSuccess={() => {
            if (isAdmin) {
              setStep('company-data')
            } else {
              void finishOnboarding()
            }
          }}
        />
      )}

      {step === 'company-data' && (
        <CompanyDataForm userId={data.userId!} onSuccess={() => void finishOnboarding()} />
      )}

      {step === 'account' && (
        <footer className="mt-8">
          <p className="text-center text-sm text-text-muted">
            Já tem conta?{' '}
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
