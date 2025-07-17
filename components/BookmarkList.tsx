import { BookmarkCard } from "./BookmarkCard";

export interface BookmarkListProps {
  bookmarks: Array<{
    _id: string;
    url: string;
    title?: string;
    favicon?: string;
    summary?: string;
    tags?: string[];
  }>;
  onDelete: (id: string) => void;
}

export function BookmarkList({ bookmarks, onDelete }: BookmarkListProps) {
  if (!bookmarks.length) {
    return <div className="text-center text-gray-500 py-8">No bookmarks found.</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map(bm => (
        <BookmarkCard key={bm._id} bookmark={bm} onDelete={onDelete} />
      ))}
    </div>
  );
} 