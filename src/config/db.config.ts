import {Sequelize} from "sequelize";

// to connect to our sqlite database
const db = new Sequelize("database", 'desmond', 'passWor!d', {
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false
});

// export db and import into app.ts
export default db;