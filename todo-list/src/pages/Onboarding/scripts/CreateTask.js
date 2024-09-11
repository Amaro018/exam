import axios from 'axios';
import showNotify from 'src/pages/Elements.vue';

export default {
  
  data() {
    return {
      task_title: '',
      form: [
        {
          task_name: '',
          time: '',
        }
      ],
      onTimePopup: false,
      pageLoadingState: false,
      
    };
  },
  methods: {
    
    
    addTodo() {
      this.form.push({ task_name: '', time: '' });
    },
    removeTodo(index) {
      this.form.splice(index, 1);
    },
    setTimePopup(index) {
      this.onTimePopup = index;
    },
    showNotify(status) {
      this.$q.notify({
        position: this.$q.screen.width < 767 ? 'top' : 'bottom-right',
        classes: `${status ? 'onboarding-success-notif' : 'onboarding-error-notif'} q-px-lg q-pt-none q-pb-none`,
        html: true,
        message: status
          ? '<div class="text-bold">Success!</div> New To-do List has been added successfully.'
          : '<div class="text-bold">Failed!</div> Failed to add a new To-do List',
      });
    },
    async addNewTodo() {
      if (this.task_title.trim() === '' || !this.form.length) {
        return; // You can add validation feedback here
      }

      try {
        this.pageLoadingState = true;

        // Prepare the data for POST request
        const postData = {
          taskTitle: this.task_title,
          tasks: this.form.map(task => ({
            taskName: task.task_name,
            taskTime: task.time,
            status: 'pending' // You can adjust status as needed
          }))
        };

        // Make POST request to save the task data
        const response = await axios.post('http://localhost/exam/backend/API.php', postData);

        if (response.status === 200) {
          // Handle success (you can navigate or reset the form)
          
          this.showNotify(true);

          console.log('Task created successfully:', response.data);
          this.$router.go(-1); // Go back to the previous page
        }
      } catch (error) {
        console.error('Error saving task:', error);
        this.showNotify(false);
      } finally {
        this.pageLoadingState = false;
      }
    },
  },
};
