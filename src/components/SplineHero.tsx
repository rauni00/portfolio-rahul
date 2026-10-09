import Spline from "@splinetool/react-spline";

const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

export default function SplineHero({ height = 620, fill = false }: { height?: number; fill?: boolean }) {
  if (fill) {
    // Full-bleed mode: fill whatever parent sizes the stage (hero background).
    return (
      <div className="h-full w-full">
        <Spline scene={SPLINE_SCENE} />
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 760, width: "100%" }}>
      <div
        className="overflow-hidden rounded-[2rem] bg-transparent"
        style={{ height, width: "100%", minHeight: 520 }}
      >
        <Spline scene={SPLINE_SCENE} />
      </div>
    </div>
  );
}
