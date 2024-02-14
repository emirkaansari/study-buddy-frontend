<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-app-bar-title>
        <span>StudyBuddy</span>
      </v-app-bar-title>
      <v-btn v-if="auth.authStatus !== 'authenticated'" @click="showLogin"> Login </v-btn>

      <v-btn v-if="auth.authStatus === 'authenticated'" @click="auth.signOut">
        <v-row align="center">
          <v-col cols="auto">
            <v-icon icon="mdi-account"></v-icon>
          </v-col>
          <v-col>
            <span>{{ auth.user?.username }}</span>
          </v-col>
        </v-row>
      </v-btn>
    </v-app-bar>

    <v-main> hey zeynep </v-main>

    <v-footer app color="primary">
      <v-container>
        <span class="white--text">&copy; 2024 Your App</span>
      </v-container>
    </v-footer>

    <v-overlay v-model="show" activator="#login-btn" class="align-center justify-center">
      <v-card elevation="24">
        <v-card-item>
          <authenticator :user="auth.user"></authenticator>
        </v-card-item>
      </v-card>
    </v-overlay>
  </v-app>
</template>

<script setup lang="ts">
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'
import '@aws-amplify/ui-vue/styles.css'
import aws_exports from './aws-exports.js'

Amplify.configure(aws_exports)

import { ref, toRefs, watch } from 'vue'
import { Amplify } from 'aws-amplify'

const auth = useAuthenticator()
const show = ref(false)
const { user } = toRefs(useAuthenticator())

function showLogin() {
  show.value = true
}

watch(user, (newVal: string) => {
  if (newVal) {
    show.value = false
  }
})
</script>

<style>
/* Additional styles for the login card or other elements */
</style>
