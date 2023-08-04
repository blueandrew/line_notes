<template>
    <!-- <button class="" data-bs-toggle="modal" data-bs-target="#msgModal"></button> -->

    <div class="modal fade" id="msgModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="msgModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="msgModalLabel">{{ modalTitle }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {{ msgText }}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { toRefs, onMounted } from 'vue'


    const emit = defineEmits([]);
    const props = defineProps({
        modalTitle: String,
        msgText: String
    });
    const { modalTitle, msgText } = toRefs(props);

    const modal = reactive({});
    const modalClose = () => {
        modal.value.hide()
    }
    defineExpose({
        modalClose
    });

    onMounted(()=> {
        modal.value = new bootstrap.Modal('#msgModal', {});
    })
</script>