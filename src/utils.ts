import Joi from "joi";
import { User, Transaction, FundingAccount } from "./models"

export const registerValidator = Joi.object().keys({
  username: Joi.string().lowercase().required(),
  email: Joi.string().lowercase().required(),
  password: Joi.string().min(6).max(15).required(),
  fullname: Joi.string().required(),
  phone: Joi.string().required()
});

export const loginValidator = Joi.object().keys({
  email: Joi.string().lowercase().required(),
  password: Joi.string().min(6).max(35).required(),
});

/**validation options*/
export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};


export async function getAllUsers() {
  const data = await User.findAll({
    attributes: ['username', 'email', 'fullname', 'phone']
  });
  return data;
}

export async function getUserByUsername(username: string) {
  const data = await User.findOne({
    where: { username: username },
    attributes: ['username', 'email', 'fullname', 'phone']
  });
  return data;
}

// export async function getUserById(id: string) {
//   const data = await User.findOne({
//     where: { id: id },
//     attributes: ['username', 'email', 'fullname', 'phone'],
//     // include: [{ model: FundingAccount, attributes: ['acctNo', 'acctBal'] }]
//   });
//   return data;
// }

export async function getUserFundAcct(userId: string) {
  const data = await FundingAccount.findOne({
    where: { userId: userId },
    attributes: ['acctNo', 'acctBal']
  });
  
  return data?.dataValues;
}

export async function getUserTransactions(userId: string, limit: number) {
  const data = await Transaction.findAll({
    where: { userId },
    attributes: ['amount', 'description', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: limit
  });
  const list:{}[] = [];
  data.forEach((i: any) => {
    const obj = {
      amount: i.amount,
      description: i.description,
      createdAt: i.createdAt.toLocaleString()
    }
    list.push(obj);
  });
  return list;
}