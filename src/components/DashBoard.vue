<template>
  <v-row>
    <v-col cols="12" md="8" lg="12" fill-height>
      <v-container fluid>
        <v-data-table width="100%" :headers="headers" :items="employees">
          <template v-slot:item.chip="{ item }">
            <ChipItem
              :is-working="item.isWorking"
              :last-worked-time="item.lastWorkedTime"
            ></ChipItem>
          </template>

          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Employees 🧑‍🔧</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ props }">
                  <v-btn class="mb-2" color="primary" dark v-bind="props"> New Employee </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field
                            v-model="editedItem.name"
                            label="Employee Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4" sm="6">
                          <v-text-field v-model="editedItem.cardId" label="Card ID"></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="close"> Cancel </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="save"> Save </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon class="me-2" size="small" @click="editItem(item)"> mdi-pencil </v-icon>
            <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-container>
    </v-col>
    <v-col cols="12" md="4" lg="12" fill-height>
      <FloorMap />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { onMounted, toRefs } from 'vue'
import { useEmployeeStore } from '@/stores/employeeStore.ts'
import ChipItem from '@/components/ChipItem.vue'
import BoxItem from '@/components/BoxItem.vue'
import ShapeItem from '@/components/ShapeItem.vue'
import FloorMap from '@/components/FloorMap.vue'
import { fetchAuthSession } from 'aws-amplify/auth'
import { EventSourcePlus } from 'event-source-plus'

export default {
  components: { FloorMap, BoxItem, ChipItem, ShapeItem },
  setup() {
    const employeeStore = useEmployeeStore()
    let eventSource

    onMounted(async () => {
      const session = await fetchAuthSession()
      const userSub = session.userSub?.toString()
      await employeeStore.fetchEmployees()
      eventSource = new EventSourcePlus(`http://localhost:8080/employee/sse/${userSub}`, {
        headers: {
          Authorization: 'Bearer ' + session.tokens?.accessToken.toString()
        }
      })

      eventSource.listen({
        onMessage(message) {
          const data = JSON.parse(message.data)
          employeeStore.updateEmployee(data)
        }
      })
    })

    const {
      headers,
      employees,
      editedItem,
      dialog,
      dialogDelete,
      formTitle,
      editItem,
      deleteItem,
      deleteItemConfirm,
      close,
      closeDelete,
      save
    } = toRefs(employeeStore)

    return {
      employees,
      headers,
      editedItem,
      dialog,
      dialogDelete,
      formTitle,
      editItem,
      deleteItem,
      deleteItemConfirm,
      close,
      closeDelete,
      save
    }
  }
}
</script>

<style scoped>
.align-self-center {
  align-self: center;
}
</style>
