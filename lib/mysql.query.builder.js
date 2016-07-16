"use strict";

const DEFAULT_LIMIT = 1000;

class MySQLQueryBuilder {
  constructor() {
    this.JOIN_LEFT = "LEFT";
    this.JOIN_RIGHT = "RIGHT";
    this.JOIN_INNER = "INNER";

    this.LIKE_BEFORE = 'before';
    this.LIKE_AFTER = 'after';
    this.LIKE_BOTH = 'both';

    this._table = null;
    this._queryType = null;
    this._fields = null;
    this._values = {};
    this._from = null;
    this._where = [];
    this._like = null;

    this._join = null;
    this._limit = null;
    this._orderBy = null;
    this._groupBy = null;

    this.dbQuery = null;
    this.queries = [];
  }

  lastQuery() {
    return this.queries.query;
  }

  getQueries() {
    return this.queries;
  }

  select(fields = null) {
    this._queryType = 'select';
    this._fields = fields;
    return this;
  }

  insert(table, fields, data){
    this._table = table;
    this._queryType = 'insert';
    this._fields = fields;

    if(data === undefined){
      this._fields = Object.keys(fields);
      data = fields;
    }
    this._values = data;
    return this;
  }

  from(from) {
    this._from = from;
    return this;
  }

  where(key, value) {
    if (typeof key === 'object') {
      return this.whereObject(key);
    }
    this._where.push({
      key: key,
      value: value,
      or: false
    });
    return this;
  }

  whereObject(object) {
    for (var key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      let value = object[key];
      this._where.push({
        key: key,
        value: value,
        or: false
      });
    }
    return this;
  }

  whereOR(key, value) {
    this._where.push(
      [key, value, true]
    );
    return this;
  }

  like(field, query, type, or = false) {
    this._like.push({
      field: field,
      query: query,
      type: type,
      or: or
    });
    return this;
  }

  likeOR(field, query, type) {
    this.like(field, query, type, true);
    return this;
  }

  join(table, on, type = '') {
    this._join.push({
      table: table,
      on: on,
      type: type.toUpperCase(type)
    });
    return this;
  }

  limit(start, limit) {
    this._limit = [start, limit];
    return this;
  }

  orderBy(orderFields, order = 'ASC') {
    this._orderBy = [orderFields, order];
    return this;
  }

  groupBy(fields) {
    this._groupBy = fields;
    return this;
  }

  executeLastQuery() {
    var queries = Object.keys(this.queries);
    var lastQueryKey = queries;
    this.queries[lastQueryKey].executed = 1;
    return this.lastQuery();
  }

  buildSQL() {
    let SQL = '';

    switch (this._queryType) {
      case 'select':
        SQL = this.buildSelectSQL();
        break;
      case 'insert':
        SQL = this.buildInsertSQL();
        break;
      default:
        SQL = null;
    }
    this.setQuery(SQL);
    this.resetQueryParams();
    return SQL;
  }

  buildInsertSQL(){
    const keys = this._fields.map( key => ( '`' + key + '`' ) ).join(',');
    const values = this._fields.map( key => ( '\'' + this._values[key] + '\'' ) ).join(',');
    return 'INSERT INTO ' + this._table + '(' + keys + ') VALUES (' + values + ')';
  }

  buildSelectSQL() {
    let params = this.collectParams();
    let where = "";

    if (this._where !== null || this._like !== null) {
      where = this.buildWhere() + this.buildLike();
      if( where){
        where = " WHERE " + where;
      }
    }

    this.checkLimit();

    let SQL =
      "SELECT " + params.fields + " " +
        "FROM " + params.from +
        this.buildJoin() +
        where +
        this.buildOrderBy() +
        this.buildGroupBy() +
        this.buildLimit();
    return SQL;
  }

