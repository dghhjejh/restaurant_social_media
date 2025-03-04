<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  priceRanges: {
    type: Array,
    required: true,
  },
  specialities: {
    type: Array,
    required: true,
  },
  search: String,
  selectedPrice: Object,
  selectedSpeciality: Array,
});

const emit = defineEmits([
  "update:search",
  "update:selectedPrice",
  "update:selectedSpeciality",
]);

const localSearch = ref(props.search);
const localSelectedPrice = ref(props.selectedPrice);
const localSelectedSpeciality = ref(
  Array.isArray(props.selectedSpeciality) ? props.selectedSpeciality : [],
);

watch(localSearch, (newSearch) => {
  emit("update:search", newSearch);
});

watch(localSelectedPrice, (newPrice) => {
  emitSelectedPrice(newPrice);
});

watch(localSelectedSpeciality, (newSpeciality) => {
  emitSelectedSpeciality(newSpeciality);
});

const clearSearch = () => {
  localSearch.value = "";
};

const emitSelectedPrice = (price) => {
  emit("update:selectedPrice", price);
};

const emitSelectedSpeciality = (speciality) => {
  emit("update:selectedSpeciality", speciality);
};
</script>

<template>
  <v-row class="mb-4 justify-center">
    <v-col cols="11" md="6">
      <v-text-field
        v-model="localSearch"
        label="Rechercher un restaurant"
        prepend-inner-icon="mdi-magnify"
        clearable
        @click:clear="clearSearch"
      />
    </v-col>

    <v-col cols="11" md="3">
      <v-select
        v-model="localSelectedPrice"
        @change="emitSelectedPrice"
        :items="priceRanges"
        item-title="label"
        item-text="label"
        item-value="value"
        label="Filtrer par prix"
        prepend-inner-icon="mdi-currency-usd"
        clearable
        @click:clear="emitSelectedPrice(null)"
      >
        <template #prepend-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Tous les prix</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
    </v-col>

    <v-col cols="11" md="3">
      <v-select
        v-model="localSelectedSpeciality"
        @change="emitSelectedSpeciality"
        :items="specialities"
        multiple
        prepend-inner-icon="mdi-chef-hat"
        label="Filtrer par spécialité"
        clearable
        @click:clear="emitSelectedSpeciality([])"
      >
        <template #prepend-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Toutes les spécialités</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
    </v-col>
  </v-row>
</template>

<style scoped></style>
