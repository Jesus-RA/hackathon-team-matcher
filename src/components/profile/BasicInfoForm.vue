<template>
  <section class="light-dark-theme rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold mb-4">Basic Information</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
        <input 
          id="name" 
          v-model="userProfile.name" 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
        />
      </div>
      <div>
        <label for="title" class="block text-sm font-medium mb-1">Job Title</label>
        <input 
          id="title" 
          v-model="userProfile.title" 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
        />
      </div>
      <div>
        <label for="github_username" class="block text-sm font-medium mb-1">GitHub Username</label>
        <input 
          id="github_username" 
          v-model="userProfile.github_username" 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
        />
      </div>
      <div>
        <label for="portfolio" class="block text-sm font-medium mb-1">Portfolio</label>
        <input 
          id="portfolio" 
          v-model="userProfile.portfolio" 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
        />
      </div>
      <div class="md:col-span-2">
        <label for="bio" class="block text-sm font-medium mb-1">Bio</label>
        <textarea 
          id="bio" 
          v-model="userProfile.bio" 
          rows="3" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
        ></textarea>
      </div>
    </div>
  </section>
</template>

<script setup>
import { $userProfile } from '@/stores/profile.js';
import { useStore } from '@nanostores/vue';

const userProfile = useStore($userProfile);
</script>
