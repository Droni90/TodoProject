import { prop } from "@typegoose/typegoose";
import * as Mongoose from "mongoose"

export class TodoItemEty {
    @prop()
    public todoName: string;

    @prop()
    public isCompleted: boolean;

    @prop()
    public groupId: string;

    @prop()
    public priority: string;

    @prop()
    public deadline: Date;

    @prop()
    public expired: boolean;
}