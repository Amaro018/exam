<template>
    <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        :duration="2000"
      >
        <div v-if="!pageLoadingState">
          <div class="q-px-lg q-pt-lg gt-xs">
            <div
              class="flex justify-start items-center onboarding-text-accent-0 q-pt-md"
            >
              <q-btn
                @click="$router.go(-1)"
                color="black"
                round
                dense
                flat
                icon="arrow_back"
              />
              <h5 class="text-26 text-semibold q-my-none q-ml-md">
                UPDATE LIST
              </h5>
            </div>


            <div
              class="q-px-lg q-py-sm scrollable-container"
              style="max-height: 70vh; overflow-y: auto"
            >
              <q-form greedy @submit="updateTodo()">
                <div class="text-14 q-mb-md">
                  Task Title<span class="text-red"> *</span>
                </div>
                <!-- THIS IS THE FORM -->

                <!-- Task Title input -->
                <q-input
                  v-model="task_title"
                  dense
                  borderless
                  placeholder="Task Name"
                  :rules="[(val) => (val !== null && val !== '') || '']"
                  hide-bottom-space
                  class="onboarding-input-field standard onboarding-border-accent-0 onboarding-border-radius-10"
                />
                <!-- End of task title input -->
                <div v-for="(task, index) in form" :key="index">
                  <div
                    class="onboarding-border-accent-0 onboarding-border-radius-15 q-px-md q-py-sm q-mt-md standard-form-width border-color"
                  >
                    <!-- Delete Button of create Todo list  -->

                    <q-expansion-item
                      dense
                      dense-toggle
                      expand-separator
                      default-opened
                    >
                      <template v-slot:header="{ expanded }">
                        <q-space />
                        <div style="margin-left: 92%"></div>
                        <q-item-section v-if="!expanded" side @click.stop>
                        </q-item-section>
                        <q-item-section v-else side @click.stop>
                          <div v-if="form.length > 1 && index !== 0">
                            <q-btn
                              dense
                              flat
                              class="delete_button"
                              size="12px"
                              color="teal"
                              icon="iconfont icon-delete-fill"
                              @click="removeTodo(index)"
                            />
                          </div>
                        </q-item-section>

                        <!-- End of delete button -->
                      </template>

                      <div class="field">
                        <div class="flex justify-between items-center">
                          <q-item-label class="label key_result q-mb-sm"
                            >Task Name<span class="text-red"> *</span></q-item-label
                          >
                        </div>
                        <!-- start of Task name input field -->
                        <q-input
                          dense
                          borderless
                          v-model="task.task_name"
                          placeholder="Account Type"
                          :rules="[(val) => (val !== null && val !== '') || '']"
                          hide-bottom-space
                          class="onboarding-border-accent-0 onboarding-border-radius-10 border-color q-pl-md"
                        />
                      </div>

                      <div class="flex justify-between items-center q-mt-md">
                        <q-item-label class="label key_result q-mb-sm"
                          >Time
                        </q-item-label>
                      </div>
                      <!-- time input -->
                      <q-input
                        dense
                        borderless
                        placeholder="00:00"
                        v-model="task.time"
                        @focus="setTimePopup(index)"
                        :rules="[(val) => (val !== null && val !== '') || '']"
                        hide-bottom-space
                        class="onboarding-border-accent-0 onboarding-border-radius-10 border-color q-pl-md"
                      >
                        <template v-slot:append>
                          <q-icon
                            name="access_time_filled"
                            class="clock-icon text-black q-mr-sm"
                          >
                          </q-icon>
                        </template>
                      </q-input>
                      <!-- End of time input -->
                    </q-expansion-item>
                  </div>
                  <!--  Clock -->
                  <q-time
                    v-if="onTimePopup === index"
                    v-model="task.time"
                    class="onboarding-border-accent-0 onboarding-border-radius-15 q-px-md q-py-sm q-mt-md standard-form-width border-color text-bold"
                    bordered
                    mask="hh:mm A"
                    style="margin-top: 8px"
                    text-color="black text-bold"
                    color="teal"
                  >
                    <div class="row items-center q-gutter-xl justify-end q-mr-lg">
                      <q-btn
                        rounded
                        dense
                        v-close-popup
                        label="Close"
                        no-caps
                        class="text-black onboarding-bg-secondary q-px-md q-mr-sm"
                        color="black"
                        flat
                        @click.stop="onTimePopup = false"
                      />
                      <q-btn
                        rounded
                        dense
                        no-caps
                        clickable
                        v-close-popup
                        label="Save"
                        @click.stop="onTimePopup = false"
                        class="text-white onboarding-bg-accent-0 q-px-lg"
                      />
                    </div>
                  </q-time>
                  <!-- End of clock -->
                </div>

                <!-- Add button to create task bin -->
                <div
                  style="border: 1px dashed #249990"
                  class="onboarding-border-radius-15 flex justify-center standard-form-width q-my-sm q-pa-md"
                >
                  <q-btn
                    flat
                    round
                    class="onboarding-bg-accent-0 size text-white"
                    id="generateKeyInput"
                    @click="addTodo(index)"
                    type="button"
                    no-caps
                    icon="add"
                  />
                </div>
                <!-- End of add button -->
                <!-- Save and cancel button -->
                <div class="q-mt-md q-gutter-md q-mb-xl">
                  <q-btn
                    color="black"
                    @click="$router.go(-1)"
                    rounded
                    dense
                    flat
                    no-caps
                    type="button"
                    clickable
                    label="Cancel"
                    class="text-black onboarding-bg-secondary q-px-xl"
                  />
                  <q-btn
                    type="submit"
                    rounded
                    dense
                    flat
                    no-caps
                    clickable
                    label="Save"

                    class="text-white onboarding-bg-accent-0 q-px-xl"
                  />
                </div>
              </q-form>
            </div>
          </div>
          <q-inner-loading
            class="absolute-center onboarding-bg-primary text-20 full-width full-height onboarding-text-accent-0"
            :showing="pageLoadingState"
          />
        </div>
      </transition>
    </template>

    <script src="./scripts/UpdateTask.js">

    </script>
