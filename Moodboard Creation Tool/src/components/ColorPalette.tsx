import { useEffect, useState } from "react";
import { useMoodboardStore } from "./store";
import { Palette, Check } from "lucide-react";

interface Color {
  hex: string;
  count: number;
}

export function ColorPalette() {
  const { placedImages } = useMoodboardStore();
  const [palette, setPalette] = useState<Color[]>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  useEffect(() => {
    if (placedImages.length === 0) {
      setPalette([]);
      return;
    }

    const extractColors = async () => {
      const colorMap = new Map<string, number>();

      for (const image of placedImages) {
        try {
          const colors = await getImageColors(image.url);
          colors.forEach((color) => {
            colorMap.set(color, (colorMap.get(color) || 0) + 1);
          });
        } catch (error) {
          console.error("Error extracting colors:", error);
        }
      }

      const sortedColors = Array.from(colorMap.entries())
        .map(([hex, count]) => ({ hex, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 12);

      setPalette(sortedColors);
    };

    extractColors();
  }, [placedImages]);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette size={18} className="text-neutral-700" />
        <h2 className="text-neutral-900">Color Palette</h2>
      </div>

      {palette.length === 0 ? (
        <div className="text-center py-6 text-neutral-400">
          <p>Add images to generate</p>
          <p>a color palette</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {palette.map((color) => (
            <button
              key={color.hex}
              onClick={() => copyToClipboard(color.hex)}
              className="group relative aspect-square rounded-lg border border-neutral-200 hover:scale-105 transition-transform overflow-hidden"
              style={{ backgroundColor: color.hex }}
              title={`Click to copy ${color.hex}`}
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity" />
              {copiedColor === color.hex && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Check size={20} className="text-white" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="truncate">{color.hex}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

async function getImageColors(imageUrl: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Resize for performance
      const size = 100;
      canvas.width = size;
      canvas.height = size;

      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const pixels = imageData.data;
      const colors: string[] = [];

      // Sample every 10th pixel
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent or very light/dark pixels
        if (
          a < 128 ||
          (r > 240 && g > 240 && b > 240) ||
          (r < 15 && g < 15 && b < 15)
        ) {
          continue;
        }

        const hex = rgbToHex(r, g, b);
        colors.push(hex);
      }

      resolve(colors);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}
