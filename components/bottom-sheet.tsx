import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  task: { name: string; link: string } | null
}

export default function BottomSheet({ isOpen, onClose, task }: BottomSheetProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(isOpen)

  useEffect(() => {
    setIsSheetOpen(isOpen)
  }, [isOpen])

  const handleOpenChange = (open: boolean) => {
    setIsSheetOpen(open)
    if (!open) onClose()
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="bottom" className="h-[50vh] sm:h-[40vh]">
        <SheetHeader>
          <SheetTitle>{task?.name}</SheetTitle>
          <SheetDescription>
            Learn more about this topic and access helpful resources.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <p className="text-sm mb-4">
            This task is an important part of your learning journey. Click the button below to access a helpful resource for this topic.
          </p>
          <Button asChild>
            <a href={task?.link} target="_blank" rel="noopener noreferrer">
              Open Resource
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

