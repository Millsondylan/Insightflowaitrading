import { User } from './fetchUsers';

export interface ExportOptions {
  users: User[];
  includeFields?: string[];
  filename?: string;
}

/**
 * Converts user data to CSV format and triggers download
 */
export function exportUsers({
  users,
  includeFields = ['address', 'created_at', 'subscription_tier', 'role'],
  filename = 'insightflow-users.csv'
}: ExportOptions): void {
  if (!users || users.length === 0) {
    console.warn('No users to export');
    return;
  }

  try {
    // Generate CSV header
    const header = includeFields.join(',');
    
    // Generate CSV rows
    const rows = users.map(user => {
      return includeFields.map(field => {
        const value = user[field as keyof User];
        
        // Format or sanitize value
        if (field === 'address') {
          // Return wallet address without modification
          return value || '';
        } else if (field === 'created_at') {
          // Format date nicely
          return value ? new Date(value as string).toLocaleDateString() : '';
        } else if (field === 'role') {
          // Ensure role value is quoted properly
          return `"${value || ''}"`;
        } else {
          // General case
          return value ? `"${value}"` : '';
        }
      }).join(',');
    });
    
    // Combine header and rows
    const csvContent = `${header}\n${rows.join('\n')}`;
    
    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    
    // Set up download using URL.createObjectURL
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    
    // Append link to body, click it to trigger download, then remove it
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    return;
  } catch (error) {
    console.error('Error exporting users:', error);
  }
}

/**
 * Handles multiple formats and export options
 */
export function formatUserData(users: User[], format: 'csv' | 'json' = 'csv'): string {
  if (format === 'json') {
    // Return JSON formatted data
    return JSON.stringify(users, null, 2);
  } else {
    // Default to CSV
    const header = ['address', 'created_at', 'subscription_tier', 'role'].join(',');
    const rows = users.map(user => {
      const address = user.address || '';
      const created = user.created_at ? new Date(user.created_at).toLocaleDateString() : '';
      const plan = `"${user.subscription_tier || ''}"`;
      const role = `"${user.role || ''}"`;
      
      return [address, created, plan, role].join(',');
    });
    
    return `${header}\n${rows.join('\n')}`;
  }
} 