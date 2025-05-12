<template>
  <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold mb-4">Technologies</h2>
    <div class="space-y-4">
      <div class="flex gap-2">
        <input v-model="technology" list="technologies" type="text" placeholder="Technology name" class="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
        <datalist id="technologies">
          <option v-for="(tech, index) in $technologies" :key="index" :value="tech.name">{{ tech.name }}</option>
        </datalist>
        <button 
          @click="localAddTechnology(technology)" 
          class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Add Technology
        </button>
      </div>

      <div v-for="(tech, index) in userProfile.technologies" :key="index" class="flex gap-2">
        <span>{{ tech.name }}</span>
        <!--<select 
          v-model="tech.level" 
          class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>-->
        <button 
          @click="removeTechnology(index)" 
          class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { $userProfile, addTechnology, removeTechnology } from '@/stores/profile.js';
import { useStore } from '@nanostores/vue';
import { ref } from 'vue';
import { $technologies } from '@/stores/technologies.js';

const userProfile = useStore($userProfile);
const technology = ref('');
const technologies = useStore($technologies);

const localAddTechnology = (technologyName) => {
  //addTechnology({ name: technology.value, level: 'beginner' });
  addTechnology(technologyName);
  technology.value = '';
};

</script>
