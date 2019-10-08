import { getDB } from './index'

const addWarehouse = (params) => {
  const { name, ware_index } = params;
  return new Promise((resolve, reject) => {
    getDB().then(db => {
      const count = db.count();
      console.log('count :', count);
      const request = db.transaction(['warehouse'], 'readwrite')
                      .objectStore('warehouse')
                      .add({ name, ware_index });
  
      request.onsuccess = function (event) {
        console.log('数据写入成功');
        resolve({success: true});
      };
      
      request.onerror = function (event) {
        console.log('数据写入失败');
        resolve({success: false});
      }
    })
  })
}

export {
  addWarehouse,
}
