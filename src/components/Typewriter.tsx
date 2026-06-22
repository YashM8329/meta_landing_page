"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  words: string[];
  className?: string;
}

export default function Typewriter({ words, className }: Props) {
  const reduce = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) return; // static when reduced motion
    const word = words[wordIndex % words.length];
    let t: ReturnType<typeof setTimeout>;

    if (!deleting && sub < word.length) {
      t = setTimeout(() => setSub(sub + 1), 95);
    } else if (!deleting && sub === word.length) {
      t = setTimeout(() => setDeleting(true), 1500);
    } else if (deleting && sub > 0) {
      t = setTimeout(() => setSub(sub - 1), 55);
    } else {
      t = setTimeout(() => {
        setDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }, 250);
    }
    return () => clearTimeout(t);
  }, [sub, deleting, wordIndex, words, reduce]);

  const current = words[wordIndex % words.length];
  const shown = reduce ? words[0] : current.slice(0, sub);

  return (
    <span className={className}>
      {shown}
      <span className="type-caret" aria-hidden="true">|</span>
    </span>
  );
}
