"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

type Profile = {
  displayName?: string | null;
  age?: number | null;
  sex?: string | null;
  medications?: string[];
  conditions?: string[];
};
type Consent = { type: string; withdrawn?: boolean };

export default function AccountForm() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile>({});
  const [privacy, setPrivacy] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/account");
      if (res.ok) {
        const j = await res.json();
        setProfile(j.profile ?? {});
        const consents: Consent[] = j.consents ?? [];
        setPrivacy(!consents.find((c) => c.type === "privacy_policy" && c.withdrawn));
        setProcessing(!consents.find((c) => c.type === "data_processing" && c.withdrawn));
      }
      setLoading(false);
    })();
  }, []);

  async function onSave() {
    setLoading(true);
    const consents: Consent[] = [
      { type: "privacy_policy", withdrawn: !privacy },
      { type: "data_processing", withdrawn: !processing },
    ];
    await fetch("/api/account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...profile, consents }),
    });
    setLoading(false);
  }

  if (loading) return <p className="mt-4 text-sm">Loading…</p>;

  return (
    <div className="mt-4 grid gap-3">
      <input
        className="border p-2 rounded"
        placeholder="Display name"
        value={profile.displayName ?? ""}
        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
      />
      <input
        className="border p-2 rounded"
        type="number"
        placeholder="Age"
        value={profile.age ?? ""}
        onChange={(e) =>
          setProfile({ ...profile, age: e.target.value ? Number(e.target.value) : null })
        }
      />
      <input
        className="border p-2 rounded"
        placeholder="Sex"
        value={profile.sex ?? ""}
        onChange={(e) => setProfile({ ...profile, sex: e.target.value })}
      />
      <input
        className="border p-2 rounded"
        placeholder="Medications (comma-separated)"
        value={(profile.medications ?? []).join(", ")}
        onChange={(e) =>
          setProfile({
            ...profile,
            medications: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
      />
      <input
        className="border p-2 rounded"
        placeholder="Conditions (comma-separated)"
        value={(profile.conditions ?? []).join(", ")}
        onChange={(e) =>
          setProfile({
            ...profile,
            conditions: e.target.value
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          })
        }
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} />I
        agree to the Privacy Policy
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={processing}
          onChange={(e) => setProcessing(e.target.checked)}
        />
        I consent to data processing (special category data)
      </label>

      <div className="flex gap-3">
        <button onClick={onSave} className="rounded bg-black px-4 py-2 text-white">
          Save
        </button>

        {/* Changed: use button + signOut instead of <a href="/api/auth/signout"> */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="underline text-sm"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
