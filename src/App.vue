<template>
  <div style="width: 100vw; height: 100vh">
    <StatsBoard />
    <Particule v-bind:key="i" v-for="i in particuleLength" :id="i" />
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import Particule from "@/components/Particule.vue";
import { useMouse } from "@/composable/useMouse";
import {
  useParticuleStore,
  Particule as ParticuleType,
  ParticulePosition,
} from "@/store/particuleStore";
import { useStatsStore } from "@/store/statsStore";
import StatsBoard from "@/components/Stats/StatsBoard.vue";
const { onMouseMove, currentMousePositionRef } = useMouse();
const { onParticuleAdded } = useParticuleStore();
const { addStats, addOnBoardMountedCallback } = useStatsStore();

const score = ref<number>(0);
const moveDodged = ref<number>(0);
const collision = ref<number>(0);

const particuleLength = computed<number>((): number => {
  return 1;
});

onMouseMove(() => {
  score.value++;
});

addOnBoardMountedCallback(() => {
  addStats({
    label: "score",
    value: score,
  });
  addStats({
    label: "dodged",
    value: moveDodged,
  });
  addStats({
    label: "collision",
    value: collision,
  });
});

onParticuleAdded((particule?: Ref<ParticuleType>) => {
  if (!particule) {
    return;
  }
  particule.value.events = {
    onMoveFinish: () => {
      moveDodged.value++;
    },
    onCollision: {
      position: {
        x: currentMousePositionRef.value.x,
        y: currentMousePositionRef.value.y,
      },
      callback: (position: ParticulePosition) => {
        collision.value++;
      },
    },
  };
});
</script>

<style scoped>

</style>
