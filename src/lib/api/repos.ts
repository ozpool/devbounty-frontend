import { apiFetch } from "./client";

export interface GithubRepo {
  owner: string;
  name: string;
  fullName: string;
  githubRepoId: number;
  private?: boolean;
  htmlUrl?: string;
  hasWebhook?: boolean;
}

export const reposApi = {
  /** Repos the linked GitHub identity can administer. */
  list: () => apiFetch<{ repos: GithubRepo[] }>("/repos"),
};
