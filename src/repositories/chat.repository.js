export default class chatRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = async () => await this.dao.getAll();
}
