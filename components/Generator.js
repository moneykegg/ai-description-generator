import { useState } from "react";
import { motion } from "framer-motion";

export default function Generator() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [tone, setTone] = useState("friendly");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateDescription = async () => {
    if (!productName.trim() || !features.trim()) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setOutput("");

    const prompt = `Write a ${tone} Shopify product description for a product called '${productName}'.\nThe product has the following features:\n- ${features.split("\n").join("\n- ")}\nMake it engaging and persuasive, and include a short CTA at the end.`;

    try {
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
      if (data.choices && data.choices[0]) {
        setOutput(data.choices[0].message.content);
      } else {
        setError("Something went wrong with the response.");
      }
    } catch (err) {
      setError("Failed to generate description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="e.g., EcoGlow Water Bottle"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Key Features (one per line)</label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 h-32"
            placeholder="- BPA-free\n- Keeps cold 24h\n- Leak-proof"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="energetic">Energetic</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          onClick={generateDescription}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Generating..." : "Generate Description"}
        </motion.button>
      </div>

      {output && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border shadow"
        >
          <h2 className="font-semibold text-lg mb-2">Generated Description:</h2>
          <p className="whitespace-pre-wrap text-gray-800">{output}</p>
        </motion.div>
      )}
    </div>
  );
}
