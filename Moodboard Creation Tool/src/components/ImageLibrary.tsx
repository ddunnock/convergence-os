import { useRef } from "react";
import { useDrag } from "react-dnd";
import { Plus, Upload } from "lucide-react";
import { useMoodboardStore } from "./store";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
  "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400",
  "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400",
];

function LibraryImage({ url }: { url: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: { url },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="relative aspect-square rounded-lg overflow-hidden cursor-move hover:ring-2 hover:ring-blue-500 transition-all"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img
        src={url}
        alt="Library item"
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
}

export function ImageLibrary() {
  const { customImages, addCustomImage } = useMoodboardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            addCustomImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const allImages = [...customImages, ...SAMPLE_IMAGES];

  return (
    <div className="flex-1 overflow-y-auto p-4 border-b border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-neutral-900">Image Library</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-500 text-white rounded-lg px-3 py-1.5 flex items-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="grid grid-cols-2 gap-3">
        {allImages.map((url, index) => (
          <LibraryImage key={`${url}-${index}`} url={url} />
        ))}
      </div>

      {allImages.length === 0 && (
        <div className="text-center py-8 text-neutral-400">
          <Upload size={32} className="mx-auto mb-2" />
          <p>No images yet</p>
          <p>Upload images to get started</p>
        </div>
      )}
    </div>
  );
}
