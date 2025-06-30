// TODO: implement collaborative strategy editor
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Save, Share2, Edit3 } from 'lucide-react';

interface MultiplayerEditorProps {
  sessionId?: string;
}

export const MultiplayerEditor: React.FC<Multiplayereditorprops > = ({ sessionId }) => {
  const [content, setContent] = React.useState(`// Collaborative Strategy Editor
// Multiple users can edit simultaneously

entry_rules:
  - price > sma(20)
  - rsi < 70
  - volume > average_volume * 1.5

exit_rules:
  - price < sma(20) OR
  - rsi > 80 OR
  - trailing_stop(2%)
`);

  const [activeUsers, setActiveUsers] = React.useState([
    { id: 1, name: 'Alex T.', color: '#FF6B6B', cursor: { line: 3, col: 15 } },
    { id: 2, name: 'Sarah M.', color: '#4ECDC4', cursor: { line: 7, col: 8 } },
    { id: 3, name: 'You', color: '#45B7D1', cursor: { line: 10, col: 20 } }
  ]);

  const [edits, setEdits] = React.useState([
    { user: 'Alex T.', action: 'added RSI condition', time: '2 min ago' },
    { user: 'Sarah M.', action: 'modified volume threshold', time: '5 min ago' }
  ]);

  return (
    <Card />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users >
          <h2 className="text-2xl font-bold">Multiplayer Editor</Multiplayereditorprops>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {activeUsers.map((user) => (
              <avatar />
                <Avatarfallback >
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">
            {activeUsers.length} active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Textarea
              className="w-full h-[400px] p-4 bg-secondary/20 rounded-lg font-mono text-sm resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your strategy..."
            />
            {/* Cursor indicators */}
            {activeUsers.filter(u => u.name !== 'You').map((user) => (
              <div key={user.id}
                className="absolute w-0.5 h-5 animate-pulse"
                style={{
                  backgroundColor: user.color,
                  top: `${user.cursor.line * 20}px`,
                  left: `${user.cursor.col * 8}px`
                }}>
                <span className="absolute -top-6 left-0 text-xs px-1 rounded whitespace-nowrap"
                  style={{ backgroundColor: user.color, color: 'white' }}></div>
                  {user.name}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button >
              <Save >
              Save Strategy
            </div>
            <Button variant="outline">
              <Share2 >
              Share
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2"></div>Recent Edits</div>
            <div className="space-y-2">
              {edits.map((edit, i) => (
                <div key={i} className="text-sm p-2 bg-secondary/20 rounded">
                  <div className="flex items-center gap-2">
                    <edit3 >
                    <span className="font-medium"></div>{edit.user}</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {edit.action} • {edit.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2"></div>Session Info</div>
            <p className="text-sm text-muted-foreground">
              Session ID: {sessionId || 'demo-session'}
            </p>
            <p className="text-sm text-muted-foreground">
              Started: 15 minutes ago
            </p>
          </div>
        </div>
      </div />
  );
}; 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
