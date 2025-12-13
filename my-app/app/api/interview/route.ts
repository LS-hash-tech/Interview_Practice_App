// backend API that calls OpenAI and handles security

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// function handles POST requests to /api/interview
export async function POST(request: Request) {
  try {
    // Get user's input from request body
    const { userInput } = await request.json();
    
    // SECURITY GUARD #1: Validate input exists and is a string
    if (!userInput || typeof userInput !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    
    // SECURITY GUARD #2: Prevent abuse by limiting input length
    if (userInput.length > 1000) {
      return NextResponse.json({ error: 'Input too long. Maximum 1000 characters.' }, { status: 400 });
    }
    
    // SECURITY GUARD #3: Check if input is empty after trimming whitespace
    const trimmedInput = userInput.trim();
    if (trimmedInput.length === 0) {
      return NextResponse.json({ error: 'Please enter a valid question' }, { status: 400 });
    }
    
    // SECURITY GUARD #4: Block prompt injection attempts
    // These patterns are common in trying to manipulate the AI
    const suspiciousPatterns = [
      'ignore previous instructions',
      'ignore above',
      'disregard',
      'system:',
      'assistant:'
    ];
    
    const hasInjection = suspiciousPatterns.some(pattern => 
      trimmedInput.toLowerCase().includes(pattern)
    );
    
    if (hasInjection) {
      return NextResponse.json({ error: 'Invalid input detected' }, { status: 400 });
    }

    // 5 different system prompts using different prompting techniques
    const systemPrompts = {
      // Technique #1: Zero-Shot - Direct instruction without examples
      zeroShot: "You are an expert interview coach. Provide interview preparation advice.",
      
      // Technique #2: Few-Shot Learning - Includes examples to guide AI
      fewShot: `You are an expert interview coach. Here are examples:

Example 1:
User: "Help me with behavioral questions"
Assistant: "Let's use the STAR method (Situation, Task, Action, Result)..."

Example 2:
User: "I need coding questions"
Assistant: "Let's start with arrays. Find two numbers that add up to a target..."

Now help the user.`,
      
      // Technique #3: Chain-of-Thought - Breaks down reasoning into steps
      chainOfThought: `You are an expert interview coach. Follow these steps:
1. Understand their interview type
2. Identify their experience level
3. Provide tailored questions
4. Offer answering tips`,
      
      // Technique #4: Role-Playing - AI adopts a specific persona
      rolePlaying: `You are a senior hiring manager at a top tech company with 500+ interviews conducted. Be friendly but thorough. Share insider tips.`,
      
      // Technique #5: Structured Output - Forces specific response format
      structured: `You are an expert interview coach. Structure responses as:
**Question:** [topic]
**Key Points:** [3-5 bullets]
**Example Answer:** [sample]
**Common Mistakes:** [avoid these]`
    };

    // Call OpenAI API with tuned settings
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using GPT-4o-mini model
      
      // Tuned settings for optimal responses
      temperature: 0.7,        // Balance between focused and creative (0-1 scale)
      max_tokens: 500,         // Limit response length
      top_p: 0.9,              // Control diversity of word choices
      frequency_penalty: 0.3,  // Reduce repetition in responses
      
      messages: [
        {
          role: "system",
          content: systemPrompts.chainOfThought // Using Chain-of-Thought technique
        },
        {
          role: "user",
          content: trimmedInput // User's actual question
        }
      ],
    });

    // Extract AI's response from completion
    const aiResponse = completion.choices[0].message.content;
    
    // Return response to frontend
    return NextResponse.json({ response: aiResponse });
    
  } catch (error) {
    // Log errors for debugging
    console.error('OpenAI Error:', error);
    
    // Return error message to frontend
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}