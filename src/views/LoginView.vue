<script setup>
import { useAuthService } from "@/composables/useAuthService";
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const visible = ref(false);
const loginForm = ref();
const email = ref("");
const password = ref("");
const accountExists = computed(() => store.getters.getAccountExists);

const emailRules = [(v) => !!v || "Un courriel doit être entré."];

const passwordRules = [(v) => !!v || "Un mot de passe doit être entré."];

const { login } = useAuthService();

const postLogin = async () => {
  try {
    const isFormValid = await loginForm.value
      .validate()
      .then((formValidity) => {
        return formValidity.valid;
      });

    if (isFormValid) {
      login(email.value, password.value);
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
  }
};

const verify = () => {
  store.dispatch("setAccountExists", true);
};
</script>

<template>
  <v-form ref="loginForm" @submit.prevent="postLogin">
    <v-card
      class="mx-auto my-12 pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Courriel</div>

      <v-text-field
        v-model="email"
        :rules="emailRules"
        @update:model-value="verify"
        density="compact"
        placeholder="Courriel"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Mot de passe
      </div>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        @update:model-value="verify"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Entrez votre mot de passe"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <v-card v-if="!accountExists" class="mb-4" color="error" variant="tonal">
        <v-card-text class="text-medium-emphasis text-caption">
          Erreur: La combinaison (courriel et de mot de passe) est éronnée!
        </v-card-text>
      </v-card>

      <v-btn
        type="submit"
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
      >
        Se connecter
      </v-btn>

      <v-card-text class="text-center">
        <v-btn class="text-blue text-decoration-none" to="/register">
          S'inscrire <v-icon icon="mdi-chevron-right"></v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<style></style>
