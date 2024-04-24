<script lang="ts">
  import { onDestroy } from "svelte";

  export let title: string;
  export let onDestroyModal: (() => void) | null = null;

  onDestroy(() => {
    onDestroyModal?.();
  });
</script>

<div class="modal">
  <div class="modal-backdrop"></div>
  <div class="modal-content">
    <!-- Modal header -->
    <div class="modal-header">
      <h3 class="modal-title">{title}</h3>
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
