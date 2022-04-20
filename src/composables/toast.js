import { ref, onUnmounted } from 'vue';

export const useToast = () => {
    const showToast = ref(false);
    const timeout = ref(null);
    const toastMessage = ref('');
    const toastAlertType = ref('');
    const triggerToast = (message, type = 'success') => {
          showToast.value = true;
          toastAlertType.value=type;
          toastMessage.value=message;
          timeout.value = setTimeout(() => {
            toastMessage.value='';
            showToast.value= false;
            toastAlertType.value='';
          }, 3000)
    }

    onUnmounted(() => {
        clearTimeout(timeout.value);
    })

    return {
        showToast,
        toastMessage,
        toastAlertType,
        triggerToast,

    }
}