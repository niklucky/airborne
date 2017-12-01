const BaseMapper = require('./base.mapper');

class MongoMapper extends BaseMapper {
  constructor(di) {
    super(di);
    this.db = null;
  }

  get(params) {
    console.log(params);
    console.log(this.dbTable);
  }

  load(params) {
    console.log(params);
    console.log(this.db);
    console.log(this.dbTable);
    // const model = new this.Model(payload);
    return Promise.resolve();
    // return new Promise((resolve, reject) => {
    //   try {
    //     this.queryBuilder
    //       .select('*')
    //       .from(this.dbTable);

    //     /* istanbul ignore else */
    //     if (params !== undefined) {
    //       this.queryBuilder.where(params);
    //     }
    //     const query = this.queryBuilder.build();
    //     return this.db.query(query, (error, rows, fields) => {
    //       if (error) {
    //         reject(error, fields);
    //       }
    //       resolve(this.buildCollection(rows));
    //     });
    //   } catch (e) {
    //     return reject(e);
    //   }
    // });
  }
}

module.exports = MongoMapper;
