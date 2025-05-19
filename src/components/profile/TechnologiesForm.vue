<template>
  <article class="flex flex-col gap-y-6 light-dark-theme rounded-lg p-6 shadow-lg outline outline-gray-100 dark:outline-none">
    <h2 class="text-xl font-bold">Technologies</h2>
    <section class="flex flex-wrap gap-3">
      <input v-model="technology" @keyup.enter="addTech" list="technologies" type="text" placeholder="Add a techology" class="w-full md:w-auto grow-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none">
      <datalist id="technologies">
        <option v-for="(tech, index) in unselectedTechnologies" :key="index" :value="tech.name">{{ tech.name }}</option>
      </datalist>
      <button 
        @click="addTech" 
        class="w-full md:w-auto px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium transition-opacity"
        :class="{'cursor-not-allowed opacity-50': !validTechnologySelected, 'hover:opacity-90': validTechnologySelected}"
        :disabled="!validTechnologySelected"
      >
        Add
      </button>
    </section>

    <section class="flex flex-wrap gap-4">
      <div v-for="(tech, index) in userProfile.technologies" :key="index" class="flex items-center gap-2">
        <span class="flex items-center gap-x-2 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {{ tech.name }}
          <button 
            @click="removeTechnology(tech.id)" 
            class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
              <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
          </button>
        </span>
        <!--<select 
          v-model="tech.level" 
          class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>-->
        <!-- <button 
          @click="removeTechnology(index)" 
          class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
        </button> -->
      </div>
    </section>
  </article>
</template>

<script setup>
import { $userProfile, addTechnology, removeTechnology } from '@/stores/profile.js';
import { $technologies } from '@/stores/technologies.js';
import { useStore } from '@nanostores/vue';
import { ref, computed } from 'vue';

const userProfile = useStore($userProfile);
const technology = ref('');
const technologies = useStore($technologies);

const selectedTechnology = computed(() => {
  return technologies.value.find((tech) => tech.name === technology.value);
})

const validTechnologySelected = computed(() => {
  return selectedTechnology.value !== undefined;
})

const unselectedTechnologies = computed(() => {
  const userTechnologies = new Set(userProfile.value.technologies.map((tech) => tech.id));
  return technologies.value.filter((tech) => !userTechnologies.has(tech.id));
})

const addTech = () => {
  if(!validTechnologySelected.value) return;

  const { id, name } = selectedTechnology.value;
  addTechnology({id, name });
  technology.value = '';
};
</script>
