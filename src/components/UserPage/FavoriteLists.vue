<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import favoriteService from "@/api/favoriteService";
import { store } from "@/store";
import { useStore } from "vuex";

const userStore = useStore();
const props = defineProps(["allRestaurantNames"]);
const router = useRouter();
const newListForm = ref();
const newListName = ref("");
const selectedRestaurant = ref(null);
const currentUser = computed(() => userStore.getters.getCurrentUser);

const nameRequiredRule = (v) => !!v || "Veuillez entrer un nom pour la liste";

const viewRestaurantDetails = (restaurantId) => {
  router.push(`/restaurant/${restaurantId}`);
};

const startEdit = (list) => {
  list.isEditing = true;
  list.newName = list.name;
};

const cancelEdit = (list) => {
  list.isEditing = false;
  list.newName = "";
};

const saveListName = async (list) => {
  if (!list.newName.trim()) {
    list.isEditing = false;
    return;
  }
  const isDuplicate = store.currentUserFavorites.some(
    (favorite) =>
      favorite.name.toLowerCase() === list.newName.trim().toLowerCase() &&
      favorite.id !== list.id,
  );

  if (isDuplicate) {
    console.warn("Une liste avec ce nom existe déjà.");
    alert(
      "Une liste avec ce nom existe déjà. Veuillez choisir un nom différent.",
    );
    return;
  }

  try {
    await favoriteService.updateFavoriteList(list.id, list.newName);
    list.name = list.newName;
    list.isEditing = false;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du nom de la liste :", error);
  }
};

const postFavoriteList = async () => {
  if (!newListName.value.trim()) {
    alert("Veuillez entrer un nom valide");
    return;
  }
  const isDuplicate = store.currentUserFavorites.some(
    (list) =>
      list.name.toLowerCase() === newListName.value.trim().toLowerCase(),
  );
  if (isDuplicate) {
    console.error("Une liste avec ce nom existe déjà.");
    alert(
      "Veuillez choisir un nom différent. Une liste avec ce nom existe déjà.",
    );
    return;
  }
  const isValid = await newListForm.value.validate();
  if (!isValid) {
    console.warn("Form validation failed.");
    return;
  }
  try {
    let tempUserFavorites = store.currentUserFavorites;
    const response = await favoriteService.createFavoriteList(
      newListName.value,
      currentUser.value.email,
    );

    tempUserFavorites.push(response);

    store.setCurrentUserFavorites(tempUserFavorites);
    newListName.value = "";
    newListForm.value.resetValidation();
  } catch (error) {
    console.error("Erreur lors de la création de la liste de favoris :", error);
  }
};

const deleteFavoriteList = async (listId) => {
  try {
    await favoriteService.deleteFavoriteList(listId);

    let tempUserFavorites = store.currentUserFavorites.filter(
      (list) => list.id !== listId,
    );

    store.setCurrentUserFavorites(tempUserFavorites);
  } catch (error) {
    console.error("Error deleting favorite list:", error);
  }
};

const addSelectedRestaurantToList = async (favoriteId) => {
  if (!selectedRestaurant.value || !favoriteId) {
    alert("Veuillez selectionner un restaurant de la liste");
    return;
  }
  const favoriteList = store.currentUserFavorites.find(
    (list) => list.id === favoriteId,
  );
  if (!favoriteList) {
    console.error("Liste de favoris non trouvée");
    return;
  }
  const restaurantExists = favoriteList.restaurants.some(
    (restaurant) => restaurant.id === selectedRestaurant.value,
  );

  if (restaurantExists) {
    alert("Le restaurant est déjà dans la liste des favoris.");
    return;
  }

  try {
    const updatedFavoriteList =
      await favoriteService.addRestaurantToFavoriteList(
        favoriteId,
        selectedRestaurant.value,
      );
    let tempUserFavorites = store.currentUserFavorites;
    tempUserFavorites.forEach((list, index) => {
      if (list.id === updatedFavoriteList.id) {
        tempUserFavorites[index] = updatedFavoriteList;
      }
    });
    store.setCurrentUserFavorites(tempUserFavorites);
    selectedRestaurant.value = null;
  } catch (error) {
    console.error("Erreur lors de l'ajout du restaurant à la liste :", error);
  }
};

