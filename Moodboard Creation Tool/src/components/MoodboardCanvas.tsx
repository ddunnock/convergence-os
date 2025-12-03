import { useCallback } from "react";
import { useDrop } from "react-dnd";
import { DraggableImage } from "./DraggableImage";
import { useMoodboardStore } from "./store";
import { Trash2 } from "lucide-react";

export function MoodboardCanvas() {
  const { placedImages, addPlacedImage, updatePlacedImage, removePlacedImage } =
    useMoodboardStore();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "image",
    drop: (item: { url: string; id?: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && item.id === undefined) {
        // New image being dropped
        const canvasRect = document
          .getElementById("canvas")
          ?.getBoundingClientRect();
        if (canvasRect) {
          addPlacedImage({
            id: `placed-${Date.now()}-${Math.random()}`,
            url: item.url,
            x: offset.x - canvasRect.left - 100,
            y: offset.y - canvasRect.top - 100,
            width: 200,
            height: 200,
          });
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const handleMove = useCallback(
    (id: string, x: number, y: number) => {
      updatePlacedImage(id, { x, y });
    },
    [updatePlacedImage]
  );

  const handleResize = useCallback(
    (id: string, width: number, height: number) => {
      updatePlacedImage(id, { width, height });
    },
    [updatePlacedImage]
  );

  return (
    <div
      id="canvas"
      ref={drop}
      className={`relative w-full h-full ${isOver ? "bg-blue-50" : "bg-neutral-100"} transition-colors`}
      style={{
        backgroundImage: `radial-gradient(circle, #d4d4d8 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {placedImages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-neutral-400">
            <p>Drag images here to start creating your moodboard</p>
          </div>
        </div>
      )}

      {placedImages.map((image) => (
        <DraggableImage
          key={image.id}
          id={image.id}
          url={image.url}
          x={image.x}
          y={image.y}
          width={image.width}
          height={image.height}
          onMove={handleMove}
          onResize={handleResize}
          onDelete={removePlacedImage}
        />
      ))}

      {placedImages.length > 0 && (
        <button
          onClick={() => {
            if (confirm("Clear all images from the moodboard?")) {
              placedImages.forEach((img) => removePlacedImage(img.id));
            }
          }}
          className="absolute top-4 right-4 bg-white border border-neutral-300 rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-neutral-50 transition-colors"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      )}
    </div>
  );
}
