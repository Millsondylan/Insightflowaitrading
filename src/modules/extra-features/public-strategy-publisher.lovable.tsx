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
    <Card style={{ padding: "24px" }}>
      <h2 style={{ fontWeight: "700" }}>Publish Strategy</h2>

      <div >
        <div>
          <label >Strategy Title</label>
          <Input
            placeholder="e.g., RSI Momentum Strategy"
            value={publishSettings.title}
            onChange={(e) => setPublishSettings({ ...publishSettings, title: e.target.value })}
          />
        </div>

        <div>
          <label >Description</label>
          <Textarea
            placeholder="Describe your strategy, its performance, and best use cases..."
            value={publishSettings.description}
            onChange={(e) => setPublishSettings({ ...publishSettings, description: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <label >Tags</label>
          <Input
            placeholder="momentum, RSI, scalping (comma separated)"
            value={publishSettings.tags}
            onChange={(e) => setPublishSettings({ ...publishSettings, tags: e.target.value })}
          />
        </div>

        <div >
          <h3 >Visibility Settings</h3>
          
          <div >
            <Button
              variant={publishSettings.visibility === 'private' ? 'default' : 'outline'}
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => setPublishSettings({ ...publishSettings, visibility: 'private' })}
            >
              <span style={{fontSize: '16px'}}>🔒</span>
              Private
            </Button>
            <Button
              variant={publishSettings.visibility === 'unlisted' ? 'default' : 'outline'}
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => setPublishSettings({ ...publishSettings, visibility: 'unlisted' })}
            >
              <span style={{fontSize: '16px'}}>👁️</span>
              Unlisted
            </Button>
            <Button
              variant={publishSettings.visibility === 'public' ? 'default' : 'outline'}
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => setPublishSettings({ ...publishSettings, visibility: 'public' })}
              disabled={!isPro}
            >
              <span style={{fontSize: '16px'}}>🌐</span>
              Public
              {!isPro && <Crown  />}
            </Button>
          </div>

          {!isPro && publishSettings.visibility === 'public' && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Crown  />
              <p >
                Pro subscription required for public publishing
              </p>
            </div>
          )}
        </div>

        <div >
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="pro-gate" >
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

          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="download" >
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
            <label >
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
          style={{ width: "100%" }}
        >
          {isPublishing ? 'Publishing...' : 'Publish Strategy'}
        </Button>

        {publishedUrl && (
          <div style={{ padding: "16px" }}>
            <p >
              Strategy published successfully!
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                value={publishedUrl}
                readOnly
                
              />
              <Button size="sm" variant="outline">
                Copy Link
              </Button>
            </div>
          </div>
        )}

        <div >
          <div >
            <p style={{ fontWeight: "700" }}>0</p>
            <p >Views</p>
          </div>
          <div >
            <p style={{ fontWeight: "700" }}>0</p>
            <p >Downloads</p>
          </div>
          <div >
            <p style={{ fontWeight: "700" }}>$0</p>
            <p >Earned</p>
          </div>
        </div>
      </div>
    </Card>
  );
}; 