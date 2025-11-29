import { useCallback, useRef, useState } from "react";

export const useToast = (duration = 3500) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message, type = "success") => {
      hideToast();
      setToast({ message, type });
      timerRef.current = setTimeout(() => {
        hideToast();
      }, duration);
    },
    [duration, hideToast]
  );

  const showSuccess = useCallback((message) => showToast(message, "success"), [showToast]);
  const showError = useCallback((message) => showToast(message, "error"), [showToast]);

  return { toast, showToast, showSuccess, showError, hideToast };
};

export default useToast;
