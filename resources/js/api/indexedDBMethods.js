export default {
    name: "indexedDBMethods",
    initiate(dbName, store, dbVersion=1) {
      return new Promise((resolve, reject) => {
        var db = null;

        const request = indexedDB.open(dbName, dbVersion);
        request.onupgradeneeded = (event) => {
            db = event.target.result
            if (!db.objectStoreNames.contains(dbName)) {
              const notesList = db.createObjectStore(store, { keyPath: "id", autoIncrement:true})
            }
        }

        request.onerror = event => {
          console.error(`Database error: ${event.target.errorCode}`);
        };

        request.onsuccess = event => {
          db = event.target.result
          resolve(db);
        }
      }
    )},
    getData(db, store) {
      return new Promise((resolve, reject) => {

        const transaction  = db.transaction(store, "readonly")
        const objectStore = transaction .objectStore(store)
        const request  = objectStore.getAll()
        request.onsuccess = event => {
          resolve(JSON.stringify(request.result));
        }
      })
    },
    installData(db, store, data) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, "readwrite")
        const objectStore = transaction.objectStore(store)
        let request  = objectStore.add(data)

        request.onsuccess = event => {
          resolve();
        };
      })
    },
    updateDBData(db, store, id, data){
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, "readwrite")
        const objectStore = transaction.objectStore(store)
        const request = objectStore.get(id)
        
        request.onsuccess = event => {
          const updateData = event.target.result
          console.log(data)
          const objectStoreUpdate = objectStore.put(data)
            objectStoreUpdate.onsuccess = event => {
              console.log('update success')
              resolve();
          }
        }
    
        request.onerror = event => {
            console.error('get error', err)
        }
      })
    },
    deleteData(db, store, id) {
      const transaction = db.transaction(store, "readwrite")
      const objectStore = transaction.objectStore(store)
      let request = objectStore.delete(id)
      request.onsuccess = event => {
      }
    }
}