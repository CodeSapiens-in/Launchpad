import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { WelcomeScreen } from "@/components/welcome-screen";
import { getGitHubProfile } from '../actions';

export default async function WelcomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const githubUser = await getGitHubProfile(user.user_metadata?.user_name || '');

  async function handleSubmit(formData: FormData) {
    "use server";
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    // Update the user profile in Supabase
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: user.id,
        college_name: formData.get('collegeName')?.toString() || '',
        graduation_year: formData.get('graduationYear')?.toString() || '',
        department: formData.get('department')?.toString() || '',
        selected_skill: formData.get('selected_skill')?.toString() || '',
        stage: -1, // Set to evaluation stage
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return;
    }

    return redirect("/evaluation");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <WelcomeScreen githubUser={githubUser} action={handleSubmit} />
    </div>
  );
}

