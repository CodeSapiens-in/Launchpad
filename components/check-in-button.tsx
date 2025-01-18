import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'

interface CheckInButtonProps {
  streak: number
  onCheckIn: () => void
}

export default function CheckInButton({ streak, onCheckIn }: CheckInButtonProps) {
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null)
  const [canCheckIn, setCanCheckIn] = useState(true)

  useEffect(() => {
    const storedLastCheckIn = localStorage.getItem('lastCheckIn')
    if (storedLastCheckIn) {
      setLastCheckIn(new Date(storedLastCheckIn))
    }
  }, [])

  useEffect(() => {
    if (lastCheckIn) {
      const now = new Date()
      const timeSinceLastCheckIn = now.getTime() - lastCheckIn.getTime()
      const hoursSinceLastCheckIn = timeSinceLastCheckIn / (1000 * 60 * 60)
      setCanCheckIn(hoursSinceLastCheckIn >= 24)
    }
  }, [lastCheckIn])

  const handleCheckIn = () => {
    if (canCheckIn) {
      const now = new Date()
      setLastCheckIn(now)
      localStorage.setItem('lastCheckIn', now.toISOString())
      setCanCheckIn(false)
      onCheckIn()
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={handleCheckIn} disabled={!canCheckIn}>
        Check In
      </Button>
      <span className="text-sm font-medium">Streak: {streak} days</span>
    </div>
  )
}

