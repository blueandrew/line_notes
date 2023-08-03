<template>
    <!-- <button class="" data-bs-toggle="modal" data-bs-target="#inputFormModal"></button> -->

    <div class="modal fade" id="inputFormModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="inputFormModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <form @submit.prevent="handelChangeData">
                        <div class="modal-header">
                            <h5 class="modal-title" id="inputFormModalLabel">{{ modalTitle }}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="resetForm"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="title=text" class="col-form-label">標題:</label>
                                <input type="text" class="form-control" id="title-text" v-model="dataItem.title" required>
                            </div>
                            <div class="mb-3">
                                <label for="url-text" class="col-form-label">鏈結:</label>
                                <input type="text" class="form-control" id="url-text" v-model="dataItem.url" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="resetForm">關閉</button>
                            <button type="submit" class="btn btn-primary" v-if="swapModalType=='add'">{{ modalTitle }}</button>
                            <button type="submit" class="btn btn-primary" v-if="swapModalType=='edit'">{{ modalTitle }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
</template>

<script setup>
    import { reactive, toRefs, onMounted } from 'vue'
    

    const emit = defineEmits(['formFn']);
    const props = defineProps({
        dataItem: Object,
        modalTitle: String,
        swapModalType: String
    });
    const { modalTitle, swapModalType, dataItem } = toRefs(props);

    const modal = reactive({});
    const modalClose = () => {
        modal.value.hide()
    }

    defineExpose({
        modalClose
    });

    onMounted(()=> {
        modal.value = new bootstrap.Modal('#inputFormModal', {});
    })

    function handelChangeData() {
        if(!dataItem.value.title || !dataItem.value.url) {
            return
        }   

        emit('formFn', dataItem.value);
    }

    function resetForm() {
        dataItem.value.title = ''
        dataItem.value.url = ''
    }

    

</script>