import DeleteModal from "../components/DeleteModal.vue";
import axios from 'axios';
import SimpleModal from '../components/SimpleModal.vue';
import { ToggleMainDialogState } from "../../../composables/Triggers";
import MainDialog from "src/components/MainDialog.vue";


export default {

  components: {
    DeleteModal,
    MainDialog
  },


  data() {
    return {
      todoList: [],
      doneList: [],
      pageLoadingState: true,
      isDeleteModalVisible: false,
      selectedTodoId: null,

    };
  },

  provide() {
    return {
      deleteTodo: this.deleteTodo,
    };
  },

  created() {
    this.fetchTodoList();
  },



  methods: {

    updateList(todoId) {

      console.log('Updating list for Todo ID:', todoId);


      this.$router.push({ name: 'update-list', params: { id: todoId } });
    },

    showDeleteDialog(todoId){
      ToggleMainDialogState();
      this.selectedTodoId = todoId;

      console.log("Todo ID to delete: ", todoId)
    },

    async deleteTodo(acceptDelete) {
      if (acceptDelete) {
        try {
          console.log("Deleting todo with ID:", this.selectedTodoId);

          const response = await axios.delete(`http://localhost/exam/backend/API.php/${this.selectedTodoId}`);

          // Check if the delete was successful
          if (response.status === 200) {
            console.log("Todo successfully deleted:", response.data);
            this.fetchTodoList();
            this.showNotifyDelete(true);
          } else {
            console.log("Failed to delete Todo");
            this.showNotifyDelete(false);
          }
        } catch (error) {
          console.error("Error deleting Todo:", error);
          this.showNotifyDelete(false);
        }
      }
    },


    showNotifyDelete(status) {
      this.$q.notify({
        position: this.$q.screen.width < 767 ? 'top' : 'bottom-right',
        classes: `${status ? 'onboarding-success-notif' : 'onboarding-error-notif'} q-px-lg q-pt-none q-pb-none`,
        html: true,
        message: status
          ? '<div class="text-bold">Success!</div>List has been Deleted successfully.'
          : '<div class="text-bold">Failed!</div> Failed to Delete List',
      });
    },

    showNotify(status) {
      this.$q.notify({
        position: this.$q.screen.width < 767 ? 'top' : 'bottom-right',
        classes: `${status ? 'onboarding-success-notif' : 'onboarding-error-notif'} q-px-lg q-pt-none q-pb-none`,
        html: true,
        message: status
          ? '<div class="text-bold">Success!</div>List has been updated successfully.'
          : '<div class="text-bold">Failed!</div> Failed to update List',
      });
    },

    async fetchTodoList() {
      try {
        const response = await axios.get('http://localhost/exam/backend/API.php');
        const todos = response.data;

        this.todoList = todos;
        this.doneList = todos;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        this.pageLoadingState = false;
      }
    },




    async updateTaskStatus(taskItem) {
      try {
        const response = await axios.put(`http://localhost/exam/backend/API.php/${taskItem.id}`, {
          id: taskItem.id,
          taskName: taskItem.taskName,
          status: taskItem.status
        });

        this.showNotify(true);
        console.log(response.data);
      } catch (error) {
        console.error('Error updating task status:', error);
        this.showNotify(false);
      }

    },

    onStatusChange(taskItem) {

      if(taskItem.status === "pending"){
        taskItem.status = "completed"
      }
      else if(taskItem.status === "completed"){
        taskItem.status = "pending"
      }

      this.updateTaskStatus(taskItem);
    },
  },

};
