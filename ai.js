const axios = require("axios");
const promptData = require("./prompt");

// Primary + fallback models
// 👉 Swap this to whichever DeepSeek model you want from HuggingFace
const PRIMARY_MODEL = "deepseek-ai/DeepSeek-R1-Distill-Llama-7B";
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
        timeout: 60000 // increase timeout for big models
      }
    );

    const data = response.data;

    // ✅ Check for error (e.g. "Model loading")
    if (data?.error) {
      throw new Error(data.error);
    }

    // ✅ Handle multiple possible outputs
    if (Array.isArray(data)) {
      if (data[0]?.generated_text) {
        return data[0].generated_text.trim();
      }
      if (data[0]?.text) {
        return data[0].text.trim();
      }
    }

    return "🤔 I couldn’t generate a reply.";
  } catch (err) {
    console.error(`❌ HF API error with ${model}:`, err.response?.data || err.message);
    throw err;
  }
}

async function askAI(question) {
  try {
    // Try primary model (DeepSeek)
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




