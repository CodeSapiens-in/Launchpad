import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EvaluationForm } from "@/components/EvaluationForm";


import fs from 'fs';
import path from 'path';

export default async function EvaluationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile to check selected skill
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("selected_skill")
    .eq("user_id", user.id)
    .single();

  if (!profile?.selected_skill) {
    return redirect("/skill-selection");
  }

  // Read questions from JSON file
  const questionsPath = path.join(process.cwd(), 'data', 'questions', `${profile.selected_skill.toLowerCase()}.json`);
  const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));

  async function completeEvaluation(formData: FormData) {
    "use server";
    
    const supabase = await createClient();
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    console.log('Received form data:', formData);
    const knew = parseInt(formData.get('knew') as string);
    const learnt = parseInt(formData.get('learnt') as string);
    const skipped = parseInt(formData.get('skipped') as string);
    
    const { error } = await supabase
      .from("user_profiles")
      .update({ 
        stage: 0,  // Move to learn stage
        evaluation_results: { knew, learnt, skipped }
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating stage:", error);
      return;
    }

    redirect("/learn");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-2">
          {profile.selected_skill} Questions
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Test, rate and improve your {profile.selected_skill} knowledge with these questions.
        </p>
        
        <EvaluationForm 
          questions={questionsData.questions}
          action={completeEvaluation}
        />
      
      </div>
    </div>
  );
}
