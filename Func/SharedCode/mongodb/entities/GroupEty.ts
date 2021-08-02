import { prop } from "@typegoose/typegoose";
import { ObjectID } from "mongodb";
import * as Mongoose from "mongoose"

export class GroupEty {

    @prop()
    public groupName: string;

    @prop()
    public color: string;

    @prop()
    public isDeleted: boolean;
}