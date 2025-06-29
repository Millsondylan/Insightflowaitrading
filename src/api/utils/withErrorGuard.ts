// Generic API error guard for Netlify Functions
type AsyncHandler = (event: any, context: any) => Promise<any>;

export function withErrorGuard(handler: AsyncHandler): AsyncHandler {
  return async (event: any, context: any) => {
    try {
      return await handler(event, context);
    } catch (error) {
      console.error(`ERROR ${event.httpMethod} ${event.path}:`, error);
      
      // Log to monitoring service if configured
      if (process.env.VITE_AUDIT_WEBHOOK_URL) {
        // Send error to monitoring
        fetch(process.env.VITE_AUDIT_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'api_error',
            path: event.path,
            method: event.httpMethod,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
          })
        }).catch(console.error);
      }
      
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Something went wrong',
          message: process.env.NODE_ENV === 'development' 
            ? (error instanceof Error ? error.message : 'Unknown error')
            : undefined
        })
      };
    }
  };
} 