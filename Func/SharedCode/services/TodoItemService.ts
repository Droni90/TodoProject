import { ObjectId } from "mongodb";
import * as Mongoose from 'mongoose';
import * as mapper from "../mappers/TodoItemMapper";
import { TodoItemEty } from "../mongodb/entities";
import { TodoItemModel } from "../models/TodoItemModel";
import { PriorityEnm } from "../models/Enums/PriorityEnm";
import { getModelForClass } from "@typegoose/typegoose";

export class TodoItemService {

  constructor() {
  }

  public async addTodoItem(itemModel:TodoItemModel, groupId: string): Promise<TodoItemModel> {
      
    const ety = new TodoItemEty();
    const TodoGroupModel = getModelForClass(TodoItemEty);
    const todoItemEty = mapper.mapToEntity(itemModel, ety);
    todoItemEty.groupId = groupId
    
    const insertResult = await TodoGroupModel.create(todoItemEty);
    const todoItemNew = await TodoGroupModel.findOne({ where: { _id: insertResult._id }});
    return mapper.mapToModel(todoItemNew);
  }

  public async getTodoItems(groupId: String): Promise<TodoItemModel[]> {
    
    const TodoGroupModel = getModelForClass(TodoItemEty);
    const aggregate: Array<TodoItemModel> = [];
    const res = await TodoGroupModel.aggregate(aggregate);
    return res.filter(item => item.groupId === groupId).map(item => mapper.mapToModel(item))
  }

  public async deleteTodoItem(id: string): Promise<void> {
    const TodoGroupModel = getModelForClass(TodoItemEty);
    try {
     await TodoGroupModel.deleteOne({where: {_id: new Mongoose.Types.ObjectId(id)}});
    } catch (error) {
      console.error("TodoGroupService.deleteTodoGroup error", error);
      throw error;
    }
  }

  public async changeCompletedStatus(id: string): Promise<TodoItemModel> {
    
    const TodoGroupModel = getModelForClass(TodoItemEty);
    try {
      const ety = await TodoGroupModel.findOne({ where: { _id: new Mongoose.Types.ObjectId(id) }});
      ety.isCompleted = !ety.isCompleted;
      return mapper.mapToModel(ety);
    } catch (error) {
      console.error("TodoGroupService.ChangeColorTodoGroup error", error);
      throw error;
    }
  }

  public async changeDeadline(id: string,newDeadline: Date): Promise<TodoItemModel> {
    
    const TodoGroupModel = getModelForClass(TodoItemEty);
    try {
      const ety = await TodoGroupModel.findOne({ where: { _id: new Mongoose.Types.ObjectId(id) }});
      ety.deadline = newDeadline;
      return mapper.mapToModel(ety);
    } catch (error) {
      console.error("TodoGroupService.ChangeColorTodoGroup error", error);
      throw error;
    }
  }

  public getPriorities() {
    return Object.values(PriorityEnm)
      .filter(item => typeof item !== 'number')
  }

  public async changePriorityStatus(id: string, priority: string): Promise<TodoItemModel> {
    
    const TodoGroupModel = getModelForClass(TodoItemEty);
    try {
      const ety = await TodoGroupModel.findOne({ where: { _id: new ObjectId(id) }});
      ety.priority = priority
      return mapper.mapToModel(ety);
    } catch (error) {
      console.error("TodoGroupService.ChangeColorTodoGroup error", error);
      throw error;
    }
  }
}

  

