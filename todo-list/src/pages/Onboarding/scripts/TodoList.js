import axios from 'axios';
import { watch } from 'vue';

export default {
  data() {
    return {
      todoList: [],
      doneList: [],
      pageLoadingState: true,
    };
  },
  created() {
    this.fetchTodoList();
  },

  methods: {


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
          task_id: taskItem.id,
          status: taskItem.status
          
        });
        this.showNotify(true);
        console.log(response.data);
      } catch (error) {
        console.error('Error updating task status:', error);
        this.showNotify(false);
      }
    },
  
    onStatusChange(taskItem, isChecked) {
      // Update status based on checkbox value
      taskItem.status = isChecked ? 'completed' : 'pending';
      // Update the status in the backend



      
      this.updateTaskStatus(taskItem);
    },

  },
};