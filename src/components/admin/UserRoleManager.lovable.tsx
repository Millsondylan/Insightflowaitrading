import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type User = { id: string; email: string; role: "admin" | "mod" | "user" };

type Props = {
  users: User[];
  onRoleChange: (id: string, newRole: User["role"]) => void;
};

export default function UserRoleManager({ users, onRoleChange }: Props) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredUsers, setFilteredUsers] = React.useState<User >(users);

  // Filter users when search query changes
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Get role badge color
  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-green-900/30 text-green-400 border-green-400/30";
      case "mod":
        return "bg-blue-900/30 text-blue-400 border-blue-400/30";
      case "user":
        return "bg-gray-900/30 text-gray-400 border-gray-400/30";
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-400/30";
    }
  };

  return (
    <div className="bg-black/30 rounded-xl p-6 border border-white/10 text-sm text-white space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">User Management</h2>
        
        {/* Search input */}
        <div className="relative">
          <Search  />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table  >
          <tableheader  >
            <tablerow  >
              <tablehead  >ID</TableHead>
              <tablehead  >Email</TableHead>
              <tablehead  >Current Role</TableHead>
              <tablehead  >Manage Role</TableHead>
            </TableRow>
          </TableHeader>
          <tablebody  >
            {filteredUsers.map((user) => (
              <tablerow  >
                <tablecell  style={{ fontSize: "0.75rem" }}>
                  {user.id.substring(0, 8)}...
                </TableCell>
                <tablecell  >{user.email}</TableCell>
                <tablecell  >
                  <badge variant="outline" >
                    {user.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <tablecell  >
                  <select  > onRoleChange(user.id, value as User["role"])}
                  >
                    <selecttrigger  style={{ color: "white" }}>
                      <selectvalue  >
                    </SelectTrigger>
                    <selectcontent  style={{ color: "white" }}>
                      <selectitem value="user" >
                        User
                      </SelectItem>
                      <selectitem value="mod" >
                        Moderator
                      </SelectItem>
                      <selectitem value="admin" >
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <tablerow  >
                <tablecell  >
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-xs text-gray-500">
        Showing {filteredUsers.length} of {users.length} users
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
