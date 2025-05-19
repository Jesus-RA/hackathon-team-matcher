<template>
  <article class="flex flex-col gap-y-6 light-dark-theme rounded-lg p-6 shadow-lg outline outline-gray-100 dark:outline-none">
    <h2 class="text-xl font-bold">
      Interests
      <span class="text-sm text-gray-500">(what you would like to work on)</span>
    </h2>

    <section class="flex flex-wrap gap-3">
      <input 
        v-model="interest"
        type="text" 
        list="interests"
        placeholder="Add a position you are interested in" 
        class="w-full md:w-auto grow-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
        @keyup.enter="localAddInterest"
      />
      <datalist id="interests">
        <option v-for="interest in unselectedInterests" :key="interest.id" :value="interest.name"></option>
      </datalist>
      <button 
        @click="localAddInterest" 
        class="w-full md:w-auto px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium transition-opacity"
        :class="{'cursor-not-allowed opacity-50': !validInterestSelected, 'hover:opacity-90': validInterestSelected}"
        :disabled="!validInterestSelected"
      >
        Add
      </button>
    </section>

    <section class="flex flex-wrap gap-2">
      <div v-for="interest in userProfile.interests" :key="interest.id" class="flex items-center gap-2">
        <span class="flex items-center gap-x-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {{ interest.name }}
          <button 
            @click="removeInterest(interest.id)" 
            class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
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
import { $userProfile, addInterest, removeInterest } from '@/stores/profile.js';
import { $positions } from '@/stores/positions.js';
import { useStore } from '@nanostores/vue';
import { ref, computed } from 'vue';

const userProfile = useStore($userProfile);
const interests = $userProfile.interests;
const positionsStore = useStore($positions);

const interest = ref('');

const selectedInterest = computed(() => {
  return positionsStore.value.find((position) => position.name === interest.value);
})

const validInterestSelected = computed(() => {
  return selectedInterest.value !== undefined;
})

const unselectedInterests = computed(() => {
  const userInterests = new Set(userProfile.value.interests.map((interest) => interest.id));
  return positionsStore.value.filter((interest) => !userInterests.has(interest.id));
})

const localAddInterest = () => {
  if(!validInterestSelected.value) return;

  const { id, name } = selectedInterest.value;
  addInterest({id, name });
  interest.value = '';
};
</script>
