const sqlite3 = require('sqlite3').verbose();

const createDb = (filename) => {
  const db = new sqlite3.Database(`${process.cwd()}/data/${filename}`)
  return {
    db, 
    createTable: createTable.bind(db),
    insert: insert.bind(db),
    query: query.bind(db),
    del: del.bind(db),
    update: update.bind(db)
  }
}

const createTable = function(sql) {
  return new Promise((r, j) => {
    this.run(sql, (error) => {
      if (error) return j(error)
      return r()
    })
  })
}

const insert = function(table, data) {
  const keys = Object.keys(data)
  const sql = `insert into ${table}(${keys.join(',')}) values(${keys.fill('?').join(',')})`
  return new Promise((r, j) => {
    this.prepare(sql).run(Object.values(data), (err) => {
      if (err) return j(err)
      return r()
    })
  })
}

const query = function(table, query, opts = {}) {
  let sql = query ? `select * from ${table} where ${query}` : `select * from ${table}`
  if (opts && Number.isInteger(opts.page)){
    const offset = opts.pageSize * opts.page
    sql += ` LIMIT ${opts.pageSize} OFFSET ${offset}`
  }

  return new Promise((r, j) => {
    this.all(sql, (err, rows) => {
      if(err) return j(err)
      r(rows);
    });
  })
}

const del = function(table, query) {
  if (!query) throw new Error('need query to delete!')
  const sql = `DELETE FROM ${table} WHERE ${query}`
  return new Promise((r, j) => {
    this.run(sql, error => {
      if (error) return j(error)
      return r()
    })
  })
}

const update = function(table, query, data) {
  if (!query) throw new Error('need query to delete!')

  const keys = Object.keys(data)
  const setStr = keys.map(key => `${key}=?`).join(',')
  const sql = `UPDATE ${table} set ${setStr} WHERE ${query}`
  return new Promise((r, j) => {
    this.prepare(sql).run(Object.values(data), (err, data) => {
      if (err) return j(err)
      return r(data)
    })
  })
}

module.exports = { createDb }