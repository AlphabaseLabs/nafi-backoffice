<script setup lang="ts">
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { AuthCard, AuthInput, AuthButton, AuthLink, AuthAlert } from '../components'

const authStore = useAuthStore()

const email = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleForgotPassword() {
  error.value = ''
  success.value = ''
  loading.value = true

  try {
    await authStore.resetPassword(email.value)
    success.value = 'Check your email for the password reset link!'
    email.value = ''
  } catch (err: unknown) {
    error.value = (err as Error).message || 'Failed to send reset link. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard 
    title="Forgot Password" 
    subtitle="Enter your email and we'll send you a reset link"
  >
    <form @submit.prevent="handleForgotPassword" class="auth-form">
      <AuthAlert v-if="error" variant="error">{{ error }}</AuthAlert>
      <AuthAlert v-if="success" variant="success">{{ success }}</AuthAlert>

      <AuthInput
        v-model="email"
        label="Email:"
        type="email"
        :icon="Mail"
        placeholder="you@example.com"
        required
      />

      <AuthButton :loading="loading">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </AuthButton>

      <div class="auth-footer">
        <AuthLink to="/auth/signin">Back to Login</AuthLink>
      </div>
    </form>
  </AuthCard>
</template>

<style scoped>
@reference "../../../assets/index.css";

.auth-form {
  @apply space-y-5;
}

.auth-footer {
  @apply text-center;
}
</style>
