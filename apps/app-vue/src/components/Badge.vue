<script setup lang="ts">
import { resolveBadge, Status } from "common";
import { computed } from "vue";

const props = defineProps<{
  status: Status;
}>();

const badgeProps = computed<[string, string]>(() => {
  return resolveBadge(props.status);
});
</script>

<template>
  <div :class="badgeProps[0]">{{ badgeProps[1] }}</div>
</template>
