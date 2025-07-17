import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

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
  const [showDelete, setShowDelete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  function handleCardClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("button")) return;
    setShowDetails(true);
  }

  return (
    <>
      <Card
        className="flex flex-col gap-2 p-4 h-full cursor-pointer hover:bg-gray-50 transition"
        onClick={handleCardClick}
      >
        <div className="flex items-center gap-2">
          {bookmark.favicon && (
            <img src={bookmark.favicon} alt="favicon" className="w-6 h-6 rounded" />
          )}
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-lg hover:underline"
            onClick={e => e.stopPropagation()}
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
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-auto flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={e => {
              e.stopPropagation();
              setShowDelete(true);
            }}
          >
            Delete
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="max-w-full w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Bookmark</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bookmark?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDelete(false);
                onDelete(bookmark._id);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-full w-[95vw] sm:max-w-lg p-0">
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{bookmark.title || bookmark.url}</DialogTitle>
              <DialogDescription>
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {bookmark.url}
                </a>
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              {bookmark.favicon && (
                <img src={bookmark.favicon} alt="favicon" className="w-6 h-6 rounded" />
              )}
              <span className="text-xs text-gray-500 break-all">{bookmark.url}</span>
            </div>
            <div className="prose prose-sm max-w-none mb-2">
              {bookmark.summary ? (
                <ReactMarkdown>{bookmark.summary}</ReactMarkdown>
              ) : (
                <span className="text-gray-500">No summary available.</span>
              )}
            </div>
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {bookmark.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 