"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button-variants";
import { useSessionStore } from "@/store/session";
import { cn } from "@/lib/utils";

/** Gates a page on an authenticated session, with a clean sign-in fallback. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const status = useSessionStore((s) => s.status);
  const pathname = usePathname() ?? "/";

  if (status === "idle" || status === "loading") {
    return (
      <div className="container max-w-4xl py-12">
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (status !== "authenticated") {
    return (
      <div className="container max-w-xl py-20">
        <EmptyState
          icon={LogIn}
          title="Sign in required"
          description="Connect your wallet and sign in to view this page."
          action={
            <Link href={`/login?next=${pathname}`} className={cn(buttonVariants())}>
              Sign in
            </Link>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
}
