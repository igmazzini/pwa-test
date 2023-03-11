<template>
  <div class="pay-data-message">
    <p>{{message}}</p>
  </div>
</template>

<script>
export default {
    name:'PayDataMessage',
    props:{
        message:{
            type:String,
            default:'Pay data message'
        }
    }

}
</script>

<style lang="scss" scoped>
.pay-data-message{
    width: 100%;
    height: 170px;
    background-color: var(--background-grey);
    color: var(--light-text-color);
    font-family: RobotoLight;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    font-size: 1.2em;

    p{
        margin: 0;
        padding: 0;
    }
}
</style>