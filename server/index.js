import "dotenv/config";
import express from "express";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const app = express();
app.use(express.json({ limit: "1mb" }));
const PORT = 3000;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CareerPilot AI backend is running",
  });
});

app.post("/api/test-resume", (req, res) => {
  const { resumeText } = req.body ?? {};

  if (typeof resumeText !== "string" || !resumeText.trim()) {
    return res.status(400).json({
      error: "Resume text is required",
    });
  }

  res.json({
    success: true,
    message: "Resume text received successfully",
    characterCount: resumeText.length,
  });
});

app.post("/api/analyze-resume", async (req, res) => {
  const { resumeText } = req.body ?? {};

  if (typeof resumeText !== "string" || !resumeText.trim()) {
    return res.status(400).json({
      error: "Resume text is required",
    });
  }

  if (resumeText.length > 30000) {
    return res.status(413).json({
      error: "Resume text must be 30000 characters or fewer",
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are a professional resume reviewer. Give honest, actionable feedback based only on the resume. Never invent skills or experience.",
        },
        {
          role: "user",
          content: `Analyze this resume. Return:
1. Overall summary
2. Three strengths
3. Three improvement areas
4. Important skills identified
5. Actionable suggestions

Resume text:
${resumeText}`,
        },
      ],
      temperature: 0.3,
      max_completion_tokens: 1500,
    });

    const analysis = completion.choices[0]?.message?.content;

    if (!analysis) {
      return res.status(502).json({
        error: "AI returned an empty response. Please try again.",
      });
    }

    return res.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Resume analysis failed:", error.message);

    return res.status(502).json({
      error: "Resume analysis failed. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
