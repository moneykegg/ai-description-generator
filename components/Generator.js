import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Generator() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("Friendly");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateDescription = async () => {
    setLoading(true);
    setOutput("");

    const prompt = `Write a ${tone} Shopify product description for a product called "${productName}" with these features:\n${features}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
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
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          🛍️ AI Product Description Generator
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="e.g., EcoGlow Reusable Water Bottle"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Key Features (one per line)
            </label>
            <textarea
              rows={4}
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="- BPA-free\n- Keeps cold 24h"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tone
            </label>
            <select
              className="mt-1 w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option>Friendly</option>
              <option>Professional</option>
              <option>Persuasive</option>
              <option>Luxury</option>
              <option>Bold</option>
              <option>Minimal</option>
            </select>
          </div>

          <button
            onClick={generateDescription}
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-xl transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Description"}
          </button>
        </div>

        {output && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Generated Description:</h2>
            <div className="bg-gray-50 border rounded-xl p-4 whitespace-pre-line">
              {output}
            </div>
          </div>
        )}
      </motion.div>
    </main>
  );
}
