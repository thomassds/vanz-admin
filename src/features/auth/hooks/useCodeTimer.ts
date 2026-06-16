import { useCallback, useEffect, useState } from 'react'

export function useCodeTimer(seconds = 60) {
  const [secondsLeft, setSecondsLeft] = useState(seconds)

  useEffect(() => {
    if (secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft((value) => value - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [secondsLeft])

  const restart = useCallback(() => setSecondsLeft(seconds), [seconds])

  return { secondsLeft, canResend: secondsLeft <= 0, restart }
}
