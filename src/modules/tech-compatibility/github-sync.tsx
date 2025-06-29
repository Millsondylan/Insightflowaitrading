// TODO: implement GitHub repository sync
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Github, GitBranch, GitCommit, GitPullRequest } from 'lucide-react';

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
    <Card className="theme-card p-6" />
      <Div className="flex items-center gap-2 mb-6">
        <Github className="h-6 w-6" />
        <H2 className="text-2xl font-bold">GitHub Sync</GitHubSyncProps>
      </Div>

      <Div className="space-y-4">
        <Div className="grid grid-cols-2 gap-4">
          <Div>
            <Label className="text-sm text-muted-foreground">Repository</Div>
            <Div className="flex items-center gap-2 mt-1">
              <Input
                value={`${repoInfo.owner}/${repoInfo.repo}`}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="sm" />
                Change
              </Div>
            </Div>
          </Div>
          <Div>
            <Label className="text-sm text-muted-foreground">Branch</Div>
            <Div className="flex items-center gap-2 mt-1">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <Input
                value={repoInfo.branch}
                readOnly
                className="font-mono text-sm"
              />
            </Div>
          </Div>
        </Div>

        <Div className="p-4 bg-secondary/20 rounded-lg">
          <Div className="flex items-center justify-between mb-3">
            <H3 className="font-semibold">Last Commit</Div>
            <Badge variant="outline" className="font-mono text-xs" />
              {repoInfo.lastCommit.sha}
            </Badge>
          </Div>
          <Div className="space-y-2 text-sm">
            <Div className="flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-muted-foreground" />
              <Span>{repoInfo.lastCommit.message}</Div>
            </Div>
            <Div className="flex items-center justify-between text-muted-foreground">
              <Span>by {repoInfo.lastCommit.author}</Div>
              <Span>{repoInfo.lastCommit.date.toLocaleString()}</Span>
            </Div>
          </Div>
        </Div>

        <Div className="grid grid-cols-3 gap-4">
          <Div className="text-center p-3 bg-secondary/20 rounded-lg">
            <P className="text-2xl font-bold text-green-500">
              {repoInfo.syncStatus.ahead}
            </Div>
            <P className="text-sm text-muted-foreground">Commits ahead</P>
          </Div>
          <Div className="text-center p-3 bg-secondary/20 rounded-lg">
            <P className="text-2xl font-bold text-yellow-500">
              {repoInfo.syncStatus.behind}
            </Div>
            <P className="text-sm text-muted-foreground">Commits behind</P>
          </Div>
          <Div className="text-center p-3 bg-secondary/20 rounded-lg">
            <P className="text-2xl font-bold text-red-500">
              {repoInfo.syncStatus.conflicts}
            </Div>
            <P className="text-sm text-muted-foreground">Conflicts</P>
          </Div>
        </Div>

        <Div className="flex gap-2">
          <Button onClick={syncRepository}
            disabled={isSyncing}
            className="flex-1"
  >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Div>
          <Button variant="outline" />
            <GitPullRequest className="h-4 w-4 mr-2" />
            Create PR
          </Button>
        </Div>

        <Div className="p-3 bg-blue-500/10 rounded-lg flex items-center gap-2">
          <Github className="h-4 w-4 text-blue-500" /></Div></Div>
          <P className="text-sm text-blue-600">
            Strategies are automatically versioned and backed up to GitHub
          </P>
        </Div>
      </div />
  );
};

export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 