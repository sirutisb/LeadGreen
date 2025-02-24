import { useEffect, useRef, useCallback } from "react";

const useInfiniteScroll = (fetchNextPage, hasNextPage, isFetchingNextPage, setIsFetchingNextPage, delay = 800) => {
  const observerRef = useRef(null);
  const timeoutRef = useRef(null);
// Observes the last element to trigger infinite scrolling
  const observeLastElement = useCallback(
    (node) => {
      if (isFetchingNextPage || !hasNextPage) return;// Prevent fetching if already

      if (observerRef.current) observerRef.current.disconnect();// Disconnect previous observer

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsFetchingNextPage(true); //
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              fetchNextPage();// Fetch next page with a delay
            }, delay);
          }
        },
        { threshold: 1 }// Trigger only when the element is fully visible
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
