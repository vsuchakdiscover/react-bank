import { useState } from "react";

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(!on);
  return { on, toggle };
}
