import * as Mongoose from 'mongoose';
// import { createConnection, getConnection, Connection } from "typeorm";

// let connection: Connection = undefined;
// const connectionName = "MongoDefault";

// export const createMongoConnection = async (): Promise<Connection> => {
//   console.log(`creatMongoConnection`);
  
//   if (connection === undefined) {
//     console.log("creating new connection...");
//     const mongoConnectionOptions: any = {database:"todo",url:"mongodb://localhost:27017"};
//     mongoConnectionOptions.type = "mongodb";
//     mongoConnectionOptions.entities = [__dirname + '/entities/*{.ts,.js}'];
//     mongoConnectionOptions.migrations = [__dirname + '/migration/*{.ts,.js}'];
//     mongoConnectionOptions.subscribers = [__dirname + '/subscriber/*{.ts,.js}'];
//     mongoConnectionOptions.name = connectionName;
//     connection = await createConnection(mongoConnectionOptions);
//   } else {
//     console.log("getting connections...");
//     connection = await getConnection(connectionName);
//   }

//   // TODO refactor to use same method return type as mysql connection or vice versa
//   return connection;
// }


let database: Mongoose.Connection;

export const connect = () => {

    const url = "mongodb://localhost:27017";

    if (database) {
        return;
    }
    
    Mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        dbName: "app-todo"
    });
    
    database = Mongoose.connection;

    database.once("open", async () => {
        console.log("Connected to database");
    });
      
    database.on("error", () => {
        console.log("Error connecting to database");
    });
};