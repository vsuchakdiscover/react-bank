import { useEffect, useState } from "react";

/**
 * Allows to handle state either locally or sending it up to a parent if parentSetValue
 * callback is provided.
 */
export default function useParentOrLocalState(parentValue, parentSetValue) {
  const [value, setValue] = useState(parentValue);

  useEffect(() => {
    setValue(parentValue);
  }, [parentValue]);

  return [value, parentSetValue ? parentSetValue : setValue];
}
