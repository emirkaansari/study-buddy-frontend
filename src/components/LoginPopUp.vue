<template>
  <v-overlay :value="show" @click:outside="close">
    <v-card class="login-card" elevation="24">
      <v-card-item>
        <authenticator :user="auth.user" :signOut="auth.signOut">
          <template v-slot="{ username }">
            <h1>Hello {{ username }}!</h1>
          </template>
        </authenticator>
      </v-card-item>
    </v-card>
  </v-overlay>
</template>

<script setup lang="ts">
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'
import { ref } from 'vue' // Assuming Vue 3

const auth = useAuthenticator()
const show = ref(false)

function close() {
  show.value = false
}
</script>

<style scoped></style>
