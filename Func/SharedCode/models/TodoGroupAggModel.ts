import { TodoItemModel } from "./TodoItemModel";

export interface TodoGroupAggModel {
  _id?: string;
  groupName: string;
  color: string;
  isDeleted: boolean;
  todoItems: TodoItemModel[];
}