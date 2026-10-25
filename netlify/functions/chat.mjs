import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MAX_MESSAGE_LENGTH = 1200;
const ALLOWED_ROLES = new Set(['user', 'assistant']);

const instructions = `You are the customer-support AI for FOLLOWLUX, a small social-media promotion and creator-support service in India. Be friendly, concise, clear, and honest. Use simple English; if the customer writes in Hindi or Hinglish, answer in the same language where possible.

KNOWN WEBSITE FACTS:
- Instagram follower packages listed on the website: 1,000 = ₹60; 5,000 = ₹300; 10,000 = ₹600.
- The site describes promotion support for Instagram, Facebook, Telegram, X/Twitter and YouTube, plus content and growth guidance. Availability and prices for services other than the listed Instagram follower packages must be confirmed with support.
- WhatsApp support: +91 98337 95921; link: https://wa.me/919833795921
- The site does not provide automatic live order tracking. Do not claim to see a customer's order, payment, delivery progress, or account.
- Delivery time varies by service; never invent an ETA, guarantee results, or claim an order is placed.
- Refund terms: the website says orders are generally non-refundable after processing begins, except where a refund or other remedy is required by applicable law. Encourage customers to read the website terms and confirm terms in writing before paying. Do not imply legal rights are waived.
- Never request or accept passwords, OTPs, recovery codes, full card/bank details, or other sensitive credentials. Warn users not to share them.
- Encourage customers to confirm exact service, quantity, price, delivery estimate, refill/cancellation terms, and payment method in writing before paying.
- Do not invent offers, pricing, guarantees, refill promises, reviews, policies, or business capabilities. If you do not know, say so and direct them to WhatsApp.
- This is a support assistant, not a human agent. Never pretend to be human. For complaints, payment disputes, order-specific questions, or uncertain details, offer WhatsApp handoff.
- Keep answers helpful and normally under 120 words. Do not provide advice to steal accounts, fake engagement deceptively, or evade platform rules.`;

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed.' }), {
      status: 405, headers: { 'Content-Type': 'application/json', 'Allow': 'POST' }
    });
  }
  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'AI support is not configured yet. The site owner must add OPENAI_API_KEY in Netlify environment variables.' }), {
      status: 503, headers: { 'Content-Type': 'application/json' }
    });
  }
  try {
    const body = await request.json();
    const message = typeof body.message === 'string' ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH) : '';
    if (!message) return new Response(JSON.stringify({ error: 'Please enter a message.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const history = Array.isArray(body.history) ? body.history.slice(-8).filter(x => x && ALLOWED_ROLES.has(x.role) && typeof x.content === 'string').map(x => ({ role: x.role, content: x.content.slice(0, MAX_MESSAGE_LENGTH) })) : [];
    const input = [...history, { role: 'user', content: message }];
    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.5',
      instructions,
      input,
      max_output_tokens: 350,
      store: false
    });
    const reply = (result.output_text || '').trim();
    if (!reply) throw new Error('Empty AI response');
    return new Response(JSON.stringify({ reply }), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('FOLLOWLUX AI function error:', error?.status || error?.message || 'unknown');
    const status = error?.status === 429 ? 429 : 502;
    const msg = status === 429 ? 'The AI support is busy right now. Please wait a moment and try again.' : 'The AI support service had a problem. Please try again or use WhatsApp support.';
    return new Response(JSON.stringify({ error: msg }), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
  }
};
