import { DataTypes, Model } from "sequelize";
import db from "./config/db.config";

export interface UserAttributes {
  id: string;
  username: string;
  email: string;
  password: string;
  fullname: string;
  phone: string;
  isAdmin: boolean;
}
export class User extends Model { };
User.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize: db,
  tableName: "Users",
  // modelName: "Users"
});


export class Transaction extends Model { }
Transaction.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    // credit, debit
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    // 100, 200, 500, 1000, 2000, 5000, 10000
    type: DataTypes.NUMBER,
    allowNull: false
  },
  description: {
    // N + amount + serviceProvider + service
    type: DataTypes.STRING,
  },
  service: {
    // airtime, data, utility bill payment, fund
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUIDV4,
    allowNull: false
  },
  phone: {
    // 08012345678
    type: DataTypes.STRING,
    allowNull: true,
  },
  serviceProvider: {
    // mtn, glo, airtel, 9mobile, topidusBank, dstv, gotv, startimes, phcn
    type: DataTypes.STRING,
    allowNull: false,
    // defaultValue: 'mtn'
  },
}, {
  sequelize: db,
  tableName: "Transactions",
});



export class FundingAccount extends Model { };
FundingAccount.init({
  id: {
    type: DataTypes.UUIDV4,
    primaryKey: true,
  },
  bankName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Topidus Bank"
  },
  acctNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acctName: {
    // username-topidus
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUIDV4,
    allowNull: false
  },
  acctBal: {
    type: DataTypes.NUMBER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize: db,
  tableName: "FundingAccounts"
})

Transaction.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Transaction, { foreignKey: 'userId' });

FundingAccount.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(FundingAccount, { foreignKey: "userId" });



// export interface TransactionAttributes {
//   id: string;
//   type: string;
//   amount: number;
//   description: string;
//   service: string;
//   userId: string;
//   phone: string;
//   serviceProvider: string;
//   createdAt?: string;
// }