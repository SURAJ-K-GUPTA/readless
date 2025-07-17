import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface AddBookmarkFormProps {
  onAdd: (bookmark: any) => void;
}

export function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!url.startsWith("http")) {
      setError("Please enter a valid URL (must start with http or https)");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const data = await res.json();
        onAdd(data.bookmark);
        setUrl("");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add bookmark");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input
        type="url"
        className="flex-1"
        placeholder="Paste a URL to save..."
        value={url}
        onChange={e => setUrl(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add"}
      </Button>
      {error && <div className="text-red-600 text-sm mt-2 w-full">{error}</div>}
    </form>
  );
} 