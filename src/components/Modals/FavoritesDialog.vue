<script setup>
import { store } from "@/store";
import { watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  favoriteLists: Array,
  restaurantId: String,
});

const emit = defineEmits(["close", "add-to-favorites"]);

watch(
  () => props.isOpen,
  (newVal) => {
    store.setFavoritesModalOpen(newVal);
  },
);

const addRestaurantToList = (favoritesListId) => {
  try {
    emit("add-to-favorites", {
      restaurantId: props.restaurantId,
      listId: favoritesListId,
    });
    emit("close");
  } catch (error) {
    console.error(
      "An error occurred while adding the restaurant to the list:",
      error,
    );
  }
};
</script>

<template>
  <v-dialog v-model="store.favoritesModalOpen" max-width="500">
    <v-card>
      <v-card-title>Listes de favoris</v-card-title>

      <v-list>
        <v-list-item
          v-for="(item, i) in props.favoriteLists"
          :key="i"
          @click="addRestaurantToList(item.id)"
        >
          <template v-slot:prepend>
            <v-list-item-action start>
              <v-btn icon>
                <v-icon color="red" icon="mdi-heart-outline"></v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" color="primary" @click="emit('close')">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
