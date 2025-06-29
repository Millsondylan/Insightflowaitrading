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
import { Calendar, Clock, Filter, Search, Inbox } from "lucide-react";

type UsageLog = { id: string; userEmail: string; action: string; timestamp: string };

type Props = {
  logs: UsageLog[];
};

type TimeFilter = "all" | "today" | "week" | "month";
type ActionFilter = "all" | "login" | "api" | "feature";

export default function UsageLogViewer({ logs }: Props) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [timeFilter, setTimeFilter] = React.useState<Timefilter>("all");
  const [actionFilter, setActionFilter] = React.useState<actionfilter  />("all");
  const [filteredLogs, setFilteredLogs] = React.useState<Usagelog >(logs);
  const containerRef = React.useRef<HTMLDivElement  >(null);

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
    <div className="bg-black/30 rounded-xl p-6 border border-white/10 text-sm text-white space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Usage Logs</h2>
        
        <div className="flex items-center space-x-2">
          {/* Search input */}
          <div className="relative">
            <Search  />
            <input type="text"
              value={searchQuery}
              onChange={(e) = /> setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          
          {/* Time filter */}
          <select  > setTimeFilter(value as TimeFilter)}>
            <selecttrigger  style={{ color: "white" }}>
              <div className="flex items-center">
                <clock  >
                <selectvalue  >
              </div>
            </SelectTrigger>
            <selectcontent  style={{ color: "white" }}>
              <selectitem value="all" >All Time</SelectItem>
              <selectitem value="today" >Today</SelectItem>
              <selectitem value="week" >This Week</SelectItem>
              <selectitem value="month" >This Month</SelectItem>
            </SelectContent>
          </select>
          
          {/* Action filter */}
          <select  > setActionFilter(value as ActionFilter)}>
            <selecttrigger  style={{ color: "white" }}>
              <div className="flex items-center">
                <filter  >
                <selectvalue  >
              </div>
            </SelectTrigger>
            <selectcontent  style={{ color: "white" }}>
              <selectitem value="all" >All Actions</SelectItem>
              <selectitem value="login" >Login</SelectItem>
              <selectitem value="api" >API Usage</SelectItem>
              <selectitem value="feature" >Feature Access</SelectItem>
            </SelectContent>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <div 
          ref={containerRef}
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        >
          <table  >
            <tableheader  style={{ backgroundColor: "black" }}>
              <tablerow  >
                <tablehead  >User</TableHead>
                <tablehead  >Action</TableHead>
                <tablehead  >Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <tablebody  >
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tablerow  >
                    <tablecell  >{log.userEmail}</TableCell>
                    <tablecell  >
                      <span className={
                        log.action.toLowerCase().includes("error") ? "text-red-400" :
                        log.action.toLowerCase().includes("warn") ? "text-yellow-400" :
                        ""
                      }>
                        {log.action}
                      </span>
                    </TableCell>
                    <tablecell  >
                      <div className="flex items-center">
                        <calendar  >
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tablerow  >
                  <tablecell  >
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                      <inbox  >
                      <p>No logs found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 flex justify-between items-center">
        <div>
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
        
        {logs.length > 0 && (
          <div className="text-right">
            Latest activity: {formatTimestamp(logs[0].timestamp)}
          </div>
        )}
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
