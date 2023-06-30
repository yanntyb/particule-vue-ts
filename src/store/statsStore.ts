import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export interface Stats {
  label: string;
  value: Ref<number | string>;
  id?: number;
}

export const useStatsStore = defineStore("stats", () => {
  const stats: Ref<Stats[]> = ref([]);
  const onStatsAdded: ((newStat: Stats) => void)[] = [];
  const boardMounted: Ref<boolean> = ref(false);
  const onBoardMounted: (() => void)[] = [];

  const addStats = (newStat: Stats) => {
    const statRef: Stats = { ...newStat, id: stats.value.length };

    stats.value.push(statRef);
    onStatsAdded.forEach((callback) => callback(statRef));

    return statRef;
  };

  const getStat = (statId: number): Stats | undefined => {
    if (typeof stats.value === "undefined") {
      return undefined;
    }
    return stats.value.find((stat) => stat.id === statId);
  };

  const addOnStatsAddedCallback = (callback: (newStat: Stats) => void) => {
    onStatsAdded.push(callback);
  };

  const setBoardMounted = () => {
    boardMounted.value = true;
    onBoardMounted.forEach((callback) => callback());
  };

  const addOnBoardMountedCallback = (callback: () => void) => {
    onBoardMounted.push(callback);
  };

  return {
    addStats,
    getStat,
    addOnStatsAddedCallback,
    setBoardMounted,
    addOnBoardMountedCallback,
  };
});
