import React, { useState } from "react";
import { motion } from "framer-motion";

// -------------- Main Page Component --------------
export default function AIDescriptionGenerator() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("friendly");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDescription = async () => {
    setLoading(true);
    setOutput("");

    const prompt = `Write a ${tone} Shopify product description for a product called '${productName}'.\nThe product has the following features:\n- ${features.split("\n").join("\n- ")}\nMake it engaging and persuasive, and include a short CTA at the end.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
       Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are an expert ecommerce copywriter." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await response.json();
    setOutput(data.choices[0].message.content);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-semibold text-center">🛍️ AI Product Description Generator</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Product Name</label>
          <input
            type="text"
            className="w-full rounded-xl border p-3"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., EcoGlow Reusable Water Bottle"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Key Features (one per line)</label>
          <textarea
            className="w-full rounded-xl border p-3 h-32"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            placeholder={"- BPA-free\n- Keeps cold 24h, hot 12h\n- Leak-proof"}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tone</label>
          <select
            className="w-full rounded-xl border p-3"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="energetic">Energetic</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={generateDescription}
          className="w-full bg-black text-white font-medium py-3 rounded-2xl shadow hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Description"}
        </motion.button>
      </div>

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-4 border shadow-xl"
        >
          <h2 className="text-xl font-semibold mb-2">Generated Description:</h2>
          <p className="whitespace-pre-wrap text-gray-800">{output}</p>
        </motion.div>
      )}
    </div>
  );
}
