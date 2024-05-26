// src/stores/dessertsStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import api from '@/api'

interface Employee {
  id: string
  name: string
  isWorking: boolean
  lastWorkedTime: string
  lastWorkstation: string
  lastEarning: LastEarning
}

interface LastEarning {
  id: string
  amount: number
  time: string
}

export const useEmployeeStore = defineStore({
  id: 'employees',
  state: () => ({
    employees: [] as Employee[],
    headers: [
      {
        title: 'Name',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      { title: 'Status', value: 'chip' },
      { title: 'Last Workstation', value: 'lastWorkstation' },
      { title: 'Last Worked Time', value: 'lastWorkedTime' },
      { title: 'Last Earning €', value: 'lastEarning.amount' },
      { title: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      id: '',
      name: '',
      cardId: ''
    },
    defaultItem: {
      id: '',
      name: '',
      cardId: ''
    },
    dialog: false,
    dialogDelete: false
  }),
  actions: {
    // Fetch your data from an API or initialize it here
    async fetchEmployees() {
      try {
        const data = await fetchAuthSession()
        const userSub = data.userSub?.toString()

        if (userSub) {
          const response = await api.get(`/employee/all/${userSub}`)
          this.employees = response.data
        }
      } catch (error) {
        console.error('Failed to fetch employees:', error)
      }
    },

    editItem(item: any) {
      this.editedIndex = this.employees.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item: any) {
      this.editedIndex = this.employees.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      this.employees.splice(this.editedIndex, 1)
      const data = await fetchAuthSession()
      const userSub = data.userSub?.toString()
      await api.delete(`/employee/delete/${userSub}/${this.editedItem.id}`)
      this.closeDelete()
    },
    close() {
      this.dialog = false
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    },
    closeDelete() {
      this.dialogDelete = false
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
    },
    async save() {
      if (this.editedIndex > -1) {
        Object.assign(this.employees[this.editedIndex], this.editedItem)
      } else {
        this.employees.push(this.editedItem)
      }
      const data = await fetchAuthSession()
      const userSub = data.userSub?.toString()
      await api.put(`/employee/update/${userSub}`, this.editedItem)
      this.close()
    },
    updateEmployee(data: Employee) {
      const employeeIndex = this.employees.findIndex((employee) => employee.id === data.id)
      if (employeeIndex !== -1) {
        this.employees[employeeIndex] = {
          ...this.employees[employeeIndex],
          ...data
        }
      }
    }
  }
})
