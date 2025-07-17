"use client";
import { useEffect, useState } from "react";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchBookmarks() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookmark");
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.bookmarks);
      } else if (res.status === 401) {
        window.location.href = "/signin";
      } else {
        setError("Failed to load bookmarks");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookmarks();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this bookmark?")) return;
    try {
      const res = await fetch(`/api/bookmark/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookmarks(bms => bms.filter(b => b._id !== id));
      }
    } catch {}
  }

  function handleAdd(newBookmark: any) {
    setBookmarks(bms => [newBookmark, ...bms]);
  }

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>
      <AddBookmarkForm onAdd={handleAdd} />
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <BookmarkList bookmarks={bookmarks} onDelete={handleDelete} />
      )}
    </main>
  );
}
