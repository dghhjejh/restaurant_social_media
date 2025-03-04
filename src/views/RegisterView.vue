<script setup>
import { useAuthService } from "@/composables/useAuthService";
import { ref } from "vue";
import { useRouter } from "vue-router";

const visible = ref(false);
const signupForm = ref();
const name = ref("");
const email = ref("");
const password = ref("");

const emailError = ref("");
const emailTouched = ref(false);
const passwordTouched = ref(false);
const passwordCriteria = ref({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  specialChar: false,
});
const passwordValid = ref(false);

const { signup } = useAuthService();
const router = useRouter();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = () => {
  if (!emailRegex.test(email.value)) {
    emailError.value = "Adresse e-mail invalide.";
    return false;
  }
  emailError.value = "";
  return true;
};
const required = (value) => !!value || "Ce champ est requis.";

const updatePasswordCriteria = () => {
  const pwd = password.value;
  passwordCriteria.value.length = pwd.length >= 12;
  passwordCriteria.value.uppercase = /[A-Z]/.test(pwd);
  passwordCriteria.value.lowercase = /[a-z]/.test(pwd);
  passwordCriteria.value.number = /\d/.test(pwd);
  passwordCriteria.value.specialChar =
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?€]/.test(pwd);

  passwordValid.value = Object.values(passwordCriteria.value).every(
    (criterion) => criterion,
  );

  if (passwordValid.value) {
    passwordCriteria.value = {};
  }
};

const handleSignup = async () => {
  const isEmailValid = validateEmail();
  updatePasswordCriteria();

  if (!isEmailValid || !passwordValid.value || !name.value) {
    return;
  }

  try {
    await signup(name.value, email.value, password.value);
    router.push({ name: "Login" });
  } catch (error) {
    if (error.message.includes("Un compte existe déjà")) {
      emailError.value = error.message;
    } else {
      console.error("Erreur d'inscription :", error.message);
    }
  }
};

const getPasswordCriterionMessage = (criterion) => {
  switch (criterion) {
    case "length":
      return "Au moins 12 caractères";
    case "uppercase":
      return "Une majuscule";
    case "lowercase":
      return "Une minuscule";
    case "number":
      return "Un chiffre";
    case "specialChar":
      return "Un caractère spécial";
    default:
      return "";
  }
};
</script>

<template>
  <v-form ref="signupForm" @submit.prevent="handleSignup">
    <v-card
      class="mx-auto my-12 pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Nom</div>
      <v-text-field
        v-model="name"
        density="compact"
        placeholder="Entrez votre nom"
        prepend-inner-icon="mdi-account-outline"
        variant="outlined"
        :rules="[required]"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis">Courriel</div>
      <v-text-field
        v-model="email"
        density="compact"
        placeholder="Entrez votre courriel"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        :error="emailTouched && !!emailError"
        :error-messages="emailTouched && emailError ? [emailError] : []"
        @input="
          emailTouched = true;
          validateEmail();
        "
      ></v-text-field>

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        Mot de passe
      </div>
      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        placeholder="Entrez votre mot de passe"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :error="passwordTouched && !passwordValid"
        @input="
          passwordTouched = true;
          updatePasswordCriteria();
        "
        @click:append-inner="visible = !visible"
      ></v-text-field>

      <div
        class="password-criteria mt-4"
        v-if="passwordTouched && !passwordValid"
      >
        <div
          v-for="(valid, criterion) in passwordCriteria"
          :key="criterion"
          class="d-flex align-center"
        >
          <v-icon :color="valid ? 'green' : 'red'" size="small">
            {{
              valid ? "mdi-check-circle-outline" : "mdi-alert-circle-outline"
            }}
          </v-icon>
          <span :class="{ valid: valid, invalid: !valid }">
            {{ getPasswordCriterionMessage(criterion) }}
          </span>
        </div>
      </div>

      <v-btn
        type="submit"
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        block
        >S'inscrire</v-btn
      >

      <v-card-text class="text-center">
        <v-btn
          @click="$router.push({ name: 'Login' })"
          class="text-blue text-decoration-none"
        >
          Déjà un compte ? Connectez-vous
          <v-icon icon="mdi-chevron-right"></v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<style scoped>
.password-criteria {
  font-size: 0.875rem;
}
.password-criteria .valid {
  color: green;
}
.password-criteria .invalid {
  color: red;
}
</style>
