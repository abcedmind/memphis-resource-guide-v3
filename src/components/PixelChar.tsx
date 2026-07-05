import { CHARS } from "@/lib/constants";

/**
 * Pixel-art growth-stage character (8px grid). A signature element of
 * the guide — rendered as crisp SVG rects, identical to v2.
 */
export default function PixelChar({
  stageIndex,
  ps = 5,
}: {
  stageIndex: number;
  ps?: number;
}) {
  const c = CHARS[stageIndex];
  if (!c) return null;
  return (
    <svg
      width={8 * ps}
      height={c.rows.length * ps}
      style={{ imageRendering: "pixelated", display: "block" }}
      aria-hidden="true"
      focusable="false"
    >
      {c.rows.flatMap((row, y) =>
        [...row]
          .map((k, x) => {
            const f = c.colors[k];
            if (!f) return null;
            return (
              <rect
                key={`${x}-${y}`}
                x={x * ps}
                y={y * ps}
                width={ps}
                height={ps}
                fill={f}
              />
            );
          })
          .filter(Boolean)
      )}
    </svg>
  );
}
