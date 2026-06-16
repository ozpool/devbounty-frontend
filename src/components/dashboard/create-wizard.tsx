"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Info, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { isUserRejection, useFundBounty } from "@/hooks/use-escrow";
import { bountiesApi, ApiError } from "@/lib/api";
import { isEscrowConfigured } from "@/lib/contracts";
import { fetchRepoId } from "@/lib/github";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { cn, formatUsdc } from "@/lib/utils";

const STEPS = ["Issue", "Reward", "Review"];
const LANGS = SUPPORTED_LANGUAGES;
const DRAFT_KEY = "devbounty-draft";

interface Draft {
  repo: string;
  issueNumber: string;
  issueTitle: string;
  issueUrl: string;
  amount: string;
  language: string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export function CreateWizard() {
  const params = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { fund, step: fundStep } = useFundBounty();
  const repoId = params.get("repoId");

  const [step, setStep] = React.useState(0);
  const [funding, setFunding] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>({
    repo: params.get("repo") ?? "",
    issueNumber: "",
    issueTitle: "",
    issueUrl: "",
    amount: "",
    language: "TypeScript",
  });

  // Restore a draft on mount; persist on change (survives a refresh mid-flow).
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) setDraft((d) => ({ ...d, ...JSON.parse(saved) }));
    } catch {
      /* ignore corrupt drafts */
    }
  }, []);
  React.useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* storage may be unavailable */
    }
  }, [draft]);

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  // The backend requires a valid http(s) Issue URL, so block step 0 until it is one.
  const isValidUrl = (s: string) => {
    try {
      const u = new URL(s);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };
  const urlInvalid = draft.issueUrl.length > 0 && !isValidUrl(draft.issueUrl);
  const canNext =
    step === 0
      ? Boolean(
          draft.repo &&
          draft.issueNumber &&
          draft.issueTitle &&
          isValidUrl(draft.issueUrl),
        )
      : step === 1
        ? Number(draft.amount) > 0
        : true;

  const handleFund = async () => {
    setFunding(true);
    // The off-chain record is created before the wallet step (the backend
    // derives the bountyId we deposit against). Track it so that, if funding
    // doesn't complete, we can discard a record that has no USDC behind it.
    let created: Awaited<ReturnType<typeof bountiesApi.create>> | undefined;
    try {
      // The dashboard passes a known repo id via the URL; a manually typed repo
      // has none, so resolve it from GitHub before the backend rejects a zero id.
      const githubRepoId = Number(repoId) || (await fetchRepoId(draft.repo)) || 0;
      if (!githubRepoId) {
        toast.error(
          "Repository not found",
          `Couldn't find "${draft.repo}" on GitHub. Check the owner/repo spelling.`,
        );
        return;
      }
      created = await bountiesApi.create({
        repoFullName: draft.repo,
        githubRepoId,
        issueNumber: Number(draft.issueNumber),
        issueTitle: draft.issueTitle,
        issueUrl: draft.issueUrl,
        amountUsdc: draft.amount,
        language: draft.language,
      });
      const txHash = await fund(created.bountyId as `0x${string}`, draft.amount);
      localStorage.removeItem(DRAFT_KEY);
      // Fast-path the bounty onto the board and persist the funding tx hash so
      // the detail page can link it. The indexer stays canonical, so a failure
      // here is non-fatal — it converges on its own.
      await bountiesApi
        .depositRecorded(created.bountyId, txHash)
        .catch(() => undefined);
      toast.success(
        "Bounty funded",
        `USDC locked in escrow · tx ${txHash.slice(0, 10)}…`,
      );
      router.push(`/bounties/${created.bountyId}`);
    } catch (e) {
      // Funding failed or was dismissed, so no USDC was escrowed. Discard the
      // orphan record so it never lingers as an unfunded bounty. cancel()
      // self-guards — it only removes a record the chain confirms is unfunded,
      // so it's a no-op in the rare case the deposit actually landed.
      if (created) {
        await bountiesApi.cancel(created.bountyId).catch(() => {
          /* deposit may have landed after all; leave the record alone */
        });
      }
      if (isUserRejection(e)) {
        toast.info("Funding cancelled", "No USDC was deposited — you can try again.");
      } else {
        toast.error(
          "Funding failed",
          e instanceof ApiError
            ? e.message
            : "The deposit didn't go through and no USDC was charged. Please try again.",
        );
      }
    } finally {
      setFunding(false);
    }
  };

  const fundLabel =
    fundStep === "approving"
      ? "Approving USDC…"
      : fundStep === "creating"
        ? "Funding escrow…"
        : "Approve & fund";

  return (
    <div className="ring-gradient rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
      <ol className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <li className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  i <= step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s}
              </span>
            </li>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-border" />}
          </React.Fragment>
        ))}
      </ol>

      <div className="mt-8 space-y-4">
        {step === 0 && (
          <>
            <Field label="Repository">
              <Input
                value={draft.repo}
                onChange={(e) => set({ repo: e.target.value })}
                placeholder="owner/repo"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Issue number">
                <Input
                  type="number"
                  value={draft.issueNumber}
                  onChange={(e) => set({ issueNumber: e.target.value })}
                  placeholder="482"
                />
              </Field>
              <Field label="Issue URL">
                <Input
                  type="url"
                  value={draft.issueUrl}
                  onChange={(e) => set({ issueUrl: e.target.value })}
                  placeholder="https://github.com/…/issues/482"
                />
                {urlInvalid && (
                  <span className="text-xs text-danger">
                    Enter a full URL starting with http:// or https://
                  </span>
                )}
              </Field>
            </div>
            <Field label="Issue title">
              <Input
                value={draft.issueTitle}
                onChange={(e) => set({ issueTitle: e.target.value })}
                placeholder="Race condition in webhook verification"
              />
            </Field>
          </>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Reward (USDC)">
              <Input
                type="number"
                min={0}
                value={draft.amount}
                onChange={(e) => set({ amount: e.target.value })}
                placeholder="1000"
              />
            </Field>
            <Field label="Primary language">
              <Select
                value={draft.language}
                onChange={(e) => set({ language: e.target.value })}
              >
                {LANGS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <dl className="divide-y divide-border rounded-xl border border-border">
              {[
                ["Repository", draft.repo || "—"],
                ["Issue", `#${draft.issueNumber} · ${draft.issueTitle || "—"}`],
                ["Reward", `$${formatUsdc(draft.amount)} USDC`],
                ["Language", draft.language],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                >
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>

            {isEscrowConfigured ? (
              <Button
                className="w-full"
                size="lg"
                disabled={funding}
                onClick={handleFund}
              >
                {funding ? <Spinner /> : <Wallet className="h-4 w-4" />}
                {fundLabel}
              </Button>
            ) : (
              <>
                <div className="flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm text-warning">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Funding approves USDC and locks it in the escrow contract. The
                    contract isn&apos;t deployed yet, so this step is disabled — the
                    rest of the flow is ready for it.
                  </span>
                </div>
                <Button className="w-full" size="lg" disabled>
                  <Wallet className="h-4 w-4" />
                  Approve &amp; fund (awaiting contract)
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step < STEPS.length - 1 && (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
