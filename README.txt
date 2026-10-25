FOLLOWLUX AI CUSTOMER SUPPORT — SETUP

This project upgrades the website chat to a real AI chatbot using the OpenAI API. The API key is used only in the server-side Netlify Function; do NOT paste it into index.html or publish it in frontend code.

FILES
- index.html: FOLLOWLUX website with AI chat frontend
- netlify/functions/chat.mjs: secure server-side AI endpoint
- netlify.toml: Netlify build configuration
- package.json: server dependency

DEPLOY TO NETLIFY
1. Unzip the entire project folder.
2. In Netlify, open your existing site and deploy the whole project folder (not only index.html). You can use Netlify's manual deploy UI or connect a Git repository. The functions folder and netlify.toml must be included.
3. In Netlify, go to Site configuration / Environment variables (wording may vary) and add:
   Key: OPENAI_API_KEY
   Value: your secret OpenAI API key
4. Optional environment variable:
   OPENAI_MODEL = gpt-5.5
5. Save the variable and redeploy the site so the function receives it.
6. Test the chat on the deployed HTTPS website. Do not test the AI function by opening index.html directly as a file; the Netlify function only runs when hosted/deployed.

API BILLING
OpenAI API usage is billed separately from a ChatGPT subscription and may require billing setup. Set usage limits/alerts in the OpenAI platform before sharing the website publicly.

SECURITY NOTES
- Never put the API key in index.html, a public repository, WhatsApp, or a screenshot.
- The AI cannot access real orders, payment records, or delivery tracking; it only knows the website facts included in its instructions and the conversation.
- Do not collect passwords, OTPs, recovery codes, or payment credentials through chat.
- Add additional abuse protection/rate limiting before large-scale public use.

Official OpenAI setup: https://developers.openai.com/api/docs/quickstart
