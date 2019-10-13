const VERSION = 1;
const DB_NAME = 'feitian';

// 创建表
export const initStores = (version = VERSION) => new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, version)
    request.onerror = () => {
      reject(new Error('数据库打开报错'));
    }
    request.onsuccess = () => {
      resolve({success: true});
    }
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('warehouse')) {
        db.createObjectStore('warehouse', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('goods')) {
        const objectStore = db.createObjectStore('goods', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('sku', 'sku', { unique: true });
        objectStore.createIndex('category_id', 'category_id', { unique: false });
      }
      if (!db.objectStoreNames.contains('category')) {
        db.createObjectStore('category', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('file')) {
        const objectStore = db.createObjectStore('file', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('create_time', 'create_time', { unique: false });
      }
      if (!db.objectStoreNames.contains('records')) {
        const objectStore = db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('file_id', 'file_id', { unique: true });
      }
    }
  })

// 数据库操作模板
const operateTmpl = (storeName, objectStoreOperateFn, type='readwrite') => {
  let db = null;
  return new Promise ((resolve, reject) => {
    const dbOpenRequest = window.indexedDB.open(DB_NAME);
  
    dbOpenRequest.onsuccess = () => {
      db = dbOpenRequest.result;
      const transaction = db.transaction([storeName], type);
  
      // transaction.oncomplete = () => {};
      transaction.onerror = () => { reject(new Error('事务操作失败')) };
  
      const objectStore = transaction.objectStore(storeName);

      const objectStoreRequest = objectStoreOperateFn(objectStore);
  
      objectStoreRequest.onsuccess =  () => {
        resolve(objectStoreRequest)
      };
      
    };
    dbOpenRequest.onerror =  () => {
      reject(new Error('数据库打开失败'))
    };
  })
}

// 根据索引值获取数据
export const getDateByIndex = (storeName, index, key) => {
  let db = null;
  return new Promise ((resolve, reject) => {
    const dbOpenRequest = window.indexedDB.open(DB_NAME);
  
    dbOpenRequest.onsuccess = () => {
      db = dbOpenRequest.result;
      const transaction = db.transaction([storeName], 'readonly');
  
      // transaction.oncomplete = () => {};
      transaction.onerror = () => { reject(new Error('事务操作失败')) };
  
      const objectStore = transaction.objectStore(storeName);

      const IDBIndex = objectStore.index(index);
      const objectStoreRequest = IDBIndex.get(key);
      objectStoreRequest.onsuccess =  () => {
        resolve(objectStoreRequest.result)
      };
      
    };
    dbOpenRequest.onerror =  () => {
      reject(new Error('数据库打开失败'))
    };
  })
}

// 根据索引及条件搜索表数据
// EQ 就是 EQUAL等于 =
// GT 就是 GREATER THAN 大于 ＞
// LT 就是 LESS THAN 小于 ＜
// GE 就是 GREATER THAN OR EQUAL 大于等于 ≥
// LE 就是 LESS THAN OR EQUAL 小于等于 ≤
export const getRangeDataByIndex = (storeName, index, option) => {
  let db = null;
  return new Promise ((resolve, reject) => {
    const dbOpenRequest = window.indexedDB.open(DB_NAME);
  
    dbOpenRequest.onsuccess = () => {
      db = dbOpenRequest.result;
      const transaction = db.transaction([storeName], 'readonly');
  
      // transaction.oncomplete = () => {};
      transaction.onerror = () => { reject(new Error('事务操作失败')) };
  
      const objectStore = transaction.objectStore(storeName);
      let r = null;

      if (option.eq) {
        r = IDBKeyRange.only(option.eq)
      } else if (option.ge && option.lt) {
        r = IDBKeyRange.bound(option.ge, option.lt, false, true);
      } else if (option.gt && option.le) {
        r = IDBKeyRange.bound(option.gt, option.le, true, false);
      } else if (option.gt && option.lt) {
        r = IDBKeyRange.bound(option.gt, option.lt, true, true);
      } else if (option.ge && option.le) {
        r = IDBKeyRange.bound(option.ge, option.le);
      } else if (option.gt) {
        r = IDBKeyRange.lowerBound(option.gt, true);
      } else if (option.ge) {
        r = IDBKeyRange.lowerBound(option.ge);
      } else if (option.lt) {
        r = IDBKeyRange.upperBound(option.lt, true);
      } else if (option.le) {
        r = IDBKeyRange.upperBound(option.le);
      }

      const res = [];
      const i = objectStore.index(index);
      const c = i.openCursor(r);
      c.onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor) {
          console.log('cursor', cursor);
          res.push(cursor.value);
          cursor.continue();
        } else {
          resolve(res);
        }
      }
    };
    dbOpenRequest.onerror =  () => {
      reject(new Error('数据库打开失败'))
    };
  })
}

// 获取表记录总数
export const dataCount = storeName => new Promise((resolve, reject) => {
    operateTmpl(storeName, (objectStore) => objectStore.count(), 'readonly')
      .then(res => resolve(res.result)).catch(err => reject(err))
  })

// 获取表记录列表
export const getDataList = storeName => new Promise((resolve, reject) => {
  operateTmpl(storeName, (objectStore) => objectStore.getAll(), 'readonly')
    .then(res => resolve(res.result)).catch(err => reject(err))
})

// 获取指定id的记录
export const getDataById = (storeName, key) => new Promise((resolve, reject) => {
  operateTmpl(storeName, (objectStore) => objectStore.get(key), 'readonly')
    .then(res => resolve(res.result)).catch(err => reject(err))
})

// 添加记录
export const addData = (storeName, params) => new Promise((resolve, reject) => {
  operateTmpl(storeName, (objectStore) => objectStore.add({...params}))
    .then(({readyState, result}) => resolve({success: readyState === 'done', result})).catch(err => reject(err))
})

// 修改记录
export const updateData = (storeName, params) => new Promise((resolve, reject) => {
  operateTmpl(storeName, (objectStore) => objectStore.put({...params}))
    .then(({readyState, result}) => resolve({success: readyState === 'done', result})).catch(err => reject(err))
})

// 删除记录
export const deleteData = (storeName, key) => new Promise((resolve, reject) => {
  operateTmpl(storeName, (objectStore) => objectStore.delete(key))
    .then(({readyState, result}) => resolve({success: readyState === 'done', result})).catch(err => reject(err))
})
