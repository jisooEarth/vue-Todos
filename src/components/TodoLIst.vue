<template>
    <div>    
        <div 
            v-for="(todo,index) in todos"
            :key="todo.id"
            class = "card mt-2"
        >
            <div 
                class="card-body p-2 d-flex align-items-center"
                @click="moveToPage(todo.id)"
                style="cursor: pointer"
            >
                <div class="flex-grow-1">
                    <input 
                        class="ms-2 me-2"
                        type="checkbox"
                        :checked="todo.completed"
                        @change="toggleTodo(index, $event)"
                        @click.stop
                        style="cursor: pointer"
                    >
                    <span 
                        :class="{ todo: todo.completed }"
                    >
                        {{ todo.subject }}
                    </span>
                </div>
                <div>  
                    <button 
                        class="btn btn-danger btn-sm"
                        @click.stop="openModal(todo.id)"
                        style="cursor: pointer"
                    >
                        Delete
                    </button>
                </div>            
            </div>
        </div>
    </div>
    <teleport to='#modal'>
        <Modal 
            v-if="showModal"
            @close="closeModal"
            @delete="deleteTodo"
        />
    </teleport>
    
</template>

// 엑스포트 디포트 안에 
// props: {
//     todos: {
//         type: Array,
//         required: true,
//     }
// }, == props: ['todos'],

<script>

import { useRouter } from 'vue-router';
import Modal from '@/components/DeleteModal.vue';
import { ref } from 'vue';

export default {
    components: {
        Modal
    },
    props: ['todos'],
    emits: ['toggle-todo', 'delete-todo'],

    setup(props, {emit}) {
        const todoDeleteId = ref(null);
        
        const showModal = ref(false);

        const openModal = (id) => {
            todoDeleteId.value=id;
            showModal.value = true;
        };

        const closeModal = () => {
            todoDeleteId.value=null;
            showModal.value = false;
        };

        const router = useRouter();

        const toggleTodo = (index, event) => {
            emit('toggle-todo', index, event.target.checked);        
         };

         const deleteTodo = () => {
             emit('delete-todo', todoDeleteId.value);
             showModal.value=false;
             todoDeleteId.value=null;
         };
        
        const moveToPage = (todoId) => {
            console.log(todoId);
            ///router.push('/todos/'+ todoId);
            router.push({
                name: 'Todo',
                params: {
                    id: todoId
                }
            });
        };

        return {
            toggleTodo,
            deleteTodo,
            moveToPage,
            showModal,
            openModal,
            closeModal,
        }

    }
    
}
</script>

<style>

</style>