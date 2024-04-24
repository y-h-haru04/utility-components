<script lang="ts" generics="T extends { text: string }">
  export let id: string | null= null;
  export let title: string = '';
  export let value: T;
  export let options: readonly T[];
</script>

<div class="form-group">
  {#if title && id}
    <label for={id} class="form-label">{title}</label>
  {/if}
  <select id={id} class="form-input" bind:value>
    {#each options as option}
      <option value={option}>
        {option.text}
      </option>
    {/each}
  </select>
</div>
