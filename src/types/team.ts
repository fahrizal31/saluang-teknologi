export interface TeamMember {
  id: string;
  name: string;
  role: string;
  roleCategory: 'leadership' | 'engineering' | 'design';
  bio: string;
  avatarUrl: string;
  linkedinUrl?: string;
  githubUrl?: string;
}
