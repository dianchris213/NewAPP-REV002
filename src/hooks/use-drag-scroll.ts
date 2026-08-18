import { useCallback, useEffect, useRef } from "react";

/**
 * Enables click-and-drag horizontal scrolling on desktop/web while keeping
 * native touch swipe on mobile and preserving click interactions on children.
 */
export function useDragScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const state = useRef({ down: false, moved: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // native touch scrolling
      state.current = {
        down: true,
        moved: false,
        startX: e.clientX,
        scrollLeft: el.scrollLeft,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!state.current.down) return;
      const dx = e.clientX - state.current.startX;
      if (Math.abs(dx) > 4) {
        state.current.moved = true;
        el.setPointerCapture?.(e.pointerId);
        el.style.cursor = "grabbing";
      }
      if (state.current.moved) {
        el.scrollLeft = state.current.scrollLeft - dx;
        e.preventDefault();
      }
    };

    const endDrag = () => {
      state.current.down = false;
      el.style.cursor = "";
      // let the click handler run first, then reset
      window.setTimeout(() => {
        state.current.moved = false;
      }, 0);
    };

    const onClickCapture = (e: MouseEvent) => {
      if (state.current.moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (el.scrollWidth <= el.clientWidth) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    el.addEventListener("pointerleave", endDrag);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("pointerleave", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    if (e.key === "ArrowRight") {
      el.scrollBy({ left: 160, behavior: "smooth" });
      e.preventDefault();
    } else if (e.key === "ArrowLeft") {
      el.scrollBy({ left: -160, behavior: "smooth" });
      e.preventDefault();
    }
  }, []);

  return { ref, onKeyDown };
}
