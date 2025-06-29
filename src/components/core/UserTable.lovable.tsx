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
  const [users, setUsers] = useState<User >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // State for filtering and pagination
  const [filterOptions, setFilterOptions] = useState<Fetchusersoptions  />({
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement >) => {
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
        <Paginationcontent  />
          <paginationitem >
            <paginationprevious href="#"> {
                e.preventDefault();
                if (currentPage > 1) {
                  handlePageChange(currentPage - 1);
                }
              }}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </User>
          
          {[...Array(pageCount)].map((_, i) => {
            const page = i + 1;
            // Show first page, last page, and pages around current page
            if (
              page === 1 || 
              page === pageCount || 
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <paginationitem >
                  <paginationlink href="#"> {
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
              return <paginationellipsis >;
            }
            return null;
          })}
          
          <paginationitem >
            <paginationnext href="#"> {
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
        <Tr key={i} className="border-b border-gray-800/30">
          <Td className="px-4 py-3"><skeleton ></Tr>
          <Td className="px-4 py-3"><skeleton ></Td>
          <Td className="px-4 py-3"><skeleton ></Td>
          <Td className="px-4 py-3"><skeleton ></Td>
          <Td className="px-4 py-3"><skeleton ></Td>
        </Tr>
      ))}
    </>
  );
  
  return (
    <Div className="bg-gray-950/70 backdrop-blur-md rounded-xl border border-gray-800/50 overflow-hidden">
      {/* Filter and tools bar */}
      <Div className="p-4 border-b border-gray-800/50 flex flex-wrap justify-between items-center gap-4">
        <Div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          {/* Search input */}
          <Div className="relative">
            <search >
            <Input type="text" placeholder="Search wallet address..." style={{ width: "100%" }} /></Div>
          </Div>
          
          {/* Role filter */}
          <Select >
            <selecttrigger >
              <selectvalue placeholder="All roles">
            </Select>
            <selectcontent >
              <selectitem value="">All roles</SelectItem>
              <selectitem value="Admin">
                <Div className="flex items-center gap-2">
                  <rolebadge role="Admin"> Admin
                </Div>
              </SelectItem>
              <selectitem value="User">
                <Div className="flex items-center gap-2">
                  <rolebadge role="User"> User
                </Div>
              </SelectItem>
              <selectitem value="Trial">
                <Div className="flex items-center gap-2">
                  <rolebadge role="Trial"> Trial
                </Div>
              </SelectItem>
              <selectitem value="Expired">
                <Div className="flex items-center gap-2">
                  <rolebadge role="Expired"> Expired
                </Div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort options */}
          <dropdownmenu >
            <dropdownmenutrigger >
              <Button variant="outline" size="sm">
                <filter >
                Sort
              </Button>
            </DropdownMenuTrigger>
            <dropdownmenucontent  style={{ border: "1px solid #E5E7EB" }}>
              <dropdownmenuitem > handleSortChange('created_at-desc')} className="cursor-pointer">
                Newest First
              </DropdownMenuItem>
              <dropdownmenuitem > handleSortChange('created_at-asc')} className="cursor-pointer">
                Oldest First
              </DropdownMenuItem>
              <dropdownmenuitem > handleSortChange('subscription_tier-desc')} className="cursor-pointer">
                By Plan (Z-A)
              </DropdownMenuItem>
              <dropdownmenuitem > handleSortChange('subscription_tier-asc')} className="cursor-pointer">
                By Plan (A-Z)
              </DropdownMenuItem>
              <dropdownmenuitem > handleSortChange('role-asc')} className="cursor-pointer">
                By Role
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Div>
        
        <Div className="flex items-center gap-2">
          {/* Export button */}
          <Button variant="outline" style={{ display: "flex", alignItems: "center" }}>
            <download >
            Export CSV
          </Div>
          
          {/* Grant admin button */}
          <Button  style={{ display: "flex", alignItems: "center" }}>
            <plus >
            Grant Admin
          </Button>
        </Div>
      </Div>
      
      {/* User table */}
      <Div className="overflow-x-auto">
        <Table className="w-full">
          <Thead className="bg-gray-900/50">
            <Tr>
              <Th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Wallet Address
              </Div>
              <Th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Joined Date
              </Th>
              <Th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Subscription Plan
              </Th>
              <Th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Role
              </Th>
              <Th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              renderSkeleton()
            ) : users.length > 0 ? (
              users.map(user => (
                <Userrow ></Tbody></Tbody>
              ))
            ) : (
              <Tr>
                <Td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  <Users ></Tr></Tr>
                  <P>No users found</P>
                  <P className="text-sm">Try adjusting your search or filters</P>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Div>
      
      {/* Pagination */}
      {!loading && pageCount > 1 && renderPagination()}
      
      {/* Summary stats */}
      <Div className="p-4 border-t border-gray-800/50 text-sm text-gray-400">
        {!loading && (
          <P></Div>
            Showing {users.length} of {totalCount} users
            {filterOptions.role ? ` with role "${filterOptions.role}"` : ''}
            {filterOptions.search ? ` matching "${filterOptions.search}"` : ''}
          </Div>
        )}
      </Div>
    </Div>
  );
};

export default UserTable; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
