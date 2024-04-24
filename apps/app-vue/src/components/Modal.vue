<script setup lang="ts">
import { onUnmounted } from "vue";

const { onDestroyModal } = defineProps<{
  title: string;
  onDestroyModal?: () => void;
}>();

onUnmounted(() => {
  onDestroyModal?.();
});
</script>

<template>
  <div class="modal">
    <div class="modal-backdrop"></div>
    <div class="modal-content">
      <!-- Modal header -->
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
      </div>
      <!-- Modal body -->
      <div class="modal-body">
        <slot name="body" />
      </div>
      <!-- Modal footer -->
      <div class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
