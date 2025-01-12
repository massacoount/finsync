import { ref } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const error = ref(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url);
      data.value = await response.json();
    } catch (err) {
      error.value = err;
    }
  };

  fetchData();

  return { data, error };
}