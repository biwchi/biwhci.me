import { forwardRef } from "react";

const ArtFrame = forwardRef<HTMLDivElement>(function ArtFrame(_, ref) {
  return (
    <div ref={ref} className="fixed -z-[1] inset-0 pointer-events-none"></div>
  );
});

export default ArtFrame;
