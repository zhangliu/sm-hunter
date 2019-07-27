const {createDb} = require('../../../utils/sqlite')

const DB = createDb('maimai.db')

// DB.db.run('DROP TABLE staffs')
DB.createTable(`create table if not exists staffs(
  id INTEGER PRIMARY KEY,
  sid char(50) NOT NULL UNIQUE,
  phone char(15),
  summary text,
  detail text,
  source char(20),
  sameId INTEGER,
  createTime INTEGER
);`)

// DB.db.run('DROP TABLE jobs')
DB.createTable(`create table if not exists jobs(
  id INTEGER PRIMARY KEY,
  sid char(50) NOT NULL UNIQUE,
  detail text,
  type char(20),
  status text,
  createTime INTEGER
);`)

// DB.query('staffs', undefined, {page: 0, pageSize: 3}).then(console.log)
// DB.query('jobs', undefined, {page: 0, pageSize: 1}).then(console.log)

module.exports = DB