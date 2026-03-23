const dictionary: Record<string, string> = {
  "good morning": "Kiptai mising",
  "hello": "Chamgei",
  "hello my good people": "Amu ee piikyuk che myach, che eecheen,",
  "thank you": "Kongoi",
  "how are you": "Ago tugul",
  "where is the nearest market": "Kobo ne market ne bo kararan?",
};

export async function translateToKalenjin(text: string): Promise<string> {
  const input = text.trim();
  if (!input) return "";

  const endpointCandidates = [
    process.env.NEXT_PUBLIC_MODEL_API_URL?.trim(),
    "https://leeroykip-english-kale.hf.space",
  ].filter(Boolean) as string[];

  for (const base of endpointCandidates) {
    try {
      const res = await fetch(`${base.replace(/\/$/, "")}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, source: "en", target: "kal" }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as { kalenjin?: string; translation?: string };
      const out = data.kalenjin ?? data.translation;
      if (out?.trim()) return out;
    } catch {
      // Try next endpoint candidate.
    }
  }

  return dictionary[input.toLowerCase()] ?? `Kalenjin translation for "${input}" is coming soon.`;
}
