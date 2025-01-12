import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LearnPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile to check stage and selected skill
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("selected_skill, stage")
    .eq("user_id", user.id)
    .single();

  if (!profile?.selected_skill) {
    return redirect("/skill-selection");
  }

  if (profile.stage === -2) {
    return redirect("/skill-selection");
  } else if (profile.stage === -1) {
    return redirect("/evaluation");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Learn {profile.selected_skill}</h1>
      <div className="w-full max-w-2xl space-y-6">
        <p className="text-lg">
          Welcome to your personalized learning journey for {profile.selected_skill}!
        </p>
        {/* Add your learning content here */}
      </div>
    </div>
  );
}
