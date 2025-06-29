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
    <div style={{ padding: "24px", borderRadius: "0.75rem", border: "1px solid #374151", color: "white" }}>
      <p >🔒 This feature is for Pro users only.</p>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter access code or referral"
        style={{ paddingLeft: "16px", paddingRight: "16px", width: "100%" }}
      />
      <button
        onClick={handleUnlock}
        style={{ color: "white", paddingLeft: "16px", paddingRight: "16px" }}
      >
        🚀 Unlock Pro
      </button>
      {status === "invalid" && <p >❌ Invalid code</p>}
    </div>
  );
} 