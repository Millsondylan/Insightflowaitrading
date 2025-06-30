// Simple audit logger for development
export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const logEntry: AuditLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      ...entry,
    };

    this.logs.push(logEntry);
    console.log('Audit Log:', logEntry);
  }

  getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const auditLogger = new AuditLogger();

// React hook for audit logging
export const useAuditLog = () => {
  const logEvent = (action: string, details?: Record<string, any>) => {
    auditLogger.log({
      action,
      resource: 'app',
      details,
    });
  };

  const logClick = (element: string, details?: Record<string, any>) => {
    auditLogger.log({
      action: `click:${element}`,
      resource: 'ui',
      details,
    });
  };

  return { logEvent, logClick };
}; 