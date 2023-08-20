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
        
        <MsgToasts ref="msgToastsObj" :toastsMsg="toastsMsg"/>
    </div>
</template>

<script setup>
    import { ref, reactive, onMounted } from 'vue'

    import indexedDBMethods from '@/api/indexedDBMethods'
    import apiMethods from '@/api/apiMethods'
    import FormModal from'@/components/modal/FormModal.vue'
    import MsgToasts from'@/components/toasts/msgToasts.vue'


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
    const msgToastsObj = ref(null)

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
    let toastsMsg = ref('');

    onMounted(()=> {        
        loadDB();
    })
    
    function changeSwapModalFormIdx(type, item) {
        swapModalTitle.value = swapModalForm[type]['modalTitle'];
        swapModalType.value = type;

        Object.assign(dataItem, item);
    }

    async function loadDB() {
        const result = await indexedDBMethods.initiate(dbName, storeName);
        if (result.success) {
            db = result.response.data.db;
            loadData();
        } else {
            toastsMsg.value = result.errors.message;
            msgToastsObj.value.toastShow();
        }
        
    }
    
    async function loadData() {
        const result = await indexedDBMethods.getData(db, storeName);
        if (result.success) {
            const resultData = JSON.parse(result.response.data);

            notesList.length = 0;
            notesList.push(...resultData);
        } else {
            notesList.length = 0;

            toastsMsg.value = result.errors.message;
            msgToastsObj.value.toastShow();
        }
    }

    async function addList(item) {
        const checkInfo = await apiMethods.checkUrlSecurity(item.url);
        let apiReturnIsError = false;

        if (!checkInfo['success']){
            toastsMsg.value = `新增失敗: 錯誤代碼: ${checkInfo['error']['code']}`;
            apiReturnIsError = true;
        }
        
        if((checkInfo['success']) && (checkInfo['response']['data'] != [])){
            toastsMsg.value = `新增失敗: ${checkInfo['response']['data']}`;
            apiReturnIsError = true;
        }
        if(apiReturnIsError){
            msgToastsObj.value.toastShow();
            cleanFromModal();
            return 
        }

        let addData = {
            'title': item.title,
            'url': item.url,
            'completed': false
        };

        isDisabled.value = true;

        const result = await indexedDBMethods.installData(db, storeName, addData);
        if (result.success) {
            toastsMsg.value = "新增成功";
            
        } else {
            toastsMsg.value = result.errors.message;
        }
        msgToastsObj.value.toastShow();
        
        loadData();
        cleanFromModal();
    }

    async function removeList(item) {
        const result = await indexedDBMethods.deleteData(db, storeName, item.id);
        if (result.success) {
            toastsMsg.value = "刪除成功";
        } else {
            toastsMsg.value = result.errors.message;
        }

        msgToastsObj.value.toastShow();
        loadData();           
    }

    async function editData(item) {
        const checkInfo = await apiMethods.checkUrlSecurity(item.url);
        let apiReturnIsError = false;

        if (!checkInfo['success']){
            toastsMsg.value = `修改失敗: 錯誤代碼: ${checkInfo['error']['code']}`;
            apiReturnIsError = true;
        }
        
        if((checkInfo['success']) && (checkInfo['response']['data'] != [])){
            toastsMsg.value = `修改失敗: ${checkInfo['response']['data']}`;
            apiReturnIsError = true;
        }
        if(apiReturnIsError){
            msgToastsObj.value.toastShow();
            cleanFromModal();
            return 
        }

        let updateData = {
            'id': item.id,
            'title': item.title,
            'url': item.url,
            'completed': item.completed
        };

        const result = await indexedDBMethods.updateDBData(db, storeName, item.id, updateData);
        if (result.success) {
            toastsMsg.value = "修改成功";
        } else {
            toastsMsg.value = result.errors.message;
        }

        msgToastsObj.value.toastShow();
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
            toastsMsg.value = "複製成功";
        }).catch(() => {
            toastsMsg.value = "catch";
        })
        msgToastsObj.value.toastShow();
    }
</script>