  buildWhere() {
    let SQL = "";
    if (this._where.length > 0) {
      for (var i in this._where) {
        if (!this._where.hasOwnProperty(i)) {
          continue;
        }

        let expression = this._where[i];
        let expressionValue = '';

        if (SQL !== "") {
          if (expression.or) {
            SQL += " OR ";
          } else {
            SQL += " AND ";
          }
        }

        var sign = "=";
        if (expression.key.indexOf('=') !== -1) {
          sign = "";
        }

        if (typeof expression.value === 'object') {
          sign = " IN ";
          for (var key in expression.value) {
            if (!this._where.hasOwnProperty(i)) {
              continue;
            }
            let value = expression.value[key];
            expressionValue = value;
            if (typeof value === "number") {

            } else {
              expression.value[key] = "'" + value + "'";
            }
          }
          expressionValue = "(" + expression.value.join(',') + ")";
        } else if (typeof expression.value === "number") {
          expressionValue = expression.value;
        } else {
          expressionValue = "'" + expression.value + "'";
        }

        SQL += '`' + expression.key + '`' + sign + expressionValue;
      }
    }

    return SQL;
  }

  buildLike() {
    let SQL = "";
    if (this._like) {
      for (var i in this._like) {
        if (!this._where.hasOwnProperty(i)) {
          continue;
        }
        let expression = this._like[i];

        if (SQL !== "") {
          if (expression.or) {
            SQL += " OR ";
          } else {
            SQL += " AND ";
          }
        }
        let value = "";
        if (expression.type === 'before' || expression.type === 'both') {
          value = "%";
        }
        value += expression.query;

        if (expression.type === 'after' || expression.type === 'both') {
          value += "%";
        }

        SQL += "{expression['field']} LIKE '" + value + "'";
      }
      if (this._where) {
        SQL = " AND " + SQL;
      }
    }

    return SQL;
  }

  buildJoin() {
    let SQL = " ";
    if (this._join) {
      for (var i in this._join) {
        if (!this._where.hasOwnProperty(i)) {
          continue;
        }
        let expression = this._join[i];
        SQL += "\n" + expression.type +
          " JOIN " + expression.table +
          " ON " + expression.on;
      }
    }
    return SQL;
  }

  checkLimit(){
    if( !this._limit){
      this.limit(0, DEFAULT_LIMIT);
    }
  }

  buildLimit() {
    if (this._limit) {
      return " LIMIT " + this._limit[0] + ", " + this._limit[1];
    }
    return "";
  }

  buildOrderBy() {
    if (this._orderBy) {
      return " ORDER BY " + this._orderBy[0] + " " + this._orderBy[1];
    }
    return "";
  }

  buildGroupBy() {
    if (this._groupBy) {
      return " GROUP BY " + this._groupBy;
    }
    return "";
  }

  collectParams() {
    let from = this._from;
    if (!from) {
      throw Error("You need to specify table");
    }

    let fields = this._fields;
    if (fields === null) {
      fields = this.getTableFields(from);
    }
    if (typeof fields !== 'string') {
      fields = fields.join(',');
    }
    return {
      from: from,
      fields: fields,
      where: this._where,
      join: this._join
    };
  }

  getTableFields(table) {
    let tableArr = table.split('as');
    let prefix = (tableArr[1]) ? tableArr[1] : tableArr[0];
    this._fields = [prefix + '.*'];
    return this._fields;
  }

  getDbQuery() {
    return this.dbQuery;
  }

  setDbQuery(dbQuery) {
    this.dbQuery = dbQuery;
    return this;
  }

  setQuery(SQL, executed = false) {
    this.queries.push({
      query: SQL, executed: executed, queryTime: 0
    });
  }

  resetQueryParams() {
    this._where = null;
    this._from = null;
    this._join = null;
    this._fields = null;
    this._values = null;
    this._orderBy = null;
    this._groupBy = null;
    this._queryType = null;
    this._limit = null;
    this._like = null;
  }
}

module.exports = MySQLQueryBuilder;
