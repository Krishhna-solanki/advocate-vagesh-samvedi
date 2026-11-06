'use client';

import { useEffect, useRef, useState } from 'react';
import PlatformIcon from './PlatformIcon';

type Props = { src: string; poster: string; label: string; platform: string; url?: string; caption: string; meta?: string };

/**
 * A reel in the Social Journey gallery: plays muted while at least half of it is on screen and pauses when it
 * leaves. Sound stays off until the visitor turns it on, and a pause button is always available.
 * Visitors with data saver on get a play button instead of autoplay.
 */
export default function SocialVideo({ src, poster, label, platform, url, caption, meta }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (saveData) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) v.play().catch(() => setPlaying(false));
        else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const togglePlay = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => setPlaying(false));
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) togglePlay();
  };

  const btn =
    'flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-ink/70 text-gold-light backdrop-blur transition-colors hover:border-gold hover:bg-ink/90';

  return (
    <div className="group relative h-full w-full overflow-hidden bg-ink">
      <video
        ref={video}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-0 border border-transparent transition-colors duration-700 group-hover:border-gold/50" />

      {/* Reel badge */}
      <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-ink/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
        Reel
      </span>

      {/* Controls */}
      <div className="absolute right-3 top-3 flex gap-2">
        <button type="button" onClick={togglePlay} className={btn} aria-label={playing ? 'Pause video' : 'Play video'}>
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          )}
        </button>
        <button type="button" onClick={toggleMute} className={btn} aria-pressed={!muted} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none" />
            {muted ? <path d="M16 9.5l5 5M21 9.5l-5 5" /> : <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />}
          </svg>
        </button>
      </div>

      {/* Caption */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold">
          <PlatformIcon platform={platform} className="h-3.5 w-3.5" />
          {platform}
          {meta && (
            <>
              <span aria-hidden className="text-muted">
                ·
              </span>
              <span className="text-muted">{meta}</span>
            </>
          )}
        </p>
        <p className="mt-2 line-clamp-3 font-serif text-sm leading-snug text-ivory md:text-base">{caption}</p>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="link-gold mt-3">
            View on {platform} <span className="arrow" aria-hidden>↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
}
