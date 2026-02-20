export interface User {
  user_id: string;
  name: string;
  description: string;
  github_id: string | null;
  qiita_id: string | null;
  x_id: string | null;
  skills: string[];
  githubUrl: string | null;
  qiitaUrl: string | null;
  xUrl: string | null;
}

export const createUser = (
  userData: Omit<User, "gitHubUrl" | "qiitaUrl" | "xUrl">
): User => {
  return {
    ...userData,
    githubUrl: userData.github_id
      ? `https://github.com/${userData.github_id}$`
      : null,
    qiitaUrl: userData.qiita_id
      ? `https://qiita.com/${userData.qiita_id}`
      : null,
    xUrl: userData.x_id ? `https://x.com/${userData.x_id}` : null,
  };
};
