import * as React from "react";

type User = { id: string; email: string; role: "admin" | "mod" | "user" };

type Props = {
  users: User[];
  onRoleChange: (id: string, newRole: User["role"]) => void;
};

export default function UserRoleManager({ users, onRoleChange }: Props) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredUsers, setFilteredUsers] = React.useState<span style={{fontSize: '16px'}}>👤</span>(users);

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
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ color: "white" }}>User Management</h2>
        
        {/* Search input */}
        <div >
          <span style={{fontSize: '16px'}}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            style={{ border: "1px solid #374151", color: "white" }}
          />
        </div>
      </div>

      <div style={{ border: "1px solid #374151" }}>
        <Table>
          <TableHeader>
            <TableRow >
              <TableHead >ID</TableHead>
              <TableHead >Email</TableHead>
              <TableHead >Current Role</TableHead>
              <TableHead >Manage Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} >
                <TableCell >
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
                    <SelectTrigger style={{ color: "white" }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent style={{ color: "white" }}>
                      <SelectItem value="user" >
                        User
                      </SelectItem>
                      <SelectItem value="mod" >
                        Moderator
                      </SelectItem>
                      <SelectItem value="admin" >
                        Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} style={{ paddingTop: "32px", paddingBottom: "32px" }}>
                  No users found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div >
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
} 