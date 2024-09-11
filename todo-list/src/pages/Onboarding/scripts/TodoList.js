import axios from 'axios';

export default {
  data() {
    return {
      todoList: [],
      doneList: [],
      pageLoadingState: false,
      showMenu: [],
    };
  },
  methods: {
    async fetchTodoList() {
      this.pageLoadingState = true;

      try {
        const response = await axios.get('http://localhost/exam/backend/API.php');
        const data = response.data;
        console.log(data);

        // Process and classify tasks into 'todoList' and 'doneList'
        this.todoList = data.filter(task => task.status === 'in-progress');
        this.doneList = data.filter(task => task.status === 'done');
      } catch (error) {
        console.error('Error fetching todo list:', error);
      } finally {
        this.pageLoadingState = false;
      }
    },
    toggleMenu(index) {
      this.$set(this.showMenu, index, !this.showMenu[index]);
    },
    showDeleteDialog() {
      // Implement the delete dialog logic here
    },
    updateTodo() {
      // Implement the update todo logic here
    },
  },
  created() {
    this.fetchTodoList();
  },
};
