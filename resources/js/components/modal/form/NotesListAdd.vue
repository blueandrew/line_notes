<template>
    <form>
        <div class="mb-3">
            <label for="title=text" class="col-form-label">標題:</label>
            <input type="text" class="form-control" id="title-text" v-model="titleText">
        </div>
        <div class="mb-3">
            <label for="url-text" class="col-form-label">鏈結:</label>
            <input type="text" class="form-control" id="url-text" v-model="urlText">
        </div>
        <div class="d-md-flex justify-content-center">
            <button type="button" class="btn btn-primary" @click="handelAddData">新增</button>
        </div>
    </form>
</template>

<script setup>
    import { ref, reactive, onMounted, defineEmits, defineProps } from 'vue'

    const emit = defineEmits(['formFn']);
    const props = defineProps([]);

    let titleText = ref('');
    let urlText = ref('');

    function resetForm() {
        titleText.value = '';
        urlText.value = '';
    }

    function handelAddData() {
        if(!titleText.value || !urlText.value) {
            return
        }
        
        const dataItem = {
            'title': titleText.value,
            'url': urlText.value,
            'completed': false
        };

        emit('formFn', dataItem);
        
        resetForm();
    }

</script>