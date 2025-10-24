import { useState, useEffect } from 'react';

// A simple custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay is over
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // The effect re-runs if value or delay changes

  return debouncedValue;
}

export default useDebounce;