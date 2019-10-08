import initSql from 'sql.js/dist/sql-asm';
import { promisify } from 'util';
import { readFile, writeFile, access, constants } from 'fs';
import * as sqlTable from './table';

const accessPromise = promisify(access);
const readFilePromise = promisify(readFile);
const writeFilePromise = promisify(writeFile);

const FILE_PATH = './db.sqlite';

export const checkDB = () => {
  return accessPromise(FILE_PATH, constants.F_OK).then(() => {
    return true
  }).catch(err => {
    return false
  })
}

export const createDB = (path = FILE_PATH) => {
  initSql().then(SQL => {
    const db = new SQL.Database();
    sqlTable.createTableWarehouse(db);
    sqlTable.createTableGoods(db);
    sqlTable.createTableCategory(db);
    sqlTable.createTableFile(db);
    sqlTable.createTableRecord(db);
    return writeFilePromise(path, Buffer.from(db.export()));
  })
}

export const getDB = (path = FILE_PATH) => {
  return Promise.all([readFilePromise(path), initSql()]).then(([filebuffer, SQL]) => {
    return new SQL.Database(filebuffer)
  })
}
/**
 * 
  readFile('./db.sqlite').then((err, data) => {
    if (err) console.error(err)
  })
  sql().then(sql => {
    console.log('ok');
  })
 */
