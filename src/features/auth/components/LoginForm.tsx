import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@/app/hooks'
import { loginSchema } from '../schemas/login.schema'
import type { LoginFormData } from '../schemas/login.schema'
import { useLoginMutation } from '../store/authApi'
import { setCredentials } from '../store/authSlice'
import { getAuthErrorMessage } from '../utils/authErrorMessages'
import { cn } from '@/shared/utils/cn'
import type { ApiError } from '@/shared/types/api.types'

export function LoginForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleLogin = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap()
      dispatch(setCredentials(result))
      void navigate('/dashboard')
    } catch (err) {
      const apiError = err as ApiError
      setError('root', { message: getAuthErrorMessage(apiError.code) })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="mt-6 grid gap-3 px-0 lg:px-6"
      noValidate
    >
      <div className="grid gap-1">
        <label
          htmlFor="email"
          className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Digite seu email de acesso"
          autoComplete="email"
          className={cn(
            "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]",
            errors.email ? 'border-red-400' : 'border-[#8994a9]',
          )}
          {...register('email')}
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div className="grid gap-1">
        <label
          htmlFor="password"
          className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#8994a9]"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          placeholder="***************"
          autoComplete="current-password"
          className={cn(
            "h-[34px] w-full rounded-[4px] border bg-white px-[10px] font-['Noto_Sans',sans-serif] text-xs text-[#8994a9] outline-none transition-colors focus:border-[#70c9ec]",
            errors.password ? 'border-red-400' : 'border-[#8994a9]',
          )}
          {...register('password')}
        />
        {errors.password && (
          <span className="text-xs text-red-500">{errors.password.message}</span>
        )}
      </div>

      <div className="mt-0.5 flex items-center justify-between gap-2.5">
        <label
          htmlFor="remember"
          className="inline-flex items-center gap-[7px] font-['Montserrat',sans-serif] text-[12px] font-medium text-[#708097]"
        >
          <input
            id="remember"
            type="checkbox"
            className="h-[14px] w-[14px] rounded-[4px] border border-[#8994a9] accent-[#00c8ff]"
          />
          <span>Lembrar de mim</span>
        </label>
        <Link
          to="/recovery-password"
          className="font-['Noto_Sans',sans-serif] text-xs font-bold text-[#00c8ff] hover:underline"
        >
          Esqueci minha senha
        </Link>
      </div>

      {errors.root && (
        <p className="text-center text-xs text-red-500">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 h-10 w-[150px] justify-self-center rounded-[5px] bg-[#00c8ff] font-['Noto_Sans',sans-serif] text-xs font-bold tracking-[0.03em] text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? 'Entrando...' : 'ENTRAR'}
      </button>
    </form>
  )
}
