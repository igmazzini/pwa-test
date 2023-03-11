<template>
  <div class="search-bar">
    <font-awesome-icon class="search-bar--icon" icon="fa-solid fa-magnifying-glass" />
    <input class="search-bar--input" type="text">
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.search-bar{
    background-color: var(--background-grey);
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 1rem;
    border-radius: 100px;
    padding-left: 15px;
    transition: all var(--animation-duration) var(--animation-type);
    color: inherit;


   
}

.search-bar--input{
    background-color: transparent;
    width: 90%;
    height: 50px;   
    padding-left: 10px;
    font-family: RobotoLight;
    font-size: 1.5em;
    color: inherit;
}

.search-bar--input,
.search-bar--input:hover,
.search-bar--input:focus,
.search-bar--input:focus-visible{
    border: none;
    outline: none;

}
.search-bar--icon{

    font-size: 1.6em;
   
}

.dark .search-bar{
    background-color: var(--dark-background-color);
    border: 1px solid white;
}


@media screen and (max-height:750px) {
    .search-bar{
     
       height: 45px;
        
        
    }

    .search-bar--input{
       
        height: 40px; 
    }
  
}

</style>