<script setup lang="ts">
/**
 * AuthLink - Styled link for auth pages
 * 
 * Usage:
 * <AuthLink to="/auth/forgot-password">Forgot Password?</AuthLink>
 */

interface Props {
  to: string
}

defineProps<Props>()
</script>

<template>
  <router-link :to="to" class="auth-link">
    <slot />
  </router-link>
</template>

<style scoped>
@reference "../../../assets/index.css";

.auth-link {
  @apply text-sm font-medium;
  @apply text-primary underline-offset-4;
  @apply transition-colors;
  @apply hover:underline;
}
</style>

