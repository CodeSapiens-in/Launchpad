import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';


export async function POST(request: Request) {
  try {
    // Ensure API key is configured
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ API key is not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const { question, context, characterPrompt } = await request.json();

    // Validate required fields
    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Prepare the conversation context
    const contextPrompt = context
      ? `Context: ${context.title}\n${context.description}\n\nQuestion: `
      : 'Question: ';

    // Call GROQ API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `${characterPrompt || 'You are a helpful AI tutor assisting students with their questions.'} Please provide your response in markdown format with:
- **bold** for emphasis
- bullet points for lists
- new line \n for paragraphs or new lines
- numbered lists for steps
- code blocks only if necessary, with proper language tags
- headings for sections
- > for important notes or quotes

Keep your response clear, concise, and well-structured.`
          },
          {
            role: 'user',
            content: contextPrompt + question
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });


    if (!response.ok) {
      const error = await response.json();
      console.error('GROQ API error:', error);
      throw new Error(error.message || 'Failed to get response from GROQ');
    }

    const data = await response.json();
    const rawText = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    return NextResponse.json({ text: rawText });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}