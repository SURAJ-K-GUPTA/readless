import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface BookmarkCardProps {
  bookmark: {
    _id: string;
    url: string;
    title?: string;
    favicon?: string;
    summary?: string;
    tags?: string[];
  };
  onDelete: (id: string) => void;
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  return (
    <Card className="flex flex-col gap-2 p-4 h-full">
      <div className="flex items-center gap-2">
        {bookmark.favicon && (
          <img src={bookmark.favicon} alt="favicon" className="w-6 h-6 rounded" />
        )}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-lg hover:underline"
        >
          {bookmark.title || bookmark.url}
        </a>
      </div>
      <div className="text-sm text-gray-700 line-clamp-4 whitespace-pre-line">
        {bookmark.summary}
      </div>
      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {bookmark.tags.map(tag => (
            <span key={tag} className="bg-gray-200 text-xs px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex justify-end">
        <Button variant="destructive" size="sm" onClick={() => onDelete(bookmark._id)}>
          Delete
        </Button>
      </div>
    </Card>
  );
} 