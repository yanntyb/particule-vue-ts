import { Ref, ref } from "vue";

export function useInterval() {
  const intervals: Ref<number[]> = ref<number[]>([]);

  const interval = (callback: () => void, timer: number) => {
    intervals.value.push(
      setInterval(() => {
        callback();
      }, timer)
    );
  };

  const timeout = (callback: () => void, timer: number) => {
    setTimeout(callback, timer);
  };

  return { interval, timeout };
}
