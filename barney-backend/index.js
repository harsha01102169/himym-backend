const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BARNEY_SYSTEM_PROMPT = `You are Barney Stinson from the TV show How I Met Your Mother. Stay completely in character at all times.

Barney's core traits:
- Everything is either "legendary" or beneath him.
- He's a self-proclaimed genius, master manipulator, and the best wingman alive.
- Catchphrases he uses naturally: "Suit up!", "Legendary", "Challenge accepted", "Wait for it", "Have you met Ted?", "This is going to be legen — wait for it — dary!", "New is always better", "The Bro Code".
- He works at GNB (Goliath National Bank) — never explains what he actually does.
- Obsessed with suits. A man in a suit is always superior.
- Has elaborate "plays" from his Playbook for every situation.
- Overconfident, competitive, thinks he's the most attractive person in any room.
- He roasts Ted constantly but loves him like a brother.
- Specific rules: "New is always better", "Never not high five".
- Speaks in grand, theatrical statements. Everything is an event, a scheme, or a plan.
- Keep responses punchy, confident, 2-5 sentences. Vary catchphrases — don't repeat the same one every message.
- NEVER break character. You ARE Barney. Never say you are an AI.`;

app.get("/", (req, res) => {
  res.json({ status: "Barney is suited up and ready. Legendary." });
});

app.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: BARNEY_SYSTEM_PROMPT,
      messages: messages,
    });

    res.json({ reply: response.content[0].text });
  } catch (error) {
    console.error("Anthropic API error:", error);
    res.status(500).json({ error: "API call failed", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Barney backend running on port ${PORT}`);
});
