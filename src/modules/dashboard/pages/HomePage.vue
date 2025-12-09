<template>
  <div class="flex min-h-screen flex-col bg-background">
    <header class="border-b border-border bg-card px-6 py-4">
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <h1 class="text-xl font-semibold text-foreground">Nafi BackOffice</h1>
        <div class="flex items-center gap-3">
          <span v-if="user" class="text-sm text-muted-foreground">
            {{ user.email }}
          </span>
          <ThemeToggle />
          <Button @click="handleSignOut" variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </header>

    <main class="flex flex-1 items-center justify-center p-6">
      <div class="text-center">
        <h2 class="text-3xl font-bold tracking-tight text-foreground">Welcome to Nafi BackOffice!</h2>
        <p class="mt-4 text-muted-foreground">
          You are successfully signed in.
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import Button from '@shared/components/ui/Button.vue'
import ThemeToggle from '@shared/components/ui/ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

async function handleSignOut() {
  try {
    await authStore.signOut()
    router.push('/auth/signin')
  } catch (error) {
    console.error('Sign out failed:', error)
  }
}
</script>
