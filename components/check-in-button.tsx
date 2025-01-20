import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckInButtonProps {
  onClick: () => void;
  className?: string;
}

export default function CheckInButton({ onClick, className }: CheckInButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "relative group bg-gradient-to-r from-primary to-primary/70 hover:from-primary/90 hover:to-primary/60",
        "transition-all duration-300 ease-out",
        className
      )}
    >
      <CheckCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
      <span className="font-medium">Check In</span>
      
      <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 blur opacity-0 group-hover:opacity-100 transition-opacity" />
    </Button>
  );
}

