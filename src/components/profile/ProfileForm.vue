<template>
    <div class="max-w-4xl mx-auto flex flex-col gap-y-6 p-4">
      <h1 class="text-3xl font-bold text-center md:text-left">Your Developer Profile</h1>
      <SpinnerLoader v-show="loadingPageData" class="size-10 border-6 border-r-6 mx-auto" />

      <BasicInfoForm />
      <TechnologiesForm />
      <InterestsForm />
      <LookingForForm />

      <div class="flex justify-end">
        <button 
          @click="saveProfile" 
          class="w-full md:w-auto px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md font-medium transition-opacity"
          :class="{ 'opacity-50 cursor-not-allowed': loading, 'hover:opacity-90 cursor-pointer': !loading }"
          :disabled="loading"
        >
          Save Profile
          <SpinnerLoader v-if="loading" class="size-6 border-3 border-r-3 border-gray-300" />
        </button>
      </div>
    </div>
    <Toaster richColors position="top-right" />
</template>

<script setup>
import BasicInfoForm from './BasicInfoForm.vue';
import TechnologiesForm from './TechnologiesForm.vue';
import InterestsForm from './InterestsForm.vue';
import LookingForForm from './LookingForForm.vue';
import { Toaster, toast } from 'vue-sonner';
import SpinnerLoader from '@/components/ui/SpinnerLoader.vue';

import { ref, onBeforeMount, onMounted } from 'vue';

import { $userProfile } from '@/stores/profile.js';
import { useStore } from '@nanostores/vue';
import { $technologies } from '@/stores/technologies.js';
import { supabase } from '@/lib/supabase';
import { getUserTechnologies } from '@/lib/user_profile.js';
import { $authStore } from '@clerk/astro/client';
import { $positions } from '@/stores/positions.js';

import { fetchPositions } from '@/lib/positions.js';

const authStore = useStore($authStore);
const userProfile = useStore($userProfile);
const loading = ref(false);
const loadingPageData = ref(true);

const { profile } = defineProps({
  profile: {
    type: Object,
    required: false,
  }
});

onBeforeMount(async () => {
  loadingPageData.value = true;
  await Promise.all([
    loadDBTechnologies(),
    loadDBPositions()
  ]);
  loadingPageData.value = false;
  
  populateUserProfileStore();  
});

onMounted(() => {
  const urlParams = new URLSearchParams(location.search);
  const profileNotFound = urlParams.get('m') === 'profile_not_found';

  if(profileNotFound){
    toast.info('Complete your profile first to find teammates');
  }
})

const saveProfile = async () => {
  try{
    loading.value = true;
    const body = {...userProfile.value};
    body.technologies = body.technologies.map((tech) => tech.id);
    body.interests = body.interests.map((interest) => interest.id);
    body.looking_for = body.looking_for.map((position) => ({
      position_id: position.id,
      required_people: position.required_people
    }));
    body.email = body.email || '';

    if($userProfile.value.data_fetched_from_github){
      body.data_fetched_from_github = true;
    }

    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if(!response.ok){
      throw new Error('Failed to save profile');
    }

    toast.success('Profile saved successfully');
  }catch(error){
    console.error('Error saving profile:', error);
  }finally{
    loading.value = false;
  }
}

const fetchDBTechnologies = async () => {
  const { data, error } = await supabase.from('technologies').select('*');
  if(error){
    console.error('Error fetching technologies:', error);
    return [];
  }
  return data;
}

const loadDBTechnologies = async () => {
  const technologies = await fetchDBTechnologies();
  $technologies.set(technologies);
}

const loadDBPositions = async () => {
  const positions = await fetchPositions();
  $positions.set(positions);
}

const populateUserProfileStore = () => {
  // Populate user profile store
  Object.entries(profile).forEach(([key, value]) => {
    $userProfile.setKey(key, value);
  });

  // Populate user technologies
  if(profile.data_fetched_from_github) {
    $userProfile.setKey('data_fetched_from_github', true);
    // Inform user that info was fetched from GitHub
    toast.info('User info fetched from GitHub, click Save Profile to save it');

    // Map technologies from GitHub to DB technologies
    const userTechnologiesFromGitHub = $technologies.value.filter((tech) => {
      return profile.technologies.includes(tech.name);
    });

    userTechnologiesFromGitHub.length && $userProfile.setKey('technologies', userTechnologiesFromGitHub);
  } else {
    $userProfile.setKey('technologies', profile.technologies);
  }
}
</script>