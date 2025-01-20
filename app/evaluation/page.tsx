import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { EvaluationForm } from "@/components/EvaluationForm";
import fs from 'fs';
import path from 'path';
import { Card } from "@/components/ui/card";

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
    return redirect("/welcome");
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

    // Update user stage to indicate evaluation is complete
    await supabase
      .from("user_profiles")
      .update({ stage: 0 })
      .eq("user_id", user.id);

    // Store evaluation results
    await supabase.from("evaluation_results").insert({
      user_id: user.id,
      knew: parseInt(formData.get('knew') as string),
      learnt: parseInt(formData.get('learnt') as string),
      skipped: parseInt(formData.get('skipped') as string),
      skill: profile?.selected_skill
    });

    return redirect("/evaluation/complete");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-2xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Skill Assessment</h1>
          <p className="text-center text-muted-foreground mt-2">
            Let's understand your current knowledge level in {profile.selected_skill}
          </p>
        </div>
        
        <EvaluationForm
          questions={questionsData.questions}
          action={completeEvaluation}
        />
      </Card>
    </div>
  );
}
