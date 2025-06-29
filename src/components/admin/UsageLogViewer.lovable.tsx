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
  const containerRef = React.useRef<HTMLDivElement >(null);

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
    <Div className="bg-black/30 rounded-xl p-6 border border-white/10 text-sm text-white space-y-4">
      <Div className="flex items-center justify-between">
        <H2 className="text-lg font-semibold text-white">Usage Logs</Timefilter>
        
        <Div className="flex items-center space-x-2">
          {/* Search input */}
          <Div className="relative">
            <Search  />
            <Input type="text"
              value={searchQuery}
              onChange={(e) = /> setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </Div>
          
          {/* Time filter */}
          <Select > setTimeFilter(value as TimeFilter)}>
            <selecttrigger  style={{ color: "white" }}>
              <Div className="flex items-center">
                <clock >
                <selectvalue >
              </Select>
            </SelectTrigger>
            <selectcontent  style={{ color: "white" }}>
              <selectitem value="all">All Time</SelectItem>
              <selectitem value="today">Today</SelectItem>
              <selectitem value="week">This Week</SelectItem>
              <selectitem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Action filter */}
          <Select > setActionFilter(value as ActionFilter)}>
            <selecttrigger  style={{ color: "white" }}>
              <Div className="flex items-center">
                <filter >
                <selectvalue >
              </Select>
            </SelectTrigger>
            <selectcontent  style={{ color: "white" }}>
              <selectitem value="all">All Actions</SelectItem>
              <selectitem value="login">Login</SelectItem>
              <selectitem value="api">API Usage</SelectItem>
              <selectitem value="feature">Feature Access</SelectItem>
            </SelectContent>
          </Select>
        </Div>
      </Div>

      <Div className="rounded-lg border border-white/10 overflow-hidden">
        <Div ref={containerRef}
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
     >
          <Table >
            <tableheader  style={{ backgroundColor: "black" }}>
              <tablerow >
                <tablehead >User</Div>
                <tablehead >Action</TableHead>
                <tablehead >Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <tablebody >
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tablerow >
                    <tablecell >{log.userEmail}</TableCell>
                    <tablecell >
                      <Span className={
                        log.action.toLowerCase().includes("error") ? "text-red-400" :
                        log.action.toLowerCase().includes("warn") ? "text-yellow-400" :
                        ""
                      }>
                        {log.action}
                      </Span>
                    </TableCell>
                    <tablecell >
                      <Div className="flex items-center">
                        <calendar >
                        {formatTimestamp(log.timestamp)}
                      </Div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <tablerow >
                  <tablecell >
                    <Div className="flex flex-col items-center gap-2 text-gray-500">
                      <inbox >
                      <P>No logs found</Div>
                      <P className="text-xs">Try adjusting your filters</P>
                    </Div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Div>
      </Div>
      
      <Div className="text-xs text-gray-500 flex justify-between items-center">
        <Div>
          Showing {filteredLogs.length} of {logs.length} logs
        </Div>
        
        {logs.length > 0 && (
          <Div className="text-right">
            Latest activity: {formatTimestamp(logs[0].timestamp)}
          </Div>
        )}
      </Div>
    </Div>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
