<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  id?: string;
  title?: string;
  inputType?: "text" | "date";
}>();

const value = defineModel<string>("value");

const inputRef = ref<HTMLInputElement | null>(null);

const focus = () => {
  inputRef.value?.focus();
};

defineExpose({
  focus,
});
</script>

<template>
  <div class="form-group">
    <label v-if="title && id" :for="id" class="form-label">{{ title }}</label>
    <input
      :id="id"
      :type="inputType"
      class="form-input"
      ref="inputRef"
      v-model="value"
    />
  </div>
</template>
