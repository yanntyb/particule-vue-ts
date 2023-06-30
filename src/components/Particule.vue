<script setup lang="ts">
import { computed, defineProps, onMounted, Ref, ref, withDefaults } from "vue";

import { useInterval } from "@/composable/useInterval";
import { useScreen } from "@/composable/useScreen";
import { useMouse } from "@/composable/useMouse";
import { useParticuleStore, Particule } from "@/store/particuleStore";
import uniqolor from "uniqolor";

const { screenX, screenY } = useScreen();
const { currentMousePosition, onFirstMouseMove } = useMouse();
const { addParticule, moveParticule } = useParticuleStore();
const { interval, timeout } = useInterval();

type IProps =
  | Particule
  | {
      randomInitialSpeed: boolean;
      randomInitialPosition: boolean;
      showStats: boolean;
    };

const props = withDefaults(defineProps<IProps>(), {
  id: null,
  definition: () => ({
    speed: 1,
  }),
  randomInitialSpeed: true,
  randomInitialPosition: true,
  showStats: false,
});

const particuleId = ref<number>();

const particuleDefinition: Ref<Particule> = addParticule({
  definition: {
    currentPosition: { x: 0, y: 0 },
    speed: 1,
    color: uniqolor.random().color,
    height: 50,
    width: 50,
    moveEveryMs: 1000 + Math.random() * 2000,
    canMove: false,
  },
  id: props.id,
  nextPosition: [],
});

particuleId.value = particuleDefinition.value.id;

const particuleTopPx = computed<string>(
  () =>
    particuleDefinition.value.definition.currentPosition.y -
    particuleDefinition.value.definition.width / 2 +
    "px"
);
const particuleLeftPx = computed<string>(
  () =>
    particuleDefinition.value.definition.currentPosition.x -
    particuleDefinition.value.definition.height / 2 +
    "px"
);
const particuleWidth = computed<string>(
  () => particuleDefinition.value.definition.width + "px"
);
const particuleHeight = computed<string>(
  () => particuleDefinition.value.definition.height + "px"
);

const particuleColor = computed<string>(
  () => "1px solid " + particuleDefinition.value.definition.color
);

onMounted(() => {
  if (props.randomInitialSpeed) {
    particuleDefinition.value.definition.speed = Math.random();
  }
  if (props.randomInitialPosition) {
    particuleDefinition.value.definition.currentPosition.x =
      Math.random() * screenX.value;
    particuleDefinition.value.definition.currentPosition.y =
      Math.random() * screenY.value;
  }
});

interval(() => {
  if (particuleDefinition.value.nextPosition.length > 0) {
    return;
  }
  particuleDefinition.value.nextPosition = [
    {
      x: currentMousePosition.value.x,
      y: currentMousePosition.value.y,
    },
  ];
}, particuleDefinition.value.definition.moveEveryMs);

interval(() => {
  if (!particuleId.value) {
    return;
  }
  moveParticule(particuleId.value);
}, 1);

onFirstMouseMove(() => {
  timeout(() => {
    particuleDefinition.value.definition.canMove = true;
  }, particuleDefinition.value.definition.moveEveryMs);
});
</script>

<template>
  <div class="block">
    <div v-if="props.showStats">
      <span> {{ particuleLeftPx }} {{ particuleTopPx }} </span>
      <br />
      <span>
        {{ particuleDefinition.definition.currentPosition.x }}
        {{ particuleDefinition.definition.currentPosition.y }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.block {
  position: absolute;
  top: v-bind(particuleTopPx);
  left: v-bind(particuleLeftPx);
  width: v-bind(particuleWidth);
  height: v-bind(particuleHeight);
  border: v-bind(particuleColor);
  color: red;
}
</style>