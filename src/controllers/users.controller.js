import { userServiceManager } from "../services/users.service.js";

const managerUser = new userServiceManager();

export const changeUserController = async (request, response) => {
  await managerUser.changeUser(request, response);
};

export const getUsersController = async (request, response) => {
    await managerUser.getUsers(request, response)
}

export const deleteUser = async (request, response) => {
    await managerUser.deleteUser(request, response)
}