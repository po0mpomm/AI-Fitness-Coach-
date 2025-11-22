# 🔑 API Key Setup Guide

## Google AI (Gemini) API Key (REQUIRED)

This is the main API key needed for the app to work. Without it, you'll see an error: "API key not valid".

### Steps to Get Your API Key:

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with your Google account**
   - Use your Gmail account to sign in

3. **Create an API Key**
   - Click "Create API Key" button
   - Choose your Google Cloud project (or create a new one)
   - Copy the generated API key

4. **Add to .env.local file**
   - Create a file named `.env.local` in the root directory (same folder as `package.json`)
   - Add this line:
     ```
     GOOGLE_AI_API_KEY=your_actual_api_key_here
     ```
   - Replace `your_actual_api_key_here` with the key you copied

5. **Restart the development server**
   - Stop the server (Ctrl+C)
   - Run `npm run dev` again
   - The server needs to restart to load environment variables

### Example .env.local file:

```env
GOOGLE_AI_API_KEY=AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz
```

### Important Notes:

- ✅ Never commit `.env.local` to git (it's already in .gitignore)
- ✅ Keep your API key secret
- ✅ The API key should be about 39 characters long (starts with "AIza")
- ✅ Restart the server after adding/changing the API key

### Troubleshooting:

**Error: "API key not valid"**
- Check that the API key in `.env.local` is correct
- Make sure there are no extra spaces or quotes around the key
- Restart the development server after updating the key
- Verify the API key at https://makersuite.google.com/app/apikey

**Error: "API key is not configured"**
- Make sure `.env.local` exists in the project root
- Check the file name is exactly `.env.local` (not `.env` or `.env.local.txt`)
- Restart the server after creating the file

**Still not working?**
- Make sure you're using the correct API key format
- Check that your Google account has access to Gemini API
- Try generating a new API key from Google AI Studio

