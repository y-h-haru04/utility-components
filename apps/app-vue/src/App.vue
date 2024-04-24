<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import {
  type Todo,
  postTodo,
  getTodoList,
  OPTIONS,
  deleteTodo,
  filterTodoList,
  SearchCriteria,
  updateTodo,
} from "common";
import Header from "./components/Header.vue";
import FormInput from "./components/FormInput.vue";
import TodoTable from "./components/TodoTable.vue";
import TodoFilter from "./components/TodoFilter.vue";
import Modal from "./components/Modal.vue";
import FormSelect from "./components/FormSelect.vue";

const editTitleRef = ref<InstanceType<typeof FormInput> | null>(null);
const titleInput = ref<string>("");
const deadlineInput = ref<string>("");
const editTitleInput = ref<string>("");
const editDeadlineInput = ref<string>("");
const editStatusSelect = ref<(typeof OPTIONS)[number]>(OPTIONS[0]);
const todoList = ref<Todo[]>([]);
const editTodo = ref<Todo | null>(null);
const openEditModal = ref<boolean>(false);
const searchCriteria = ref<SearchCriteria>({
  title: "",
  deadline: "",
  status: -1,
});

const initInput = () => {
  titleInput.value = "";
  deadlineInput.value = "";
};

const init = async () => {
  const res = await getTodoList();
  todoList.value = res.data;
  initInput();
};

const onDestroyModal = () => {
  editTodo.value = null;
  editTitleInput.value = "";
  editDeadlineInput.value = "";
  editStatusSelect.value = OPTIONS[0];
};

const onClickTodoRow = async (index: number) => {
  const targetTodo = todoList.value[index];
  const statusOptions = OPTIONS.find(option => {
    return option.id === targetTodo.status;
  });
  editTodo.value = targetTodo;
  editTitleInput.value = targetTodo.title;
  editDeadlineInput.value = targetTodo.deadline;
  openEditModal.value = true;
  if (statusOptions) {
    editStatusSelect.value = statusOptions;
  }

  await nextTick();
  if (editTitleRef.value) {
    editTitleRef.value?.focus();
  }
};

const onClickTodoDelete = async (index: number) => {
  const targetTodo = todoList.value[index];
  if (targetTodo) {
    const deleteId = targetTodo.id;
    await deleteTodo(deleteId);
    todoList.value.splice(index, 1);
  }
};

const onClickAdd = async () => {
  const result = await postTodo({
    title: titleInput.value,
    deadline: deadlineInput.value,
  });
  todoList.value.push(result.data);
  initInput();
};

const onClickUpdateModal = async () => {
  const targetTodo = editTodo.value;
  if (targetTodo) {
    const result = await updateTodo({
      ...targetTodo,
      deadline: editDeadlineInput.value,
      title: editTitleInput.value,
      status: editStatusSelect.value.id,
    });
    const targetId = targetTodo.id;
    const updateAt = todoList.value.findIndex(
      (todo: Todo) => todo.id === targetId,
    );
    todoList.value.splice(updateAt, 1, result.data);
  }
  openEditModal.value = false;
};

const onClickCancelModal = () => {
  openEditModal.value = false;
};

const onCriteriaChange = (_searchCriteria: SearchCriteria) => {
  searchCriteria.value = _searchCriteria;
};

const filteredTodoList = computed<Todo[]>(() => {
  return filterTodoList(todoList.value, searchCriteria.value);
});

const canAdd = computed<boolean>(() => {
  return (
    titleInput.value.trim().length > 0 && deadlineInput.value.trim().length > 0
  );
});

onMounted(() => {
  init();
});
</script>

<template>
  <Header />
  <main class="p-md flex flex-col gap-2">
    <!-- TodoInputArea -->
    <div class="card">
      <div class="card-header">新しいTODOの追加</div>

      <div class="p-lg flex flex-col gap-2">
        <FormInput
          title="タイトル"
          id="title-input"
          v-model:value="titleInput"
        />
        <FormInput
          title="期日"
          inputType="date"
          id="deadline-input"
          v-model:value="deadlineInput"
        />
        <div class="mt-2">
          <button
            class="btn btn-primary w-full"
            :disabled="!canAdd"
            @click="onClickAdd"
          >
            追加
          </button>
        </div>
      </div>
    </div>

    <!-- TodoDisplayArea -->
    <div class="card">
      <div class="card-header">TODOリスト</div>
      <div class="p-lg">
        <TodoFilter @criteriaChange="onCriteriaChange" />

        <TodoTable
          @clickRow="onClickTodoRow"
          @clickDelete="onClickTodoDelete"
          :todoList="filteredTodoList"
        />
      </div>
    </div>

    <!-- EditModalArea -->
    <Transition name="fade">
      <Modal
        v-if="openEditModal"
        title="TODOの編集"
        :onDestroyModal="onDestroyModal"
      >
        <template v-slot:body>
          <div class="flex flex-col gap-2">
            <FormInput
              id="edit-title-input"
              title="タイトル"
              ref="editTitleRef"
              v-model:value="editTitleInput"
            />
            <FormInput
              id="edit-deadline-input"
              title="期日"
              inputType="date"
              v-model:value="editDeadlineInput"
            />

            <FormSelect
              id="edit-status-select"
              title="ステータス"
              :options="OPTIONS"
              v-model:value="editStatusSelect"
            />
          </div>
        </template>

        <template v-slot:footer>
          <div class="flex w-full gap-2">
            <div class="flex-1" />
            <button class="btn btn-secondary" @click="onClickCancelModal">
              キャンセル
            </button>
            <button class="btn btn-primary" @click="onClickUpdateModal">
              更新
            </button>
          </div>
        </template>
      </Modal>
    </Transition>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
