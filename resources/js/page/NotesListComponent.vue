<template>
    <div class="row justify-content-center">
        <div class="pt-5 col-md-8">
            <h1 class="text-center pb-2 display-3">Notes List</h1>
            <ul class="list-group d-grid gap-2">
                <li class="list-group-item py-1 border rounded-3" v-for="(item, index) in notesList" :key='index'>
                    <div class="d-flex  align-items-center">
                        <label class="flex-fill">
                            <span>{{item.title}}</span>
                        </label>
                        <div class="align-items-center d-flex">
                            <button class="col-auto btn btn-primary mx-1" :disabled="isDisabled" @click="copyUrl(item.url)">複製網址</button>
                        </div>
                        <div class="align-items-center d-flex">
                            <button class="col-auto btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop" :disabled="isDisabled" @click="changeSwapModalFormIdx(1, item)">修改</button>
                        </div>
                        <div class="align-items-center d-flex">
                            <button class="col-auto btn btn-primary mx-1" :disabled="isDisabled" @click="removeList(item)">刪除</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <button class="position-fixed bottom-0 end-0 m-5 col-auto btn btn-primary btn-lg rounded-circle" data-bs-toggle="modal" data-bs-target="#staticBackdrop" :disabled="isDisabled" @click="changeSwapModalFormIdx(0, item)">+</button>

        <ModalComponent>
            <template #modalForm>
                <component :is="swapModalForm[swapModalFormIdx]['component']" @formFn="swapModalForm[swapModalFormIdx]['formFn']" :dataItem="dataItem"></component>
            </template>
        </ModalComponent>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue'

    import indexedDBMethods from '@/api/indexedDBMethods'
    import ModalComponent from '@/components/modal/ModalComponent.vue'
    import NotesListAdd from '@/components/modal/form/NotesListAdd.vue'
    import NotesListEdit from '@/components/modal/form/NotesListEdit.vue'

    const dbName = 'notes';
    const storeName = 'notesList';
    const initialDataItem = {
        'id': 0,
        'title': '',
        'url': '',
        'completed': false
    };

    let db
    const modal = reactive({});

    let isDisabled = ref(false);
    let notesList = reactive([]);
    let dataItem = reactive({ ...initialDataItem });

    const swapModalForm = [
        {
            'component': NotesListAdd,
            'formFn': addList
        },
        {
            'component': NotesListEdit,
            'formFn': editData
        }
    ];
    let swapModalFormIdx = ref(0);


    onMounted(()=> {
        modal.value = new bootstrap.Modal('#staticBackdrop', {});

        loadDB();
    })
    
    function changeSwapModalFormIdx(idx, item) {
        swapModalFormIdx.value = idx;

        Object.assign(dataItem, item);
    }

    async function loadDB() {
        db = await indexedDBMethods.initiate(dbName, storeName);

        loadData();
    }
    
    async function loadData() {
        let resultData = JSON.parse(await indexedDBMethods.getData(db, storeName));
        notesList.length = 0;
        notesList.push(...resultData);
    }

    async function addList(addDataItem) {
        isDisabled.value = true;

        await indexedDBMethods.installData(db, storeName, addDataItem);

        loadData();
        cancelEdit();
    }

    async function removeList(item) {
        indexedDBMethods.deleteData(db, storeName, item.id);

        loadData()              
    }

    async function editData(item) {
        let updateData = {
            'id': item.id,
            'title': item.title,
            'url': item.url,
            'completed': item.completed
        };

        await indexedDBMethods.updateDBData(db, storeName, item.id, updateData);

        loadData();
        cancelEdit();
    }

    function cancelEdit() {
        isDisabled.value = false;
        
        Object.assign(dataItem, initialDataItem);

        modal.value.hide()
    }

    function copyUrl(url){
        navigator.clipboard.writeText(url)
        .then(() => {
            console.log("success")
        }).catch(() => {
            console.log("fail")
    }   )
    }
</script>