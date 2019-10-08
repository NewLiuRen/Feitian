/**
 * 仓库表
 * @param {name} 名称 
 * @param {ware_index} 序号 
 * @param {is_del} 是否删除 
 */
const createTableWareHouse = (db) => {
  db.run(`CREATE TABLE ware_house (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL DEFAULT '',
    ware_index INTEGER,
    is_del BOOLEAN NOT NULL DEFAULT false
  );`);
}

/**
 * 商品表
 * @param {name} 名称 
 * @param {cate_index} 种类id 
 * @param {is_del} 是否删除 
 */
const createTableGoods = (db) => {
  db.run(`CREATE TABLE ware_house (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(120) NOT NULL DEFAULT '',
    cate_index INTEGER,
    is_del BOOLEAN NOT NULL DEFAULT false
  );`);
}

/**
 * 种类表
 * @param {name} 名称 
 * @param {is_del} 是否删除 
 */
const createTableCategory = (db) => {
  db.run(`CREATE TABLE ware_house (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(120) NOT NULL DEFAULT '',
    is_del BOOLEAN NOT NULL DEFAULT false
  );`);
}

/**
 * 文件表
 * @param {name} 名称 
 * @param {create_time} 创建时间
 * @param {update_time} 修改时间 
 * @param {export} 是否被导出 
 */
const createTableFile = (db) => {
  db.run(`CREATE TABLE ware_house (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL DEFAULT '',
    create_time TimeStamp NOT NULL DEFAULT (datetime('now', 'localtime')),
    update_time TimeStamp NOT NULL DEFAULT (datetime('now', 'localtime')),
    export BOOLEAN NOT NULL DEFAULT 0
  );`);
}

/**
 * 记录表
 * @param {name} 名称 
 * @param {count} 数量
 * @param {goods_id} 商品id 
 * @param {file_id} 文件id 
 * @param {file_id} 仓库id 
 */
const createTableRecord = (db) => {
  db.run(`CREATE TABLE ware_house (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    count INTEGER NOT NULL DEFAULT 0,
    goods_id INTEGER,
    file_id INTEGER,
    ware_id INTEGER
  );`);
}

export {
  createTableWareHouse,
  createTableGoods,
  createTableCategory,
  createTableFile,
  createTableRecord,
}
