<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-app-bar-title>
        <span>Productivity Tracker ⚙️</span>
      </v-app-bar-title>
      <v-btn v-if="auth.authStatus !== 'authenticated'" @click="showLogin"> Login </v-btn>

      <v-avatar v-if="auth.authStatus === 'authenticated'" @click="showUploadDialog = true">
        <img
          v-if="profilePicture"
          :src="profilePicture"
          alt="Profile Picture"
          class="avatar-image"
        />
        <v-icon v-else>mdi-account-circle</v-icon>
      </v-avatar>

      <v-btn v-if="auth.authStatus === 'authenticated'" @click="auth.signOut">
        <v-row align="center">
          <v-col>
            <span>{{ auth.user?.username }}</span>
          </v-col>
        </v-row>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container v-if="auth.authStatus === 'authenticated'">
        <DashBoard />
      </v-container>
      <v-container v-if="auth.authStatus !== 'authenticated'">
        <v-row justify="center">
          <v-col cols="12" sm="6" md="4" align-self="center">
            <img src="@/assets/main_pic.png" alt="Productivity Tracker" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer app color="primary">
      <v-container>
        <span class="white--text">&copy; 2024 Productivity Tracker</span>
      </v-container>
    </v-footer>

    <v-overlay v-model="show" activator="#login-btn" class="align-center justify-center">
      <v-card elevation="24">
        <v-card-item>
          <authenticator :user="auth.user"></authenticator>
        </v-card-item>
      </v-card>
    </v-overlay>

    <v-dialog v-model="showUploadDialog" max-width="500px">
      <v-card>
        <v-card-title>Upload Profile Picture</v-card-title>
        <v-card-text>
          <v-file-input
            :rules="rules"
            accept="image/png, image/jpeg, image/bmp"
            label="Avatar"
            placeholder="Pick an avatar"
            prepend-icon="mdi-camera"
            @change="uploadProfilePicture($event)"
          ></v-file-input>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-vue'
import { Amplify } from 'aws-amplify'
import { uploadData } from '@aws-amplify/storage'
import { getUrl } from 'aws-amplify/storage'
import '@aws-amplify/ui-vue/styles.css'
import aws_exports from './aws-exports.js'
import { fetchAuthSession } from 'aws-amplify/auth'

Amplify.configure(aws_exports)

import { ref, toRefs, watch, onMounted } from 'vue'
import DashBoard from '@/components/DashBoard.vue'

const auth = useAuthenticator()
const show = ref(false)
const { user } = toRefs(useAuthenticator())
const profilePicture = ref('')
const showUploadDialog = ref(false)
const file = ref<File | null>(null)

const rules = ref([
  (value: File[] | null) => {
    return (
      !value || !value.length || value[0].size < 2000000 || 'Avatar size should be less than 2 MB!'
    )
  }
])

watch(user, async (newVal: string) => {
  if (newVal) {
    show.value = false
    fetchAuthSession()
      .then((data) => {
        console.log(data)
        console.log(data.tokens?.accessToken.toString())
      })
      .catch((err) => {
        console.log(err)
      })
    await downloadProfilePicture()
  }
})

onMounted(async () => {
  if (auth.user) {
    await downloadProfilePicture()
  }
})

// Upload profile picture
async function uploadProfilePicture(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  console.log(file)
  try {
    const result = await uploadData({
      key: auth.user.userId,
      data: file,
      options: {
        contentEncoding: 'compress'
      }
    }).result
    console.log(result)
  } catch (error) {
    console.error('Error uploading file: ', error)
  }
}

// Download profile picture
async function downloadProfilePicture() {
  const getUrlResult = await getUrl({
    key: auth.user.userId
  })
  profilePicture.value = getUrlResult.url.toString()
}

function showLogin() {
  show.value = true
}
</script>

<style>
/* Additional styles for the login card or other elements */
.avatar-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
</style>
