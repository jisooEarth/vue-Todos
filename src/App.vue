<template>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <router-link class="navbar-brand" :to=" { name: 'Home' } ">
        Jisoo's Todo List!
    </router-link>
    
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" :to=" { name: 'Todos'} ">
                Todos
            </router-link>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    
  </div>
</nav>
<router-view/>
</template>


<script>
export default {
}
</script>

<style>

</style>
