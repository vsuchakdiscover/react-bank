// Adapted from https://usehooks.com/useLocalStorage/
import { useState, useRef, useEffect } from "react";

export default function useLocalStorage(key, initialValue) {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => (isMounted.current = false);
  }, []);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return window.localStorage.getItem(key) || initialValue;
    } catch (error) {
      console.error("Initializing useLocalStorage failed.", error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save to local storage
      window.localStorage.setItem(key, valueToStore);

      // Save state, but only if the component is still mounted (a redirect/reload may already be in progress).
      if (isMounted.current) setStoredValue(valueToStore);
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error("Failed to set value in useLocalStorage.", error);
    }
  };

  return [storedValue, setValue];
}
