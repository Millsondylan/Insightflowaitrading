import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
    <Div className="bg-black/30 rounded-xl p-6 border border-white/10 text-sm text-white space-y-4">
      <Div className="flex justify-between items-center">
        <H2 className="text-lg font-semibold text-white">Promo Codes</Div>
        
        <Button  style={{ color: "white" }}>
          <Plus>
          Generate New Code
        </Button>
      </Div>

      <Div className="rounded-lg border border-white/10 overflow-hidden">
        <Table  />
          <Tableheader >
            <Tablerow  /></Div>
              <tablehead >Code</TableHead>
              <tablehead >Expires</TableHead>
              <tablehead >Uses Left</TableHead>
              <tablehead >Actions</TableHead>
            </TableRow>
          </TableHeader>
          <tablebody >
            {codes.length > 0 ? (
              codes.map((code) => {
                const daysRemaining = getDaysRemaining(code.expiresAt);
                const isExpiringSoon = daysRemaining <= 5 && daysRemaining > 0;
                const isExpired = daysRemaining <= 0;

                return (
                  <tablerow >
                    <tablecell >
                      <Div className="flex items-center gap-2">
                        {code.code}
                        <Button  onClick={() => handleCopyCode(code.code)}
                          className="text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          <copy >
                        </Div>
                      </Div>
                    </TableCell>
                    <tablecell >
                      <Div className="flex flex-col">
                        <Span className={isExpired ? "text-red-400" : isExpiringSoon ? "text-yellow-400" : ""}>
                          {formatDate(code.expiresAt)}
                        </Div>
                        <Span className="text-xs text-gray-500">
                          {isExpired ? (
                            "Expired"
                          ) : (
                            `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left`
                          )}
                        </Span>
                      </Div>
                    </TableCell>
                    <tablecell >
                      <Span className={code.usesLeft <= 3 ? "text-amber-400" : "text-white"}>
                        {code.usesLeft}
                      </Span>
                    </TableCell>
                    <tablecell >
                      <Button > onRevoke(code.code)}
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-900/50"
                      >
                        <trash2 >
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tablerow >
                <tablecell >
                  No active promo codes. Generate a new code to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Div>
      
      <Div className="text-xs text-gray-500">
        {codes.length > 0
          ? `${codes.length} active promo code${codes.length !== 1 ? "s" : ""}`
          : "No active promo codes"}
      </Div>
    </Div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
