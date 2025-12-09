<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.store'
import { AuthCard, AuthInput, AuthButton, AuthLink, AuthAlert } from '../components'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleSignUp() {
  error.value = ''
  success.value = ''

  // Validation
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    await authStore.signUp(email.value, password.value, fullName.value)
    success.value = 'Account created successfully! Please check your email to verify your account.'

    // Redirect to sign in page after 2 seconds
    setTimeout(() => {
      router.push('/auth/signin')
    }, 2000)
  } catch (err: unknown) {
    error.value = (err as Error).message || 'Failed to create account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard title="Create Account" subtitle="Sign up to get started">
    <form @submit.prevent="handleSignUp" class="auth-form">
      <AuthAlert v-if="error" variant="error">{{ error }}</AuthAlert>
      <AuthAlert v-if="success" variant="success">{{ success }}</AuthAlert>

      <AuthInput
        v-model="fullName"
        label="Full Name:"
        type="text"
        :icon="User"
        placeholder="John Doe"
      />

      <AuthInput
        v-model="email"
        label="Email:"
        type="email"
        :icon="Mail"
        placeholder="you@example.com"
        required
      />

      <AuthInput
        v-model="password"
        label="Password:"
        type="password"
        :icon="Lock"
        hint="Must be at least 6 characters"
        required
      />

      <AuthInput
        v-model="confirmPassword"
        label="Confirm Password:"
        type="password"
        :icon="Lock"
        required
      />

      <AuthButton :loading="loading">
        {{ loading ? 'Creating account...' : 'Sign Up' }}
      </AuthButton>

      <div class="auth-footer">
        <span class="auth-footer-text">Already have an account? </span>
        <AuthLink to="/auth/signin">Log in</AuthLink>
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

.auth-footer-text {
  @apply text-sm text-muted-foreground;
}
</style>
