import { ref } from "vue";
import restaurantService from "@/api/restaurantService";

export async function useRestaurants(loading) {
  const restaurants = ref([]);
  const specialities = ref([]);
  const priceRanges = ref([]);

  const getRestaurants = async () => {
    const response = await restaurantService.getRestaurants(150);
    restaurants.value = response.map((item) => ({
      ...item,
      isFavorite: false,
    }));

    specialities.value = [
      ...new Set(restaurants.value.flatMap((item) => item.genres)),
    ];

    const uniquePriceRanges = Array.from(
      new Set(restaurants.value.map((item) => item.price_range)),
    )
      .sort((a, b) => a - b)
      .map((range) => ({
        label: `$`.repeat(range),
        value: range,
      }));
    priceRanges.value = uniquePriceRanges;
    loading.value = false;
  };

  await getRestaurants();

  return { restaurants, specialities, priceRanges };
}
