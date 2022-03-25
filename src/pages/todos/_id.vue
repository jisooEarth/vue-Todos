<template>
  <h1>To-Do page</h1>
  <div v-if="loading">
    Loading....
  </div>
  <form 
    v-else
    @submit.prevent="onSave"  
  >
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <div>
            <input 
              v-model="todo.subject" 
              type="text" 
              class="form control"
            >
            <button 
            type = "submit" 
            class="btn btn-primary"
            :disabled="!todoUpdated"
            >
              Save
            </button>
            <button
              class="btn btn-outline-dark ms-2"
              @click="moveToTodoListPage"
            >
              Cancle
            </button>            
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button 
              class="btn"
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
              @click="toggleTodoStatus"
              type = "button"
            >
              {{ todo.completed ? 'completed': 'Imcompleted' }}
            </button>
          </div>
        </div>
      </div>    
    </div> 
      
  </form>
  <Toast 
    v-if="showToast"
    :message="toastMessage"
    :type="toastAlertType"
  />
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import {ref, computed } from 'vue';
import _ from 'lodash';
import Toast from '@/components/Toast.vue';

export default {
  components: {
    Toast,
  },
  setup() {
        const route = useRoute();
        const router = useRouter();
        const todo = ref(null);
        const originalTodo = ref(null);
        const loading = ref(true);
        const showToast = ref(false);
        const toastMessage = ref('');
        const toastAlertType = ref('');
        const todoId = route.params.id;

        const getTodo = async () => {
          try { 
            const res = await axios.get('http://localhost:3000/todos/'+ todoId);
            todo.value = { ...res.data };
            originalTodo.value = { ...res.data };
            console.log(todo.value.subject);
            loading.value = false;
          } catch (error) {
            console.log(error);
            triggerToast('에러!', 'danger');
          }
          
        };
        getTodo();
        
        const toggleTodoStatus = () => {
          todo.value.completed = !todo.value.completed;
        };

        const moveToTodoListPage = () => {
          router.push({
            name: 'Todos'
          })
        };

        const onSave = async () => {
          try { 
            const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
              subject: todo.value.subject,
              completed: todo.value.completed
            });
            originalTodo.value = {...res.data};
            //52강 마지막에 값을 복사해서 넣는 건데 이거 왜 originalTodo를 새로운 값을 복사해서 넣는것만으로 값도 바뀌고 save버튼이 비활성화 되지? 
            // 그리고 저거 하면 새로운 주소값을 참조하게 되는건데 그럼 todo랑 originalTodo가 하나 더 생겨야하는거 아닌가??
            triggerToast('저장 완료!'); 
          } catch (error) {
            console.log(error);
            triggerToast('에러!', 'danger');
          }
        };

        const todoUpdated = computed(() => {
          return !_.isEqual(todo.value, originalTodo.value)
        });

        const triggerToast = (message, type = 'success') => {
          showToast.value = true;
          toastAlertType.value=type;
          toastMessage.value=message;
          setTimeout(() => {
            toastMessage.value='';
            showToast.value= false;
            toastAlertType.value='';
          }, 3000)
        };

        return {
          todo,
          loading,
          toggleTodoStatus,
          moveToTodoListPage,
          onSave,
          todoUpdated,
          showToast,
          triggerToast,
          toastMessage,
          toastAlertType,
          
        };
    }
}
</script>

<style>

</style>