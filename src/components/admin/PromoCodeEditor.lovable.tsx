import * as React from "react";

type PromoCode = { code: string; expiresAt: string; usesLeft: number };

type Props = {
  codes: PromoCode[];
  onGenerate: () => void;
  onRevoke: (code: string) => void;
};

export default function PromoCodeEditor({ codes, onGenerate, onRevoke }: Props) {
  const { toast } = useToast();

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Calculate days remaining until expiration
  const getDaysRemaining = (dateString: string) => {
    const now = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle code copy to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Promo code copied to clipboard",
    });
  };

  return (
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ color: "white" }}>Promo Codes</h2>
        
        <Button
          onClick={onGenerate}
          style={{ color: "white" }}
        >
          <span style={{fontSize: '16px'}}>➕</span>
          Generate New Code
        </Button>
      </div>

      <div style={{ border: "1px solid #374151" }}>
        <Table>
          <TableHeader>
            <TableRow >
              <TableHead >Code</TableHead>
              <TableHead >Expires</TableHead>
              <TableHead >Uses Left</TableHead>
              <TableHead >Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.length > 0 ? (
              codes.map((code) => {
                const daysRemaining = getDaysRemaining(code.expiresAt);
                const isExpiringSoon = daysRemaining <= 5 && daysRemaining > 0;
                const isExpired = daysRemaining <= 0;

                return (
                  <TableRow key={code.code} >
                    <TableCell >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {code.code}
                        <button
                          onClick={() => handleCopyCode(code.code)}
                          style={{ color: "#9CA3AF" }}
                        >
                          <Copy  />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span className={isExpired ? "text-red-400" : isExpiringSoon ? "text-yellow-400" : ""}>
                          {formatDate(code.expiresAt)}
                        </span>
                        <span >
                          {isExpired ? (
                            "Expired"
                          ) : (
                            `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left`
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={code.usesLeft <= 3 ? "text-amber-400" : "text-white"}>
                        {code.usesLeft}
                      </span>
                    </TableCell>
                    <TableCell >
                      <Button
                        onClick={() => onRevoke(code.code)}
                        variant="ghost"
                        
                      >
                        <span style={{fontSize: '16px'}}>🗑️</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} style={{ paddingTop: "32px", paddingBottom: "32px" }}>
                  No active promo codes. Generate a new code to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div >
        {codes.length > 0
          ? `${codes.length} active promo code${codes.length !== 1 ? "s" : ""}`
          : "No active promo codes"}
      </div>
    </div>
  );
} 