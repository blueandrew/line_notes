<template>
    <form>
        <div class="mb-3">
            <label for="title=text" class="col-form-label">標題:</label>
            <input type="text" class="form-control" id="title-text" v-model="dataItem.title">
        </div>
        <div class="mb-3">
            <label for="url-text" class="col-form-label">鏈結:</label>
            <input type="text" class="form-control" id="url-text" v-model="dataItem.url">
        </div>
        <div class="d-md-flex justify-content-center">
            <button type="button" class="btn btn-primary" @click="handelEditData">修改</button>
        </div>
    </form>
</template>

<script setup>
    import { ref, reactive, onMounted, defineEmits, defineProps } from 'vue'

    const emit = defineEmits(['formFn']);
    const props = defineProps({dataItem: Object});
    const { dataItem } = props;


    function handelEditData() {
        if(!dataItem.title || !dataItem.url) {
            return
        }

        emit('formFn', dataItem);
    }

</script>