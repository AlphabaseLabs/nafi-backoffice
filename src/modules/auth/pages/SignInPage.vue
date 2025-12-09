<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { AuthCard, AuthInput, AuthButton, AuthLink, AuthAlert } from '../components'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSignIn() {
  error.value = ''
  loading.value = true

  try {
    await authStore.signIn(email.value, password.value)
    router.push('/')
  } catch (err: unknown) {
    error.value = (err as Error).message || 'Failed to sign in. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard title="Login">
    <form @submit.prevent="handleSignIn" class="auth-form">
      <AuthAlert v-if="error" variant="error">{{ error }}</AuthAlert>

      <AuthInput
        v-model="email"
        label="Email:"
        type="email"
        :icon="Mail"
        required
      />

      <AuthInput
        v-model="password"
        label="Password:"
        type="password"
        :icon="Lock"
        required
      />

      <AuthButton :loading="loading">
        {{ loading ? 'Logging in...' : 'Log in' }}
      </AuthButton>

      <div class="auth-footer">
        <AuthLink to="/auth/forgot-password">Forgot Password?</AuthLink>
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
