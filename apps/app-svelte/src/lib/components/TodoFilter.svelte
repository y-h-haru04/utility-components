<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import FormSelect from "$lib/components/FormSelect.svelte";
  import FormInput from "$lib/components/FormInput.svelte";
  import { SEARCH_SELECT_OPTIONS, type SearchCriteria } from "common";

  const dispatch = createEventDispatcher<{ criteriaChange: SearchCriteria }>();

  let inputTitle: string = "";
  let inputDeadline: string = "";
  let selectedStatus = SEARCH_SELECT_OPTIONS[0];
  let timeoutId: NodeJS.Timeout | undefined = undefined;

  const updateTimeout = (callback: () => void) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback();
    }, 500);
  };

  $: {
    updateTimeout(() => {
      dispatch("criteriaChange", {
        title: inputTitle.trim(),
        deadline: inputDeadline.trim(),
        status: selectedStatus.id,
      });
    });
  }
</script>

<div class="py-2 flex gap-2">
  <FormInput id="filter-title" title="タイトル" bind:value={inputTitle} />
  <FormInput
    id="filter-deadline"
    title="期日"
    inputType="date"
    bind:value={inputDeadline}
  />
  <FormSelect
    title="ステータス"
    id="filter-status"
    options={SEARCH_SELECT_OPTIONS}
    bind:value={selectedStatus}
  />
</div>
