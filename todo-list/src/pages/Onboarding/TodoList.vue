<template>
  <transition
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    :duration="2000"
  >
    <div class="todo-list col q-pt-lg q-pl-lg" style="overflow-y: auto; height: calc(100vh - 120px)">
      <div class="flex justify-end q-pr-lg">
        <q-btn
          rounded
          dense
          flat
          no-caps
          label="Create New Task"
          @click="$router.push({ name: 'create-new' })"
          class="onboarding-border-accent-0 text-white onboarding-bg-accent-0 q-px-xl"
        />
      </div>

      <div class="row q-pt-lg q-pr-lg">
        <div class="col-6">
          <div
            class="in-progress onboarding-bg-accent-0 text-center text-white text-bold q-pt-xs q-mb-xs"
          >
            In-Progress
          </div>

          <div
            class="col q-pa-md onboarding-border-accent-0 onboarding-border-radius-10 q-mr-md q-mb-md"
            v-for="(todo, index) in todoList"
            :key="index"
          >
            <q-expansion-item expand-separator :label="todo.taskTitle">



              <template v-slot:header="{ expanded }" >
                <q-item-section
                  v-if="!expanded"
                  class="onboarding-text-accent-0 text-semibold"
                >
                <div>

                  {{ todo.taskTitle }}
                </div>

                </q-item-section>
                <q-item-section
                  v-if="!expanded"
                  side
                  class="onboarding-text-accent-0 text-semibold"
                >
                  {{ new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </q-item-section>
                <q-item-section v-else class="onboarding-text-accent-0 text-semibold">
                  {{ todo.taskTitle }}
                </q-item-section>
                <q-item-section v-if="expanded" side @click.stop>
                  <q-btn
                    flat
                    round
                    icon="more_horiz"
                    color="blue-9"
                    @click="toggleMenu(index)"
                  >
                
                  <q-menu
                     
                      auto-close
                      anchor="bottom right"
                      self="top right"
                      style="width: 11%"
                      class="onboarding-border-accent-0"
                    >
                      <div class="edit">
                        <q-item
                          class="select-list onboarding-bg-hover-accent-0"
                          clickable
                          v-close-popup
                          
                        >
                          <q-item-section>Edit</q-item-section>
                        </q-item>
                      </div>
                      <div class="delete">
                        <q-item
                          class="select-list onboarding-bg-hover-accent-0"
                          clickable
                          v-close-popup
                        
                        >
                          <q-item-section>Delete</q-item-section>
                        </q-item>
                      </div>
                    </q-menu>
                
                
                </q-btn>
                </q-item-section>
              </template>

              <q-list>
                <q-item
                  v-for="(taskItem, keyIndex) in todo.task_items.filter(item => item.status === 'pending')"
                  :key="keyIndex"
                  class="q-py-none"
                >
                  <q-item-section>
                    <q-checkbox
                      :model-value="taskItem.status === 'completed'"
                      :label="taskItem.taskName"
                      color="blue-9"
                      @update:model-value="(value) => onStatusChange(taskItem, value)"
                    />
                  </q-item-section>
                  <q-item-section>{{ taskItem.taskTime }}</q-item-section>
                </q-item>
              </q-list>
              <div class="flex justify-end onboarding-text-accent-0 text-semibold">
                {{ new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
              </div>
            </q-expansion-item>
          </div>
        </div>

        <div class="col-6">
          <div
            class="Done onboarding-bg-accent-0 text-center text-white text-bold q-pt-xs q-mb-xs"
          >
            Done
          </div>

          <div
            class="col q-pa-md onboarding-border-accent-0 onboarding-border-radius-10 q-mr-md q-mb-md"
            v-for="(todo, index) in doneList"
            :key="index"
          >
            <q-expansion-item expand-separator :label="todo.taskTitle">
              <template v-slot:header="{ expanded }">
                <q-item-section
                  v-if="!expanded"
                  class="onboarding-text-accent-0 text-semibold"
                >
                  {{ todo.taskTitle }}
                </q-item-section>
                <q-item-section
                  v-if="!expanded"
                  side
                  class="onboarding-text-accent-0 text-semibold"
                >
                  {{ new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
                </q-item-section>
                <q-item-section v-else class="onboarding-text-accent-0 text-semibold">
                  {{ todo.taskTitle }}
                </q-item-section>
                <q-item-section v-if="expanded" side>
                  <!-- <q-icon name="more_horiz" /> -->
                </q-item-section>
              </template>

              <q-list>
                <q-item
                  v-for="(taskItem, keyIndex) in todo.task_items.filter(item => item.status === 'completed')"
                  :key="keyIndex"
                  class="q-py-none"
                >
                  <q-item-section>
                    <q-checkbox
                      :model-value="taskItem.status === 'completed'"
                      :label="taskItem.taskName"
                      color="blue-9"
                      @update:model-value="onStatusChange(taskItem)"
                    />
                  </q-item-section>
                  <q-item-section>{{ taskItem.taskTime }}</q-item-section>
                </q-item>
              </q-list>
              <div class="flex justify-end onboarding-text-accent-0 text-semibold">
                {{ new Date(todo.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}
              </div>
            </q-expansion-item>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scope>
@import url("./styles/TodoList.scss");
</style>

<script src="./scripts/TodoList.js"></script>

