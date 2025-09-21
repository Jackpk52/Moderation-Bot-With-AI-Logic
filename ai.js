const axios = require("axios");
const promptData = require("./prompt");

// Primary + fallback models
const PRIMARY_MODEL = "mistralai/Mistral-7B-Instruct-v0.2";
const FALLBACK_MODEL = "gpt2";

async function queryHF(model, question) {
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: question },
      {
        headers: {
          Authorization: `Bearer ${promptData.hfApiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    // ✅ Handle successful text generation
    if (Array.isArray(response.data) && response.data[0]?.generated_text) {
      return response.data[0].generated_text.trim();
    }

    // ❌ Handle Hugging Face error
    if (response.data?.error) {
      throw new Error(response.data.error);
    }

    return "🤔 I couldn’t generate a reply.";
  } catch (err) {
    console.error(`❌ HF API error with ${model}:`, err.response?.data || err.message);
    throw err;
  }
}

async function askAI(question) {
  try {
    // Try primary model
    return await queryHF(PRIMARY_MODEL, question);
  } catch (err) {
    console.log("⚠️ Primary model failed, falling back to GPT-2...");
    try {
      return await queryHF(FALLBACK_MODEL, question);
    } catch (fallbackErr) {
      console.error("❌ Fallback model also failed:", fallbackErr.response?.data || fallbackErr.message);
      return "⚠️ AI service is currently unavailable.";
    }
  }
}

module.exports = { askAI };

