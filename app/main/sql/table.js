/**
 * 仓库表
 * @param {name} 名称 
 * @param {ware_index} 序号 
 * @param {is_del} 是否删除 
 */
const createTableWarehouse = (db) => {
  db.run(`
    DROP TABLE IF EXISTS warehouse;
    CREATE TABLE warehouse (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(50) NOT NULL DEFAULT '',
      ware_index INTEGER,
      is_del BOOLEAN NOT NULL DEFAULT false
    );
  `);
}

/**
 * 商品表
 * @param {name} 名称 
 * @param {cate_index} 种类id 
 * @param {is_del} 是否删除 
 */
const createTableGoods = (db) => {
  db.run(`
    DROP TABLE IF EXISTS goods;
    CREATE TABLE goods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(120) NOT NULL DEFAULT '',
      cate_index INTEGER,
      is_del BOOLEAN NOT NULL DEFAULT false
    );
  `);
}

/**
 * 种类表
 * @param {name} 名称 
 * @param {is_del} 是否删除 
 */
const createTableCategory = (db) => {
  db.run(`
    DROP TABLE IF EXISTS category;
    CREATE TABLE category (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(120) NOT NULL DEFAULT '',
      is_del BOOLEAN NOT NULL DEFAULT false
    );
  `);
}

/**
 * 文件表
 * @param {name} 名称 
 * @param {create_time} 创建时间
 * @param {update_time} 修改时间 
 * @param {export} 是否被导出 
 */
const createTableFile = (db) => {
  db.run(`
    DROP TABLE IF EXISTS file;
    CREATE TABLE file (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(200) NOT NULL DEFAULT '',
      create_time TimeStamp NOT NULL DEFAULT (datetime('now', 'localtime')),
      update_time TimeStamp NOT NULL DEFAULT (datetime('now', 'localtime')),
      export BOOLEAN NOT NULL DEFAULT 0
    );
  `);
}

/**
 * 记录表
 * @param {name} 名称 
 * @param {count} 数量
 * @param {max_count} 最大数量
 * @param {order_number} 订单号
 * @param {goods_id} 商品id 
 * @param {file_id} 文件id 
 * @param {file_id} 仓库id 
 */
const createTableRecord = (db) => {
  db.run(`
    DROP TABLE IF EXISTS record;
    CREATE TABLE record (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      count INTEGER NOT NULL DEFAULT 0,
      max_count INTEGER NOT NULL DEFAULT 0,
      order_number VARCHAR(50) NOT NULL DEFAULT '',
      goods_id INTEGER,
      file_id INTEGER,
      ware_id INTEGER
    );
  `);
}

export {
  createTableWarehouse,
  createTableGoods,
  createTableCategory,
  createTableFile,
  createTableRecord,
}
