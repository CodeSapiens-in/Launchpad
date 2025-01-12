import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

const skills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Java",
  "C++",
];

export default async function SkillSelectionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  async function updateSkillAndStage(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const selectedSkill = formData.get("skill") as string;
    
    const { error } = await supabase
      .from("user_profiles")
      .upsert({ 
        user_id: user?.id, 
        selected_skill: selectedSkill,
        stage: -1  // Move to evaluation stage
      });

    if (error) {
      console.error("Error updating skill:", error);
      return;
    }

    redirect("/evaluation");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Select Your Primary Skill</h1>
      <form action={updateSkillAndStage} className="w-full max-w-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill} className="flex items-center">
              <input
                type="radio"
                id={skill}
                name="skill"
                value={skill}
                className="hidden peer"
                required
              />
              <label
                htmlFor={skill}
                className="w-full p-4 text-center border rounded-lg cursor-pointer
                         peer-checked:bg-primary peer-checked:text-primary-foreground
                         hover:bg-muted transition-colors"
              >
                {skill}
              </label>
            </div>
          ))}
        </div>
        <Button type="submit" className="w-full mt-8">
          Continue
        </Button>
      </form>
    </div>
  );
}
