<template>
  <div style="width: 100vw; height: 100vh">
    <div id="stats">
      <p>Mouvement de la souris : {{ score }}</p>
      <p>Mouvement des enemies finis: {{ moveDodged }}</p>
    </div>
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
} from "@/store/particuleStore";
const { onMouseMove } = useMouse();
const { onParticuleAdded } = useParticuleStore();

const score = ref<number>(0);
const moveDodged = ref<number>(0);

const particuleLength = computed<number>((): number => {
  return 1
  // return 1 + Math.floor(moveDodged.value / 3);
});

onMouseMove(() => {
  score.value++;
});

onParticuleAdded((particule?: Ref<ParticuleType>) => {
  if (!particule) {
    return;
  }
  particule.value.events = {
    onMoveFinish: () => {
      moveDodged.value++;
    },
  };
});
</script>

<style scoped>
#stats {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 20vw;
  height: 20vw;
  border: 1px solid greenyellow;
  color: red;
}
</style>
