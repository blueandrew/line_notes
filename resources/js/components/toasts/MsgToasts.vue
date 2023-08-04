<template>
    <div class="position-absolute pt-3 bottom-50">
        <div aria-live="polite" aria-atomic="true" class="d-flex justify-content-center align-items-center w-100">
            <!-- Then put toasts within -->
            <div class="toast bg-primary" role="alert" aria-live="assertive" aria-atomic="true"  data-bs-autohide="false" id="liveToast">
                <div class="toast-header">
                    <!-- <img src="..." class="rounded me-2" alt="..."> -->
                    <strong class="me-auto fs-3 fw-bold">訊息通知</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body fs-4 fw-bold">
                    {{ toastsMsg }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { reactive, toRefs } from 'vue'


    const props = defineProps({
        toastsMsg: String
    });
    const { toastsMsg } = toRefs(props);

    const toast = reactive({});

    const toastShow = () => {
        const toastLiveExample = document.getElementById('liveToast');
        toast.value = new bootstrap.Toast(toastLiveExample)
        toast.value.show()
    }

    defineExpose({
        toastShow
    });
</script>