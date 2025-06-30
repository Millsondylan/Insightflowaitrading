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
  onPublish?: (data: unknown) => void;
}

export const PublicStrategyPublisher: React.FC<publicstrategypublisherprops> = ({ 
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
    <Card />
      <h2 className="text-2xl font-bold mb-6">Publish Strategy</Card>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">Strategy Title</div>
          <Input placeholder="e.g., RSI Momentum Strategy"/> setPublishSettings({ ...publishSettings, title: e.target.value })}
          / />

        <div>
          <Label className="text-sm font-medium mb-2 block">Description</Input>
          <Textarea placeholder="Describe your strategy, its performance, and best use cases..."/> setPublishSettings({ ...publishSettings, description: e.target.value })}
            rows={4}
          / />

        <div>
          <Label className="text-sm font-medium mb-2 block">Tags</Textarea>
          <Input placeholder="momentum, RSI, scalping (comma separated)"/> setPublishSettings({ ...publishSettings, tags: e.target.value })}
          / />

        <div className="space-y-4">
          <h3 className="font-semibold">Visibility Settings</Input>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button  style={{ display: "flex", alignItems: "center" }}> setPublishSettings({ ...publishSettings, visibility: 'private' })}
            >
              <Lock >
              Private
            </div>
            <Button  style={{ display: "flex", alignItems: "center" }}> setPublishSettings({ ...publishSettings, visibility: 'unlisted' })}
            >
              <Eye >
              Unlisted
            </button>
            <Button  style={{ display: "flex", alignItems: "center" }}> setPublishSettings({ ...publishSettings, visibility: 'public' })}
              disabled={!isPro}
            >
              <Globe >
              Public
              {!isPro && <crown >}
            </button>
          </div>

          {!isPro && publishSettings.visibility === 'public' && (
            <div className="p-3 bg-yellow-500/10 rounded-lg flex items-center gap-2">
              <crown >
              <p className="text-sm text-yellow-600">
                Pro subscription required for public publishing
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="pro-gate" className="text-sm font-medium">
              Require Pro for Access
            </div>
            <Switch id="pro-gate"> 
                setPublishSettings({ ...publishSettings, requiresPro: checked })
              }
              disabled={!isPro}
            />
          </Switch>

          <div className="flex items-center justify-between">
            <Label htmlFor="download" className="text-sm font-medium">
              Allow Downloads
            </div>
            <Switch id="download"> 
                setPublishSettings({ ...publishSettings, allowDownload: checked })
              }
            />
          </Switch>
        </div>

        {publishSettings.visibility === 'public' && isPro && (
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Price (optional, 0 for free)
            </div>
            <Input type="number" placeholder="0"/> setPublishSettings({ ...publishSettings, price: Number(e.target.value) })}
            / />
        )}

        <Button  style={{ width: "100%" }}>
          {isPublishing ? 'Publishing...' : 'Publish Strategy'}
        </Input>

        {publishedUrl && (
          <div className="p-4 bg-green-500/10 rounded-lg">
            <p className="text-sm font-medium text-green-600 mb-2">
              Strategy published successfully!
            </div>
            <div className="flex items-center gap-2">
              <Input style={{ fontSize: "0.75rem" }}/></div>
              <Button size="sm" variant="outline"></button>
                Copy Link
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Downloads</p>
          </div>
          <div className="p-3 bg-secondary/20 rounded-lg">
            <p className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">Earned</p>
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
