const confirmState = ref({
  isOpen: false,
  title: '',
  message: '',
  icon: 'mdi:alert-circle',
  danger: false,
  loading: false,
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  onConfirm: null,
})

export const useConfirm = () => {
  const open = (options) => {
    confirmState.value = {
      isOpen: true,
      title: options.title || 'Confirm action',
      message: options.message || '',
      icon: options.icon || 'mdi:alert-circle',
      danger: options.danger || false,
      loading: false,
      confirmLabel: options.confirmLabel || 'Confirm',
      cancelLabel: options.cancelLabel || 'Cancel',
      onConfirm: options.onConfirm,
    }
  }

  const close = () => {
    confirmState.value.isOpen = false
    confirmState.value.onConfirm = null
  }

  const confirm = async () => {
    if (!confirmState.value.onConfirm) return

    confirmState.value.loading = true
    try {
      await Promise.resolve(confirmState.value.onConfirm())
      close()
    } catch (error) {
      confirmState.value.loading = false
      throw error
    }
  }

  return {
    isOpen: computed(() => confirmState.value.isOpen),
    title: computed(() => confirmState.value.title),
    message: computed(() => confirmState.value.message),
    icon: computed(() => confirmState.value.icon),
    danger: computed(() => confirmState.value.danger),
    loading: computed(() => confirmState.value.loading),
    confirmLabel: computed(() => confirmState.value.confirmLabel),
    cancelLabel: computed(() => confirmState.value.cancelLabel),
    open,
    close,
    confirm,
  }
}
