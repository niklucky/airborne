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
    return new Promise((resolve, reject) => {
      try {
        const model = new this.Model(params);
        const data = (model.get) ? model.get() : model ;

        let query = this.queryBuilder.insert(this.dbTable, data).buildSQL();
        this.db.query(query, (error, result) => {
          if(error){
            return reject(error);
          }
          data.id = result.insertId;
          resolve(data);
        });
      }catch(e){
        reject(e);
      }
    });
  }
}

module.exports = MySQLMapper;
