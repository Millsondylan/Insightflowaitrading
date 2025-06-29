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

export const PublicStrategyPublisher: React.FC<publicStrategyPublisherProps> = ({ 
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

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};

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
    <Card className="theme-card p-6" />
      <H2 className="text-2xl font-bold mb-6">Publish Strategy</Card>

      <Div className="space-y-6">
        <Div>
          <Label className="text-sm font-medium mb-2 block">Strategy Title</Div>
          <Input placeholder="e.g., RSI Momentum Strategy"
            value={publishSettings.title}
            onChange={(e) = /> setPublishSettings({ ...publishSettings, title: e.target.value })}
          />
        </Input>

        <Div>
          <Label className="text-sm font-medium mb-2 block">Description</Div>
          <Textarea
            placeholder="Describe your strategy, its performance, and best use cases..."
            value={publishSettings.description}
            onChange={(e) => setPublishSettings({ ...publishSettings, description: e.target.value })}
            rows={4}
          />
        </Textarea>

        <Div>
          <Label className="text-sm font-medium mb-2 block">Tags</Div>
          <Input placeholder="momentum, RSI, scalping (comma separated)"
            value={publishSettings.tags}
            onChange={(e) = /> setPublishSettings({ ...publishSettings, tags: e.target.value })}
          />
        </Input>

        <Div className="space-y-4">
          <H3 className="font-semibold">Visibility Settings</Div>
          
          <Div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant={publishSettings.visibility === 'private' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() = /> setPublishSettings({ ...publishSettings, visibility: 'private' })}
            >
              <Lock className="h-4 w-4" />
              Private
            </Div>
            <Button variant={publishSettings.visibility === 'unlisted' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() = /> setPublishSettings({ ...publishSettings, visibility: 'unlisted' })}
            >
              <Eye className="h-4 w-4" />
              Unlisted
            </Button>
            <Button variant={publishSettings.visibility === 'public' ? 'default' : 'outline'}
              className="flex items-center gap-2"
              onClick={() = /> setPublishSettings({ ...publishSettings, visibility: 'public' })}
              disabled={!isPro}
            >
              <Globe className="h-4 w-4" />
              Public
              {!isPro && <Crown className="h-3 w-3 ml-1" />}
            </Button>
          </Div>

          {!isPro && publishSettings.visibility === 'public' && (
            <Div className="p-3 bg-yellow-500/10 rounded-lg flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <P className="text-sm text-yellow-600">
                Pro subscription required for public publishing
              </Div>
            </Div>
          )}
        </Div>

        <Div className="space-y-3">
          <Div className="flex items-center justify-between">
            <Label htmlFor="pro-gate" className="text-sm font-medium">
              Require Pro for Access
            </Div>
            <Switch id="pro-gate"
              checked={publishSettings.requiresPro}
              onCheckedChange={(checked) = /> 
                setPublishSettings({ ...publishSettings, requiresPro: checked })
              }
              disabled={!isPro}
            />
          </Switch>

          <Div className="flex items-center justify-between">
            <Label htmlFor="download" className="text-sm font-medium">
              Allow Downloads
            </Div>
            <Switch id="download"
              checked={publishSettings.allowDownload}
              onCheckedChange={(checked) = /> 
                setPublishSettings({ ...publishSettings, allowDownload: checked })
              }
            />
          </Switch>
        </Div>

        {publishSettings.visibility === 'public' && isPro && (
          <Div>
            <Label className="text-sm font-medium mb-2 block">
              Price (optional, 0 for free)
            </Div>
            <Input type="number"
              placeholder="0"
              value={publishSettings.price}
              onChange={(e) = /> setPublishSettings({ ...publishSettings, price: Number(e.target.value) })}
            />
          </Input>
        )}

        <Button onClick={handlePublish}
          disabled={isPublishing || !publishSettings.title}
          className="w-full"
     >
          {isPublishing ? 'Publishing...' : 'Publish Strategy'}
        </Button>

        {publishedUrl && (
          <Div className="p-4 bg-green-500/10 rounded-lg">
            <P className="text-sm font-medium text-green-600 mb-2">
              Strategy published successfully!
            </Div>
            <Div className="flex items-center gap-2">
              <Input
                value={publishedUrl}
                readOnly
                className="text-xs"
              />
              <Button size="sm" variant="outline" />
                Copy Link
              </Div>
            </Div>
          </Div>
        )}

        <Div className="grid grid-cols-3 gap-4 text-center">
          <Div className="p-3 bg-secondary/20 rounded-lg">
            <P className="text-2xl font-bold">0</Div>
            <P className="text-xs text-muted-foreground">Views</P>
          </Div>
          <Div className="p-3 bg-secondary/20 rounded-lg">
            <P className="text-2xl font-bold">0</Div>
            <P className="text-xs text-muted-foreground">Downloads</P>
          </Div>
          <Div className="p-3 bg-secondary/20 rounded-lg">
            <P className="text-2xl font-bold">$0</Div>
            <P className="text-xs text-muted-foreground">Earned</P>
          </Div>
        </Div>
      </Div>
    </Card>
  );
}; 