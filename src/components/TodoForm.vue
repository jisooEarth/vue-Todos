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
</template>

<script>
export default {

}
</script>

<style>

</style>