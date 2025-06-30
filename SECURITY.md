# Security Guidelines for InsightFlow AI Trading

This document outlines security best practices for handling sensitive data in the InsightFlow AI Trading platform.

## API Keys and Sensitive Data

### ⚠️ IMPORTANT: API Key Exposure Alert

We've detected that API keys and wallet addresses were previously exposed. If you've committed API keys or other sensitive data to this repository, take these steps immediately:

1. **Revoke and rotate all exposed API keys**:
   - OpenAI API key
   - Supabase API key
   - SendGrid API key
   - All market data API keys
   - Any other exposed credentials

2. **Update wallet addresses**:
   - Consider using new wallet addresses for any production services
   - Review transaction history for suspicious activity

### Secure Environment Variables

Always use environment variables for sensitive data:

```bash
# Local development
cp .env.example .env
# Edit .env with your actual values

# Lovable deployment
cp lovable.env.example lovable.env
# Edit lovable.env with your actual values
```

### Never Commit Sensitive Data

- Add `.env` and `lovable.env` to `.gitignore`
- Use `.env.example` and `lovable.env.example` as templates (without real values)
- Run `npm run check:sensitive` before committing to check for leaked credentials

## Security Tools

This repository includes tools to help manage sensitive data:

```bash
# Check for sensitive data in files
npm run check:sensitive

# Create a template from an existing .env file
npm run env:template

# Validate environment variables against a template
npm run env:validate
```

## Lovable Deployment Security

When deploying to Lovable:

1. Set environment variables in the Lovable dashboard, not in files
2. Use the `lovable.env.example` as a reference for required variables
3. Ensure DATABASE_URL and SUPABASE_KEY are properly secured
4. Enable any available security features in the Lovable dashboard

## Database Security

- Use parameterized queries to prevent SQL injection
- Limit database permissions to only what's necessary
- Regularly back up your database
- Monitor database access logs

## Frontend Security

- Implement proper authentication and authorization
- Use HTTPS for all connections
- Sanitize user inputs to prevent XSS attacks
- Implement proper CORS policies

## Reporting Security Issues

If you discover a security vulnerability, please report it by:

1. **DO NOT** create a public GitHub issue
2. Email [security@insightflow.ai](mailto:security@insightflow.ai) with details
3. Include steps to reproduce the vulnerability

## Security Updates

- Keep all dependencies updated
- Review security advisories regularly
- Apply security patches promptly 