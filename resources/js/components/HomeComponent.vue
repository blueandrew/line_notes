<template>
    <div class="row justify-content-center">
        <div class="pt-5 col-md-8">
            <h1>Notes List</h1>
            <div class="input-group my-3">
                <input type="text" class="form-control" v-model="addUrl">
                <button class="btn btn-outline-secondary" type="button" @click="addList">新增</button>
            </div>
            <ul class="list-group d-grid gap-2">
                <li class="list-group-item py-1 rounded-3" v-for="(item, index) in notesList" :key='index' @dblclick="editList(item)">
                    <div class="d-flex  align-items-center"  v-if="item.id !== editId">
                        <label class="flex-fill">
                            <span>{{item.url}}</span>
                        </label>
                        <div class="align-items-center d-flex">
                            <button class="col-auto btn btn-primary mx-1" :disabled="isDisabled" @click="removeList(item, index)">刪除</button>
                        </div>
                    </div>

                    <div class="d-flex  align-items-center" v-if="item.id === editId">
                        <label class="flex-fill">
                            <div class="input-group ">
                                <input type="text" class="form-control" v-model="editUrl" @keyup.esc="cancelEdit()" @keyup.enter="sendEdit(item)">
                            </div>
                        </label>
                    </div>
                </li>
            </ul>
        </div>
</div>
    
    
</template>

<script>
    import {ref, reactive, onMounted} from 'vue'

    import indexedDBMethods from '../api/indexedDBMethods'
    export default {
        setup() {
            const dbName = 'notes'
            const storeName = 'notesList'

            let db
            let isDisabled = ref(false);
            let addUrl = ref('');
            let notesList = reactive([]);
            let editUrl = ref('');
            let editId = ref(-1);

            onMounted(()=>{
                console.log('Component: HomeComponent')
                loadDB()
            })

            async function loadDB() {
                db = await indexedDBMethods.initiate(dbName, storeName)
                loadData()
            }

            async function loadData() {
                let resultData = JSON.parse(await indexedDBMethods.getData(db, storeName))
                notesList.length = 0
                notesList.push(...resultData)
            }

            async function addList(){
                if(!addUrl.value){
                    return
                }
                
                let installData = {
                    title: addUrl.value,
                    url: addUrl.value,
                    completed: false
                }
                await indexedDBMethods.installData(db, storeName, installData)
                loadData()
                addUrl.value = '';

            }

            async function removeList(item, index){
                console.log(item.id, index)
                indexedDBMethods.deleteData(db, storeName, item.id)
                loadData()              
            }

            function editList(item) {
                isDisabled.value = true;
                editId.value = item.id;
                editUrl.value = item.url;
                console.log(editId === item.id)
            }
        
            async function sendEdit(item) {
                // notesList[index].title = editUrl.value;
                // notesList[index].url = editUrl.value;
                let updateData = {
                    'id': item.id,
                    'title': editUrl.value,
                    'url': editUrl.value,
                    'completed': false
                }
                await indexedDBMethods.updateDBData(db, storeName, item.id, updateData)
                this.cancelEdit()
                loadData()
            }

            function cancelEdit(){
                isDisabled.value = false;
                editId.value = -1
                editUrl.value = '';
            }

            return { isDisabled, addUrl, notesList, editUrl, editId, addList, removeList, editList, cancelEdit, sendEdit }
        }
    }
</script>