const removeRestaurantFromList = async (favoriteId, restaurantId) => {
  try {
    const updatedFavoriteList =
      await favoriteService.removeRestaurantFromFavoriteList(
        favoriteId,
        restaurantId,
      );
    let tempUserFavorites = store.currentUserFavorites;
    tempUserFavorites.forEach((list, index) => {
      if (list.id === updatedFavoriteList.id) {
        tempUserFavorites[index] = updatedFavoriteList;
      }
    });
    store.setCurrentUserFavorites(tempUserFavorites);
    selectedRestaurant.value = null;
  } catch (error) {
    console.error("Error removing restaurant from list:", error);
  }
};
</script>

<template>
  <v-card>
    <v-card-title>Mes listes de restaurants favoris</v-card-title>
    <v-divider></v-divider>
    <v-card-item>
      <v-form @submit.prevent="postFavoriteList" ref="newListForm">
        <v-row>
          <v-col cols="4">
            <v-text-field
              density="compact"
              v-model="newListName"
              label="Nom de la nouvelle liste de favoris *"
              maxlength="50"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn color="primary" type="submit">Créer la liste</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-item>
    <v-card-item>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="(favoriteList, index) in store.currentUserFavorites"
          :key="index"
        >
          <v-expansion-panel-title>
            <div
              class="d-flex align-center justify-space-between"
              style="width: 100%"
            >
              <span v-if="!favoriteList.isEditing" class="favorite-list-name">{{
                favoriteList.name
              }}</span>
              <v-text-field
                v-else
                v-model="favoriteList.newName"
                label="Renommer la liste"
                dense
                :rules="[nameRequiredRule]"
                maxlength="50"
                required
                hide-details
                style="max-width: 200px"
                @click.stop
              ></v-text-field>

              <div class="d-flex align-center">
                <template v-if="favoriteList.isEditing">
                  <v-btn
                    class="mr-2"
                    icon
                    @click.stop="saveListName(favoriteList)"
                  >
                    <v-icon :disabled="!favoriteList.newName.trim()"
                      >mdi-check</v-icon
                    >
                  </v-btn>
                  <v-btn
                    class="mr-4"
                    icon
                    @click.stop="cancelEdit(favoriteList)"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>

                <template v-else>
                  <v-btn
                    class="mr-2"
                    icon
                    @click.stop="startEdit(favoriteList)"
                    color="white"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn
                    class="mr-4"
                    icon
                    @click.stop="deleteFavoriteList(favoriteList.id)"
                    color="black"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </div>
            </div>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <v-list>
              <v-list-item
                v-for="(restaurant, subIndex) in favoriteList.restaurants"
                :key="subIndex"
              >
                <div
                  class="d-flex justify-space-between align-center listRestaurant"
                >
                  <div class="restaurant-info">
                    <div style="display: flex; align-items: center">
                      <strong> {{ restaurant.name }} </strong>
                      <v-rating
                        half-increments
                        readonly
                        :length="5"
                        :size="32"
                        :model-value="restaurant.rating"
                        active-color="primary"
                        color="grey-lighten-2"
                        style="margin-left: 8px; vertical-align: middle"
                      />
                    </div>
                  </div>
                  <div class="d-flex">
                    <v-btn
                      class="mr-2"
                      icon
                      @click="viewRestaurantDetails(restaurant.id)"
                      color="info"
                    >
                      <v-icon
                        @click="router.push(`/restaurant/${restaurant.id}`)"
                        >mdi-eye</v-icon
                      >
                    </v-btn>
                    <v-btn
                      icon
                      @click="
                        removeRestaurantFromList(favoriteList.id, restaurant.id)
                      "
                      color="error"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-list-item>
            </v-list>
            <v-select
              v-model="selectedRestaurant"
              :items="props.allRestaurantNames"
              item-title="name"
              item-value="id"
              label="Select"
            ></v-select>
            <v-btn
              color="primary"
              @click="addSelectedRestaurantToList(favoriteList.id)"
            >
              <v-icon>mdi-plus</v-icon>
              Ajouter
            </v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.listRestaurant {
  width: 100%;
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.favorite-list-name {
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: bold;
}
</style>
