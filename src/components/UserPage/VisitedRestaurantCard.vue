<script setup>
import { ref } from "vue";
import { defineProps, computed } from "vue";
import visitService from "@/api/visitService";
import { store } from "@/store";
import { useStore } from "vuex";

const props = defineProps({
  name: String,
  rating: Number,
  visits: Number,
  restaurant_id: String,
});

const userStore = useStore();
const showVisitDetails = ref(false);
const visitDetails = ref([]);
const currentUser = computed(() => userStore.getters.getCurrentUser);

const fetchVisitDetails = async () => {
  try {
    const response = await visitService.getVisitsForRestaurant(
      currentUser.value.id,
      props.restaurant_id,
    );
    visitDetails.value = response;
  } catch (error) {
    console.error("Error fetching visit details:", error);
  }
};

function toggleVisitDetails() {
  showVisitDetails.value = !showVisitDetails.value;
  if (showVisitDetails.value && visitDetails.value.length === 0) {
    fetchVisitDetails();
  }
}

const formatTime = (visitDataDate) => {
  let hours = visitDataDate.getHours();
  let minutes = visitDataDate.getMinutes();

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;

  return hours + ":" + minutes;
};

function openReadOnlyVisitModal(visitData) {
  visitData.time = formatTime(new Date(visitData.date));
  store.setVisitModalOpen(true);
  store.setReadOnlyVisitModal(true);
  store.setVisitModalContent({
    comment: visitData.comment,
    rating: visitData.rating,
    selectedDate: new Date(visitData.date),
    selectedTime: visitData.time,
  });
}
</script>

<template>
  <v-card>
    <v-card-title>{{ name }}</v-card-title>
    <v-card-subtitle>Score: {{ rating }}</v-card-subtitle>
    <v-card-text>Nombre de visites: {{ visits }}</v-card-text>
    <v-card-actions>
      <v-btn icon @click="toggleVisitDetails">
        <v-icon>{{
          showVisitDetails ? "mdi-chevron-up" : "mdi-chevron-down"
        }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-if="showVisitDetails" class="visit-details">
        <v-list>
          <v-list-item
            v-for="(visit, index) in visitDetails"
            :key="index"
            @click="openReadOnlyVisitModal(visit)"
          >
            <v-list-item-content>
              <v-list-item-title>Date: {{ visit.date }}</v-list-item-title>
              <v-list-item-subtitle
                >Comment: {{ visit.comment }}</v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Rating: {{ visit.rating }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.visit-details {
  padding: 10px;
  border-top: 1px solid #e0e0e0;
}
</style>
