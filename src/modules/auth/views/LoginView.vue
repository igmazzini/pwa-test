<template>
  <section class="login">
    <div class="card login-card">
      <img src="@/assets/img/Logo-blanco.svg" class="login-img" alt="PrepPro" />

      <div class="login-buttons">
        <button v-show="!logged" @click="onLoginWithGoogle" class="btn btn-light login-button">
          <!--  <Google class="login-button--icon" /> -->
          <font-awesome-icon icon="fa-brands fa-google" />
          <p>{{ lblSubmit }}</p>
        </button>
        <span v-if="loginError?.length > 0" class="login-error">{{
          loginError
        }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { useUI } from '@/modules/shared/composables';
import { onMounted, ref, } from "vue";



export default {
  name: "Login",

  setup() {

    const router = useRouter();
    const { loginWithGoogle, authStatus } = useAuth();
    const { mobile, showLoading } = useUI();
    const logged = ref(false);
    const loginError = ref("");


    const onFinishMutation = async (result) => {

      if (result) {

        logged.value = true;


        console.log('REDIRECT')

        redirect();

        showLoading(false);

      } else {

        logged.value = false;
        loginError.value = 'Falló la autenticación';
      }

    }

    const onLoginWithGoogle = async () => {

      loginWithGoogle(onFinishMutation);


    };

    onMounted(() => {

      if (authStatus.value == "authenticated") {
        redirect();
      }

    });

    const redirect = () => {
      if (mobile.value) {
        router.push({ name: "projects-page" });
      } else {
        router.push({ name: "dashboard-page" });
      }
    };

    return {

      router,
      logged,
      lblUserName: "Nombre de usuario",
      lblPassword: "Contraseña",
      lblSubmit: "Ingresar con Google",
      loginError,
      onLoginWithGoogle,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/css/login.scss";
</style>