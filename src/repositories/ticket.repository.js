export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getAll = async () => await this.dao.getAll();
  create = async (data) => await this.dao.create(data);
}
