// TODO: implement collaborative strategy editor
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Save, Share2, Edit3 } from 'lucide-react';

interface MultiplayerEditorProps {
  sessionId?: string;
}

export const MultiplayerEditor: React.FC<MultiplayerEditorProps> = ({ sessionId }) => {
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

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
    <Card className="theme-card p-6" />
      <Div className="flex items-center justify-between mb-4">
        <Div className="flex items-center gap-2">
          <Users className="h-6 w-6" />
          <H2 className="text-2xl font-bold">Multiplayer Editor</MultiplayerEditorProps>
        </Div>
        <Div className="flex items-center gap-2">
          <Div className="flex -space-x-2">
            {activeUsers.map((user) => (
              <avatar key={user.id} className="h-8 w-8 border-2 border-background">
                <AvatarFallback style={{ backgroundColor: user.color }}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Div>
              </Avatar>
            ))}
          </Div>
          <Span className="text-sm text-muted-foreground ml-2">
            {activeUsers.length} active
          </Span>
        </Div>
      </Div>

      <Div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Div className="lg:col-span-2">
          <Div className="relative">
            <Textarea
              className="w-full h-[400px] p-4 bg-secondary/20 rounded-lg font-mono text-sm resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your strategy..."
            />
            {/* Cursor indicators */}
            {activeUsers.filter(u => u.name !== 'You').map((user) => (
              <Div key={user.id}
                className="absolute w-0.5 h-5 animate-pulse"
                style={{
                  backgroundColor: user.color,
                  top: `${user.cursor.line * 20}px`,
                  left: `${user.cursor.col * 8}px`
                }}
          >
                <Span className="absolute -top-6 left-0 text-xs px-1 rounded whitespace-nowrap"
                  style={{ backgroundColor: user.color, color: 'white' }}
                />
                  {user.name}
                </Div>
              </Div>
            ))}
          </Div>
          <Div className="flex gap-2 mt-4">
            <Button className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Strategy
            </Div>
            <Button variant="outline" />
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </Div>
        </Div>

        <Div className="space-y-4">
          <Div>
            <H3 className="font-semibold mb-2">Recent Edits</Div>
            <Div className="space-y-2">
              {edits.map((edit, i) => (
                <Div key={i} className="text-sm p-2 bg-secondary/20 rounded">
                  <Div className="flex items-center gap-2">
                    <Edit3 className="h-3 w-3 text-muted-foreground" /></Div>
                    <Span className="font-medium">{edit.user}</Span>
                  </Div>
                  <P className="text-xs text-muted-foreground mt-1">
                    {edit.action} • {edit.time}
                  </P>
                </Div>
              ))}
            </Div>
          </Div>

          <Div>
            <H3 className="font-semibold mb-2">Session Info</Div>
            <P className="text-sm text-muted-foreground">
              Session ID: {sessionId || 'demo-session'}
            </P>
            <P className="text-sm text-muted-foreground">
              Started: 15 minutes ago
            </P>
          </Div>
        </Div>
      </Div>
    </Card>
  );
}; 