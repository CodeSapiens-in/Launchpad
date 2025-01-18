import { getGitHubProfile } from '../actions'
import { WelcomeScreen } from '@/components/welcome-screen'
import { UserFormData } from '@/types/github';
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function WelcomePage() {

  const supabase = await createClient();
    
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  
  const githubUser = await getGitHubProfile(user.user_metadata?.user_name || '');


  const handleSubmit = async (formData: FormData) => {
   "use server";
    console.log('Form submitted:', formData)

    const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const username= user?.user_metadata?.user_name || '';
  if (username === '') {
    return redirect("/sign-in");
  }
    // Update the user profile in Supabase
    const { data, error } = await supabase
    .from("user_profiles")
    .upsert({  
      user_id: user?.id,
      college_name: formData['collegeName'],
      graduation_year: formData['graduationYear'],
      department: formData['department'],
      selected_skill: formData['selected_skill'],
      })
      .eq('user_id', user?.id); // Assuming you have a user ID to match

    if (error) {
      console.error('Error updating profile:', error)
      // Handle error (e.g., show a message to the user)
    } else {
      console.log('Profile updated successfully:', data)
      // Redirect to evaluation page
     redirect("/evaluation"); // Adjust the path as necessary
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen">
  <WelcomeScreen githubUser={githubUser} action={handleSubmit} />
  </div>
  )
}

