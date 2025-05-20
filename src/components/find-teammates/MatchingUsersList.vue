<template>
  <div class="h-dvh flex flex-col gap-y-6 md:gap-y-8 p-4 overflow-y-auto">
    <h1 class="text-3xl font-bold">Find your team! 🚀</h1>
    <p class="">Find potential team members for your hackathon project.</p>

    <section class="flex flex-wrap items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
      <button
        @click="showFiltersDialog = true"
        class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
      >
        <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>

      <span class="font-semibold">Current Filters:</span>
      <div v-for="category in displayFilters" class="flex items-center gap-3">
        <span class="font-semibold">{{ category.name }}:</span>
        <span v-if="category.items.length === 0">Any</span>
        <p v-else class="flex flex-wrap items-center gap-2">
          <span v-for="item in category.items" :key="item.name" class="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            {{ item.name }}
          </span>
        </p>
      </div>
    </section>

    <FilterDialog
      v-model="filters"
      :visible="showFiltersDialog"
      @close="showFiltersDialog = false"
      @apply-filters="applyFilters"
      :technologies="technologies"
      :positions="positions"
    />

    <template v-if="!filteredUsers.length">
      <section class="h-[50vh] flex items-center justify-center">
        <p class="text-center bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white py-6 px-12 rounded shadow">
          {{ noResultsMessage }}
        </p>
      </section>
    </template>

    <template v-else>
      <section class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MatchingUserCard
          v-for="user in filteredUsers"
          :key="user.clerk_user_id"
          :user="user"
        />
      </section>
    </template>
  </div>
</template>

<script setup>
import MatchingUserCard from '@/components/find-teammates/MatchingUserCard.vue';
import FilterDialog from '@/components/ui/FilterDialog.vue';

import { ref, computed, onBeforeMount } from 'vue';

import { $technologies } from '@/stores/technologies.js';
import { $positions } from '@/stores/positions.js';
import { useStore } from '@nanostores/vue';
import { fetchTechnologies } from '@/lib/technologies.js';
import { fetchPositions } from '@/lib/positions.js';

const props = defineProps({
  users: {
    type: Array,
    required: true
  }
});

const technologies = useStore($technologies);
const positions = useStore($positions);

const defaultFilters = {
  matchingScore: 50,
  technologies: [],
  interests: [],
  lookingFor: []
};

const filters = ref({ ...defaultFilters });
const showFiltersDialog = ref(false);

onBeforeMount(async () => {
  await Promise.all([
    loadDBTechnologies(),
    loadDBPositions()
  ]);
})

const displayFilters = computed(() => {
  const matching_score = filters.value.matchingScore === 0 ? [] : [{name: `${filters.value.matchingScore}+`}];
  const technologies = filters.value.technologies.length === 0 ? [] : filters.value.technologies.map(tech => ({name: tech.name}));
  const interests = filters.value.interests.length === 0 ? [] : filters.value.interests.map(interest => ({name: interest.name}));
  const looking_for = filters.value.lookingFor.length === 0 ? [] : filters.value.lookingFor.map(position => ({name: position.name}));

  return [
    { name: 'Matching Score', items: matching_score },
    { name: 'Technologies', items: technologies },
    { name: 'Interests', items: interests },
    { name: 'Looking For', items: looking_for }
  ];
});

const applyFilters = (newFilters) => {
  filters.value = {...newFilters};
}

const loadDBTechnologies = async () => {
  const technologies = await fetchTechnologies();
  $technologies.set(technologies);
}

const loadDBPositions = async () => {
  const positions = await fetchPositions();
  $positions.set(positions);
}

const filteredUsers = computed(() => {
  return props.users.filter(user => {
    const { matchingScore, technologies, interests, lookingFor } = filters.value;
    
    // Matching score filter
    if (user.matching_score.total_percentage < matchingScore) return false;
    
    // Technologies filter
    if (technologies.length > 0 && !technologies.some(tech => user.technologies?.some(t => t.name === tech.name))) return false;
    
    // Interests filter
    if (interests.length > 0 && !interests.some(interest => user.interests?.some(i => i.name === interest.name))) return false;
    
    // Looking for filter
    if (lookingFor.length > 0 && !lookingFor.some(look => user.looking_for?.some(l => l.name === look.name))) return false;
    
    return true;
  });
});

const noResultsMessage = computed(() => {
  if (!props.users.length) {
    return 'There are no devs available yet. Share to your network to find potential team members.';
  }
  return 'No matches found with current filters. Try adjusting your filters.';
});
</script>
