import { getDB } from './index';

// 查询所以未冻结的仓库
const queryWarehouseWithoutDel = () => getDB().then(db => {
    const res = db.exec(`
      SELECT id, name, ware_index FROM warehouse where is_del=false;
    `)
    return res
  })

// 查询所有仓库（包括已冻结的）
const queryWarehouse = (db) => getDB().then(db => {
    const res = db.exec(`
      SELECT id, name, ware_index FROM warehouse;
    `)
    return res
  })

// 新增仓库
const insertWarehouse = (params) => {
  const { name, ware_index } = params
  return getDB().then(db => {
    const res = db.run(`
      INSERT INTO warehouse
        (name, ware_index)
      VALUES
        ($name, $ware_index);
    `, [name, ware_index])
    return res
  })
}

// 修改仓库
const updateWarehouse = (db, params) => {
  const { id, name, ware_index } = params
  const stmt = db.prepare(`
    UPDATE warehouse
    SET
      name=$name, ware_index=$ware_index
    WHERE
      id=$id;
  `)
  return stmt.getAsObject({$id: id, $name: name, $ware_index: ware_index})
}

// 删除仓库
const deleteWarehouse = (db, params) => {
  const { id } = params
  const stmt = db.prepare(`
    UPDATE warehouse
    SET
      is_del=true
    WHERE
      id=$id;
  `)
  return stmt.getAsObject({$id: id})
}

export {
  queryWarehouseWithoutDel,
  queryWarehouse,
  insertWarehouse,
  updateWarehouse,
  deleteWarehouse,
}