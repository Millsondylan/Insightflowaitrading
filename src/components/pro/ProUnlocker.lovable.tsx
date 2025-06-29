import { useState } from "react";
import { checkProAccess } from "@/lib/pro/checkProAccess";

type Props = {
  onUnlock: () => void;
};

export default function ProUnlocker({ onUnlock }: Props) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");

  const handleUnlock = async () => {
    setStatus("checking");
    const isValid = await checkProAccess(code);
    setStatus(isValid ? "valid" : "invalid");
    if (isValid) onUnlock();
  };

  return (
    <div className="bg-black/30 p-6 rounded-xl border border-white/10 text-white space-y-4">
      <p className="text-white/80">🔒 This feature is for Pro users only.</p>
      <input value={code}
        onChange={(e) = /> setCode(e.target.value)}
        placeholder="Enter access code or referral"
        className="bg-white/10 px-4 py-2 rounded w-full"
      />
      <Button onClick={handleUnlock}
        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full"
    >
        🚀 Unlock Pro
      </Button>
      {status === "invalid" && <p className="text-red-400">❌ Invalid code</p>}
    </div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
