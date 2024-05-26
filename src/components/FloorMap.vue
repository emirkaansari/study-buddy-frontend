<template>
  <BoxItem>
    <v-row>
      <v-col cols="6" md="3" sm="3">
        <ShapeItem type="rectangle" :text="workstations[0]?.name" :items="employeeNames[0]" />
      </v-col>
      <v-col cols="6" md="2" sm="1">
        <ShapeItem type="square" :text="workstations[1]?.name" :items="employeeNames[1]" />
      </v-col>
      <v-col cols="6" md="3" sm="3">
        <ShapeItem type="L" size="50" :text="workstations[2]?.name" :items="employeeNames[2]" />
      </v-col>
      <v-col cols="6" md="7" sm="10">
        <ShapeItem
          type="rectangle"
          size="50"
          :text="workstations[3]?.name"
          :items="employeeNames[3]"
        />
      </v-col>
      <v-row class="justify-end">
        <v-col cols="auto">
          <ShapeItem type="square" :text="workstations[4]?.name" :items="employeeNames[4]" />
        </v-col>
      </v-row>
    </v-row>
  </BoxItem>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import ShapeItem from '@/components/ShapeItem.vue'
import BoxItem from '@/components/BoxItem.vue'
import { useFloorMapStore } from '@/stores/floorMapStore'
import { useEmployeeStore } from '@/stores/employeeStore'

type Workstation = {
  id: number
  name: string
}

export default defineComponent({
  name: 'FloorMap',
  components: { BoxItem, ShapeItem },
  setup() {
    const floorMapStore = useFloorMapStore()
    const employeeStore = useEmployeeStore()
    const workstations = ref<Workstation[]>([])

    onMounted(async () => {
      workstations.value = await floorMapStore.fetchFloorMap()
    })

    const employeeNames = computed(() => {
      return workstations.value.map((workstation) => {
        return employeeStore.employees
          .filter((e) => e.lastWorkstation === workstation.name && e.isWorking)
          .map((e) => e.name)
      })
    })

    return { workstations, employeeNames }
  }
})
</script>

<style scoped></style>
