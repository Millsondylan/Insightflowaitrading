import * as React from "react";

import UserRoleManager from "@/components/admin/UserRoleManager";
import PromoCodeEditor from "@/components/admin/PromoCodeEditor";
import UsageLogViewer from "@/components/admin/UsageLogViewer";
import { generatePromoCode } from "@/lib/admin/generatePromoCode";

// Mock data
const mockUsers = [
  { id: "user1", email: "john.doe@example.com", role: "user" as const },
  { id: "user2", email: "jane.smith@example.com", role: "user" as const },
  { id: "user3", email: "alex.admin@example.com", role: "admin" as const },
  { id: "user4", email: "sarah.mod@example.com", role: "mod" as const },
  { id: "user5", email: "mike.johnson@example.com", role: "user" as const },
  { id: "user6", email: "lisa.williams@example.com", role: "user" as const },
  { id: "user7", email: "david.wilson@example.com", role: "mod" as const },
  { id: "user8", email: "emma.davis@example.com", role: "user" as const },
];

// Create expiry dates for promo codes
const today = new Date();
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);
const nextMonth = new Date(today);
nextMonth.setMonth(today.getMonth() + 1);
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const mockPromoCodes = [
  { code: "SUMMER23", expiresAt: nextMonth.toISOString(), usesLeft: 50 },
  { code: "WELCOME15", expiresAt: nextWeek.toISOString(), usesLeft: 3 },
  { code: "FLASHSALE", expiresAt: yesterday.toISOString(), usesLeft: 0 },
];

// Create timestamps for logs
const createLogTime = (minutesAgo: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutesAgo);
  return date.toISOString();
};

const mockLogs = [
  { id: "log1", userEmail: "john.doe@example.com", action: "Login successful", timestamp: createLogTime(5) },
  { id: "log2", userEmail: "alex.admin@example.com", action: "Changed user role", timestamp: createLogTime(15) },
  { id: "log3", userEmail: "jane.smith@example.com", action: "API request: /trading/strategy", timestamp: createLogTime(25) },
  { id: "log4", userEmail: "sarah.mod@example.com", action: "Generated promo code", timestamp: createLogTime(35) },
  { id: "log5", userEmail: "mike.johnson@example.com", action: "Feature access: Advanced Strategies", timestamp: createLogTime(45) },
  { id: "log6", userEmail: "lisa.williams@example.com", action: "Login successful", timestamp: createLogTime(55) },
  { id: "log7", userEmail: "john.doe@example.com", action: "API request: /data/historical", timestamp: createLogTime(65) },
  { id: "log8", userEmail: "emma.davis@example.com", action: "API request failed: Rate limit exceeded", timestamp: createLogTime(75) },
  { id: "log9", userEmail: "david.wilson@example.com", action: "Warning: Multiple login attempts", timestamp: createLogTime(85) },
  { id: "log10", userEmail: "alex.admin@example.com", action: "System settings updated", timestamp: createLogTime(95) },
  { id: "log11", userEmail: "jane.smith@example.com", action: "Subscription renewed", timestamp: createLogTime(105) },
  { id: "log12", userEmail: "sarah.mod@example.com", action: "Support ticket created", timestamp: createLogTime(115) },
  { id: "log13", userEmail: "mike.johnson@example.com", action: "Error: Payment processing failed", timestamp: createLogTime(125) },
  { id: "log14", userEmail: "john.doe@example.com", action: "Feature access: Strategy Copilot", timestamp: createLogTime(135) },
  { id: "log15", userEmail: "lisa.williams@example.com", action: "Login successful", timestamp: createLogTime(145) },
];

export default function AdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = React.useState(mockUsers);
  const [promoCodes, setPromoCodes] = React.useState(mockPromoCodes);
  const [logs, setLogs] = React.useState(mockLogs);

  // Handle role change
  const handleRoleChange = (id: string, newRole: "admin" | "mod" | "user") => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    ));
    
    // Add log entry for role change
    const user = users.find(u => u.id === id);
    if (user) {
      const newLog = {
        id: `log${logs.length + 1}`,
        userEmail: user.email,
        action: `Role changed to ${newRole}`,
        timestamp: new Date().toISOString()
      };
      
      setLogs([newLog, ...logs]);
      
      toast({
        title: "Role Updated",
        description: `${user.email} is now a ${newRole}.`,
      });
    }
  };

  // Handle promo code generation
  const handleGeneratePromoCode = () => {
    const code = generatePromoCode();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now
    
    const newPromoCode = {
      code,
      expiresAt: expiryDate.toISOString(),
      usesLeft: 25
    };
    
    setPromoCodes([newPromoCode, ...promoCodes]);
    
    // Add log entry for code generation
    const newLog = {
      id: `log${logs.length + 1}`,
      userEmail: "admin@insightflow.ai", // Assume current admin user
      action: `Created promo code: ${code}`,
      timestamp: new Date().toISOString()
    };
    
    setLogs([newLog, ...logs]);
    
    toast({
      title: "Code Generated",
      description: `New promo code ${code} created.`,
    });
  };

  // Handle promo code revocation
  const handleRevokePromoCode = (code: string) => {
    setPromoCodes(promoCodes.filter(c => c.code !== code));
    
    // Add log entry for code revocation
    const newLog = {
      id: `log${logs.length + 1}`,
      userEmail: "admin@insightflow.ai", // Assume current admin user
      action: `Revoked promo code: ${code}`,
      timestamp: new Date().toISOString()
    };
    
    setLogs([newLog, ...logs]);
    
    toast({
      title: "Code Revoked",
      description: `Promo code ${code} has been revoked.`,
    });
  };

  return (
    <div style={{ width: "100%", marginLeft: "auto", marginRight: "auto", paddingTop: "32px", paddingBottom: "32px", paddingLeft: "16px", paddingRight: "16px" }}>
      <div >
        <header style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: "white", marginBottom: "16px" }}>Admin Dashboard</h1>
          <p >
            Manage users, promo codes, and view system usage logs.
          </p>
        </header>

        <Tabs defaultValue="users">
          <TabsList style={{ marginBottom: "32px", border: "1px solid #374151" }}>
            <TabsTrigger value="users" style={{ display: "flex", alignItems: "center" }}>
              <span style={{fontSize: '16px'}}>🛡️</span>
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="promo" style={{ display: "flex", alignItems: "center" }}>
              <Ticket  />
              <span>Promo Codes</span>
            </TabsTrigger>
            <TabsTrigger value="logs" style={{ display: "flex", alignItems: "center" }}>
              <Activity  />
              <span>Usage Logs</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <span style={{fontSize: '16px'}}>👤</span>
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