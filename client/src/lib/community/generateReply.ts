type Post = {
  title: string;
  body: string;
  tags?: string[];
};

export function generateReply(post: Post): {
  tone: "Supportive" | "Analytical" | "Curious";
  reply: string;
} {
  const allText = `${post.title} ${post.body} ${post.tags?.join(' ') || ''}`.toLowerCase();
  
  // Determine tone based on content analysis
  let tone: "Supportive" | "Analytical" | "Curious" = "Analytical";
  
  // Supportive tone indicators
  const supportiveKeywords = ['help', 'struggling', 'confused', 'lost', 'frustrated', 'stuck', 'problem', 'issue', 'difficult', 'hard', 'can\'t', 'unable', 'failed', 'losing', 'loss'];
  const needsSupport = supportiveKeywords.some(keyword => allText.includes(keyword));
  
  // Curious tone indicators
  const curiousKeywords = ['what do you think', 'opinion', 'thoughts', 'feedback', 'review', 'experience', 'anyone tried', 'has anyone', 'wondering', 'curious'];
  const isAskingForOpinions = curiousKeywords.some(keyword => allText.includes(keyword));
  
  if (needsSupport) {
    tone = "Supportive";
  } else if (isAskingForOpinions) {
    tone = "Curious";
  }
  
  // Generate reply based on content and tone
  let reply = "";
  
  // Opening based on tone
  if (tone === "Supportive") {
    reply += "Thanks for sharing this - it sounds like a challenging situation, but you're definitely not alone here! ";
  } else if (tone === "Curious") {
    reply += "Great question! This is definitely something worth exploring. ";
  } else {
    reply += "Thanks for sharing this setup! ";
  }
  
  // Content-specific responses
  if (allText.includes('strategy') || allText.includes('setup')) {
    if (allText.includes('entry')) {
      reply += "Your entry logic looks solid. ";
    }
    if (allText.includes('exit') || allText.includes('stop loss')) {
      reply += "Good to see you're thinking about exit strategies. ";
    }
    if (allText.includes('risk')) {
      reply += "Risk management is crucial - you're on the right track. ";
    }
  }
  
  // Technical analysis mentions
  if (allText.includes('rsi')) {
    reply += "RSI can be a great momentum indicator. ";
  }
  if (allText.includes('moving average') || allText.includes('ma ')) {
    reply += "Moving averages are solid for trend identification. ";
  }
  if (allText.includes('breakout')) {
    reply += "Breakout strategies can be very effective in trending markets. ";
  }
  if (allText.includes('support') || allText.includes('resistance')) {
    reply += "Support and resistance levels are fundamental to price action. ";
  }
  
  // Market conditions
  if (allText.includes('volatile') || allText.includes('volatility')) {
    reply += "Volatility can definitely impact strategy performance. ";
  }
  if (allText.includes('sideways') || allText.includes('choppy')) {
    reply += "Choppy markets can be tricky - filtering conditions might help. ";
  }
  
  // Suggestions based on tone and content
  if (tone === "Supportive") {
    if (allText.includes('losing') || allText.includes('loss')) {
      reply += "Have you considered reviewing your trades in the Journal section? It might help identify patterns. ";
    } else {
      reply += "The Academy has some great resources that might help clarify things. ";
    }
    reply += "Don't give up - every trader goes through these challenges!";
  } else if (tone === "Curious") {
    reply += "I'd love to hear what others think about this too. ";
    if (allText.includes('backtest')) {
      reply += "Have you run any backtests on this approach?";
    } else {
      reply += "What's been your experience so far?";
    }
  } else {
    // Analytical suggestions
    if (allText.includes('strategy') && !allText.includes('volatility')) {
      reply += "Have you considered adding a volatility filter to avoid choppy conditions? ";
    }
    if (allText.includes('entry') && !allText.includes('volume')) {
      reply += "Volume confirmation might strengthen your entry signals. ";
    }
    if (allText.includes('breakout') && !allText.includes('retest')) {
      reply += "Waiting for a retest of the breakout level could improve your win rate. ";
    }
    if (!allText.includes('backtest')) {
      reply += "Consider backtesting this approach to validate the edge.";
    } else {
      reply += "The backtesting results look promising!";
    }
  }
  
  return {
    tone,
    reply: reply.trim()
  };
} 