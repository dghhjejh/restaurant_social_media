<script setup>
import L from "leaflet";
import "leaflet.locatecontrol";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";
import "leaflet-routing-machine";
import { ref, onMounted, watch } from "vue";

const props = defineProps(["longitude", "latitude"]);

const Longitude = ref(0);
const Latitude = ref(0);

const restaurantLongitude = parseFloat(props.longitude);
const restaurantLatitude = parseFloat(props.latitude);

let map = null;
let route = null;

watch([Longitude, Latitude], ([newLongitude, newLatitude]) => {
  if (map) {
    newLongitude = eval(newLongitude);
    newLatitude = eval(newLatitude);

    if (typeof newLongitude === "number" && typeof newLatitude === "number") {
      map.panTo([newLatitude, newLongitude], 13);
      map.panBy([0, -50]);
    }
  }
});

onMounted(() => {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  });

  map = L.map("map").setView([restaurantLatitude, restaurantLongitude], 15);

  L.marker([restaurantLatitude, restaurantLongitude]).addTo(map);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
});

function startItinerary() {
  navigator.geolocation.getCurrentPosition((position) => {
    Longitude.value = position.coords.longitude;
    Latitude.value = position.coords.latitude;

    if (route) {
      map.removeControl(route);
    }

    route = L.routing
      .control({
        waypoints: [
          L.latLng(Latitude.value, Longitude.value),
          L.latLng(restaurantLatitude, restaurantLongitude),
        ],
      })
      .addTo(map);
  });
}
</script>

<template>
  <div>
    <div id="map"></div>
    <v-btn @click="startItinerary" id="itinirary-btn" variant-tonal>
      Itinéraire
    </v-btn>
  </div>
</template>

<style scoped>
#map {
  height: 500px;
}

#itinirary-btn {
  position: absolute;
  bottom: 15px;
  z-index: 9999;
  left: 15px;
}
</style>
