import { useEffect, useState } from "react";

// Starts at 0 and switches to `target` on the next frame, so NumberFlow
// animates the count up after mount.
export function useCountUp(target: number) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCount(target));
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return count;
}
