<template>
  <div class="width-200">
    <div class="full-width flex justify-center q-mb-md">
      <div class="onboarding-border-radius-15 width-auto q-pa-sm">
        <q-icon
          no-fill
          name="iconfont icon-report-fill"
          class="onboarding-text-accent-0 onboarding-border-radius-15"
          size="30px"
        />
      </div>
    </div>
    <h6
      :class="`text-semibold text-20 q-my-none ${
        $q.screen.width < 768 ? 'q-mb-sm' : 'q-mb-lg'
      }`"
    >
      Are you sure you want to delete this To-Do List?
    </h6>
    <p class="text-16 text-weight-light q-pb-sm">
      This process cannot be undone.<q-space />By confirming, this account will
      be deleted. To go back Click "Cancel"
    </p>
    <div class="flex justify-evenly q-px-lg q-mr-lg">
      <q-btn
        rounded
        dense
        flat
        no-caps
        label="Cancel"
        class="onboarding-bg-hover-accent-0 q-px-lg q-mr-sm onboarding-border-accent-0"
        @click="closeDialog()"
      />
      <q-btn
        rounded
        dense
        flat
        no-caps
        label="Yes"
        class="onboarding-border-accent-0 text-white onboarding-bg-accent-0 q-px-lg q-mr-lg"
        @click.stop="acceptDelete(), showNotifyDelete()"
      />
    </div>
  </div>
</template>
<script>
import { ref, inject } from "vue";
import { useQuasar } from "quasar";
import { ToggleMainDialogState } from "../../../composables/Triggers";

export default {
  setup() {
    const $q = useQuasar();

    let btnLoadingState = ref(false);

    let rows = ref([]);

    const deleteOR = inject("deleteOR");

    const closeDialog = () => {
      ToggleMainDialogState();
    };

    const deleteTodo = inject("deleteTodo");
    const acceptDelete = () => {
      ToggleMainDialogState();
      deleteTodo(true);
    };

    const showNotifyDelete = () => {
      let status = true;
      $q.notify({
        position: $q.screen.width < 767 ? "top" : "bottom-right",
        classes: `${
          status ? "onboarding-success-notif" : "onboarding-error-notif"
        } q-px-lg q-pt-none q-pb-none`,
        html: true,
        message: status
          ? `<div class="text-bold">Successfully Deleted!</div> To-do List has been Deleted successfully`
          : `<div class="text-bold">Failed!</div> message here.`,
      });
    };

    return {
      showNotifyDelete,
      deleteTodo,
      acceptDelete,
      deleteOR,
      closeDialog,
      btnLoadingState,
    };
  },
};
</script>
