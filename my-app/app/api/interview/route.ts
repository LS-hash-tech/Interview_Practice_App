import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userInput } = await request.json();
    
    // SECURITY GUARDS
    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    if (userInput.length > 1000) {
      return NextResponse.json({ error: 'Input too long. Maximum 1000 characters.' }, { status: 400 });
    }
    
    const trimmedInput = userInput.trim();
    if (trimmedInput.length === 0) {
      return NextResponse.json({ error: 'Please enter a valid question' }, { status: 400 });
    }
    
    const suspiciousPatterns = ['ignore previous instructions', 'ignore above', 'disregard', 'system:', 'assistant:'];
    const hasInjection = suspiciousPatterns.some(pattern => trimmedInput.toLowerCase().includes(pattern));
    
    if (hasInjection) {
      return NextResponse.json({ error: 'Invalid input detected' }, { status: 400 });
    }

    // 5 DIFFERENT SYSTEM PROMPTS
    const systemPrompts = {
      zeroShot: "You are an expert interview coach. Provide interview preparation advice.",
      
      fewShot: `You are an expert interview coach. Here are examples:

Example 1:
User: "Help me with behavioral questions"
Assistant: "Let's use the STAR method (Situation, Task, Action, Result)..."

Example 2:
User: "I need coding questions"
Assistant: "Let's start with arrays. Find two numbers that add up to a target..."

Now help the user.`,
      
      chainOfThought: `You are an expert interview coach. Follow these steps:
1. Understand their interview type
2. Identify their experience level
3. Provide tailored questions
4. Offer answering tips`,
      
      rolePlaying: `You are a senior hiring manager at a top tech company with 500+ interviews conducted. Be friendly but thorough. Share insider tips.`,
      
      structured: `You are an expert interview coach. Structure responses as:
**Question:** [topic]
**Key Points:** [3-5 bullets]
**Example Answer:** [sample]
**Common Mistakes:** [avoid these]`
    };

    // TUNED OPENAI SETTINGS
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
      frequency_penalty: 0.3,
      messages: [
        {
          role: "system",
          content: systemPrompts.chainOfThought
        },
        {
          role: "user",
          content: trimmedInput
        }
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    return NextResponse.json({ response: aiResponse });
    
  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}