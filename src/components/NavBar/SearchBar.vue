<script setup>
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(["update:modelValue", "search"]);

const searchQuery = ref(props.modelValue);

watch(searchQuery, (newValue) => {
  emit("update:modelValue", newValue);
});

const emitSearch = () => {
  emit("search", searchQuery.value);
  searchQuery.value = "";
};

const route = useRoute();
const showSearchBar = computed(() => {
  if (route.name === "Home" || route.name === "Login") return false;
  return true;
});
</script>

<template>
  <v-text-field
    v-if="showSearchBar"
    v-model="searchQuery"
    append-icon="mdi-magnify"
    label="Rechercher..."
    solo-inverted
    hide-details
    class="mx-3"
    @click:append="emitSearch"
    @keyup.enter="emitSearch"
    clearable
    density="compact"
  ></v-text-field>
</template>

<style scoped>
.mx-3 {
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
