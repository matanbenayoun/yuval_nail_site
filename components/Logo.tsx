const NAIL_PATH = "M18,3 C11,3 8,10 8,18 C8,26 12,35 18,37 C24,35 28,26 28,18 C28,10 25,3 18,3 Z"
const SPARKLE_V = "M27,5 L28.2,9 L27,13 L25.8,9 Z"
const SPARKLE_H = "M23,9 L27,7.8 L31,9 L27,10.2 Z"
const COLOR = "#3272C8"

interface LogoProps {
  size?: "sm" | "md"
  className?: string
}

export default function Logo({ size = "md", className = "" }: LogoProps) {
  const svgHeight = size === "sm" ? 28 : 36

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 36 40"
        height={svgHeight}
        width={svgHeight * 0.9}
        fill="none"
        aria-hidden="true"
      >
        <path d={NAIL_PATH} fill={COLOR} />
        <path d={SPARKLE_V} fill={COLOR} />
        <path d={SPARKLE_H} fill={COLOR} />
      </svg>

      <div className="flex flex-col">
        <span
          className={`font-medium leading-none ${size === "sm" ? "text-sm" : "text-base"} font-[family-name:var(--font-cormorant)]`}
        >
          יובל סין ראובן
        </span>
        <span className="text-[10px] font-light tracking-widest text-muted-foreground mt-0.5">
          ציפורניים
        </span>
      </div>
    </div>
  )
}
