import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Send to monitoring service if configured
    if (import.meta.env.VITE_AUDIT_WEBHOOK_URL) {
      fetch(import.meta.env.VITE_AUDIT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'react_error',
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" / /></Props>
                Something went wrong
              </CardTitle />
            <CardContent className="space-y-4">
              <P className="text-sm text-muted-foreground" />
                We encountered an unexpected error. The error has been logged and we'll look into it.
              </CardContent>
              {import.meta.env.DEV && this.state.error && (
                <Pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                  {this.state.error.message}
                </Pre>
              )}
              <Button onClick={this.handleReset} className="w-full">
                Reload Page
              </button />
          </Button>
        </Div>
      );
    }

    return this.props.children;
  }
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 