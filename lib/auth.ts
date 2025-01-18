import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"; // For accessing cookies in a server component

export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies });

  // Fetch session from Supabase
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }

  return session;
}
