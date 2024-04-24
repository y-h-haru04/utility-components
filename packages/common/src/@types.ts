export enum Status {
  BeforeStart = 0,
  Working = 1,
  Hold = 2,
  Completed = 3,
}

export type TodoInput = {
  title: string;
  deadline: string;
};

export type Todo = {
  id: string;
  title: string;
  deadline: string;
  status: Status;
};

export type GetTodoListRes = {
  data: Todo[];
};

export type PostTodoRes = {
  data: Todo;
};

export type SearchCriteria = {
  title: string;
  deadline: string;
  status: number;
};
