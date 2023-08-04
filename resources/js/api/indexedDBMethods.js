let result = {
  "success": false,
  "response": {
    "data": {}
  },
  "errors": [
    {
      "code": 0,
      "message": ""
    }
  ]
};

export default {
    name: "indexedDBMethods",
    initiate(dbName, store, dbVersion=1) {
      return new Promise((resolve, reject) => {
        var db = null;

        const request = indexedDB.open(dbName, dbVersion);
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            if (!db.objectStoreNames.contains(dbName)) {
              const notesList = db.createObjectStore(store, { keyPath: "id", autoIncrement:true});
            }
        }

        request.onsuccess = event => {
          db = event.target.result;

          result.success = true;
          result.response.data.db = db;

          resolve(result);
        }
        request.onerror = event => {
          result.errors.code = 500;
          result.errors.message = `Database initiate error: ${event.target.errorCode}`;

          reject(result);
        };
      }
    )},
    getData(db, store) {
      return new Promise((resolve, reject) => {
        const transaction  = db.transaction(store, "readonly");
        const objectStore = transaction .objectStore(store);
        const request  = objectStore.getAll();

        request.onsuccess = event => {
          result.success = true;
          result.response.data = JSON.stringify(request.result);

          resolve(result);
        };
        request.onerror = event => {
          result.errors.code = 500;
          result.errors.message = `Database getData error: ${event.target.errorCode}`;

          reject(result);
        };

      })
    },
    installData(db, store, data) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, "readwrite");
        const objectStore = transaction.objectStore(store);
        const request  = objectStore.add(data);

        request.onsuccess = event => {
          result.success = true;

          resolve(result);
        };
        request.onerror = event => {
          result.errors.code = 500;
          result.errors.message = `Database installData error: ${event.target.errorCode}`;

          reject(result);
        };

      })
    },
    updateDBData(db, store, id, data){
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, "readwrite");
        const objectStore = transaction.objectStore(store);
        const request = objectStore.get(id);

        request.onsuccess = event => {
          const objectStoreUpdate = objectStore.put(data);
          
          objectStoreUpdate.onsuccess = event => {
            result.success = true;
            if (JSON.stringify(request.result) === JSON.stringify(data)) {
              result.success = false;
              result.errors.code = 400;
              result.errors.message = `Update data not change`;
            }

            resolve(result);
          }

          objectStoreUpdate.onerror = event => {
            result.errors.code = 500;
            result.errors.message = `Database updateDBData 'put data' error: ${event.target.errorCode}`;
  
            reject(result);
          };
        };
        request.onerror = event => {
          result.errors.code = 500;
          result.errors.message = `Database updateDBData 'get id' error: ${event.target.errorCode}`;

          reject(result);
        };
      })
    },
    deleteData(db, store, id) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(store, "readwrite");
        const objectStore = transaction.objectStore(store);
        const request = objectStore.delete(id);
        
        request.onsuccess = event => {
          result.success = true;
          resolve(result);
        };
        request.onerror = event => {
          result.errors.code = 500;
          result.errors.message = `Database deleteData error: ${event.target.errorCode}`;

          reject(result);
        };
      })
    }
}