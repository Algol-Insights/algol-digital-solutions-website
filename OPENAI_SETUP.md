# OpenAI API Setup Guide

Quick guide to set up OpenAI API for AI features.

## Steps

1. **Create OpenAI Account**
   - Go to https://platform.openai.com/signup
   - Sign up or log in

2. **Get API Key**
   - Navigate to https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Give it a name (e.g., "Algol Digital Solutions")
   - Copy the key (you won't see it again!)

3. **Add to Environment Variables**
   
   Open `.env` file and add:
   ```env
   OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxx"
   ```

4. **Add Credits (if needed)**
   - New accounts get $5 free credit
   - Go to https://platform.openai.com/account/billing
   - Add payment method for continued usage
   - Set usage limits to control costs

5. **Verify Installation**
   
   Check that the `openai` package is installed:
   ```bash
   npm list openai
   ```
   
   If not installed:
   ```bash
   npm install openai
   ```

6. **Test the Integration**
   
   Try the AI features:
   - **Product Import**: Go to `/admin/products/import`
   - **Chatbot**: Click the chat button on any page

## Pricing

Using GPT-4o-mini (cost-effective model):
- Input: $0.15 per 1M tokens (~$0.0001 per request)
- Output: $0.60 per 1M tokens (~$0.0005 per response)

**Estimated Costs:**
- Product import (50 products): ~$0.02-0.05
- Chatbot conversation: ~$0.001-0.01
- Monthly usage (500 imports + 1000 chats): ~$20-30

## Security Best Practices

1. **Never commit `.env` to git**
   - Already in `.gitignore`
   - Use environment variables in production

2. **Use Organization Keys**
   - Create organization-specific keys
   - Easier to manage and rotate

3. **Set Usage Limits**
   - In OpenAI dashboard: Settings → Limits
   - Set monthly budget cap
   - Get alerts when approaching limit

4. **Rotate Keys Regularly**
   - Generate new key every 3-6 months
   - Delete old keys after migration

## Troubleshooting

### Error: "Invalid API key"
- Check key is copied correctly (no spaces)
- Verify key hasn't been deleted from OpenAI dashboard
- Restart Next.js server after adding key

### Error: "Insufficient credits"
- Check billing page: https://platform.openai.com/account/billing
- Add payment method or credits
- Free tier has $5 credit (expires after 3 months)

### Error: "Rate limit exceeded"
- You're making too many requests
- Implement caching to reduce API calls
- Upgrade to higher tier for more rate limit

## Alternative: Use Different AI Provider

If you prefer another AI service:

### Anthropic Claude
```bash
npm install @anthropic-ai/sdk
```
```env
ANTHROPIC_API_KEY="sk-ant-xxxxx"
```

### Google Gemini
```bash
npm install @google/generative-ai
```
```env
GOOGLE_AI_API_KEY="AIzaSyxxxxx"
```

Update API routes to use chosen provider.

## Support

- OpenAI Documentation: https://platform.openai.com/docs
- OpenAI Community: https://community.openai.com
- Pricing: https://openai.com/pricing
