<template>
    <div class="modal fade" id="magModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="magModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="magModalLabel">{{ modalTitle }}</h5>
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
    import { defineProps, toRefs } from 'vue'

    const props = defineProps({
        modalTitle: String,
        msgText: String
    });
    const { modalTitle, msgText } = toRefs(props);
</script>