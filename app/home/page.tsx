import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user's name from metadata, fallback to email if not available
  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">
        Welcome, {userName}!
      </h1>
    </div>
  );
}
