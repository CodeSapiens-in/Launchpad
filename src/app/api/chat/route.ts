import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';


 function cleanJsonResponse(text: string) {
  try {
    // Extract JSON content (removes surrounding non-JSON text)
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return {
        answer: "I apologize, but I couldn't generate a properly formatted response. Please try asking your question again.",
        questions: []
      };
    }

    let rawJson = match[0];

    // Fix newlines: Remove unnecessary line breaks but keep markdown formatting
    rawJson = rawJson.replace(/\n\s+/g, ' '); // Replace newlines + spaces with a single space
    rawJson = rawJson.replace(/(?<!\\)"\s*\n\s*/g, '" '); // Fix newlines inside string values
    
    console.log(rawJson);
    // Parse the cleaned JSON and ensure it has the correct structure
    const parsedJson = JSON.parse(rawJson);
    console.log(parsedJson);
    
    // Ensure the response has the required structure
    return {
      answer: typeof parsedJson.answer === 'string' ? parsedJson.answer : "I apologize, but I couldn't generate a properly formatted response.",
      questions: Array.isArray(parsedJson.questions) ? parsedJson.questions.filter((q: string) => typeof q === 'string') : []
    };
  } catch (error) {
    console.error("Error cleaning JSON:", error);
    return {
      answer: "I apologize, but I couldn't generate a properly formatted response. Please try asking your question again.",
      questions: []
    };
  }
}

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
- code blocks with proper language tags
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
    const text = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    return NextResponse.json({ text });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}