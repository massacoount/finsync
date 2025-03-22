<template>
  <div class="dashboard p-4">
    <div class="rounded-xl w-full">
      <h2 class="text-lg font-semibold mb-3">Latest Transactions</h2>
      <div class="relative mb-3">
        <input
          type="text"
          placeholder="Search by Name, Number or Transaction ID"
          class="w-full p-2 pl-10 pr-4 shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        <span class="absolute left-3 top-3 text-gray-400">🔍</span>
      </div>

      <div class="space-y-4">
        <!-- Transactions List -->
        <div
          v-for="transaction in transactions"
          :key="transaction.id"
          class="flex justify-between items-center py-2 border-b"
          @touchstart="startTouch($event, transaction)"
          @touchmove="moveTouch($event)"
          @touchend="endTouch"
        >
          <div class="flex items-center space-x-3">
            <div>
              <p class="text-sm font-semibold">{{ transaction.store }}</p>
              <p class="text-xs text-gray-500">{{ transaction.description }}</p>
              <p class="text-xs text-gray-500">
                {{ new Date(transaction.date).toLocaleDateString() }}
              </p>
              <p class="text-xs text-gray-500">
                From: {{ transaction.accountFrom }}
              </p>
              <p class="text-xs text-gray-500">
                To: {{ transaction.accountTo }}
              </p>
            </div>
          </div>
          <p
            :class="{
              'text-red-500': transaction.amount < 0,
              'text-blue-500': transaction.amount > 0,
            }"
            class="font-semibold"
          >
            {{ transaction.amount < 0 ? "-" : "" }}${{
              Math.abs(transaction.amount).toFixed(2)
            }}
          </p>
        </div>
      </div>
      <div ref="loadMoreTrigger" class="h-1"></div>
    </div>

    <FloatingActionButton @action="handleFabAction" />
  </div>
</template>

<<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useFinance } from "@/composables/useFinance";
import FloatingActionButton from "@/components/common/FloatingActionButton.vue";
import type { Transaction } from "@/types/finance";

const router = useRouter();
const { transactions, fetchTransactions, loadMoreTransactions, deleteTransaction, hasMore } = useFinance();

const loadMoreTrigger = ref<HTMLElement | null>(null);
const touchStartX = ref(0);
const touchEndX = ref(0);
const currentTransaction = ref<Transaction | null>(null);

const startTouch = (event: TouchEvent, transaction: Transaction) => {
  touchStartX.value = event.changedTouches[0].screenX;
  currentTransaction.value = transaction;
};

const moveTouch = (event: TouchEvent) => {
  touchEndX.value = event.changedTouches[0].screenX;
};

const endTouch = () => {
  if (touchStartX.value - touchEndX.value > 50) {
    // Swipe left - Edit
    handleSwipeLeft(currentTransaction.value!);
  } else if (touchEndX.value - touchStartX.value > 50) {
    // Swipe right - Delete
    handleSwipeRight(currentTransaction.value!);
  }
};

const handleSwipeLeft = (transaction: Transaction) => {
  router.push(`/edit-transaction/${transaction.id}`);
};

const handleSwipeRight = (transaction: Transaction) => {
  if (confirm("Are you sure you want to delete this transaction?")) {
    deleteTransaction(transaction.id);
  }
};

const handleFabAction = (action: string) => {
  if (action === "addTransaction") {
    router.push("/add-transaction");
  } else if (action === "manageAccounts") {
    router.push("/accounts");
  }
};

onMounted(async () => {
  const authResponse = await checkAuth();
  if (authResponse) {
    await fetchTransactions();
  } else {
    console.error("User is not authenticated");
  }
});

// Setup intersection observer for infinite scroll
const observer = new IntersectionObserver(
  async (entries) => {
    if (entries[0].isIntersecting && hasMore.value) {
      await loadMoreTransactions();
    }
  },
  { threshold: 1.0 }
);

onMounted(() => {
  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value);
  }
});
</script>

<style scoped>
/* Add any additional styles here */
</style>