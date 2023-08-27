export default class cartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async () => await this.dao.getAll();
  create = async (data) => await this.dao.create(data);
  updateOne = async (id, data) => await this.dao.updateOne(id, data);
  findOneAndUpdate = async (id, data, filter) =>
    await this.dao.findOneAndUpdate(id, data, filter);
  findOne = async (id) => await this.dao.findOne(id);
}
