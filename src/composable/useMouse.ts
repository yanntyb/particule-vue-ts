import { onMounted, onUnmounted, Ref, ref } from "vue";

export interface MousePosition {
  x: number;
  y: number;
}

export function useMouse() {
  const currentMousePosition = ref<MousePosition>({ x: 0, y: 0 });
  const lastClickPosition = ref<MousePosition>({ x: 0, y: 0 });
  const mouseMovedOnce = ref(false);

  const updatePosition = (event: MouseEvent, position: Ref<MousePosition>) => {
    position.value.y = event.pageY;
    position.value.x = event.pageX;
  };

  const onClick = (callback: () => void) => {
    window.addEventListener("click", callback);
  };

  const onMouseMove = (callback: () => void) => {
    window.addEventListener("mousemove", callback);
  };

  const onFirstMouseMove = (callback: () => void) => {
    window.addEventListener("mousemove", () => {
      if (mouseMovedOnce.value) {
        return;
      }
      if (!mouseMovedOnce.value) {
        mouseMovedOnce.value = true;
        callback();
      }
    });
  };

  onMounted(() => {
    window.addEventListener("mousemove", (event) =>
      updatePosition(event, currentMousePosition)
    );
    window.addEventListener("click", (event) =>
      updatePosition(event, lastClickPosition)
    );
  });
  return {
    currentMousePosition,
    lastClickPosition,
    mouseMovedOnce,
    onClick,
    onFirstMouseMove,
    onMouseMove,
  };
}