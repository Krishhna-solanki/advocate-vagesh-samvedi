// Lets the disclaimer and page animations wait until the preloader has left the screen.
let done = false;
const listeners = new Set<() => void>();

export function markPreloaderDone() {
  if (done) return;
  done = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function whenPreloaderDone(fn: () => void): () => void {
  if (done || document.documentElement.classList.contains('preloaded')) {
    done = true;
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => listeners.delete(fn);
}
