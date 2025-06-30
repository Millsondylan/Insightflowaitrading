import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/sessionHandler';
import { agentService, AgentType, ModelProvider } from '@/lib/ai/agent-service';

export async function POST(req: NextRequest) {
  try {
    // Authenticate the user
    const user = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { 
      agentType, 
      context, 
      triggeredBy,
      modelProvider = 'openai' // Default to OpenAI
    } = body;

    if (!agentType || !context) {
      return NextResponse.json(
        { error: 'Missing required parameters (agentType, context)' },
        { status: 400 }
      );
    }

    // Check if agentType is valid
    const validAgentTypes: AgentType[] = ['onboarding', 'strategy', 'market', 'journal', 'alert'];
    if (!validAgentTypes.includes(agentType as AgentType)) {
      return NextResponse.json(
        { error: `Invalid agent type. Must be one of: ${validAgentTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if modelProvider is valid
    const validProviders: ModelProvider[] = ['openai', 'anthropic', 'google', 'groq'];
    if (!validProviders.includes(modelProvider as ModelProvider)) {
      return NextResponse.json(
        { error: `Invalid model provider. Must be one of: ${validProviders.join(', ')}` },
        { status: 400 }
      );
    }

    // Create agent
    const agentId = await agentService.createAgent(
      user.id,
      agentType as AgentType,
      context,
      triggeredBy
    );

    // Start processing in the background
    // Note: In a production environment with serverless functions,
    // you might want to use a queue system instead
    agentService.processAgent(agentId, modelProvider as ModelProvider)
      .catch(error => console.error(`Background agent processing error for ${agentId}:`, error));

    return NextResponse.json({
      success: true,
      message: 'Agent created and processing started',
      agentId
    });
  } catch (error: any) {
    console.error('Error generating agent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate agent suggestions' },
      { status: 500 }
    );
  }
} 