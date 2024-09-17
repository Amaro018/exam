import axios from 'axios';
import showNotify from 'src/pages/Elements.vue';
import router from 'src/router';

export default {
  data() {
    return {
      task_title: '',
      form: [
        {
          task_name: '',
          time: '',
          taskItemId: '',

        }
      ],
      onTimePopup: false,
      pageLoadingState: false,
      todoId: null, // ID of the task to be updated
    };
  },

  created() {
    // Get the todoId from the route parameters
    this.todoId = this.$route.params.id;
    console.log('Todo ID in UpdateTask:', this.todoId);

    // Fetch task details if todoId is available
    if (this.todoId != null) {
      console.log('Fetching task details for Todo ID:', this.todoId);
      this.fetchTaskDetails(this.todoId);
    }
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

    async fetchTaskDetails(todoId) {
      try {
        // Fetch the task details using the todoId
        const response = await axios.get(`http://localhost/exam/backend/API.php/${todoId}`);

        const taskData = response.data;

        this.task_title = taskData.taskTitle;
        this.form = taskData.task_items.map(task => ({
          task_name: task.taskName,
          time: task.taskTime,
          taskItemId: task.taskName,
        }))

        console.log(this.form);
        console.log('Fetched task details:', response.data);
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    },

    addTodo() {
      this.form.push({ task_name: '', time: '' });
      console.log(this.form);
    },

    removeTodo(index) {
      this.form.splice(index, 1);
      console.log(index + " removed this task_items");
    },

    setTimePopup(index) {
      this.onTimePopup = index;
    },


    async updateTodo() {



        const taskData = {
          id: this.todoId,
          taskTitle: this.task_title,
        task_items: this.form.map(task => ({
          taskName: task.task_name,
          taskTime: task.time,
          taskItemId: task.taskItemId,
        }))

    };

            console.log(this.form);



            const response = await axios.put(`http://localhost/exam/backend/API.php/${this.todoId}`, taskData);
            this.$router.go(-1);
            console.log(response.data);
            this.showNotify(true);




      // if (this.task_title.trim() === '' || !this.form.length) {
      //   return; // Add validation feedback here if needed
      // }

      // try {
      //   this.pageLoadingState = true;

      //   // Prepare the data for POST/PUT request
      //   const postData = {
      //     taskTitle: this.task_title,
      //     tasks: this.form.map(task => ({
      //       taskName: task.task_name,
      //       taskTime: task.time,
      //       status: 'pending' // Default status if not provided
      //     })),
      //   };

      //   let response;

      //   if (this.todoId) {
      //     // Update existing task
      //     response = await axios.put(`http://localhost/exam/backend/API.php/${this.todoId}`, postData);
      //   } else {
      //     // Create new task
      //     response = await axios.post('http://localhost/exam/backend/API.php', postData);
      //   }

      //   if (response.status === 200) {
      //     // Handle success and show notification
      //     // this.showNotify(true);
      //     console.log('Task saved successfully:', response.data);

      //     // Navigate back or reset the form
      //     this.$router.go(-1);
      //   }
      // } catch (error) {
      //   console.error('Error saving task:', error);
      //   // this.showNotify(false);
      // } finally {
      //   this.pageLoadingState = false;
      // }

    },
  },
};

