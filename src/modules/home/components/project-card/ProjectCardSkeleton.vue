<template>
    <div class="projects-list--card">
        
        <div class="projects-list--card---name">
            <AnimatedPlaceholder :width="'50px'" :height="'50px'" :border-radius="'50px'"/>
            <div>
                <p><AnimatedPlaceholder :width="'150px'" :height="'8px'" :border-radius="'5px'"/></p>
                <p class="project-status"><AnimatedPlaceholder :width="'150px'" :height="'8px'" :border-radius="'5px'"/></p>
                <p class="project-status"><AnimatedPlaceholder :width="'150px'" :height="'8px'" :border-radius="'5px'"/></p>
            </div>
           
            <font-awesome-icon class="marker" icon="fa-solid fa-bookmark" />
        </div>
        <div class="projects-list--card---info">
            <div class="projects-list--card---info----date">
                <p>Inicio</p>
                <p><AnimatedPlaceholder :width="'80px'" :height="'15px'" :border-radius="'5px'"/></p>
               
            </div>
            <div class="projects-list--card---info----date">
                <p>Fin</p>
                <p><AnimatedPlaceholder :width="'80px'" :height="'15px'" :border-radius="'5px'"/></p>
            </div>
            <div class="projects-list--card---info----days">
                <p>Dias de rodaje</p>
                <p><AnimatedPlaceholder :width="'80px'" :height="'15px'" :border-radius="'5px'"/></p>
            </div>
        </div>

    </div>
</template>

<script setup>
import {AnimatedPlaceholder} from '@/modules/shared/components'
</script>

<style lang="scss" scoped>
@import "./project-card.scss";


</style>