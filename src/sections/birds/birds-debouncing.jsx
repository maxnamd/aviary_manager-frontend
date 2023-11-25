// useDebounce.js
import { useState, useEffect } from 'react';
import { useDebounce as useDebounceCore } from 'use-debounce';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [cancel] = useDebounceCore(
    () => setDebouncedValue(value),
    delay,
    [value]
  );

  useEffect(() => cancel, [cancel]);

  return debouncedValue;
};

export default useDebounce;
