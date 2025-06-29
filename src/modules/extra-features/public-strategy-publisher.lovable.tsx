// TODO: implement public strategy publishing with Pro gate
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Globe, Lock, Crown, Eye, Download } from 'lucide-react';

interface PublicStrategyPublisherProps {
  strategyId: string;
  isPro: boolean;
  onPublish?: (data: any) => void;
}

export const PublicStrategyPublisher: React.FC<publicstrategypublisherprops  > = ({ 
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
    <card  >
      <h2 className="text-2xl font-bold mb-6">Publish Strategy</h2>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Strategy Title</label>
          <input placeholder="e.g., RSI Momentum Strategy" > setPublishSettings({ ...publishSettings, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <textarea placeholder="Describe your strategy, its performance, and best use cases..." > setPublishSettings({ ...publishSettings, description: e.target.value })}
            rows={4}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Tags</label>
          <input placeholder="momentum, RSI, scalping (comma separated)" > setPublishSettings({ ...publishSettings, tags: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Visibility Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button  style={{ display: "flex", alignItems: "center" }}> setPublishSettings({ ...publishSettings, visibility: 'private' })}
            >
              <lock  >
              Private
            </Button>
            <button  style={{ display: "flex", alignItems: "center" }}> setPublishSettings({ ...publishSettings, visibility: 'unlisted' })}
            >
              <eye  >
              Unlisted
            </Button>
            <button  style={{ display: "flex", alignItems: "center" }}> setPublishSettings({ ...publishSettings, visibility: 'public' })}
              disabled={!isPro}
            >
              <globe  >
              Public
              {!isPro && <crown  >}
            </Button>
          </div>

          {!isPro && publishSettings.visibility === 'public' && (
            <div className="p-3 bg-yellow-500/10 rounded-lg flex items-center gap-2">
              <crown  >
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
            <switch id="pro-gate" > 
                setPublishSettings({ ...publishSettings, requiresPro: checked })
              }
              disabled={!isPro}
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="download" className="text-sm font-medium">
              Allow Downloads
            </label>
            <switch id="download" > 
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
            <input type="number" placeholder="0" > setPublishSettings({ ...publishSettings, price: Number(e.target.value) })}
            />
          </div>
        )}

        <button  style={{ width: "100%" }}>
          {isPublishing ? 'Publishing...' : 'Publish Strategy'}
        </Button>

        {publishedUrl && (
          <div className="p-4 bg-green-500/10 rounded-lg">
            <p className="text-sm font-medium text-green-600 mb-2">
              Strategy published successfully!
            </p>
            <div className="flex items-center gap-2">
              <input  style={{ fontSize: "0.75rem" }}>
              <button size="sm" variant="outline" >
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
