<script setup>
import { computed, ref } from "vue";
import { store } from "@/store";
import * as momentUtils from "@/utils/momentUtils";
import VisitService from "@/api/visitService";
import { useStore } from "vuex";

const userStore = useStore();
const visitForm = ref();
const currentUser = computed(() => userStore.getters.getCurrentUser);
const timePickerIsOpen = ref(false);

const ratingRules = [
  (v) => !!v || "Une note doit être donnée.",
  (v) =>
    v <= 5 ||
    v >= 0 ||
    "La note ne peut pas être plus basse que 0 ou plus haute que 5.",
];

const dateRules = [(v) => !!v || "Une date doit être spécifiée."];

const timeRules = [(v) => !!v || "Une heure doit être spécifiée."];

const formatDateTime = () => {
  let selectedDate = store.visitModalContent.selectedDate;
  let time = store.visitModalContent.selectedTime;

  selectedDate.setHours(time.split(":")[0]);
  selectedDate.setMinutes(time.split(":")[1]);
};

const postVisit = async () => {
  try {
    const isFormValid = await visitForm.value
      .validate()
      .then((formValidity) => {
        return formValidity.valid;
      });

    if (isFormValid) {
      formatDateTime();

      const visitData = {
        restaurant_id: store.currentAddingVisitRestaurantId,
        comment: store.visitModalContent.comment,
        rating: store.visitModalContent.rating,
        date: momentUtils.formatDateForAPIPost(
          store.visitModalContent.selectedDate,
        ),
      };

      await VisitService.createVisit(currentUser.value.id, visitData).then(
        (response) => {
          store.handleVisitSubmittedFunction(response.data);
          closeVisitModal();
        },
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la visite :", error);
  }
};

const closeVisitModal = () => {
  store.setCurrentAddingVisitRestaurantId("");
  store.setCurrentAddingVisitRestaurantVisits([]);
  store.setReadOnlyVisitModal(false);
  store.setVisitModalContent({
    comment: "",
    rating: 0,
    selectedDate: null,
  });
  store.setVisitModalOpen(false);
};
</script>

<template>
  <v-dialog
    v-model="store.visitModalOpen"
    max-width="500"
    @click:outside="closeVisitModal"
  >
    <v-card>
      <v-form ref="visitForm" @submit.prevent="postVisit">
        <v-card-title>Votre visite</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-4">
          <v-row class="d-flex align-center justify-center flex-column">
            Note donnée
            <v-input
              :disabled="store.readOnlyVisitModal"
              v-model="store.visitModalContent.rating"
              :rules="ratingRules"
            >
              <v-rating
                half-increments
                hover
                :length="5"
                :size="30"
                v-model="store.visitModalContent.rating"
                active-color="warning"
              />
            </v-input>
          </v-row>
          <v-row dense>
            <v-col class="mt-4">
              <v-date-input
                :allowed-dates="(date) => new Date() >= date"
                :disabled="store.readOnlyVisitModal"
                v-model="store.visitModalContent.selectedDate"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                label=" Date de la visite"
                :rules="dateRules"
                clearable
              ></v-date-input>
            </v-col>
            <v-col class="mt-4">
              <v-text-field
                :disabled="store.readOnlyVisitModal"
                v-model="store.visitModalContent.selectedTime"
                :active="timePickerIsOpen"
                label="Heure de la visite"
                prepend-icon=""
                prepend-inner-icon="mdi-clock-time-four-outline"
                readonly
                clearable
                :rules="timeRules"
              >
                <v-menu
                  v-model="timePickerIsOpen"
                  :close-on-content-click="false"
                  activator="parent"
                  transition="scale-transition"
                >
                  <v-time-picker
                    v-if="timePickerIsOpen"
                    format="24hr"
                    v-model="store.visitModalContent.selectedTime"
                    full-width
                  ></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col>
              <v-textarea
                :disabled="store.readOnlyVisitModal"
                v-model="store.visitModalContent.comment"
                label="Commentaire"
                clearable
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <template v-if="!store.readOnlyVisitModal">
            <v-btn variant="text" @click="closeVisitModal">Annuler</v-btn>
            <v-btn type="submit" variant="tonal">Soumettre</v-btn>
          </template>
          <template v-else>
            <v-btn variant="text" @click="closeVisitModal">Fermer</v-btn>
          </template>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
