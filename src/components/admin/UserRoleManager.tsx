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
  const [filteredUsers, setFilteredUsers] = React.useState<User[]>(users);

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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-white/5">
              <TableHead className="text-white/70 font-medium">ID</TableHead>
              <TableHead className="text-white/70 font-medium">Email</TableHead>
              <TableHead className="text-white/70 font-medium">Current Role</TableHead>
              <TableHead className="text-white/70 font-medium">Manage Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="hover:bg-white/5 border-white/10">
                <TableCell className="font-mono text-xs text-white/50">
                  {user.id.substring(0, 8)}...
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getRoleBadgeColor(user.role)}
                  >
                    {user.role.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={user.role}
                    onValueChange={(value) => onRoleChange(user.id, value as User["role"])}
                  >
                    <SelectTrigger className="bg-black/50 border-white/10 text-white w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white border-white/10">
                      <SelectItem value="user" className="text-gray-200 focus:bg-gray-800 focus:text-white">
                        User
                      </SelectItem>
                      <SelectItem value="mod" className="text-blue-400 focus:bg-gray-800 focus:text-white">
                        Moderator
                      </SelectItem>
                      <SelectItem value="admin" className="text-green-400 focus:bg-gray-800 focus:text-white">
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
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