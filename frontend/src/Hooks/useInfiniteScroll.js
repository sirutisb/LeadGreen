import { useEffect, useRef, useCallback } from "react";

const useInfiniteScroll = (fetchNextPage, hasNextPage, isFetchingNextPage, setIsFetchingNextPage, delay = 800) => {
  const observerRef = useRef(null);
  const timeoutRef = useRef(null);

  const observeLastElement = useCallback(
    (node) => {
      if (isFetchingNextPage || !hasNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsFetchingNextPage(true); //
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              fetchNextPage();
            }, delay);
          }
        },
        { threshold: 1 }
      );

      if (node) observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage, setIsFetchingNextPage, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return observeLastElement;
};

export default useInfiniteScroll;
