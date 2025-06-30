import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Edit2, Trash2, Copy } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth.tsx';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Strategy {
  id: string;
  name: string;
  description: string;
  logic: any;
  parameters: any;
  created_at: string;
  updated_at: string;
}

export default function StrategyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStrategy();
    }
  }, [id]);

  const fetchStrategy = async () => {
    try {
      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setStrategy(data);
    } catch (error) {
      console.error('Error fetching strategy:', error);
      toast({
        title: "Error",
        description: "Failed to load strategy",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runBacktest = () => {
    navigate(`/backtest?strategy=${id}`);
  };

  const editStrategy = () => {
    navigate(`/strategy-builder?edit=${id}`);
  };

  const deleteStrategy = async () => {
    if (!confirm('Are you sure you want to delete this strategy?')) return;

    try {
      const { error } = await supabase
        .from('strategies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Strategy deleted",
        description: "Your strategy has been deleted successfully",
      });
      navigate('/strategy-builder');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const duplicateStrategy = async () => {
    if (!strategy) return;

    try {
      const { data, error } = await supabase
        .from('strategies')
        .insert({
          user_id: user?.id,
          name: `${strategy.name} (Copy)`,
          description: strategy.description,
          logic: strategy.logic,
          parameters: strategy.parameters
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Strategy duplicated",
        description: "A copy of your strategy has been created",
      });
      navigate(`/strategy/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading strategy...</div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Strategy not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/strategy-builder')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{strategy.name}</h1>
            <p className="text-muted-foreground">{strategy.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={runBacktest}>
            <Play className="mr-2 h-4 w-4" />
            Run Backtest
          </Button>
          <Button variant="outline" onClick={editStrategy}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={duplicateStrategy}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="destructive" onClick={deleteStrategy}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Strategy Logic</CardTitle>
          <CardDescription>
            The rules and conditions for this strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code>{JSON.stringify(strategy.logic, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
          <CardDescription>
            Configurable settings for this strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(strategy.parameters || {}).map(([key, value]) => (
              <div key={key} className="border rounded-lg p-3">
                <p className="text-sm font-medium">{key}</p>
                <p className="text-lg">{String(value)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(strategy.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{new Date(strategy.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 