import React, { useState, useEffect } from 'react';
import { fetchUsers, User, FetchUsersOptions } from '@/lib/admin/fetchUsers';
import { exportUsers } from '@/lib/admin/exportUsers';
import UserRow from '@/components/ui/UserRow';
import RoleBadge, { UserRole } from '@/components/ui/RoleBadge';
import { Search, Download, Users, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

const UserTable: React.FC = () => {
  // State for user data
  const [users, setUsers] = useState<User[]>([]);
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
      <Pagination className="mt-4">
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
        <tr key={i} className="border-b border-gray-800/30">
          <td className="px-4 py-3"><Skeleton className="h-6 w-24" /></td>
          <td className="px-4 py-3"><Skeleton className="h-6 w-20" /></td>
          <td className="px-4 py-3"><Skeleton className="h-6 w-16" /></td>
          <td className="px-4 py-3"><Skeleton className="h-6 w-16 rounded-full" /></td>
          <td className="px-4 py-3"><Skeleton className="h-6 w-8 rounded-full" /></td>
        </tr>
      ))}
    </>
  );
  
  return (
    <div className="bg-gray-950/70 backdrop-blur-md rounded-xl border border-gray-800/50 overflow-hidden">
      {/* Filter and tools bar */}
      <div className="p-4 border-b border-gray-800/50 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="text"
              placeholder="Search wallet address..." 
              className="pl-9 w-full min-w-[200px] bg-gray-900/80"
              onChange={handleSearchChange}
            />
          </div>
          
          {/* Role filter */}
          <Select onValueChange={handleRoleFilterChange}>
            <SelectTrigger className="w-[140px] bg-gray-900/80">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900">
              <SelectItem value="">All roles</SelectItem>
              <SelectItem value="Admin">
                <div className="flex items-center gap-2">
                  <RoleBadge role="Admin" showTooltip={false} /> Admin
                </div>
              </SelectItem>
              <SelectItem value="User">
                <div className="flex items-center gap-2">
                  <RoleBadge role="User" showTooltip={false} /> User
                </div>
              </SelectItem>
              <SelectItem value="Trial">
                <div className="flex items-center gap-2">
                  <RoleBadge role="Trial" showTooltip={false} /> Trial
                </div>
              </SelectItem>
              <SelectItem value="Expired">
                <div className="flex items-center gap-2">
                  <RoleBadge role="Expired" showTooltip={false} /> Expired
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-gray-900/80">
                <Filter className="h-3.5 w-3.5 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900 border border-gray-800">
              <DropdownMenuItem onClick={() => handleSortChange('created_at-desc')} className="cursor-pointer">
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('created_at-asc')} className="cursor-pointer">
                Oldest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('subscription_tier-desc')} className="cursor-pointer">
                By Plan (Z-A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('subscription_tier-asc')} className="cursor-pointer">
                By Plan (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange('role-asc')} className="cursor-pointer">
                By Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Export button */}
          <Button 
            variant="outline" 
            className="bg-gray-900/80 flex items-center gap-2" 
            onClick={handleExport}
            disabled={users.length === 0 || loading}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          
          {/* Grant admin button */}
          <Button 
            className="bg-violet-600 hover:bg-violet-700 flex items-center gap-2" 
            onClick={handleGrantAdmin}
          >
            <Plus className="h-4 w-4" />
            Grant Admin
          </Button>
        </div>
      </div>
      
      {/* User table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Wallet Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Subscription Plan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              renderSkeleton()
            ) : users.length > 0 ? (
              users.map(user => (
                <UserRow 
                  key={user.id} 
                  user={user} 
                  onUserUpdate={handleUserUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No users found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {!loading && pageCount > 1 && renderPagination()}
      
      {/* Summary stats */}
      <div className="p-4 border-t border-gray-800/50 text-sm text-gray-400">
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