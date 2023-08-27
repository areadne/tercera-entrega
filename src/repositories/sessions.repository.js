export default class sessionRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll = async (data) => await this.dao.getAll(data);
}
