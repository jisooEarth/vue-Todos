<template>
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
                        <!-- <button 
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
                        </button>             -->
                        <div 
                            v-if="subjectError"
                            class="text-red"
                        >
                            {{ subjectError }}
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="editing" class="col-6">
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
             <div class="col-12">
                <div class="form-group">
                    <label>Body</label>
                    <textarea v-model="todo.body" class="form-control" id="" cols="30" rows="10"></textarea>
                </div>
            </div>
            <div>
                <button 
                type = "submit" 
                class="btn btn-primary"
                :disabled="!todoUpdated"
                >
                {{ editing ? 'Update' : 'Create'}}
                </button>
                <button
                class="btn btn-outline-dark ms-2"
                @click="moveToTodoListPage"
                >
                Cancle
                </button>  
            </div>        
        </div> 
    </form>
    <transition name="fade">
        <Toast
            v-if="showToast"
            :message="toastMessage"
            :type="toastAlertType"
        >
        </Toast>
    </transition>
</template>

<script>
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios'
import { ref, computed } from '@vue/reactivity'
import _ from 'lodash'
import Toast from '@/components/Toast.vue'
import {useToast} from '@/composables/toast'
export default {
    components: {
      Toast
    },
    props: {
        editing: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const todo = ref({
            subject: '',
            completed: false,
            body: '',
        })
        const subjectError = ref('');
        const originalTodo = ref(null)
        const loading = ref(false)
        const router = useRouter();
        const route = useRoute();
        const todoId = route.params.id;
        
        
        // const showToast = ref(false)
        // const toastMessage = ref('');
        // const toastAlert = ref('');
        // const tiemout = ref(null)
        // const triggerToast = (message, type = 'success') => {
        //   showToast.value = true;
        //   toastAlert.value = type
        //   toastMessage.value = message;
        //   tiemout.value = setTimeout(() => {
        //     toastMessage.value = '';
        //     toastAlert.value = ''
        //     showToast.value = false;
        //   }, 3000)
        // }
        const {        
            toastMessage,
            toastAlert,
            showToast,
            triggerToast,
        } = useToast();
        const todoUpdated =  computed(() => {
          return !_.isEqual(todo.value, originalTodo.value)
        })
        const getTodo = async () => {
            loading.value = true;
          try {
            const res = await axios.get(`http://localhost:3000/todos/${todoId}`)
            console.log(res)
            todo.value = {...res.data}
            originalTodo.value = {...res.data}
            loading.value = false;
            
          } catch (error) {
            loading.value = false;
            console.log(error)
              triggerToast('Something went wrong!', 'danger');
          }
        }
        if (props.editing) {
            getTodo();
        }
        const toggleTodoStatus = () => {
          todo.value.completed = !todo.value.completed;
        }
        const onSave = async () => {
            subjectError.value = ''
            if (!todo.value.subject) {
                subjectError.value = 'Subject is required'
                return;
            }
            try {
                let res;
                const data = {
                        subject: todo.value.subject,
                        completed: todo.value.completed,
                        body: todo.value.body
                }
                if (props.editing) {
                    res = await axios.put(`http://localhost:3000/todos/${todoId}`, data)
                    originalTodo.value = {...res.data}
                } else {
                    res = await axios.post(`http://localhost:3000/todos`, data)
                    todo.value.subject = '';
                    todo.value.body = '';
                }
            const toastMessage = props.editing ? '수정' : '저장' + '이 완료되었습니다.'//수정이 가능함??? 저장하고 나면 바로 사라지자나??
            //message를 toastMessage로 트리거토스트랑 변경했는데, 꼭 msessage로 써야하나? 나는 왜 똑같지 결과가??
             
            triggerToast(toastMessage);
          } catch (error) {
            console.log(error)
            triggerToast('Something went wrong!', 'danger');
          }
                  }
        const moveToTodoListPage = () => {
          router.push({
            name: 'Todos'
          })
        }
        
        return {
            todo,
            loading,
            onSave,
            toggleTodoStatus,
            moveToTodoListPage,
            todoUpdated,
            showToast,
            toastMessage,
            toastAlert,
            subjectError,
        }
    }
}
</script>

<style>
    .text-red {
        color: red;
    }
    .fade-enter-active,
    .fade-leave-active{
        transition: all 0.5s ease;
    }
    
    .fade-enter-from,
    .fade-leave-to{
        opacity: 0;
        transform: translateY(-30px);
    }
    .fade-enter-to,
    .fade-leave-from{
        opacity: 1;
        transform: translateY(0px);
    }
</style>