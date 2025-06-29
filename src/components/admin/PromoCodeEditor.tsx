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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

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
    <div className="bg-black/30 rounded-xl p-6 border border-white/10 text-sm text-white space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">Promo Codes</h2>
        
        <Button onClick={onGenerate}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
       >
          <plus className="h-4 w-4 mr-2" />
          Generate New Code
        </Button>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table>
          <tableHeader>
            <tableRow className="hover:bg-white/5">
              <tableHead className="text-white/70 font-medium">Code</TableHead>
              <tableHead className="text-white/70 font-medium">Expires</TableHead>
              <tableHead className="text-white/70 font-medium">Uses Left</TableHead>
              <tableHead className="text-white/70 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <tableBody>
            {codes.length > 0 ? (
              codes.map((code) => {
                const daysRemaining = getDaysRemaining(code.expiresAt);
                const isExpiringSoon = daysRemaining <= 5 && daysRemaining > 0;
                const isExpired = daysRemaining <= 0;

                return (
                  <tableRow key={code.code} className="hover:bg-white/5 border-white/10">
                    <tableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        {code.code}
                        <Button  onClick={() => handleCopyCode(code.code)}
                          className="text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <tableCell>
                      <div className="flex flex-col">
                        <span className={isExpired ? "text-red-400" : isExpiringSoon ? "text-yellow-400" : ""}>
                          {formatDate(code.expiresAt)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {isExpired ? (
                            "Expired"
                          ) : (
                            `${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left`
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <tableCell>
                      <span className={code.usesLeft <= 3 ? "text-amber-400" : "text-white"}>
                        {code.usesLeft}
                      </span>
                    </TableCell>
                    <tableCell className="text-right">
                      <Button  onClick={() => onRevoke(code.code)}
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-900/50"
                      >
                        <trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tableRow>
                <tableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No active promo codes. Generate a new code to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
      
      <div className="text-xs text-gray-500">
        {codes.length > 0
          ? `${codes.length} active promo code${codes.length !== 1 ? "s" : ""}`
          : "No active promo codes"}
      </div>
    </div>
  );
} 