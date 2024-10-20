import { useState, useEffect, useCallback, RefObject } from "react";

export const useInfiniteScroll = (
  callback: () => void,
  containerRef: RefObject<HTMLElement>
) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollHeight - scrollTop <= clientHeight + 5 && !isFetching) {
      setIsFetching(true);
    }
  }, [isFetching, containerRef]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", handleScroll);
      return () => currentContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, containerRef]);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching, callback]);

  return { isFetching, setIsFetching };
};
