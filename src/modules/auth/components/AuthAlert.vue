<script setup lang="ts">
/**
 * AuthAlert - Alert message for success/error states
 * 
 * Usage:
 * <AuthAlert v-if="error" variant="error">{{ error }}</AuthAlert>
 * <AuthAlert v-if="success" variant="success">{{ success }}</AuthAlert>
 */

interface Props {
  variant: 'error' | 'success'
}

defineProps<Props>()
</script>

<template>
  <div :class="['auth-alert', `auth-alert--${variant}`]">
    <slot />
  </div>
</template>

<style scoped>
@reference "../../../assets/index.css";

.auth-alert {
  @apply relative w-full rounded-lg border p-4 text-sm;
}

.auth-alert--error {
  @apply border-destructive/50 bg-destructive/10 text-destructive;
}

.auth-alert--success {
  @apply border-primary/50 bg-primary/10 text-primary;
}
</style>

