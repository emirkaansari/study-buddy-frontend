<template>
  <template v-if="isWorking">
    <v-chip color="green">
      <v-col>
        <v-icon>mdi-cog</v-icon>
        {{ elapsedTime }}
      </v-col>
    </v-chip>
  </template>
  <template v-else>
    <v-chip color="red">
      <v-icon>mdi-cog-off</v-icon>
    </v-chip>
  </template>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'ChipItem',
  props: {
    isWorking: {
      type: Boolean,
      required: true
    },
    lastWorkedTime: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const elapsedTime = ref('')

    const updateElapsedTime = () => {
      const now = Date.now()
      const diff = now - new Date(props.lastWorkedTime).getTime()
      const seconds = Math.floor((diff / 1000) % 60)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      elapsedTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    let intervalId: number | undefined

    onMounted(() => {
      if (props.isWorking) {
        intervalId = setInterval(updateElapsedTime, 1000)
      }
    })

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    return { elapsedTime }
  }
})
</script>

<style scoped></style>
