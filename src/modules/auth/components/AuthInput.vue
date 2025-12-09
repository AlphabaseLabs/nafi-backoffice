<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

/**
 * AuthInput - Styled input field with icon for auth forms
 * 
 * Usage:
 * <AuthInput
 *   v-model="email"
 *   label="Email:"
 *   type="email"
 *   :icon="Mail"
 *   placeholder="you@example.com"
 * />
 */

interface Props {
  modelValue: string
  label: string
  type?: string
  placeholder?: string
  icon?: Component
  required?: boolean
  hint?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.id || props.label.toLowerCase().replace(/[^a-z]/g, ''))

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="input-wrapper">
    <label :for="inputId" class="input-label">{{ label }}</label>
    <div class="input-container">
      <component v-if="icon" :is="icon" class="input-icon" />
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :class="['input-field', { 'has-icon': icon }]"
        @input="updateValue"
      />
    </div>
    <p v-if="hint" class="input-hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
@reference "../../../assets/index.css";

.input-wrapper {
  @apply space-y-2;
}

.input-label {
  @apply text-sm font-medium leading-none;
  @apply text-foreground;
}

.input-container {
  @apply relative;
}

.input-icon {
  @apply absolute left-3 top-1/2 -translate-y-1/2;
  @apply h-4 w-4;
  @apply text-muted-foreground;
}

.input-field {
  @apply flex h-10 w-full rounded-md px-3 py-2;
  @apply text-sm;
  @apply bg-background text-foreground;
  @apply border border-input;
  @apply placeholder:text-muted-foreground;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
  @apply disabled:cursor-not-allowed disabled:opacity-50;
  @apply transition-colors;
  @apply file:border-0 file:bg-transparent file:text-sm file:font-medium;
}

.input-field.has-icon {
  @apply pl-10;
}

.input-hint {
  @apply text-xs;
  @apply text-muted-foreground;
}
</style>

