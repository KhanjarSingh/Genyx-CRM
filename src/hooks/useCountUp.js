import { useState, useEffect } from 'react';

export function useCountUp(end, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const targetString = String(end);
    // Find numeric parts, ignoring everything else
    const numMatch = targetString.match(/[-]?[\d,]+(\.\d+)?/);
    if (!numMatch) {
      setCount(end);
      return;
    }

    const targetNum = parseFloat(numMatch[0].replace(/,/g, ''));
    if (isNaN(targetNum)) {
      setCount(end);
      return;
    }

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.round(targetNum * easeOut));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(targetNum);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  if (typeof end === 'string' && count !== end) {
    const numMatch = end.match(/[-]?[\d,]+(\.\d+)?/);
    if (numMatch) {
      return end.replace(numMatch[0], count.toLocaleString());
    }
  }

  return count !== end && typeof count === 'number' ? count.toLocaleString() : count;
}
