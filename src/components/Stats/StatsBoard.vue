<script setup lang="ts">
import { computed, onMounted, Ref, ref } from "vue";
import StatsItem from "@/components/Stats/StatsItem.vue";
import { Stats, useStatsStore } from "@/store/statsStore";
const { addOnStatsAddedCallback, setBoardMounted } = useStatsStore();

const stats: Ref<Stats[]> = ref([]);

const statIds = computed(() => {
  return stats.value.map((stat) => stat.id);
});

addOnStatsAddedCallback((newStat: Stats) => {
  stats.value.push(newStat);
});

onMounted(() => {
  setBoardMounted();
});
</script>

<template>
  <div id="stats">
    <StatsItem v-bind:key="i" v-bind:stat-id="i" v-for="i of statIds" />
  </div>
</template>

<style scoped>
#stats {
  position: absolute;
  top: 0;
  left: 0;
  //min-width: 20vw;
  //min-height: 20vw;
  //border: 1px solid greenyellow;
  color: greenyellow;
  padding: 0.5vw;
  background-color: black;
  z-index: 1000;
}
</style>
