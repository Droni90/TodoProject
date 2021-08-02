import { TodoGroupModel } from "../models/TodoGroupModel";
import { TodoGroupEty } from "../mongodb/entities/TodoGroupEty";
import { connect } from "../mongodb/index";
import * as Mongoose from 'mongoose'
import * as mapper from "../mappers/TodoGroupMapper";
import { TodoItemService } from "./TodoItemService";

import { getModelForClass } from "@typegoose/typegoose";

export class TodoGroupService {

  constructor() {
    connect();
  }

  public async addTodoGroup(group:TodoGroupModel): Promise<TodoGroupModel> {
    const ety = new TodoGroupEty()
    const TodoGroupModel = getModelForClass(TodoGroupEty);

    const todoGroupEty = mapper.mapToEntity(group, ety);
    const { _id: id } = await TodoGroupModel.create(todoGroupEty);

    const todoGroupNew = await TodoGroupModel.findById(id);
    const model = mapper.mapToModel(todoGroupNew);
    return {...model, _id: id}
  }

  public async getTodoGroups(): Promise<TodoGroupModel[]> {
    const TodoGroupModel = getModelForClass(TodoGroupEty);

    const aggregate: Array<TodoGroupModel> = [];
    const res = await TodoGroupModel.aggregate(aggregate)
    const todoItems =  new TodoItemService();
 
    return await Promise.all(res.filter(groups => groups.isDeleted === false).map(async group => {
          
          const model = mapper.mapToModel(group)
          const todoItem = await todoItems.getTodoItems(group._id.toString())
          model.totalCount = todoItem.length
          model.completedCount = todoItem.filter(todo => todo.isCompleted === true).length
          return model
    })
    )
  }

  public async deleteTodoGroup(id: string): Promise<TodoGroupModel> {
    const TodoGroupModel = getModelForClass(TodoGroupEty);
    try {
      const ety = await TodoGroupModel.findOne({ where: { _id: new Mongoose.Types.ObjectId(id) }});
      ety.isDeleted = true;
      return mapper.mapToModel(ety)
    } catch (error) {
      console.error("TodoGroupService.deleteTodoGroup error", error);
      throw error;
    }
  }
  public async getTodoGroup(): Promise<any> {
    const TodoGroupModel = getModelForClass(TodoGroupEty);
    let aggregate: Array<any> = [];
    const res = await TodoGroupModel.aggregate(aggregate);
  
    return res;
  }

  public async changeColorTodoGroup(id: string, color: string): Promise<TodoGroupModel> {
    
    const TodoGroupModel = getModelForClass(TodoGroupEty);
    try {
      const ety = await TodoGroupModel.findOne({ where: { _id: new Mongoose.Types.ObjectId(id) }});
      ety.color = color;
      return mapper.mapToModel(ety);
    } catch (error) {
      console.error("TodoGroupService.ChangeColorTodoGroup error", error);
      throw error;
    }
  }
}

