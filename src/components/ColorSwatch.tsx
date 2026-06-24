import { cloneRGB, rgbToCss, type RGB } from "@/lib/colorUtils";

type ColorSwatchProps = {
  color: RGB;
  size?: "md" | "lg";
  label?: string;
};

export default function ColorSwatch({
  color,
  size = "md",
  label,
}: ColorSwatchProps) {
  const dim = size === "lg" ? "h-20 w-20" : "h-16 w-16";

  return (
    <div className="text-center">
      {label && (
        <p className="mb-2 text-xs text-amber-700">{label}</p>
      )}
      <div
        className={`${dim} rounded-full border-4 border-amber-800/25 shadow-md`}
        style={{ backgroundColor: rgbToCss(cloneRGB(color)) }}
      />
    </div>
  );
}
