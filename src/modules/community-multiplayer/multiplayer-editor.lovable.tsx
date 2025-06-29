// TODO: implement collaborative strategy editor
import React from 'react';

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
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{fontSize: '16px'}}>👤</span>
          <h2 style={{ fontWeight: "700" }}>Multiplayer Editor</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex" }}>
            {activeUsers.map((user) => (
              <Avatar key={user.id} >
                <AvatarFallback style={{ backgroundColor: user.color }}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <span >
            {activeUsers.length} active
          </span>
        </div>
      </div>

      <div >
        <div >
          <div >
            <textarea
              style={{ width: "100%", padding: "16px" }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your strategy..."
            />
            {/* Cursor indicators */}
            {activeUsers.filter(u => u.name !== 'You').map((user) => (
              <div
                key={user.id}
                
                style={{
                  backgroundColor: user.color,
                  top: `${user.cursor.line * 20}px`,
                  left: `${user.cursor.col * 8}px`
                }}
              >
                <span
                  
                  style={{ backgroundColor: user.color, color: 'white' }}
                >
                  {user.name}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex" }}>
            <Button >
              <Save  />
              Save Strategy
            </Button>
            <Button variant="outline">
              <span style={{fontSize: '16px'}}>🔗</span>
              Share
            </Button>
          </div>
        </div>

        <div >
          <div>
            <h3 >Recent Edits</h3>
            <div >
              {edits.map((edit, i) => (
                <div key={i} >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{fontSize: '16px'}}>✏️</span>
                    <span >{edit.user}</span>
                  </div>
                  <p >
                    {edit.action} • {edit.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 >Session Info</h3>
            <p >
              Session ID: {sessionId || 'demo-session'}
            </p>
            <p >
              Started: 15 minutes ago
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}; 