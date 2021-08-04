import { ObjectId } from "mongodb";
import * as Mongoose from 'mongoose';
import * as mapper from "../mappers/TodoItemMapper";
import { TodoItemEty } from "../mongodb/entities";
import { TodoItemModel } from "../models/TodoItemModel";
import { PriorityEnm } from "../models/Enums/PriorityEnm";
import { getModelForClass } from "@typegoose/typegoose";
import { connect } from "../mongodb";

export class TodoItemService {

  constructor() {
    connect()
  }

  public async addTodoItem(itemModel:TodoItemModel, groupId: string): Promise<TodoItemModel> {
      
    const ety = new TodoItemEty();
    const TodoItemModel = getModelForClass(TodoItemEty);
    const todoItemEty = mapper.mapToEntity(itemModel, ety);
    todoItemEty.groupId = groupId
    
    const insertResult = await TodoItemModel.create(todoItemEty);
    const todoItemNew = await TodoItemModel.findOne({ _id: insertResult._id });
    const model = mapper.mapToModel(todoItemNew);
    return {...model, id: todoItemNew._id}
  }

  public async getTodoItems(groupId: string): Promise<TodoItemModel[]> {
    
    const TodoItemModel = getModelForClass(TodoItemEty);
    const res = await TodoItemModel.find({ groupId });
    return res.map(item => {
      const model = mapper.mapToModel(item)
      return {...model, id: item._id}
    })
  }

  public async deleteTodoItem(id: string): Promise<void> {
    const TodoItemModel = getModelForClass(TodoItemEty);
    try {
     await TodoItemModel.deleteOne({_id: new Mongoose.Types.ObjectId(id)});
    } catch (error) {
      console.error("TodoGroupService.deleteTodoGroup error", error);
      throw error;
    }
  }

  public async changeCompletedStatus(id: string): Promise<TodoItemModel> {
    
    const TodoItemModel = getModelForClass(TodoItemEty);
    try {
      const ety = await TodoItemModel.findOne( { _id: new Mongoose.Types.ObjectId(id) });
      ety.isCompleted = !ety.isCompleted;
      ety.save()
      const model = mapper.mapToModel(ety);
      return {...model, id: ety._id}
    } catch (error) {
      console.error("TodoGroupService.ChangeColorTodoGroup error", error);
      throw error;
    }
  }

  public async changeDeadline(id: string,newDeadline: Date): Promise<TodoItemModel> {
    
    const TodoItemModel = getModelForClass(TodoItemEty);
    try {
      const ety = await TodoItemModel.findOne({ _id: new Mongoose.Types.ObjectId(id) });
      ety.deadline = newDeadline;
      ety.save()
      const model = mapper.mapToModel(ety);
      return {...model, id: ety._id}
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
    
    const TodoItemModel = getModelForClass(TodoItemEty);
    try {
      const ety = await TodoItemModel.findOne( { _id: new ObjectId(id) });
      ety.priority = priority
      ety.save()
      const model = mapper.mapToModel(ety);
      return {...model, id: ety._id}
    } catch (error) {
      console.error("TodoGroupService.ChangeColorTodoGroup error", error);
      throw error;
    }
  }

  public async getUrgentTodoItems(count: number): Promise<TodoItemModel[]> {
    const TodoItemModel = getModelForClass(TodoItemEty);
    const res = await TodoItemModel.aggregate([
      {
        $match: {
          isCompleted: false,
        }
      },
      {
        $sort: {
          deadline: 1, 
        }
      },
      {
        $limit: count,
      }] );
    return res.map(todo => {
      const model = mapper.mapToModel(todo)
      return {...model, id: todo._id}
    })
  }
}

  

