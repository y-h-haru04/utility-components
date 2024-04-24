<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { TABLE_HEADER, type Todo } from "common";
  import Badge from "./Badge.svelte";

  type ClickButtonEvent = MouseEvent & {
    currentTarget: EventTarget & HTMLButtonElement;
  };

  const dispatch = createEventDispatcher<{
    clickRow: number;
    clickDelete: number;
  }>();

  export let todoList: Todo[] = [];

  const onClickRow = (index: number) => {
    dispatch("clickRow", index);
  };
  const onClickDelete = (e: ClickButtonEvent, index: number) => {
    e.stopPropagation();
    dispatch("clickDelete", index);
  };
</script>

<div class="table-wrapper">
  {#if todoList.length > 0}
    <table>
      <thead>
        <tr>
          {#each TABLE_HEADER as col}
            <th>{col}</th>
          {/each}
        </tr>
      </thead>

      <tbody>
        {#each todoList as row, index}
          <tr on:click={() => onClickRow(index)}>
            <td>{row.title}</td>
            <td>{row.deadline}</td>
            <td>
              <Badge bind:status={row.status} />
            </td>
            <td>
              <button
                class="btn btn-danger"
                on:click={e => onClickDelete(e, index)}>削除</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <div class="p-lg w-full">There's no TODO.</div>
  {/if}
</div>
