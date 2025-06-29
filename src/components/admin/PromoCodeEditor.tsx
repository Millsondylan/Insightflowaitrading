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
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface PromoCode {
  id: string;
  code: string;
  expiresAt: string;
  usesLeft: number;
}

interface Props {
  codes: PromoCode[];
  onGenerate: (code: string) => void;
  onRevoke: (codeId: string) => void;
}

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

  const generateNewCode = () => {
    const code = "NEW" + Math.random().toString(36).substring(7).toUpperCase();
    onGenerate(code);
  };

  return (
    <Div className="bg-black/30 rounded-xl p-6 border border-white/10 text-sm text-white space-y-4">
      <Div className="flex justify-between items-center">
        <H2 className="text-lg font-semibold text-white">Promo Codes</Div>
        
        <Button onClick={generateNewCode}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
      >
          <Plus className="h-4 w-4 mr-2" />
          Generate Code
        </Button>
      </Div>

      <Div className="rounded-lg border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</Div>
              <TableHead>Expires</TableHead>
              <TableHead>Uses Left</TableHead>
              <TableHead className="text-right" />Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500" />
                  No active promo codes. Generate a new code to get started.
                </TableBody>
              </TableRow>
            ) : (
              codes.map((code) => {
                const isExpired = new Date(code.expiresAt) < new Date();
                const isLowUses = code.usesLeft < 5;

                return (
                  <TableRow key={code.id} className="hover:bg-white/5 border-white/10" />
                    <TableCell className="font-mono" />
                      <Div className="flex items-center gap-2">
                        <Span className={cn(
                          "text-sm",
                          isExpired ? "text-red-400" : isLowUses ? "text-yellow-400" : "text-green-400"
                        )}>
                          {code.code}
                        </TableRow>
                      </Div>
                    </TableCell>
                    <TableCell>
                      {new Date(code.expiresAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {code.usesLeft}
                    </TableCell>
                    <TableCell className="text-right" />
                      <Button onClick={() = /> onRevoke(code.id)}
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-400 hover:text-white hover:bg-red-900/50"
                      >
                        <Trash2 className="h-4 w-4" /></TableCell>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
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