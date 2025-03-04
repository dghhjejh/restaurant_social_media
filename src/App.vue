<script setup>
import NavBar from "@/components/NavBar/NavBar.vue";
import RestaurantVisitModal from "@/components/Modals/RestaurantVisitModal";
import SuspenseSpinner from "./components/SuspenseSpinner.vue";
import { store } from "@/store";
import FavoritesDialog from "@/components/Modals/FavoritesDialog.vue";
</script>

<template>
  <Suspense>
    <template #default>
      <v-layout>
        <NavBar />
        <RestaurantVisitModal />
        <FavoritesDialog
          :isOpen="store.isFavoriteDialogOpen"
          :favoriteLists="store.favoriteLists"
          :restaurantId="store.currentAddingVisitRestaurantId"
          @close="store.setFavoritesModalOpen(false)"
          @add-to-favorites="store.handleAddToFavorites"
        />

        <v-main>
          <v-container fluid>
            <router-view :key="$route.fullPath"></router-view>
          </v-container>
        </v-main>
      </v-layout>
    </template>

    <template #fallback>
      <v-layout>
        <SuspenseSpinner />
      </v-layout>
    </template>
  </Suspense>
</template>
