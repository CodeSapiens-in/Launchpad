"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signInWithGithubAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: 'repo:status,read:user',
    }
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return redirect("/");
  }

  if (data.url) {
    return redirect(data.url);
  }
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

import { GitHubUser } from '../types/github'

export async function getGitHubProfile(username: string): Promise<GitHubUser> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `Bearer ${data.session?.provider_token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub profile')
  }

  return response.json()
}
