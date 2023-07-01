<template>
  <div style="width: 100vw; height: 100vh">
    <StatsBoard />
    <Particule v-bind:key="i" v-for="i in particuleLength" :id="i" />
  </div>
</template>

<script setup lang="ts">
import { computed, Ref, ref } from "vue";
import Particule from "@/components/Particule.vue";
import { MousePosition, useMouse } from "@/composable/useMouse";
import {
  useParticuleStore,
  Particule as ParticuleType,
  ParticulePosition,
} from "@/store/particuleStore";
import { useStatsStore } from "@/store/statsStore";
import StatsBoard from "@/components/Stats/StatsBoard.vue";
const { onMouseMove, currentMousePositionRef, onFirstMouseMove } = useMouse();
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
    value: () => score.value.toString(),
  });
  addStats({
    label: "dodged",
    value: () => moveDodged.value.toString(),
  });
  addStats({
    label: "collision",
    value: () => collision.value.toString(),
  });
});

onParticuleAdded((particule?: Ref<ParticuleType>) => {
  if (!particule) {
    return;
  }
  onFirstMouseMove((position?: MousePosition) => {
    const currentMousePosition = currentMousePositionRef;
    addStats({
      label: "collision on ",
      value: () =>
        Math.abs(
          particule.value.definition.currentPosition.x -
          particule.value.events?.onCollision.getPosition().x
        ) - particule.value.definition.width / 2,
    });
    particule.value.events.onCollision = {
      getPosition: () => currentMousePosition.value,
      callback: (position: ParticulePosition) => {
        collision.value++;
      },
    };
  });

  particule.value.events.onMoveFinish = () => moveDodged.value++;
});
</script>

<style scoped></style>
