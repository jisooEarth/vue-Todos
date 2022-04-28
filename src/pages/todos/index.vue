<template>
  <div>
    <!-- <router-view /> -->
    <div class="d-flex justify-content-between mb-3">
      <h2>To-Do List</h2>
      <button 
        class="btn btn-primary"
        @click="moveToCreatePage"
      >
          Create Todo
      </button>
    </div>
    
    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search"
      @keyup.enter="serchTodo"
    />
    <hr />
    <!-- <TodoSimpleForm @add-todo="addTodo" />
    <div style="color=red">{{ error }}</div>
    <div v-if="!todos.length">There is nothing to display</div>
    {{ todos }} -->
    <TodoList
      :todos="todos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
    ></TodoList>
    <hr />
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li v-if="currentPage !== 1" style="cursor: pointer" class="page-item">
        <a
            style="cursor: pointer"
            class="page-link"
            @click="getTodos(currentPage - 1)"
            aria-label="Previous"
        >Previous
            <!-- <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span> -->
        </a>
        </li>
        <li
          v-for="page in numberOfPages"
          :key="page"
          class="page-item"
          :class="currentPage === page ? 'active' : ''"
        >
          <a
            style="cursor: pointer"
            class="page-link"
            @click="getTodos(page)"
            >{{page}}</a>
        </li>
        <li v-if="numberOfPages !== currentPage" class="page-item">
          <a
            style="cursor: pointer"
            class="page-link"
            @click="getTodos(currentPage + 1)"
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
  <Toast 
    v-if="showToast"
    :message="toastMessage"
    :type="toastAlertType"
  />
</template>

<script>
// :style="todo.completed ? todoStyle : {}" -> 스타일 바인딩
// :class="{ todo: todo.completed }" -> 클래스 바인딩(스타일 안에 선언 하고 위에서 스타일 객체 바인딩)
// 변수 선언좀 제대로 해줬으면... props 할 때, <TodoList :보낼 이름="보낼 데이터/>
import { ref, computed, watch } from "vue";
// import TodoSimpleForm from "@/components/TodoSimpleForm.vue";
import TodoList from "@/components/TodoLIst.vue";
// import { reactive } from 'vue';
import axios from "axios";
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';
import { useRouter } from 'vue-router';

export default {
  components: {
    // TodoSimpleForm,
    TodoList,
    Toast,
  },

  setup() {
    const toggle = ref(false);
    // const todo = ref('');
    const router = useRouter();
    const todos = ref([]);
    const error = ref("");
    // const hasError=ref(false);
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    const searchText = ref("");

    const {
      showToast,
      toastMessage,
      toastAlertType,
      triggerToast,
    } = useToast();

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    });

    const getTodos = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        const res = await axios.get(
          `http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
        );
        

        numberOfTodos.value = res.headers["x-total-count"];
        todos.value = res.data;
      } catch (err) {
        console.log(err);
        error.value = "뭔가 잘못됐습니다!";
        triggerToast('에러!', 'danger');
      }
    };

    getTodos();

    const todoStyle = {
      textDecoration: "line-through",
      color: "gray",
    };

    const addTodo = async (todo) => {
      error.value = "";
      //데이터베이스 투두를 저장
      try {
        await axios.post("http://localhost:3000/todos/", {
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodos(1);
        // todos.value.push(res.data);
      } catch (err) {
        console.log(err);
        error.value = "뭔가 잘못됐습니다!";
        triggerToast('에러!', 'danger');
      }
    };

    const deleteTodo = async (id) => {
      // const id = todos.value[index].id;
      error.value = '';
      try {
        await axios.delete("http://localhost:3000/todos/" + id);
        getTodos(1);
        // todos.value.splice(index,1);
      } catch (err) {
        console.log(err);
        error.value = "뭔가 잘못됐습니다!";
        triggerToast('에러!', 'danger');
      }
    };

    const onToggle = () => {
      toggle.value = !toggle.value;
    };

    const toggleTodo = async (index, checked) => {
      error.value = "";
      const id = todos.value[index].id;
      try {
        await axios.patch("http://localhost:3000/todos/" + id, {
          completed: checked
        });
        todos.value[index].completed = checked;
        console.log(checked);
      } catch (err) {
        console.log(err);
        error.value = "뭔가 잘못됐습니다!";
        triggerToast('에러!', 'danger');
      }
    };

    const moveToCreatePage = () => {
      router.push({
        name: 'TodoCreate',
      })
    };

    let timeout = null;
    const serchTodo = () => {
      clearTimeout(timeout);
      getTodos(1);
    };
    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodos(1);
      }, 2000);
    });


    return {
      todos,
      toggle,
      onToggle,

      todoStyle,
      deleteTodo,
      addTodo,
      toggleTodo,
      searchText,
      // filteredTodos,
      error,
      numberOfPages,
      currentPage,
      getTodos,
      serchTodo,
      toastMessage,
      toastAlertType,
      showToast,
      moveToCreatePage,
    };
  },
};
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>