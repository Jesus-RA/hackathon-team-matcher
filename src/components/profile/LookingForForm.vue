<template>
  <article class="flex flex-col gap-y-6 light-dark-theme rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold">
      Looking For
      <span class="text-sm text-gray-500">(what type of teammate are you looking for)</span>
    </h2>

    <section class="flex gap-x-2">
      <input 
        v-model="lookingFor"
        type="text" 
        list="positions"
        placeholder="Add a position you are looking for" 
        class="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
        @keyup.enter="localAddLookingFor"
      />
      <datalist id="positions">
        <option v-for="position in unselectedPositions" :key="position.id" :value="position.name"></option>
      </datalist>
      <button 
        @click="localAddLookingFor" 
        class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 transition-opacity"
        :class="{'cursor-not-allowed opacity-50': !validPositionSelected}"
        :disabled="!validPositionSelected"
      >
        Add
      </button>
    </section>

    <section class="flex flex-wrap gap-2">
      <div v-for="position in userProfile.looking_for" :key="position.id" class="flex items-center gap-2">
        <span class="flex items-center gap-x-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {{ position.name }}
          <button 
            @click="removeLookingFor(position.id)" 
            class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
          </button>
        </span>
      </div>
    </section>
  </article>
</template>

<script setup>
import { $userProfile } from '@/stores/profile.js';
import { $positions } from '@/stores/positions.js';
import { useStore } from '@nanostores/vue';
import { ref, computed } from 'vue';
import { addLookingFor, removeLookingFor } from '@/stores/profile.js';

const userProfile = useStore($userProfile);
const positionsStore = useStore($positions);
const lookingFor = ref('');

const selectedPosition = computed(() => {
  return positionsStore.value.find((position) => position.name === lookingFor.value);
})

const validPositionSelected = computed(() => {
  return selectedPosition.value !== undefined;
})

const unselectedPositions = computed(() => {
  const userPositions = new Set(userProfile.value.looking_for.map((position) => position.id));
  return positionsStore.value.filter((position) => !userPositions.has(position.id));
})

const localAddLookingFor = () => {
  if(!validPositionSelected.value) return;

  const { id, name } = selectedPosition.value;
  addLookingFor({id, name });
  lookingFor.value = '';
};
</script>
