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
    <Card style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Github  />
        <h2 style={{ fontWeight: "700" }}>GitHub Sync</h2>
      </div>

      <div >
        <div >
          <div>
            <label >Repository</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                value={`${repoInfo.owner}/${repoInfo.repo}`}
                readOnly
                
              />
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
          <div>
            <label >Branch</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <GitBranch  />
              <Input
                value={repoInfo.branch}
                readOnly
                
              />
            </div>
          </div>
        </div>

        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <h3 >Last Commit</h3>
            <Badge variant="outline" >
              {repoInfo.lastCommit.sha}
            </Badge>
          </div>
          <div >
            <div style={{ display: "flex", alignItems: "center" }}>
              <GitCommit  />
              <span>{repoInfo.lastCommit.message}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>by {repoInfo.lastCommit.author}</span>
              <span>{repoInfo.lastCommit.date.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div >
          <div >
            <p style={{ fontWeight: "700" }}>
              {repoInfo.syncStatus.ahead}
            </p>
            <p >Commits ahead</p>
          </div>
          <div >
            <p style={{ fontWeight: "700" }}>
              {repoInfo.syncStatus.behind}
            </p>
            <p >Commits behind</p>
          </div>
          <div >
            <p style={{ fontWeight: "700" }}>
              {repoInfo.syncStatus.conflicts}
            </p>
            <p >Conflicts</p>
          </div>
        </div>

        <div style={{ display: "flex" }}>
          <Button
            onClick={syncRepository}
            disabled={isSyncing}
            
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
          <Button variant="outline">
            <GitPullRequest  />
            Create PR
          </Button>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Github  />
          <p >
            Strategies are automatically versioned and backed up to GitHub
          </p>
        </div>
      </div>
    </Card>
  );
}; 