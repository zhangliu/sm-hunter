const {createDb} = require('../../utils/sqlite')

const DB = createDb('maimai.db')
// DB.db.run('DROP TABLE staffs', () => {
  DB.createTable(`create table if not exists staffs(
    id INTEGER PRIMARY KEY,
    mmUid NOT NULL UNIQUE,
    phone char(15),
    query text,
    summary text,
    detail text,
    sameId INTEGER,
    createTime INTEGER
  );`)
// })

// DB.query('staffs', undefined, {page: 0, pageSize: 3}).then(console.log)

module.exports = DB