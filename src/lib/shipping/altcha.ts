// ─── ALTCHA proof of work for the /ship form ─────────────────────────────────────────────────────
//
// Same self-hosted format as the CashierThru sign-up (App\Support\Altcha in Laravel): find the number n
// in 0..maxnumber whose SHA-256(salt + n) equals the challenge, then send base64(JSON) back. No third
// party and no widget: the browser solves it in the background while the visitor types.

export interface AltchaChallenge {
    algorithm: string;
    challenge: string;
    maxnumber: number;
    salt: string;
    signature: string;
}

export function isAltchaChallenge(value: unknown): value is AltchaChallenge {
    const v = value as Partial<AltchaChallenge> | null;
    return Boolean(
        v &&
            v.algorithm === "SHA-256" &&
            typeof v.challenge === "string" &&
            typeof v.salt === "string" &&
            typeof v.signature === "string" &&
            typeof v.maxnumber === "number",
    );
}

type Digest = (text: string) => Promise<string>;

const sha256Hex: Digest = async (text) => {
    const bytes = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * The payload for the `altcha` field, or null when no number up to maxnumber fits (a broken challenge)
 * or `signal` was aborted. Yields to the page every few hundred tries so typing stays smooth.
 */
export async function solveAltcha(c: AltchaChallenge, signal?: AbortSignal, digest: Digest = sha256Hex): Promise<string | null> {
    const max = Math.min(Math.max(0, Math.floor(c.maxnumber)), 10_000_000);
    for (let n = 0; n <= max; n++) {
        if (signal?.aborted) return null;
        if ((await digest(c.salt + n)) === c.challenge) {
            return encodePayload({ algorithm: c.algorithm, challenge: c.challenge, number: n, salt: c.salt, signature: c.signature });
        }
        if (n % 500 === 499) await new Promise((r) => setTimeout(r, 0));
    }
    return null;
}

function encodePayload(data: Record<string, unknown>): string {
    const json = JSON.stringify(data);
    if (typeof btoa === "function") return btoa(String.fromCharCode(...new TextEncoder().encode(json)));
    return Buffer.from(json, "utf8").toString("base64");
}
