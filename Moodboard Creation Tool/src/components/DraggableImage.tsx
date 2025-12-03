import { useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { Resizable } from "re-resizable";
import { X } from "lucide-react";

interface DraggableImageProps {
  id: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDelete: (id: string) => void;
}

export function DraggableImage({
  id,
  url,
  x,
  y,
  width,
  height,
  onMove,
  onResize,
  onDelete,
}: DraggableImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: () => {
      const rect = dragRef.current?.getBoundingClientRect();
      return {
        id,
        url,
        offsetX: rect ? rect.width / 2 : 0,
        offsetY: rect ? rect.height / 2 : 0,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvasRect = document
          .getElementById("canvas")
          ?.getBoundingClientRect();
        if (canvasRect) {
          onMove(
            id,
            offset.x - canvasRect.left - width / 2,
            offset.y - canvasRect.top - height / 2
          );
        }
      }
    },
  }));

  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className="absolute cursor-move"
      style={{
        left: x,
        top: y,
        opacity: isDragging ? 0.5 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Resizable
        size={{ width, height }}
        onResizeStop={(e, direction, ref, d) => {
          onResize(id, width + d.width, height + d.height);
        }}
        lockAspectRatio={true}
        minWidth={100}
        minHeight={100}
        className="relative"
      >
        <img
          src={url}
          alt="Moodboard item"
          className="w-full h-full object-cover rounded-lg shadow-lg border-2 border-white"
          draggable={false}
        />

        {isHovered && (
          <button
            onClick={() => onDelete(id)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </Resizable>
    </div>
  );
}
