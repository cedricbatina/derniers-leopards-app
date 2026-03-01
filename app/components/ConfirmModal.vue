<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="card animate-in zoom-in-95 duration-200 w-full max-w-md">
          <div class="card-body">
            <!-- Header -->
            <div v-if="$slots.header" class="mb-4">
              <slot name="header" />
            </div>

            <!-- Title & Icon -->
            <div class="flex items-start gap-4 mb-6">
              <div v-if="icon" :class="`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBgClass}`">
                <Icon :name="icon" :class="iconClass" />
              </div>
              <div class="flex-1">
                <h3 v-if="title" class="text-lg font-bold">{{ title }}</h3>
                <p v-if="message" class="text-sm text-muted mt-2">{{ message }}</p>
              </div>
            </div>

            <!-- Body Slot -->
            <div v-if="$slots.default" class="mb-6 text-sm text-muted">
              <slot />
            </div>

            <!-- Actions -->
            <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-6 border-t border-border">
              <button
                @click="$emit('update:modelValue', false)"
                class="btn btn-ghost"
                :disabled="loading"
              >
                {{ cancelLabel }}
              </button>
              <button
                @click="handleConfirm"
                :class="`btn ${danger ? 'btn-danger' : 'btn-primary'}`"
                :disabled="loading"
              >
                <Icon v-if="loading" name="mdi:loading" class="animate-spin" />
                {{ confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  title: {
    type: String,
    default: 'Confirm action',
  },
  message: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: 'mdi:alert-circle',
  },
  danger: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  confirmLabel: {
    type: String,
    default: 'Confirm',
  },
  cancelLabel: {
    type: String,
    default: 'Cancel',
  },
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const iconBgClass = computed(() => {
  return props.danger ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
})

const iconClass = computed(() => {
  return props.danger ? 'text-red-600 dark:text-red-400 w-5 h-5' : 'text-blue-600 dark:text-blue-400 w-5 h-5'
})

const handleConfirm = () => {
  emit('confirm')
}
</script>
</script>
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
