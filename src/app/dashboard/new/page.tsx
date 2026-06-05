"use client";

import * as React from "react";
import { RequireAuth } from "@/components/auth/require-auth";
import { PageHeader } from "@/components/common/page-header";
import { CreateWizard } from "@/components/dashboard/create-wizard";

export default function NewBountyPage() {
  return (
    <RequireAuth>
      <div className="container max-w-2xl py-12">
        <PageHeader
          title="Post a bounty"
          description="Pick an issue, set a USDC reward, and fund the escrow."
        />
        <div className="mt-8">
          <React.Suspense fallback={null}>
            <CreateWizard />
          </React.Suspense>
        </div>
      </div>
    </RequireAuth>
  );
}
