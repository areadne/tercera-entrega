export default class carRepository {
    constructor(dao) {
      this.dao = dao;
    }
  
    getAll = async () => await this.dao.getAll();
    getOne = async (data) => await this.dao.getOne(data);
    create = async (data) => await this.dao.create(data);
    updateOne = async (id, data) => await this.dao.updateOne(id, data);
    deleteOne = async (id) => await this.dao.deleteOne(id);
    paginate = async (data, details) =>
      await this.dao.paginate(data, details);
  }
  