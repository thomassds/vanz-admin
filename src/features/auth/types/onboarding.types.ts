export type OnboardingStep = 'account' | 'email-code' | 'personal-data' | 'phone-code' | 'company-data'

export interface OnboardingResumeState {
  resumeStep?: OnboardingStep
  userId?: string
  email?: string
  password?: string
  phone?: string
}
