<template>
  <h1>Create Page</h1>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import {ref, computed } from 'vue';
import _ from 'lodash';
// import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';

export default {
  components: {
    // Toast,
  },
  setup() {
        const route = useRoute();
        const router = useRouter();
        const todo = ref(null);
        const originalTodo = ref(null);
        const loading = ref(true);
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

        const {
          showToast,
          toastMessage,
          toastAlertType,
          triggerToast,
        } = useToast();

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