"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  message: string;
};

export default function InfoTooltip({
  title,
  message,
}: Props) {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700 hover:bg-sky-200 transition"
      >
        i
      </button>

      {open ? (
        <div className="absolute left-0 top-7 z-50 w-72 max-w-[260px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            {message}
          </p>
        </div>
      ) : null}
    </div>
  );
}
