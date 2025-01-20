import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ExternalLink, X } from "lucide-react"

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  task: { name: string; link: string } | null;
}

export default function BottomSheet({ isOpen, onClose, task }: BottomSheetProps) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] animate-in">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold pr-8">{task.name}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60"
            onClick={() => window.open(task.link, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Resource
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

