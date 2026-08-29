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
    const e1 = process.env.e1;
    const e2 = process.env.e2;
    const e3 = process.env.e3;
    const a1 = process.env.a1;
    const a2 = process.env.a2;
    const a3 = process.env.a3;
    const a4 = process.env.a4;
    const r1 = process.env.r1;
    const r2 = process.env.r2;
    const r3 = process.env.r3;
    const c = process.env.c;
    const c2 = process.env.c2;
    const con2 = process.env.con2
    const API = process.env.API
    const model = process.env.model
    const t = process.env.t
    const mt = process.env.mt

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

    if (action === a1) {
      if (!code?.trim()) {
        return NextResponse.json(
          {
            error: "Please provide some code to explain.",
          },
          { status: 400 }
        );
      }

      prompt = e1 || '';
    }

    // =========================
    // DEBUG CODE
    // =========================

    else if (action === a2) {
      if (!code?.trim()) {
        return NextResponse.json(
          {
            error: "Please provide some code to debug.",
          },
          { status: 400 }
        );
      }

      prompt = e2 || '';
    }

    // =========================
    // CHECK PRACTICE SOLUTION
    // =========================

    else if (action === a3) {
      if (!code?.trim()) {
        return NextResponse.json(
          {
            error: "Please provide your solution code.",
          },
          { status: 400 }
        );
      }

      prompt = e3 || '';
    }

    // =========================
    // AI CHAT MENTOR
    // =========================

    else if (action === a4) {
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
          role: r1,
          content: c || "",
        },
        ...conversationHistory
          .filter(
            (msg: any) =>
              msg &&
              (msg.role === r2 || msg.role === r2) &&
              typeof msg.content === con2
          )
          .slice(-10),
        {
          role: r2,
          content: userQuestion,
        },
      ];

      // Directly use conversation history
      const response = await fetch(
        `${API}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },

          body: JSON.stringify({
            model: `${model}`,

            messages: chatMessages,

            temperature: t,

            max_tokens: mt,
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
      `${API}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          model: `${model}`,

          messages: [
            {
              role: r1,
              content:
                c2,
            },

            {
              role: r2,
              content: prompt,
            },
          ],

          temperature: t,

          max_tokens: mt,
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