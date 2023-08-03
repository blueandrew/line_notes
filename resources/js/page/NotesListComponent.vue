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
                            <button class="col-auto btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target="#inputFormModal" :disabled="isDisabled" @click="changeSwapModalFormIdx('edit', item)">修改</button>
                        </div>
                        <div class="align-items-center d-flex">
                            <button class="col-auto btn btn-primary mx-1" :disabled="isDisabled" @click="removeList(item)">刪除</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <button class="position-fixed bottom-0 end-0 m-5 col-auto btn btn-primary btn-lg rounded-circle" data-bs-toggle="modal" data-bs-target="#inputFormModal" :disabled="isDisabled" @click="changeSwapModalFormIdx('add', item)">+</button>

        <FormModal ref="modalObj" :modalTitle="swapModalTitle" :swapModalType="swapModalType" @formFn="swapModalForm[swapModalType]['formFn']" :dataItem="dataItem"/>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue'

    import indexedDBMethods from '@/api/indexedDBMethods'
    import FormModal from'@/components/modal/FormModal.vue'


    let db
    const dbName = 'notes';
    const storeName = 'notesList';
    const initialDataItem = {
        'id': 0,
        'title': '',
        'url': '',
        'completed': false
    };

    const modalObj = ref(null)

    let isDisabled = ref(false);
    let notesList = reactive([]);
    let dataItem = reactive({ ...initialDataItem });

    const swapModalForm = {
        "add": {
            'modalTitle': '新增',
            'formFn': addList
        },
        "edit": {
            'modalTitle': '修改', 
            'formFn': editData
        }
    };
    let swapModalType = ref('add')
    let swapModalTitle = ref(swapModalForm['add']['modalTitle']);

    onMounted(()=> {
        // modal.value = new bootstrap.Modal('#inputFormModal', {});
        
        loadDB();
    })
    
    function changeSwapModalFormIdx(type, item) {
        swapModalTitle.value = swapModalForm[type]['modalTitle'];
        swapModalType.value = type;

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

    async function addList(item) {
        modalObj.value.modalClose()
        let addData = {
            'title': item.title,
            'url': item.url,
            'completed': false
        };

        isDisabled.value = true;

        await indexedDBMethods.installData(db, storeName, addData);

        loadData();
        cleanFromModal();
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
        cleanFromModal();
    }

    function cleanFromModal() {
        isDisabled.value = false;
        
        Object.assign(dataItem, initialDataItem);

        modalObj.value.modalClose()
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