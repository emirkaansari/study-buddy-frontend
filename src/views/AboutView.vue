<template>
  <v-card class="mx-auto" elevation="24">
    <v-card-item>
      <authenticator>
        <template v-slot="{ user, signOut }">
          <h1>Hello {{ user.username }}!</h1>
          <button @click="signOut">Sign Out</button>
        </template>
      </authenticator>
    </v-card-item>
  </v-card>
</template>

<script setup>
import { Authenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'
</script>
