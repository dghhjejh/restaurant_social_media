<script setup>
import { useProfile } from "@/composables/useProfile";
import FavoriteLists from "@/components/UserPage/FavoriteLists.vue";
import VisitedRestaurantCard from "@/components/UserPage/VisitedRestaurantCard.vue";
import FollowedUsersTable from "@/components/UserPage/FollowedUsersTable.vue";
import FollowersTable from "@/components/UserPage/FollowersTable.vue";
import { useStore } from "vuex";

const userStore = useStore();
const { currentUser, userRecentVisits, allRestaurantNames } =
  await useProfile(userStore);
</script>

<template>
  <div v-if="currentUser">
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <h4 class="text-left">Nom:</h4>
          <v-card>
            <span class="name">{{ currentUser.name }}</span>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <h4 class="text-left">Courriel:</h4>
          <v-card>
            <span class="email">{{ currentUser.email }}</span>
          </v-card>
        </v-col>
        <v-col cols="12" md="1">
          <h4 class="text-left">Score:</h4>
          <span class="text-left">
            {{ currentUser.rating }}
            <v-icon color="amber" class="ms-2">mdi-star-shooting</v-icon>
          </span>
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" md="12">
          <h3 class="text-left">Restaurants visités récemment:</h3>
        </v-col>
      </v-row>
      <v-row>
        <template v-if="userRecentVisits.length === 0">
          <v-col cols="12">
            <v-btn color="primary" to="/">Accueil</v-btn>
          </v-col>
        </template>

        <template v-else>
          <v-col
            cols="12"
            md="3"
            v-for="restaurant in userRecentVisits"
            :key="restaurant.restaurant_id"
          >
            <VisitedRestaurantCard
              :name="restaurant.name"
              :rating="restaurant.rating"
              :visits="restaurant.visits"
              :restaurant_id="restaurant.restaurant_id"
            />
          </v-col>
        </template>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" md="12">
          <FavoriteLists :allRestaurantNames="allRestaurantNames" />
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <FollowedUsersTable :currentUser="currentUser" />
        </v-col>
        <v-col cols="12" md="6">
          <FollowersTable :currentUser="currentUser" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
h2 {
  margin-left: 20px;
}

.d-flex {
  display: flex;
  justify-content: flex-end;
}

.text-left {
  padding: 5px;
  font-weight: bold;
}

.name,
.email {
  margin-left: 10px;
  font-weight: bold;
}

h3 {
  margin-bottom: 20px;
}
</style>
