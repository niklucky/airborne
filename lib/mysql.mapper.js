const BaseMapper = require('./base.mapper');
const MySQLQueryBuilder = require('./mysql.query.builder');

class MySQLMapper extends BaseMapper {
  constructor(di) {
    super(di);
    this.db = null;
    this.dbTable = null;
    this.queryBuilder = new MySQLQueryBuilder();
  }

  get(params) {
    return new Promise((resolve, reject) => {
      try {
        let query = this.queryBuilder
          .select('*')
          .from(this.dbTable)
          .where(params)
          .buildSQL();
        this.db.query(query, (error, rows, fields) => {
          if (error) {
            return reject(error);
          }
          resolve(this.build(rows[0]));
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  create(params){
    const data = new this.Model(params);
    return data;
  }
}

module.exports = MySQLMapper;
