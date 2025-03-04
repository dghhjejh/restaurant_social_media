<script setup>
import { ref, onMounted, watchEffect, onUnmounted, nextTick } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "vue-router";

const { filteredRestaurants } = defineProps(["filteredRestaurants"]);

const router = useRouter();
const uniqueMapId = `map-${Math.random().toString(36).substr(2, 9)}`;
const nearbyRestaurants = ref([]);
const Latitude = ref(46.8054132);
const Longitude = ref(-71.2897939);

let carte = null;

navigator.geolocation.getCurrentPosition((position) => {
  Latitude.value = position.coords.latitude;
  Longitude.value = position.coords.longitude;
});

async function displayNearbyRestaurants(userLat, userLon) {
  if (!userLat || !userLon || !carte) {
    console.error("Paramètres invalides ou carte non initialisée");
    return;
  }

  const userIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  carte.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      carte.removeLayer(layer);
    }
  });

  carte.setView([userLat, userLon], 8);

  L.marker([userLat, userLon], { icon: userIcon })
    .bindTooltip("Votre position", { permanent: false, direction: "top" })
    .addTo(carte);

  filteredRestaurants.forEach((restaurant) => {
    const latitude = restaurant.location.coordinates[1];
    const longitude = restaurant.location.coordinates[0];
    const name = restaurant.name;

    const goToRestaurant = () => {
      router.push(`/restaurant/${restaurant.id}`);
    };

    L.marker([latitude, longitude])
      .on("click", goToRestaurant)
      .bindPopup(`<b>${name}</b>`)
      .bindTooltip(name, { permanent: false, direction: "top" })
      .addTo(carte);
  });
}

onMounted(async () => {
  if (carte) {
    carte.remove();
    carte = null;
  }

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  await nextTick();
  const mapElement = document.getElementById(uniqueMapId);
  if (!mapElement) {
    return;
  }

  try {
    carte = L.map(uniqueMapId).setView([0, 0], 8);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(carte);

    displayNearbyRestaurants(Latitude.value, Longitude.value);
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la carte:", error);
  }
});

onUnmounted(() => {
  if (carte) {
    carte.remove();
    carte = null;
  }
});

watchEffect(() => {
  if (Latitude.value && Longitude.value && carte) {
    displayNearbyRestaurants(Latitude.value, Longitude.value);
    carte.setView([Latitude.value, Longitude.value], 8);
  }
});
</script>

<template>
  <div>
    <div :id="uniqueMapId" style="height: 100vh"></div>
  </div>
</template>

<style scoped>
[id^="map-"] {
  height: 400px;
  width: 100%;
  z-index: 1;
}
</style>
