"use client";
import { useEffect, useState } from "react";
import { AddBookmarkForm } from "@/components/AddBookmarkForm";
import { BookmarkList } from "@/components/BookmarkList";
import { useMemo } from "react";

export default function HomePage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tagSearch, setTagSearch] = useState("");

  async function fetchBookmarks(tag?: string | null) {
    setLoading(true);
    setError("");
    try {
      const url = tag ? `/api/bookmark?tag=${encodeURIComponent(tag)}` : "/api/bookmark";
      const res = await fetch(url);
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
    fetchBookmarks(selectedTag);
  }, [selectedTag]);

  // Extract unique tags from bookmarks
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    bookmarks.forEach(bm => {
      if (bm.tags && Array.isArray(bm.tags)) {
        bm.tags.forEach((tag: string) => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [bookmarks]);

  // Filter bookmarks by search input (title or tags) and selected tag
  const filteredBookmarks = useMemo(() => {
    let filtered = bookmarks;
    if (selectedTag) {
      filtered = filtered.filter((bm: any) => bm.tags && bm.tags.includes(selectedTag));
    }
    if (tagSearch.trim()) {
      const search = tagSearch.toLowerCase();
      filtered = filtered.filter((bm: any) => {
        const titleMatch = bm.title?.toLowerCase().includes(search);
        const tagMatch = (bm.tags || []).some((tag: string) => tag.toLowerCase().includes(search));
        return titleMatch || tagMatch;
      });
    }
    return filtered;
  }, [bookmarks, selectedTag, tagSearch]);

  async function handleDelete(id: string) {
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
      {allTags.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 items-start">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={tagSearch}
            onChange={e => setTagSearch(e.target.value)}
            className="mb-2 px-2 py-1 border rounded text-sm w-48"
          />
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold mr-2">Filter by tag:</span>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-2 py-1 rounded text-xs border ${selectedTag === tag ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
            {selectedTag && (
              <button
                className="ml-2 px-2 py-1 rounded text-xs border bg-gray-200 text-gray-700"
                onClick={() => setSelectedTag(null)}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : (
        <BookmarkList bookmarks={filteredBookmarks} onDelete={handleDelete} />
      )}
    </main>
  );
}
