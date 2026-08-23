import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      code,
      question,
      message,
      action,
      language,
      problemTitle,
      problemDescription,
      example,
      messages,
    } = body;

    // =========================
    // GET GROQ API KEY
    // =========================

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Groq API key is missing. Please add GROQ_API_KEY to .env.local",
        },
        { status: 500 }
      );
    }

    let prompt = "";

    // =========================
    // EXPLAIN CODE
    // =========================

    if (action === "explain") {
      if (!code?.trim()) {
        return NextResponse.json(
          {
            error: "Please provide some code to explain.",
          },
          { status: 400 }
        );
      }

      prompt = `
You are CodeMentor AI, a friendly AI coding mentor.

Explain the following ${language} code in simple, beginner-friendly language.

Include:

1. What the code does
2. Step-by-step explanation
3. Important concepts used
4. Simple example if helpful
5. Tips for improving the code

Code:

${code}
`;
    }

    // =========================
    // DEBUG CODE
    // =========================

    else if (action === "debug") {
      if (!code?.trim()) {
        return NextResponse.json(
          {
            error: "Please provide some code to debug.",
          },
          { status: 400 }
        );
      }

      prompt = `
You are an expert programming mentor.

Analyze the following ${language} code and find bugs.

Return your response EXACTLY in this format:

ERRORS:
List all errors clearly.

WHY:
Explain why these errors happen.

FIXED_CODE:
Provide the complete corrected code only.

CONCEPT:
Explain the important programming concept related to the mistake.

TIP:
Give one useful improvement tip.

Code:

${code}
`;
    }

    // =========================
    // CHECK PRACTICE SOLUTION
    // =========================

    else if (action === "check-solution") {
      if (!code?.trim()) {
        return NextResponse.json(
          {
            error: "Please provide your solution code.",
          },
          { status: 400 }
        );
      }

      prompt = `
You are CodeMentor AI, reviewing a student's programming solution.

Programming Language:
${language}

Problem Title:
${problemTitle}

Problem Description:
${problemDescription}

Example:
${example}

Student's Code:

${code}

Analyze whether the solution correctly solves the problem.

Return your response EXACTLY in this format:

VERDICT:
Correct / Partially Correct / Incorrect

FEEDBACK:
Give beginner-friendly feedback.

ERRORS:
Explain any errors or write "No major errors found."

SUGGESTIONS:
Suggest how the student can improve the solution.

SCORE:
Give a score out of 10, for example: 8/10
`;
    }

    // =========================
    // AI CHAT MENTOR
    // =========================

    else if (action === "chat") {
      const userQuestion =
        question?.trim() ||
        message?.trim() ||
        code?.trim();

      if (!userQuestion) {
        return NextResponse.json(
          {
            error: "Please enter a question.",
          },
          { status: 400 }
        );
      }

      // Make sure messages is an array
      const conversationHistory = Array.isArray(messages)
        ? messages
        : [];

      const chatMessages = [
        {
          role: "system",
          content: `
You are CodeMentor AI, a friendly, patient and highly knowledgeable AI Coding Mentor.

Your goal is to help students LEARN programming rather than simply give them answers.

Teaching style:

- Explain difficult concepts in simple beginner-friendly language.
- Use real-world analogies when useful.
- Give small and clear code examples.
- Break complicated problems into steps.
- Encourage the student to think independently.
- If the student makes a mistake, explain WHY it is wrong.
- Never make the student feel bad for asking basic questions.
- Ask a short follow-up question when it would help learning.

You can help with:

- Programming fundamentals
- JavaScript
- TypeScript
- React
- Next.js
- Node.js
- Python
- Java
- C
- C++
- HTML
- CSS
- SQL
- MongoDB
- Data Structures
- Algorithms
- AI / ML basics
- Debugging
- Web development
- Computer science concepts
- Coding interview preparation

When explaining code:

1. Explain what it does.
2. Explain how it works.
3. Explain important concepts.
4. Give an example.
5. Give a small tip for remembering the concept.

Keep answers clear and structured.

Use Markdown formatting when useful.
`,
        },
        ...conversationHistory
          .filter(
            (msg: any) =>
              msg &&
              (msg.role === "user" || msg.role === "assistant") &&
              typeof msg.content === "string"
          )
          .slice(-10),
        {
          role: "user",
          content: userQuestion,
        },
      ];

      // Directly use conversation history
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },

          body: JSON.stringify({
            model: "openai/gpt-oss-20b",

            messages: chatMessages,

            temperature: 0.7,

            max_tokens: 2000,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Groq Chat Error:", data);

        return NextResponse.json(
          {
            error:
              data?.error?.message ||
              "Failed to get a response from Groq AI.",
          },
          {
            status: response.status,
          }
        );
      }

      const result =
        data?.choices?.[0]?.message?.content;

      if (!result) {
        return NextResponse.json(
          {
            error: "AI did not return a response.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        result,
      });
    }

    // =========================
    // INVALID ACTION
    // =========================

    else {
      return NextResponse.json(
        {
          error: "Invalid AI action.",
        },
        { status: 400 }
      );
    }

    // =========================
    // CALL GROQ API
    // EXPLAIN / DEBUG / PRACTICE
    // =========================

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          model: "openai/gpt-oss-20b",

          messages: [
            {
              role: "system",
              content:
                "You are CodeMentor AI, an intelligent, helpful and beginner-friendly AI coding mentor.",
            },

            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.7,

          max_tokens: 2000,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);

      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "Failed to get a response from Groq AI.",
        },
        {
          status: response.status,
        }
      );
    }

    const result =
      data?.choices?.[0]?.message?.content;

    if (!result) {
      return NextResponse.json(
        {
          error: "AI did not return a response.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result,
    });
  } catch (error) {
    console.error("AI Route Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong with the AI request.",
      },
      {
        status: 500,
      }
    );
  }
}