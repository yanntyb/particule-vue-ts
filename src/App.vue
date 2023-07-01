<template>
  <StatsBoard />
  <div
    :class="onCollision && 'blink'"
    id="game"
    style="width: 100vw; height: 100vh"
  >
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
const onCollision = ref<boolean>(false);

const particuleLength = computed<number>((): number => {
  return 15;
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
  console.log(particule.value.id, "onParticuleAdded");
  onFirstMouseMove((position?: MousePosition) => {
    const currentMousePosition = currentMousePositionRef;

    console.log(particule.value.id, "onFirstMouseMove", position);
    particule.value.events.onCollision = {
      getPosition: () => currentMousePosition.value,
      callback: (position: ParticulePosition) => {
        collision.value++;
        onCollision.value = true;

        setTimeout(() => {
          onCollision.value = false;
        }, 1000);
      },
    };

    addStats({
      label: "collision on ",
      value: () =>
        (
          Math.abs(
            particule.value.definition.currentPosition.x -
              particule.value.events.onCollision.getPosition().x
          ) -
          particule.value.definition.width / 2
        ).toString(),
    });
  });

  particule.value.events.onMoveFinish = () => moveDodged.value++;
});
</script>

<style scoped lang="scss">
#game {
  position: absolute;
  background-color: black;

  &.blink {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: &;
    opacity: 0;
    animation: blink 0.5s infinite;
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1;
  }
}
</style>
