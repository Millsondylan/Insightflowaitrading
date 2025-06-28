// TODO: implement GitHub repository sync
import React from 'react';

interface GitHubSyncProps {
  onSync?: () => void;
}

export const GitHubSync: React.FC<GitHubSyncProps> = ({ onSync }) => {
  const [repoInfo, setRepoInfo] = React.useState({
    owner: 'insightflow',
    repo: 'trading-strategies',
    branch: 'main',
    lastCommit: {
      sha: 'a1b2c3d',
      message: 'Update RSI strategy parameters',
      author: 'alex-trader',
      date: new Date('2024-02-12T09:15:00')
    },
    syncStatus: {
      ahead: 2,
      behind: 0,
      conflicts: 0
    }
  });

  const [isSyncing, setIsSyncing] = React.useState(false);

  const syncRepository = async () => {
    setIsSyncing(true);
    // TODO: Connect to syncWithGitHub function
    setTimeout(() => {
      setRepoInfo({
        ...repoInfo,
        syncStatus: { ahead: 0, behind: 0, conflicts: 0 },
        lastCommit: {
          ...repoInfo.lastCommit,
          date: new Date()
        }
      });
      setIsSyncing(false);
      onSync?.();
    }, 2000);
  };

  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '24px'
      }}>
        <span style={{fontSize: '24px'}}>💻</span>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: 0
        }}>GitHub Sync</h2>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <div>
            <label style={{
              fontSize: '14px',
              color: '#9ca3af',
              display: 'block',
              marginBottom: '4px'
            }}>Repository</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input
                value={`${repoInfo.owner}/${repoInfo.repo}`}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#2a2a3a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              />
              <button style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Change
              </button>
            </div>
          </div>
          <div>
            <label style={{
              fontSize: '14px',
              color: '#9ca3af',
              display: 'block',
              marginBottom: '4px'
            }}>Branch</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{fontSize: '16px'}}>🔱</span>
              <input
                value={repoInfo.branch}
                readOnly
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: '#2a2a3a',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: 'white',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{
          padding: '16px',
          backgroundColor: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontWeight: '600',
              margin: 0,
              fontSize: '16px'
            }}>Last Commit</h3>
            <span style={{
              padding: '4px 8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              {repoInfo.lastCommit.sha}
            </span>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{fontSize: '16px'}}>📝</span>
              <span>{repoInfo.lastCommit.message}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#9ca3af'
            }}>
              <span>by {repoInfo.lastCommit.author}</span>
              <span>{repoInfo.lastCommit.date.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
          <div style={{
            textAlign: 'center',
            padding: '12px',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '8px'
          }}>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#22c55e',
              margin: '0 0 4px 0'
            }}>
              {repoInfo.syncStatus.ahead}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              margin: 0
            }}>Commits ahead</p>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '12px',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '8px'
          }}>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#eab308',
              margin: '0 0 4px 0'
            }}>
              {repoInfo.syncStatus.behind}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              margin: 0
            }}>Commits behind</p>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '12px',
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '8px'
          }}>
            <p style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#ef4444',
              margin: '0 0 4px 0'
            }}>
              {repoInfo.syncStatus.conflicts}
            </p>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              margin: 0
            }}>Conflicts</p>
          </div>
        </div>

        <div style={{display: 'flex', gap: '8px'}}>
          <button
            onClick={syncRepository}
            disabled={isSyncing}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '6px',
              border: 'none',
              cursor: isSyncing ? 'not-allowed' : 'pointer',
              opacity: isSyncing ? 0.7 : 1,
              fontWeight: '500'
            }}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
          <button style={{
            padding: '12px',
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{fontSize: '16px'}}>🔄</span>
            Create PR
          </button>
        </div>

        <div style={{
          padding: '12px',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{fontSize: '16px', color: '#3b82f6'}}>💻</span>
          <p style={{
            fontSize: '14px',
            color: '#3b82f6',
            margin: 0
          }}>
            Strategies are automatically versioned and backed up to GitHub
          </p>
        </div>
      </div>
    </div>
  );
}; 