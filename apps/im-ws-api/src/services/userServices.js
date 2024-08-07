const database = require("../database/models");
const pick = require("lodash/pick");
const isEmpty = require("lodash/isEmpty");

const getUserByUserId = async (userId) => {
  return await database.User.findOne({
    attributes: ["id", "name", "phone", "email", "createdAt"],
    where: {
      id: userId,
    },
  });
};

module.exports.updateUserByUserId = async (userId, query) => {
  const user = await getUserByUserId(userId);

  if(query.name) {
    user.name = query.name;
  }

  if(query.email) {
    user.email = query.email;
  }

  await user.save();
  return user;
};

module.exports.getUserWithPasswordBy = async (phone) => {
  const userResult = await database.User.findOne({
    where: {
      phone,
    },
  });

  return userResult;
};

const parseUserResponse = (userResult) => {
  const userResponse = pick(userResult, [
    "id",
    "phone",
    "email",
    "createAt",
  ]);
  return userResponse;
};

module.exports.createUser = async (userData) => {
  const existUser = await database.User.findOne({ where: {phone: userData.phone} });
  if (existUser) throw new Error("使用者已存在");

  const userResult = await database.User.create(
    {
      name: userData.name,
      phone: userData.phone,
      email: userData.email,
      password: userData.password,
    });
  

  return {
    id: userResult.id,
    createdAt: userResult.createdAt,
    ...userData,
  };
};

module.exports.parseUserResponse = parseUserResponse;
module.exports.getUserByUserId = getUserByUserId;
