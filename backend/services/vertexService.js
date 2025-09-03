const { VertexAI } = require('@google-cloud/vertexai');

function getVertexClient() {
  const project = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION || 'us-central1';
  if (!project) {
    throw new Error('GCP_PROJECT_ID env var is required');
  }
  return new VertexAI({ project, location });
}

async function generateTopicsPrompted(promptText) {
  const modelName = process.env.RECOMMENDER_MODEL || 'gemini-1.5-pro';
  const vertex = getVertexClient();
  const model = vertex.getGenerativeModel({ model: modelName });
  const req = {
    contents: [{ role: 'user', parts: [{ text: promptText }]}],
    generationConfig: {
      temperature: 0.4,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };
  const res = await model.generateContent(req);
  const candidates = res?.response?.candidates || [];
  const text = candidates[0]?.content?.parts?.[0]?.text || '';
  return text;
}

module.exports = {
  generateTopicsPrompted,
};

