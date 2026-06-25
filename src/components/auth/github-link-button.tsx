"use client";

import { Github } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { authApi } from "@/lib/api";
import { openGithubOAuth } from "@/lib/github-oauth";

/** Opens the backend GitHub OAuth linking flow in a new tab (falling back to a
 *  same-tab redirect if the browser blocks the popup). Forces GitHub's account
 *  chooser so the user picks/confirms the account to link. */
export function GithubLinkButton(props: ButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={() => openGithubOAuth(authApi.githubStartUrl({ switch: true }))}
      {...props}
    >
      <Github className="h-4 w-4" />
      Link GitHub
    </Button>
  );
}
