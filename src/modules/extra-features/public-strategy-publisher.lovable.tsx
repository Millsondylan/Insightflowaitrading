// TODO: implement public strategy publishing with Pro gate
import React from 'react';

interface PublicStrategyPublisherProps {
  strategyId: string;
  isPro: boolean;
  onPublish?: (data: any) => void;
}

export const PublicStrategyPublisher: React.FC<PublicStrategyPublisherProps> = ({ 
  strategyId, 
  isPro, 
  onPublish 
}) => {
  const [publishSettings, setPublishSettings] = React.useState({
    title: '',
    description: '',
    tags: '',
    visibility: 'private',
    requiresPro: false,
    allowDownload: false,
    price: 0
  });

  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishedUrl, setPublishedUrl] = React.useState('');

  const handlePublish = async () => {
    if (!isPro && publishSettings.visibility === 'public') {
      alert('Pro subscription required for public publishing');
      return;
    }

    setIsPublishing(true);
    // TODO: Connect to publishStrategy function
    setTimeout(() => {
      setPublishedUrl(`https://insightflow.ai/strategies/${strategyId}`);
      setIsPublishing(false);
      onPublish?.(publishSettings);
    }, 2000);
  };

  return (
    <Card className="theme-card p-6">
      <h2 className="text-2xl font-bold mb-6">Publish Strategy</h2>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Strategy Title</label>
          <Input
            placeholder="e.g., RSI Momentum Strategy"
            value={publishSettings.title}
            onChange={(e) => setPublishSettings({ ...publishSettings, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <Textarea
            placeholder="Describe your strategy, its performance, and best use cases..."
            value={publishSettings.description}
            onChange={(e) => setPublishSettings({ ...publishSettings, description: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <Input
            placeholder="momentum, RSI, scalping (comma separated)"
            value={publishSettings.tags}
            onChange={(e) => setPublishSettings({ ...publishSettings, tags: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Visibility Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={publishSettings.visibility === 'private' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => setPublishSettings({ ...publishSettings, visibility: 'private' })}
            >
              <span style={{fontSize: '16px'}}>🔒</span>
              Private
            </Button>
            <Button
              variant={publishSettings.visibility === 'unlisted' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => setPublishSettings({ ...publishSettings, visibility: 'unlisted' })}
            >
              <span style={{fontSize: '16px'}}>👁️</span>
              Unlisted
            </Button>
            <Button
              variant={publishSettings.visibility === 'public' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() => setPublishSettings({ ...publishSettings, visibility: 'public' })}
              disabled={!isPro}
            >
              <span style={{fontSize: '16px'}}>🌐</span>
              Public
              {!isPro && <Crown className="h-3 w-3 ml-1" />}
            </Button>
          </div>

          {!isPro && publishSettings.visibility === 'public' && (
            <div className="p-3 bg-yellow-500/10 rounded-lg flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-yellow-600">
                Pro subscription required for public publishing
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="pro-gate" className="text-sm font-medium">
              Require Pro for Access
            </label>
            <Switch
              id="pro-gate"
              checked={publishSettings.requiresPro}
              onCheckedChange={(checked) => 
                setPublishSettings({ ...publishSettings, requiresPro: checked })
              }
              disabled={!isPro}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="download" className="text-sm font-medium">
              Allow Downloads
            </label>
            <Switch
              id="download"
              checked={publishSettings.allowDownload}
              onCheckedChange={(checked) => 
                setPublishSettings({ ...publishSettings, allowDownload: checked })
              }
            />
          </div>
        </div>

        {publishSettings.visibility === 'public' && isPro && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Price (optional, 0 for free)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={publishSettings.price}
              onChange={(e) => setPublishSettings({ ...publishSettings, price: Number(e.target.value) })}
            />
          </div>
        )}

        <Button
          onClick={handlePublish}
          disabled={isPublishing || !publishSettings.title}
          className="w-full"
        >
          {isPublishing ? 'Publishing...' : 'Publish Strategy'}
        </Button>

        {publishedUrl && (
          <div className="p-4 bg-green-500/10 rounded-lg">
            <p className="text-sm font-medium text-green-600 mb-2">
              Strategy published successfully!
            </p>
            <div className="flex items-center gap-2">
              <Input
                value={publishedUrl}
                readOnly
                className="text-xs"
              />
              <Button size="sm" variant="outline">
                Copy Link
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Downloads</p>
          </div>
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-2xl font-bold">$0</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
        </div>
      </div>
    </Card>
  );
}; 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};

export default $(basename "${FILE%.*}" | sed 's/\.lovable//');
