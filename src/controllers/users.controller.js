import { userServiceManager } from "../services/users.service.js";

const managerUser = new userServiceManager();

export const changeUserController = async (request, response) => {
  await managerUser.changeUser(request, response);
};

export const createUserController = async (request, response) => {
  await managerUser.createUser(request, response);
};

export const loginTokenController = async (request, response) => {
  await managerUser.loginToken(request, response);
};

export const getUserController = async (request, response) => {
  await managerUser.getUser(request, response);
};

export const getUserByIdController = async (request, response) => {
  await managerUser.getUserById(request, response);
};

export const validateTokenController = async (request, response) => {
  await managerUser.validateToken(request, response)
}

export const deleteUser = async (request, response) => {
  await managerUser.deleteUser(request, response)
}