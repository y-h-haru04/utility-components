<script setup lang="ts" generic="T extends { text: string; id: number }">
defineProps<{
  id?: string;
  title?: string;
  options: readonly T[];
}>();

const value = defineModel<T>("value");
</script>

<template>
  <div class="form-group">
    <label v-if="title && id" :for="id" class="form-label">{{ title }}</label>
    <select :id="id" class="form-input" v-model="value">
      <option v-for="option in options" :value="option" :key="option.id">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>
