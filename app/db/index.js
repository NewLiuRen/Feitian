const VERSION = 1;

export const getDB = () => {
  const DB = null;
  return DB || new Promise((resolve, reject) => {
    const request = window.indexedDB.open('feitian', VERSION)
    request.onerror = (event) => {
      reject(new Error('数据库打开报错'));
    }
    request.onsuccess = (event) => {
      console.log('event :', event);
      DB = request.result;
      resolve(request.result);
    }
    request.onupgradeneeded = (event) => {
      let db = event.target.result;
      if (!db.objectStoreNames.contains('warehouse')) {
        db.createObjectStore('warehouse', { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('goods')) {
        db.createObjectStore('goods', { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('category')) {
        db.createObjectStore('category', { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('file')) {
        db.createObjectStore('file', { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('record')) {
        db.createObjectStore('record', { autoIncrement: true });
      }
    }
  })
}