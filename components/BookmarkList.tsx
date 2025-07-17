import { BookmarkCard } from "./BookmarkCard";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

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
  onReorder?: (newOrder: string[]) => void;
}

export function BookmarkList({ bookmarks, onDelete, onReorder }: BookmarkListProps) {
  if (!bookmarks.length) {
    return <div className="text-center text-gray-500 py-8">No bookmarks found.</div>;
  }

  function handleDragEnd(result: DropResult) {
    if (!result.destination || result.destination.index === result.source.index) return;
    const newOrder = Array.from(bookmarks);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    if (onReorder) {
      onReorder(newOrder.map(b => b._id));
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="bookmark-list" direction="vertical">
        {(provided) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {bookmarks.map((bm, idx) => (
              <Draggable key={bm._id} draggableId={bm._id} index={idx}>
                {(dragProvided, dragSnapshot) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                    className={
                      "transition-shadow " +
                      (dragSnapshot.isDragging
                        ? "ring-2 ring-blue-400 z-10 bg-blue-50 dark:bg-zinc-800"
                        : "")
                    }
                  >
                    <BookmarkCard bookmark={bm} onDelete={onDelete} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 