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
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ChangeEvent } from "react";

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'mod';
}

interface Props {
  users: User[];
  onRoleChange: (userId: string, newRole: User['role']) => void;
}

const UserRoleManager = ({ users, onRoleChange }: Props) => {
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

  const handleRoleChange = (userId: string, event: ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;
    if (newRole === 'user' || newRole === 'admin' || newRole === 'mod') {
      onRoleChange(userId, newRole);
    }
  };

  return (
    <div className="bg-black/30 rounded-xl p-6 border border-white/10 text-sm text-white space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">User Management</h2>
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
          <Input type="text"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  No users found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleRoleChange(user.id, e)}
                      className="bg-transparent border border-white/10 rounded px-2 py-1 text-white"
                    >
                      <option value="user">User</option>
                      <option value="mod">Moderator</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                      <Settings className="h-4 w-4"/>
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>
      <div className="text-xs text-gray-500">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
};

export default UserRoleManager;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 