import { defineStore } from 'pinia'
import { fetchAuthSession } from 'aws-amplify/auth'
import api from '@/api'

type Workstation = {
  id: number
  name: string
}
export const useFloorMapStore = defineStore({
  id: 'floorMap',
  state: () => ({
    // Define your state here
    // For example:
    workstations: [] as Workstation[]
  }),
  actions: {
    // Define your actions here
    // For example:
    async fetchFloorMap(): Promise<Workstation[]> {
      const userSub = (await fetchAuthSession()).userSub?.toString()
      if (userSub) {
        const response = await api.get(`/workstation/all/${userSub}`)
        this.workstations = response.data
        return this.workstations
      }
      return []
    }
  }
})
