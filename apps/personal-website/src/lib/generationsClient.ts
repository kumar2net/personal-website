export async function apiRequest(
  endpoint: string,
  method: 'GET' | 'POST' = 'GET',
  body?: any
) {
  const url = `${import.meta.env.VITE_GENERATIONS_API_URL}${endpoint}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${import.meta.env.VITE_GENERATIONS_API_KEY}`,
  };
  if (body) headers['Content-Type'] = 'application/json';

  let retries = 0;
  while (retries < 3) {
    try {
      const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      retries++;
      if (retries >= 3) throw err;
      const delay = 500 * Math.pow(2, retries);
      console.log(\`Retry \${retries}/3 in \${delay}ms\`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
