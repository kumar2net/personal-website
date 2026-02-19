export function extractResponseText(response: unknown): string {
  if (!response || typeof response !== "object") {
    return "";
  }

  const typed = response as {
    output_text?: unknown;
    output?: Array<{ content?: Array<{ text?: unknown }> }>;
  };

  if (typeof typed.output_text === "string" && typed.output_text.trim()) {
    return typed.output_text.trim();
  }

  const chunks: string[] = [];
  const output = Array.isArray(typed.output) ? typed.output : [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string" && part.text.trim()) {
        chunks.push(part.text.trim());
      }
    }
  }

  return chunks.join("\n").trim();
}

export function safeJsonParse<T>(raw: string): T | null {
  if (!raw || typeof raw !== "string") {
    return null;
  }

  const fenced = raw.match(/```json\s*([\s\S]*?)```/iu);
  const candidate = (fenced?.[1] ?? raw).trim();

  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}
