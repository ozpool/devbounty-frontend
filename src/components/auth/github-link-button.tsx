"use client";

import { Github } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { authApi } from "@/lib/api";

/** Full-page redirect into the backend GitHub OAuth linking flow. Forces
 *  GitHub's account chooser so the user picks/confirms the account to link
 *  rather than silently reusing whichever session the browser holds. */
export function GithubLinkButton(props: ButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        window.location.href = authApi.githubStartUrl({ switch: true });
      }}
      {...props}
    >
      <Github className="h-4 w-4" />
      Link GitHub
    </Button>
  );
}
