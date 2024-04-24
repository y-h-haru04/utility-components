<script setup lang="ts">
import { SEARCH_SELECT_OPTIONS, type SearchCriteria } from "common";
import FormInput from "./FormInput.vue";
import { reactive, ref, watch } from "vue";
import FormSelect from "./FormSelect.vue";

type ReactiveInputs = {
  title: string;
  deadline: string;
  selectedStatus: (typeof SEARCH_SELECT_OPTIONS)[number];
};

const emits = defineEmits<{
  (name: "criteriaChange", searchCriteria: SearchCriteria): void;
}>();

const inputs = reactive<ReactiveInputs>({
  title: "",
  deadline: "",
  selectedStatus: SEARCH_SELECT_OPTIONS[0],
});
const timeoutId = ref<number | undefined>(undefined);

watch(inputs, (newValue: ReactiveInputs) => {
  clearTimeout(timeoutId.value);
  timeoutId.value = setTimeout(() => {
    emits("criteriaChange", {
      ...newValue,
      status: newValue.selectedStatus.id,
    });
  }, 500);
});
</script>

<template>
  <div class="py-2 flex gap-2">
    <FormInput
      id="filter-title"
      title="タイトル"
      v-model:value="inputs.title"
    />
    <FormInput
      id="filter-deadline"
      title="期日"
      inputType="date"
      v-model:value="inputs.deadline"
    />
    <FormSelect
      title="ステータス"
      id="filter-status"
      :options="SEARCH_SELECT_OPTIONS"
      v-model:value="inputs.selectedStatus"
    />
  </div>
</template>
