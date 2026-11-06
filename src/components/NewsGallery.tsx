'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { GalleryImage } from '@/lib/news';
import { lockScroll } from '@/lib/smooth-scroll';

/**
 * Additional images for a news article (e.g. further newspaper clippings).
 * Thumbnails keep each image's own proportions; the viewer shows the original file, unscaled.
 */
export default function NewsGallery({ images, label = 'Gallery' }: { images: GalleryImage[]; label?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? null : images[index];

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
    lockScroll('gallery', true);
  };
  const close = () => dialog.current?.close();
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length));

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (images.length < 2) return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [images.length]);

  return (
    <div className="mx-auto max-w-5xl pt-10">
      <p className="label mb-5 text-center">{label}</p>
      <ul className="flex flex-wrap justify-center gap-5">
        {images.map((g, i) => {
          // Frames follow each image's own proportions: wide photos get wide frames, tall clippings tall ones
          const ratio = g.width && g.height ? g.width / g.height : 0.72;
          const frameH = ratio < 0.6 ? 288 : ratio > 1.6 ? 176 : 240;
          const frameW = Math.round(frameH * ratio) + 16;
          return (
          <li key={g.image} style={{ width: `min(100%, ${frameW}px)` }}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full text-left"
              aria-label={`Enlarge: ${g.alt || g.caption || 'image'}`}
            >
              <span
                className="relative block border border-gold/30 bg-ink transition-[border-color,box-shadow] duration-500 group-hover:border-gold/70 group-hover:shadow-[0_20px_40px_-24px_rgba(200,164,93,0.45)]"
                style={{ aspectRatio: `${frameW} / ${frameH + 16}` }}
              >
                <Image src={g.image} alt={g.alt} fill sizes="(min-width: 640px) 420px, 92vw" className="object-contain p-2" />
              </span>
              {g.caption && <span className="mt-3 block text-xs leading-5 text-muted">{g.caption}</span>}
              <span className="link-gold mt-2" aria-hidden>
                Enlarge <span className="arrow">↗</span>
              </span>
            </button>
          </li>
          );
        })}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => {
          setIndex(null);
          lockScroll('gallery', false);
        }}
        onClick={(e) => e.target === dialog.current && close()}
        aria-label="Image viewer"
        className="m-auto max-h-[100dvh] max-w-[100vw] bg-transparent p-0 text-ivory backdrop:bg-black/90"
      >
        {current && (
          <figure className="flex max-h-[100dvh] flex-col items-center gap-4 p-4 sm:p-8">
            {/* The original file, unscaled and uncompressed */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image} alt={current.alt} className="h-auto max-h-[78dvh] w-auto max-w-[92vw] border border-gold/30 bg-ink object-contain p-2" />
            <figcaption className="flex max-w-[92vw] flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center text-xs text-muted">
              {current.caption && <span>{current.caption}</span>}
              <a href={current.image} target="_blank" rel="noopener" className="link-gold">
                Open original <span className="arrow" aria-hidden>↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </figcaption>
            <div className="flex items-center gap-3">
              {images.length > 1 && (
                <button type="button" onClick={() => step(-1)} className="btn-outline px-4 py-2" aria-label="Previous image">
                  ←
                </button>
              )}
              <button type="button" onClick={close} className="btn-outline px-5 py-2" autoFocus>
                Close
              </button>
              {images.length > 1 && (
                <button type="button" onClick={() => step(1)} className="btn-outline px-4 py-2" aria-label="Next image">
                  →
                </button>
              )}
            </div>
          </figure>
        )}
      </dialog>
    </div>
  );
}
