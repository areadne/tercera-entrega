export default class userRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getAll = async (data) => await this.dao.getAll(data);
    updateOne = async (id, data) => await this.dao.updateOne(id, data);
    deleteOne = async (id) => await this.dao.deleteOne(id);

  }
  