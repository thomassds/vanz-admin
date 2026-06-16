import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-3 bg-gray-50 px-4 text-center">
      <h1 className="font-['Montserrat',sans-serif] text-5xl font-bold text-primary">404</h1>
      <p className="font-['Nunito',sans-serif] text-gray-600">
        A página que você procura não existe ou foi movida.
      </p>
      <Link
        to="/dashboard"
        className="mt-2 rounded-md bg-primary px-6 py-2.5 font-['Montserrat',sans-serif] text-sm font-bold text-white hover:bg-primary-hover"
      >
        Voltar para o início
      </Link>
    </main>
  )
}
