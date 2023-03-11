<script src="./AsideMenu.js"></script>
<template>

   <aside  class="aside--menu">
    <div v-if="!mobile" class="asside--menu---logo"><img src="@/assets/img/Logo-verde.svg" alt="PrepPro" />   </div>
    <div v-if="mobile" class="asside--menu---user"> <UserAccount/></div>
   
    
    <ul class="asside--menu---navigation">

    
      
      <li class="menu--button toogle-menu" v-if="!smallMenu && !mobile" @click="onToggleMenu"><font-awesome-icon  class="menu--button---icon"  icon="fa-solid fa-ellipsis-vertical" /></li>
      <li class="menu--button toogle-menu" v-if="smallMenu && !mobile" @click="onToggleMenu"><font-awesome-icon  class="menu--button---icon" icon="fa-solid fa-bars" /></li>
      
     
      <RouterLink v-if="!mobile" @click.stop="closeMenu" class="menu--button" :to="{name:'dashboard-page'}"><font-awesome-icon class="menu--button---icon" icon="fa-solid fa-house"   /><p>Escritorio</p></RouterLink>
      <RouterLink @click.stop="closeMenu" class="menu--button" :to="{name:'projects-page'}"><font-awesome-icon class="menu--button---icon" icon="fa-solid fa-diagram-project"  /><p>Proyectos</p></RouterLink>
      <RouterLink v-if="!mobile" @click.stop="closeMenu" class="menu--button" :to="{name:'products-page'}"><font-awesome-icon class="menu--button---icon" icon="fa-solid fa-list-ul"  /><p>Productos</p></RouterLink>
      <RouterLink v-if="!mobile" @click.stop="closeMenu" class="menu--button" :to="'dashboard-page'"><font-awesome-icon class="menu--button---icon" icon="fa-solid fa-chart-line" /><p>Estadisticas</p></RouterLink>
     
      <li class="menu--button toogle-screen" v-if="mobile" @click="onToggleScreen"><font-awesome-icon  class="menu--button---icon" v-if="!fullScreen" icon="fa-solid fa-expand" /><font-awesome-icon class="menu--button---icon"  v-if="fullScreen" icon="fa-solid fa-compress" /><p v-if="!fullScreen">Pantalla completa</p><p v-if="fullScreen">Pantalla reducida</p></li>
      <li class="menu--button toogle-mode" @click="onChangeMode" ><ToggleThemeMode/><p v-if="darkMode">Modo oscuro</p><p v-if="!darkMode">Modo claro</p></li>
    </ul>
   
    <ul class="asside--menu---settings">
      
      <RouterLink @click.stop="closeMenu" class="menu--button" :to="{name:'profile-page'}"><font-awesome-icon class="menu--button---icon" icon="fa-solid fa-gear"  /><p>Cuenta</p></RouterLink>
      <RouterLink @click.stop="closeMenu" class="menu--button" :to="'/'"><font-awesome-icon class="menu--button---icon" icon="fa-solid fa-circle-question"  /><p>Ayuda</p></RouterLink>
     
      <li class="menu--button" @click="logOut"><font-awesome-icon class="menu--button---icon" icon="fa-solid fa-arrow-right-from-bracket"  /><p>Salir</p></li>   
       
      
    </ul>
    
    <p class="version">V:{{ version }}</p>
   </aside>
  
</template>



<style lang="scss" scoped>
@import "./menu.scss";
</style>