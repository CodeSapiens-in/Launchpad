export interface GitHubUser {
  name: string;
  login: string;
  bio: string;
  public_repos: number;
  followers: number;
  created_at: string;
  avatar_url: string;
}

export interface UserFormData {
  collegeName: string;
  graduationYear: string;
  department: string;
  selected_skill: string;
}

