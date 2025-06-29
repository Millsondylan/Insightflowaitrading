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
    <Div className="bg-black/30 rounded-xl p-6 border border-white/10 text-sm text-white space-y-4">
      <Div className="flex items-center justify-between">
        <H2 className="text-lg font-semibold text-white">Usage Logs</TimeFilter>
        
        <Div className="flex items-center space-x-2">
          {/* Search input */}
          <Div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </Div>
          
          {/* Time filter */}
          <Select value={timeFilter} onValueChange={(value) = /> setTimeFilter(value as TimeFilter)}>
            <SelectTrigger className="bg-black/50 border-white/10 text-white w-32" />
              <Div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue / />
            </Select>
            <SelectContent className="bg-gray-900 text-white border-white/10" />
              <SelectItem value="all" />All Time</SelectContent>
              <SelectItem value="today" />Today</SelectItem>
              <SelectItem value="week" />This Week</SelectItem>
              <SelectItem value="month" />This Month</SelectItem />
          </SelectItem>
          
          {/* Action filter */}
          <Select value={actionFilter} onValueChange={(value) = /> setActionFilter(value as ActionFilter)}>
            <SelectTrigger className="bg-black/50 border-white/10 text-white w-32" />
              <Div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-gray-400" />
                <SelectValue / />
            </Select>
            <SelectContent className="bg-gray-900 text-white border-white/10" />
              <SelectItem value="all" />All Actions</SelectContent>
              <SelectItem value="login" />Login</SelectItem>
              <SelectItem value="api" />API Usage</SelectItem>
              <SelectItem value="feature" />Feature Access</SelectItem />
          </SelectItem>
        </Div>
      </Div>

      <Div className="rounded-lg border border-white/10 overflow-hidden">
        <Div ref={containerRef}
          className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <Table>
            <TableHeader className="sticky top-0 bg-black z-10" />
              <TableRow className="hover:bg-transparent border-white/10" />
                <TableHead className="text-white/70 font-medium w-1/3" />User</Div>
                <TableHead className="text-white/70 font-medium w-1/3" />Action</TableHead>
                <TableHead className="text-white/70 font-medium w-1/3" />Timestamp</TableHead />
            </TableHead>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-white/5 border-white/10" />
                    <TableCell>{log.userEmail}</TableBody>
                    <TableCell>
                      <Span className={
                        log.action.toLowerCase().includes("error") ? "text-red-400" :
                        log.action.toLowerCase().includes("warn") ? "text-yellow-400" :
                        ""
                      }>
                        {log.action}
                      </TableCell />
                    <TableCell className="text-gray-400" />
                      <Div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        {formatTimestamp(log.timestamp)}
                      </TableCell />
                  </TableCell>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-12" />
                    <Div className="flex flex-col items-center gap-2 text-gray-500">
                      <Inbox className="h-10 w-10 text-gray-600/50" / /></TableRow /></TableRow /></TableRow>
                      <P>No logs found</P>
                      <P className="text-xs">Try adjusting your filters</P>
                    </div />
                </TableRow>
              )}
            </TableBody />
        </Div>
      </Div>
      
      <Div className="text-xs text-gray-500 flex justify-between items-center">
        <Div></Div>
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