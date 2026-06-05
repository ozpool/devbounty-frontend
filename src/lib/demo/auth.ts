/**
 * Demo-only auth flag. Lives at module scope so the (non-React) demo resolver
 * can read it, and is persisted so a sign-out survives a reload. Lets the demo
 * walk a real sign in -> out -> in flow without a wallet.
 */
const KEY = "devbounty-demo-auth";

function read(): boolean {
  if (typeof window === "undefined") return true; // default: land signed in
  return localStorage.getItem(KEY) !== "out";
}

let signedIn = read();

export const demoAuth = {
  isSignedIn: () => signedIn,
  setSignedIn(value: boolean) {
    signedIn = value;
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, value ? "in" : "out");
    }
  },
};
