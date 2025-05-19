<template>
  <section class="light-dark-theme rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold mb-4">Basic Information</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
        <input 
          id="name" 
          v-model="form.name"
          @change="updateUserProfileStore('name', form.name)"
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
        />
      </div>
      <div>
        <label for="title" class="block text-sm font-medium mb-1">Job Title</label>
        <input 
          id="title" 
          v-model="form.title"
          @change="updateUserProfileStore('title', form.title)"
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
        />
      </div>
      <div>
        <label for="github_username" class="block text-sm font-medium mb-1 w-full grow-1">
          GitHub Username
        </label>
        <input 
          id="github_username" 
          v-model="form.github_username"
          @change="updateUserProfileStore('github_username', form.github_username)" 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
        />
        <div class="flex flex-wrap items-center justify-between gap-2 mt-2">
          <span class="w-full md:w-auto text-xs text-gray-800 dark:text-gray-300">Add your username to fetch your data from GitHub</span>
          <button
            class="ml-auto md:w-auto px-3 py-1 bg-gray-800 dark:bg-white text-white dark:text-gray-800 rounded-md font-medium text-xs"
            :class="{ 'opacity-50 cursor-not-allowed': !form.github_username || loadingGitHubData, 'hover:opacity-90 transition-opacity cursor-pointer': form.github_username && !loadingGitHubData }"
            :disabled="!form.github_username || loadingGitHubData"
            @click="fetchUserDataFromGitHub"
          >
            Pull data <span v-if="!loadingGitHubData">↓</span>
            <SpinnerLoader v-else />
          </button>
        </div>
      </div>
      <div>
        <label for="portfolio" class="block text-sm font-medium mb-1">Portfolio</label>
        <input 
          id="portfolio" 
          v-model="form.portfolio"
          @change="updateUserProfileStore('portfolio', form.portfolio)" 
          type="text" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
        />
      </div>
      <div class="md:col-span-2">
        <label for="bio" class="block text-sm font-medium mb-1">Bio</label>
        <textarea 
          id="bio" 
          v-model="form.bio"
          @change="updateUserProfileStore('bio', form.bio)" 
          rows="3" 
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 focus:outline-none"
        ></textarea>
      </div>
    </div>
  </section>

  <GitHubProfileDataPreviewDialog
    :is-open="showPreview"
    :preview-data="githubData"
    @close="handleClose"
    @apply="handleApplyGitHubData"
  />
</template>

<script setup>
import { $userProfile, addTechnology } from '@/stores/profile.js';
import { $technologies } from '@/stores/technologies.js';
import { $authStore } from '@clerk/astro/client';
import { useStore } from '@nanostores/vue';
import GitHub from '@/components/icons/GitHub.vue';
import { ref, watch } from 'vue';
import SpinnerLoader from '@/components/ui/SpinnerLoader.vue';
import GitHubProfileDataPreviewDialog from '@/components/profile/GitHubProfileDataPreviewDialog.vue';

const userProfile = useStore($userProfile);
const authStore = useStore($authStore);

const loadingGitHubData = ref(false);
const form = ref({
  name: '',
  title: '',
  github_username: '',
  portfolio: '',
  bio: '',
});

const showPreview = ref(false);
const githubData = ref({});

const handleApplyGitHubData = () => {
  showPreview.value = false;
  $userProfile.setKey('name', githubData.value.name);
  $userProfile.setKey('portfolio', githubData.value.blog);
  $userProfile.setKey('bio', githubData.value.bio);

  $technologies.value
    .filter(tech => githubData.value.technologies.includes(tech.name))
    .forEach(tech => {
      addTechnology({id: tech.id, name: tech.name});
    });

  $userProfile.setKey('data_fetched_from_github', true);
}

const handleClose = () => {
  showPreview.value = false;
}

// Populate form when userProfile is loaded
watch(() => userProfile.value, (newValue) => {
  if(newValue){
    form.value = {...newValue};
  }
});

const updateUserProfileStore = (key, value) => {
  $userProfile.setKey(key, value);
}

const fetchUserDataFromGitHub = async () => {
  loadingGitHubData.value = true;

  const response = await fetch(`/api/github?username=${encodeURIComponent(form.value.github_username)}`);
  if (response.ok) {
    const { profile, technologies } = await response.json();
    githubData.value = {...profile, technologies}
    showPreview.value = true;

    //$userProfile.setKey('name', profile.name);
    // $userProfile.setKey('portfolio', profile.blog);
    // $userProfile.setKey('bio', profile.bio);

    /*const userTechnologiesFromGitHub = $technologies.value.filter((tech) => {
      return technologies.includes(tech.name);
    });

    userTechnologiesFromGitHub.length && $userProfile.setKey('technologies', userTechnologiesFromGitHub);
    $userProfile.setKey('data_fetched_from_github', true);*/
  } else {
    const error = await response.json();
    console.error('Error:', error.error);
  }
  loadingGitHubData.value = false;
}

</script>
