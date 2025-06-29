import React, { useState, useEffect } from 'react';
import { fetchUsers, User, FetchUsersOptions } from '@/lib/admin/fetchUsers';
import { exportUsers } from '@/lib/admin/exportUsers';
import UserRow from '@/components/ui/UserRow';
import RoleBadge, { UserRole } from '@/components/ui/RoleBadge';

const UserTable: React.FC = () => {
  // State for user data
  const [users, setUsers] = useState<span style={{fontSize: '16px'}}>👤</span>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // State for filtering and pagination
  const [filterOptions, setFilterOptions] = useState<FetchUsersOptions>({
    page: 1,
    perPage: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  
  // Load users when filter options change
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const result = await fetchUsers(filterOptions);
        setUsers(result.users);
        setTotalCount(result.totalCount);
        setPageCount(result.pageCount);
      } catch (error) {
        console.error('Error loading users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load user data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, [filterOptions]);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Debounce implementation would be better in production
    setFilterOptions(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };
  
  // Handle role filter change
  const handleRoleFilterChange = (role: string) => {
    setFilterOptions(prev => ({ ...prev, role: role || undefined, page: 1 }));
  };
  
  // Handle sorting change
  const handleSortChange = (sort: string) => {
    const [sortBy, sortOrder] = sort.split('-') as [any, 'asc' | 'desc'];
    setFilterOptions(prev => ({ ...prev, sortBy, sortOrder }));
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setFilterOptions(prev => ({ ...prev, page }));
  };
  
  // Handle CSV export
  const handleExport = () => {
    exportUsers({ users });
    toast({
      title: 'Export Started',
      description: 'Your user data export has begun',
    });
  };
  
  // Handle user update (from UserRow)
  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };
  
  // Handle grant admin access
  const handleGrantAdmin = () => {
    // In production, this would open a modal to select a user to grant admin access
    toast({
      title: 'Grant Admin',
      description: 'Admin granting interface would appear here',
    });
  };
  
  // Render pagination
  const renderPagination = () => {
    const currentPage = filterOptions.page || 1;
    
    return (
      <Pagination >
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {[...Array(pageCount)].map((_, i) => {
            const page = i + 1;
            // Show first page, last page, and pages around current page
            if (
              page === 1 || 
              page === pageCount || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            } else if (
              page === currentPage - 2 || 
              page === currentPage + 2
            ) {
              return <PaginationEllipsis key={page} />;
            }
            return null;
          })}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < pageCount) {
                  handlePageChange(currentPage + 1);
                }
              }}
              className={currentPage >= pageCount ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  // Loading skeleton UI
  const renderSkeleton = () => (
    <>
      {[...Array(filterOptions.perPage)].map((_, i) => (
        <tr key={i} >
          <td style={{ paddingLeft: "16px", paddingRight: "16px" }}><Skeleton  /></td>
          <td style={{ paddingLeft: "16px", paddingRight: "16px" }}><Skeleton  /></td>
          <td style={{ paddingLeft: "16px", paddingRight: "16px" }}><Skeleton  /></td>
          <td style={{ paddingLeft: "16px", paddingRight: "16px" }}><Skeleton  /></td>
          <td style={{ paddingLeft: "16px", paddingRight: "16px" }}><Skeleton  /></td>
        </tr>
      ))}
    </>
  );
  
  return (
    <div style={{ borderRadius: "0.75rem", border: "1px solid #374151" }}>
      {/* Filter and tools bar */}
      <div style={{ padding: "16px", display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Search input */}
          <div >
            <span style={{fontSize: '16px'}}>🔍</span>
            <Input 
              type="text"
              placeholder="Search wallet address..." 
              style={{ width: "100%" }}
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Role filter */}
          <Select onValueChange={handleRoleFilterChange}>
            <SelectTrigger >
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="">All roles</SelectItem>
              <SelectItem value="Admin">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RoleBadge role="Admin" showTooltip={false} /> Admin
                </div>
              </SelectItem>
              <SelectItem value="User">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RoleBadge role="User" showTooltip={false} /> User
                </div>
              </SelectItem>
              <SelectItem value="Trial">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RoleBadge role="Trial" showTooltip={false} /> Trial
                </div>
              </SelectItem>
              <SelectItem value="Expired">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <RoleBadge role="Expired" showTooltip={false} /> Expired
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" >
                <Filter  />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent style={{ border: "1px solid #374151" }}>
              <DropdownMenuItem onClick={() => handleSortChange('created_at-desc')} >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('created_at-asc')} >
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('subscription_tier-desc')} >
                By Plan (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('subscription_tier-asc')} >
                By Plan (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('role-asc')} >
                By Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Export button */}
          <Button 
            variant="outline" 
            style={{ display: "flex", alignItems: "center" }} 
            onClick={handleExport}
            disabled={users.length === 0 || loading}
          >
            <span style={{fontSize: '16px'}}>⬇️</span>
            Export CSV
          </Button>
          
          {/* Grant admin button */}
          <Button 
            style={{ display: "flex", alignItems: "center" }} 
            onClick={handleGrantAdmin}
          >
            <span style={{fontSize: '16px'}}>➕</span>
            Grant Admin
          </Button>
        </div>
      </div>
      
      {/* User table */}
      <div >
        <table style={{ width: "100%" }}>
          <thead >
            <tr>
              <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>
                Wallet Address
              </th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>
                Joined Date
              </th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>
                Subscription Plan
              </th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>
                Role
              </th>
              <th style={{ paddingLeft: "16px", paddingRight: "16px", color: "#9CA3AF" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeleton()
            ) : users.length > 0 ? (
              users.map(user => (
                <span style={{fontSize: '16px'}}>👤</span>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ paddingLeft: "16px", paddingRight: "16px", paddingTop: "32px", paddingBottom: "32px", color: "#9CA3AF" }}>
                  <span style={{fontSize: '16px'}}>👤</span>
                  <p>No users found</p>
                  <p >Try adjusting your search or filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!loading && pageCount > 1 && renderPagination()}
      
      {/* Summary stats */}
      <div style={{ padding: "16px", color: "#9CA3AF" }}>
        {!loading && (
          <p>
            Showing {users.length} of {totalCount} users
            {filterOptions.role ? ` with role "${filterOptions.role}"` : ''}
            {filterOptions.search ? ` matching "${filterOptions.search}"` : ''}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserTable; 