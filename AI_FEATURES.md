# AI Features Documentation

This document describes the AI-powered features integrated into Algol Digital Solutions website.

## Overview

The platform now includes two major AI features:
1. **AI Product Import** - Automatically parse price lists and import products
2. **Algol Chatbot** - Customer support and product recommendation assistant

---

## 1. AI Product Import

### Purpose
Reduce manual data entry time and errors by using AI to automatically extract product information from unstructured price lists.

### Location
- **Admin Panel**: `/admin/products/import`
- **API Endpoints**:
  - `/api/admin/products/ai-parse` - Parse price list with AI
  - `/api/admin/products/ai-import` - Import parsed products to database

### How It Works

1. **Paste Price List**: Admin pastes a price list in any format (text, spreadsheet data, etc.)

2. **AI Parsing**: OpenAI GPT-4 extracts:
   - Product name and model
   - Brand
   - Category
   - Price
   - Stock quantity
   - Specifications (processor, RAM, storage, etc.)
   - Description

3. **Review & Edit**: Admin can review and edit all parsed data before import

4. **Import**: Products are bulk-imported to the database with:
   - Product records created
   - Initial stock logged in inventory system
   - All relationships properly established

### Example Price List Formats

The AI can understand various formats:

```
Dell Latitude 5420 - $850 - 10 units
Intel i5, 8GB RAM, 256GB SSD

HP ProBook 450 G8 | $920 | Stock: 5
Specs: i7, 16GB, 512GB

Lenovo ThinkPad X1 Carbon
Price: $1,200
Quantity: 3
i7-11th Gen, 16GB RAM, 512GB NVMe SSD
```

### Configuration

Required environment variable:
```env
OPENAI_API_KEY="your_openai_api_key_here"
```

Get your API key from: https://platform.openai.com/api-keys

### Cost Considerations

- Model: GPT-4o-mini (cost-effective)
- Average cost: ~$0.01-0.05 per price list parse
- Typical usage: 10-50 products per parse

---

## 2. Algol Chatbot

### Purpose
Provide 24/7 customer support, answer product questions, and assist with orders using AI-powered conversation.

### Location
- **Frontend**: Available on all pages (bottom-right floating button)
- **API Endpoint**: `/api/chatbot`

### Features

1. **Product Recommendations**
   - AI has access to current product catalog
   - Can recommend specific models based on requirements
   - Provides pricing and availability information

2. **Technical Support**
   - Answers specification questions
   - Compares products
   - Explains technical terms

3. **Customer Service**
   - Order inquiries
   - Delivery information
   - General company information
   - Contact details

4. **Natural Conversation**
   - Context-aware responses
   - Maintains conversation history
   - Professional and friendly tone

### How It Works

1. **User Message**: Customer sends a message through the chat widget

2. **Context Building**:
   - Last 5 messages for conversation context
   - Current product catalog (top 50 in-stock items)
   - Company information and policies

3. **AI Response**: OpenAI generates a relevant, helpful response

4. **Product Integration**: Can reference specific products with prices and specs

### Example Conversations

**Product Inquiry:**
```
User: I need a laptop for video editing under $1000
Bot: I'd recommend the HP ProBook 450 G8 at $920. It features an Intel i7 
     processor, 16GB RAM, and 512GB SSD - perfect for video editing. It's 
     currently in stock. Would you like more details or to compare with 
     other options?
```

**Technical Support:**
```
User: What's the difference between SSD and HDD?
Bot: SSDs (Solid State Drives) are faster, more reliable, and use less 
     power than traditional HDDs (Hard Disk Drives). SSDs have no moving 
     parts, making them more durable. All our current laptop models come 
     with SSDs for better performance.
```

### Configuration

Required environment variable:
```env
OPENAI_API_KEY="your_openai_api_key_here"
```

### Customization

Edit the system prompt in `/app/api/chatbot/route.ts` to:
- Update company information
- Modify chatbot personality
- Add specific policies or procedures
- Change response guidelines

### Cost Considerations

- Model: GPT-4o-mini (cost-effective)
- Average cost: ~$0.001-0.01 per conversation
- Context includes product catalog for better recommendations

---

## Security & Best Practices

### API Key Management
- Store OpenAI API key in `.env` file (never commit to git)
- Use environment variables in production
- Rotate keys periodically

### Rate Limiting
Consider implementing rate limiting to prevent abuse:
```typescript
// Example: Limit to 10 requests per minute per IP
import rateLimit from 'express-rate-limit'
```

### Error Handling
Both features include comprehensive error handling:
- Graceful fallbacks if AI is unavailable
- User-friendly error messages
- Detailed logging for debugging

### Content Filtering
The chatbot is configured to:
- Stay on-topic (products and support)
- Not make unauthorized promises
- Admit when it doesn't know something
- Suggest human support when needed

---

## Monitoring & Analytics

### Track Usage
Monitor these metrics:
- Number of products imported via AI
- Chatbot conversation count
- Customer satisfaction with AI responses
- Cost per conversation/import

### Logging
All AI interactions are logged:
```typescript
console.log('AI parsing request:', { itemCount, timestamp })
console.log('Chatbot query:', { message, userId, timestamp })
```

---

## Troubleshooting

### Common Issues

**AI Import Not Working**
- Check OpenAI API key is set correctly
- Verify API key has sufficient credits
- Check price list format (should be plain text)

**Chatbot Not Responding**
- Verify OpenAI API key
- Check network connectivity
- Review browser console for errors
- Ensure chatbot component is loaded

**Inaccurate Parsing**
- Add more context to price list
- Use consistent formatting
- Include explicit units and labels
- Review and edit parsed data before import

### Debug Mode

Enable detailed logging:
```typescript
// In .env
DEBUG=true
```

---

## Future Enhancements

Potential improvements:
- File upload support (Excel, CSV, PDF)
- Image recognition for product photos
- Voice chat support
- Multi-language chatbot
- Sales analytics from chatbot conversations
- Automated product descriptions using AI
- Price optimization recommendations

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review OpenAI documentation: https://platform.openai.com/docs
- Contact development team

---

## Version History

- **v1.0** (December 2025)
  - Initial release
  - AI product import
  - Customer chatbot
  - GPT-4o-mini integration
