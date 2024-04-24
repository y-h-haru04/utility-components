<script lang="ts">
  import { onMount, tick } from "svelte";
  import { fade } from "svelte/transition";
  import {
    type SearchCriteria,
    OPTIONS,
    updateTodo,
    deleteTodo,
    filterTodoList,
  } from "common";
  import { type Todo, getTodoList, postTodo } from "common";
  import Modal from "$lib/components/Modal.svelte";
  import FormSelect from "$lib/components/FormSelect.svelte";
  import TodoTable from "$lib/components/TodoTable.svelte";
  import Header from "$lib/components/Header.svelte";
  import TodoFilter from "$lib/components/TodoFilter.svelte";
  import FormInput from "$lib/components/FormInput.svelte";

  let editTitleRef: FormInput;
  let titleInput = "";
  let deadlineInput = "";
  let editTitleInput = "";
  let editDeadlineInput = "";
  let editStatusSelect: (typeof OPTIONS)[number] = OPTIONS[0];
  let todoList: Todo[] = [];
  let editTodo: Todo | null = null;
  let openEditModal: boolean = false;
  let searchCriteria: SearchCriteria = {
    title: "",
    deadline: "",
    status: -1,
  };

  const initInput = () => {
    titleInput = "";
    deadlineInput = "";
  };

  const init = async () => {
    const res = await getTodoList();
    todoList = res.data;
    initInput();
  };

  const onDestroyModal = () => {
    editTodo = null;
    editTitleInput = "";
    editDeadlineInput = "";
    editStatusSelect = OPTIONS[0];
  };

  const onClickTodoRow = async (e: CustomEvent<number>) => {
    const index = e.detail;
    const targetTodo = todoList[index];
    const statusOptions = OPTIONS.find(option => {
      return option.id === targetTodo.status;
    });
    editTodo = targetTodo;
    editTitleInput = targetTodo.title;
    editDeadlineInput = targetTodo.deadline;
    openEditModal = true;
    if (statusOptions) {
      editStatusSelect = statusOptions;
    }

    await tick();
    if (editTitleRef) {
      editTitleRef.focus();
    }
  };

  const onClickTodoDelete = async (e: CustomEvent<number>) => {
    const index = e.detail;
    const targetTodo = todoList[index];
    if (targetTodo) {
      const deleteId = targetTodo.id;
      await deleteTodo(deleteId);
      todoList.splice(index, 1);
      todoList = todoList;
    }
  };

  const onClickAdd = async () => {
    const result = await postTodo({
      title: titleInput,
      deadline: deadlineInput,
    });
    todoList.push(result.data);
    todoList = todoList;
    initInput();
  };

  const onClickUpdateModal = async () => {
    if (editTodo !== null) {
      const result = await updateTodo({
        ...editTodo,
        deadline: editDeadlineInput,
        title: editTitleInput,
        status: editStatusSelect.id,
      });
      const targetId = editTodo.id;
      const updateAt = todoList.findIndex((todo: Todo) => todo.id === targetId);
      todoList.splice(updateAt, 1, result.data);
      todoList = todoList;
    }
    openEditModal = false;
  };

  const onClickCancelModal = () => {
    openEditModal = false;
  };

  const onCriteriaChange = (_searchCriteria: CustomEvent<SearchCriteria>) => {
    searchCriteria = _searchCriteria.detail;
  };

  $: filteredTodoList = filterTodoList(todoList, searchCriteria);

  $: canAdd = titleInput.trim().length > 0 && deadlineInput.trim().length > 0;

  onMount(() => {
    init();
  });
</script>

<div>
  <Header />
  <main class="p-md flex flex-col gap-2">
    <!-- TodoInputArea -->
    <div class="card">
      <div class="card-header">新しいTODOの追加</div>

      <div class="p-lg flex flex-col gap-2">
        <FormInput title="タイトル" id="title-input" bind:value={titleInput} />
        <FormInput
          title="期日"
          inputType="date"
          id="deadline-input"
          bind:value={deadlineInput}
        />
        <div class="mt-2">
          <button
            class="btn btn-primary w-full"
            disabled={!canAdd}
            on:click={onClickAdd}>追加</button
          >
        </div>
      </div>
    </div>

    <!-- TodoDisplayArea -->
    <div class="card">
      <div class="card-header">TODOリスト</div>
      <div class="p-lg">
        <TodoFilter on:criteriaChange={onCriteriaChange} />

        <TodoTable
          on:clickRow={onClickTodoRow}
          on:clickDelete={onClickTodoDelete}
          todoList={filteredTodoList}
        />
      </div>
    </div>

    <!-- EditModalArea -->
    {#if openEditModal}
      <div transition:fade={{ delay: 0, duration: 200 }}>
        <Modal title={"TODOの編集"} {onDestroyModal}>
          <div slot="body" class="flex flex-col gap-2">
            <FormInput
              id="edit-title-input"
              title="タイトル"
              bind:this={editTitleRef}
              bind:value={editTitleInput}
            />
            <FormInput
              id="edit-deadline-input"
              title="期日"
              inputType="date"
              bind:value={editDeadlineInput}
            />

            <FormSelect
              id="edit-status-select"
              title="ステータス"
              options={OPTIONS}
              bind:value={editStatusSelect}
            />
          </div>
          <div slot="footer" class="flex w-full gap-2">
            <div class="flex-1" />
            <button class="btn btn-secondary" on:click={onClickCancelModal}
              >キャンセル</button
            >
            <button class="btn btn-primary" on:click={onClickUpdateModal}
              >更新</button
            >
          </div>
        </Modal>
      </div>
    {/if}
  </main>
</div>
