<script setup lang="ts">
import { computed, defineProps } from "vue";
import { Stats, useStatsStore } from "@/store/statsStore";
const { getStat } = useStatsStore();

const props = defineProps<{
  statId: string;
}>();

const stat: Stats | undefined = getStat(props.statId);

const getContent = computed<string>(() => {
  if (stat) {
    return `${stat.label}: ${stat.value()}`;
  }
  return "";
});
</script>

<template>
  <div v-if="stat">
    <span v-text="getContent" />
  </div>
</template>

<style scoped></style>
