import { TodoGroupModel } from "../models/TodoGroupModel";
import { TodoGroupEty } from "../mongodb/entities/TodoGroupEty";
import { connect } from "../mongodb/index";
import * as Mongoose from 'mongoose'
import * as mapper from "../mappers/TodoGroupMapper";
import { TodoItemService } from "./TodoItemService";

import { getModelForClass } from "@typegoose/typegoose";
import { TodoItemEty } from "../mongodb/entities";
import { ObjectId, ObjectID } from "mongodb";
import { TodoGroupAggModel } from "../models/TodoGroupAggModel";

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
    return {...model, id}
  }

  public async getTodoGroups(): Promise<TodoGroupModel[]> {
    const TodoGroupModel = getModelForClass(TodoGroupEty);
    
    const agg = await TodoGroupModel.aggregate<TodoGroupAggModel>([
      {
        $match: { isDeleted: false }
      },
      {
        $project: {
          _id: {
            "$toString": "$_id"
          },
          groupName: "$groupName",
          color: "$color",
          isDeleted: "$isDeleted"
        }
      },
      {
        $lookup:{
          from: "todoitemeties",
          localField: "_id",
          foreignField: "groupId",
          as: "todoItems"
        }
      },
      // {
      //   $addFields: {
      //       totalCount: { $size: "$todoitemeties_docs" },
      //   }
      // },
    ]);
    return agg.map(item => {
     const model = mapper.mapToModel(item)
     model.totalCount = item.todoItems.length
     model.completedCount = item.todoItems.filter(todo => todo.isCompleted === true).length
     model.id = item._id
     return model
    })
    // const model = mapper.mapToModel(agg)
    // return await Promise.all(res.map(async group => {  
    //       const model = mapper.mapToModel(group)
    //       const todoItem = await todoItems.getTodoItems(group._id.toString())
    //       model.totalCount = todoItem.length
    //       model.completedCount = todoItem.filter(todo => todo.isCompleted === true).length
    //       model.id = group._id
    //       return model
    //   })
    // )
  }

  public async deleteTodoGroup(id: string): Promise<TodoGroupModel> {
    const TodoGroupModel = getModelForClass(TodoGroupEty);
    try {
      const ety = await TodoGroupModel.findOne({_id: new Mongoose.Types.ObjectId(id) });
      ety.isDeleted = true;
      await ety.save()
      const model = mapper.mapToModel(ety)
      return {...model, id}
    } catch (error) {
      console.error("TodoGroupService.deleteTodoGroup error", error);
      throw error;
    }
  }

  // public async getTodoGroup(): Promise<any> {
  //   const TodoGroupModel = getModelForClass(TodoGroupEty);
  //   let aggregate: Array<any> = [];
  //   const res = await TodoGroupModel.aggregate(aggregate);
  
  //   return res;
  // }

  public async changeColorTodoGroup(id: string, color: string): Promise<TodoGroupModel> {
    
    const TodoGroupModel = getModelForClass(TodoGroupEty);
    try {
      const ety = await TodoGroupModel.findOne({ _id: new Mongoose.Types.ObjectId(id) });
      ety.color = color;
      await ety.save()
      const model = mapper.mapToModel(ety)
      return {...model, id}
    } catch (error) {
      console.error("TodoGroupService.ChangeColorTodoGroup error", error);
      throw error;
    }
  }
}

