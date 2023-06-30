import { ref } from "vue";

export function useScreen() {
  const screenX = ref(window.innerWidth);
  const screenY = ref(window.innerHeight);

  return { screenX, screenY };
}
