<template>
  <component
    :is="as"
    :class="[
      'card',
      hover ? 'card-hover' : '',
      variantClass,
      className,
    ]"
  >
    <!-- Header (optionnel) -->
    <div v-if="hasHeader" class="card-header">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <slot name="kicker">
            <div v-if="kicker" class="kicker">{{ kicker }}</div>
          </slot>

          <slot name="title">
            <div v-if="title" class="card-title truncate">{{ title }}</div>
          </slot>

          <slot name="subtitle">
            <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
          </slot>
        </div>

        <div v-if="$slots.actions" class="shrink-0">
          <slot name="actions" />
        </div>
      </div>

      <div v-if="$slots.headerBottom" class="mt-3">
        <slot name="headerBottom" />
      </div>
    </div>

    <!-- Body -->
    <div v-if="$slots.default" :class="bodyClass">
      <slot />
    </div>

    <!-- Footer (optionnel) -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  as: { type: String, default: 'div' },

  // contenu header rapide (optionnel)
  kicker: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },

  // style
  variant: { type: String, default: 'default' }, // default | soft | flat | outline
  hover: { type: Boolean, default: false },

  // padding body
  body: { type: String, default: 'default' }, // default | compact | none

  // classes additionnelles
  class: { type: [String, Array, Object], default: '' },
})

const slots = useSlots()

const className = computed(() => props.class)

const hasHeader = computed(() => {
  return (
    !!props.kicker ||
    !!props.title ||
    !!props.subtitle ||
    !!slots.kicker ||
    !!slots.title ||
    !!slots.subtitle ||
    !!slots.actions ||
    !!slots.headerBottom
  )
})

const variantClass = computed(() => {
  if (props.variant === 'soft') return 'card-soft'
  if (props.variant === 'flat') return 'card-flat'
  if (props.variant === 'outline') return 'card-outline'
  return ''
})

const bodyClass = computed(() => {
  if (props.body === 'none') return ''
  if (props.body === 'compact') return 'card-body py-3 sm:py-3'
  return 'card-body'
})
</script>
