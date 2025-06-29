import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, Ticket, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import UserRoleManager from "@/components/admin/UserRoleManager";
import PromoCodeEditor from "@/components/admin/PromoCodeEditor";
import UsageLogViewer from "@/components/admin/UsageLogViewer";
import { generatePromoCode } from "@/lib/admin/generatePromoCode";

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'mod';
}

interface PromoCode {
  id: string;
  code: string;
  expiresAt: string;
  usesLeft: number;
}

interface UsageLog {
  id: string;
  userEmail: string;
  action: string;
  timestamp: string;
}

const mockUsers: User[] = [
  { id: '1', email: 'user@example.com', role: 'user' },
  { id: '2', email: 'admin@example.com', role: 'admin' },
  { id: '3', email: 'mod@example.com', role: 'mod' }
];

const mockPromoCodes: PromoCode[] = [
  { id: '1', code: 'WELCOME10', expiresAt: '2024-12-31', usesLeft: 100 },
  { id: '2', code: 'SUMMER20', expiresAt: '2024-06-30', usesLeft: 50 }
];

const mockLogs: UsageLog[] = [
  { id: '1', userEmail: 'user@example.com', action: 'Logged in', timestamp: '2024-01-01T00:00:00Z' },
  { id: '2', userEmail: 'admin@example.com', action: 'Created promo code', timestamp: '2024-01-02T00:00:00Z' }
];

export default function AdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState(mockUsers);
  const [promoCodes, setPromoCodes] = React.useState(mockPromoCodes);
  const [logs, setLogs] = React.useState(mockLogs);

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast({
      title: "User Updated",
      description: `Successfully updated user role.`
    });
  };

  const handleGeneratePromoCode = (code: string) => {
    const newCode: PromoCode = {
      id: String(promoCodes.length + 1),
      code,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usesLeft: 100
    };
    setPromoCodes([...promoCodes, newCode]);
    toast({
      title: "Promo Code Created",
      description: `Successfully created code ${code}.`
    });
  };

  const handleRevokePromoCode = (codeId: string) => {
    setPromoCodes(promoCodes.filter(c => c.id !== codeId));
    toast({
      title: "Promo Code Revoked",
      description: "Successfully revoked promo code."
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="theme-admin">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
          <p className="text-white/70">
            Manage users, promo codes, and view system usage logs.
          </p>
        </header>

        <Tabs defaultValue="users">
          <TabsList className="mb-8 grid grid-cols-3 bg-black/30 border border-white/10 p-1">
            <TabsTrigger value="users" className="flex items-center gap-2 data-[state=active]:bg-cyan-600">
              <ShieldCheck className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="promo" className="flex items-center gap-2 data-[state=active]:bg-cyan-600">
              <Ticket className="h-4 w-4" />
              <span>Promo Codes</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2 data-[state=active]:bg-cyan-600">
              <Activity className="h-4 w-4" />
              <span>Usage Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserRoleManager users={users} onRoleChange={handleRoleChange} />
          </TabsContent>

          <TabsContent value="promo">
            <PromoCodeEditor 
              codes={promoCodes} 
              onGenerate={handleGeneratePromoCode} 
              onRevoke={handleRevokePromoCode} 
            />
          </TabsContent>

          <TabsContent value="logs">
            <UsageLogViewer logs={logs} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 