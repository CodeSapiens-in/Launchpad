import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LearningPlan from '@/components/learning-plan';

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
    return redirect("/welcome");
  }

  if (profile.stage === -2) {
    return redirect("/welcome");
  } else if (profile.stage === -1) {
    return redirect("/evaluation");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
    <LearningPlan />
    </div>
  );
}
