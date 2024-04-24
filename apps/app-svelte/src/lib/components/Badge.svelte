<script lang="ts">
  import { Status, resolveBadge } from "common";

  export let status: Status;

  $: [className, text] = (() => {
    return resolveBadge(status);
  })();
</script>

<div class={className}>{text}</div>
