<script lang="ts">
  export let id: string | null = null;
  export let title: string = "";
  export let inputType: "text" | "date" = "text";
  export let value: string;
  export const focus = () => {
    inputRef.focus();
  };

  let inputRef: HTMLInputElement;
</script>

<div class="form-group">
  {#if title && id}
    <label for={id} class="form-label">{title}</label>
  {/if}

  {#if inputType == "date"}
    <input
      {id}
      type="date"
      class="form-input"
      bind:this={inputRef}
      bind:value
    />
  {:else}
    <input {id} class="form-input" bind:this={inputRef} bind:value />
  {/if}
</div>
