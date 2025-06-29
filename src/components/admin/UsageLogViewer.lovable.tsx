import * as React from "react";

type UsageLog = { id: string; userEmail: string; action: string; timestamp: string };

type Props = {
  logs: UsageLog[];
};

type TimeFilter = "all" | "today" | "week" | "month";
type ActionFilter = "all" | "login" | "api" | "feature";

export default function UsageLogViewer({ logs }: Props) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>("all");
  const [actionFilter, setActionFilter] = React.useState<ActionFilter>("all");
  const [filteredLogs, setFilteredLogs] = React.useState<UsageLog[]>(logs);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Apply filters when any filter changes
  React.useEffect(() => {
    let result = [...logs];

    // Apply time filter
    if (timeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);

      result = result.filter(log => {
        const logDate = new Date(log.timestamp);
        if (timeFilter === "today") {
          return logDate >= today;
        } else if (timeFilter === "week") {
          return logDate >= weekAgo;
        } else if (timeFilter === "month") {
          return logDate >= monthAgo;
        }
        return true;
      });
    }

    // Apply action filter
    if (actionFilter !== "all") {
      result = result.filter(log => {
        const action = log.action.toLowerCase();
        if (actionFilter === "login") {
          return action.includes("login") || action.includes("auth");
        } else if (actionFilter === "api") {
          return action.includes("api") || action.includes("request");
        } else if (actionFilter === "feature") {
          return action.includes("feature") || action.includes("access");
        }
        return true;
      });
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(log => 
        log.userEmail.toLowerCase().includes(query) ||
        log.action.toLowerCase().includes(query)
      );
    }

    setFilteredLogs(result);
  }, [logs, searchQuery, timeFilter, actionFilter]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <div style={{ borderRadius: "0.75rem", padding: "24px", border: "1px solid #374151", color: "white" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ color: "white" }}>Usage Logs</h2>
        
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Search input */}
          <div >
            <span style={{fontSize: '16px'}}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              style={{ border: "1px solid #374151", color: "white" }}
            />
          </div>
          
          {/* Time filter */}
          <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
            <SelectTrigger style={{ color: "white" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{fontSize: '16px'}}>⏰</span>
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent style={{ color: "white" }}>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Action filter */}
          <Select value={actionFilter} onValueChange={(value) => setActionFilter(value as ActionFilter)}>
            <SelectTrigger style={{ color: "white" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Filter style={{ color: "#9CA3AF" }} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent style={{ color: "white" }}>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="api">API Usage</SelectItem>
              <SelectItem value="feature">Feature Access</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div style={{ border: "1px solid #374151" }}>
        <div 
          ref={containerRef}
          
        >
          <Table>
            <TableHeader style={{ backgroundColor: "black" }}>
              <TableRow >
                <TableHead >User</TableHead>
                <TableHead >Action</TableHead>
                <TableHead >Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} >
                    <TableCell>{log.userEmail}</TableCell>
                    <TableCell>
                      <span className={
                        log.action.toLowerCase().includes("error") ? "text-red-400" :
                        log.action.toLowerCase().includes("warn") ? "text-yellow-400" :
                        ""
                      }>
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell style={{ color: "#9CA3AF" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{fontSize: '16px'}}>📅</span>
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Inbox  />
                      <p>No logs found</p>
                      <p >Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
        
        {logs.length > 0 && (
          <div >
            Latest activity: {formatTimestamp(logs[0].timestamp)}
          </div>
        )}
      </div>
    </div>
  );
} 