import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { signInWithGithubAction } from "./actions";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to CodeSapiens</h1>
        <p className="text-muted-foreground">Sign in to continue</p>
      </div>
      <form action={signInWithGithubAction}>
        <Button
          size="lg"
          variant="outline"
          className="flex items-center gap-2 px-8 py-6 text-lg"
        >
          <FaGithub className="w-6 h-6" />
          Sign in with GitHub
        </Button>
      </form>
    </div>
  );
}
