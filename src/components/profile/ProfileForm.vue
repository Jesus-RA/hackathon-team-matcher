<template>
    <div class="max-w-4xl mx-auto flex flex-col gap-y-6">
      <h1 class="text-3xl font-bold mb-8">Your Developer Profile</h1>

      <BasicInfoForm />
      <TechnologiesForm />
      <InterestsForm />
      <LookingForForm />
      <ProjectsForm />

      <div class="flex justify-end">
        <button 
          @click="saveProfile" 
          class="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Save Profile
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
import ProjectsForm from './ProjectsForm.vue';
import { Toaster, toast } from 'vue-sonner';

import { onBeforeMount, onMounted } from 'vue';

import { $userProfile } from '@/stores/profile.js';
import { useStore } from '@nanostores/vue';
import { $technologies } from '@/stores/technologies.js';
import { supabase } from '@/lib/supabase';
import { getUserTechnologies } from '@/lib/user_profile.js';
import { $authStore } from '@clerk/astro/client';

const authStore = useStore($authStore);

onBeforeMount(async () => {
  await loadDBTechnologies();
  populateUserProfileStore();
});


const userProfile = useStore($userProfile);

const{ profile } = defineProps({
  profile: {
    type: Object,
    required: false,
  }
});

const saveProfile = async () => {
  try{
    const body = {...userProfile.value};
    body.technologies = body.technologies.map((tech) => tech.id);

    if(profile.data_fetched_from_github){
      body.data_fetched_from_github = true;
    }
    console.log('Saving profile:', body);

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

    console.log('Profile saved successfully');
  }catch(error){
    console.error('Error saving profile:', error);
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
  $technologies.value = technologies;
}

const populateUserProfileStore = () => {
  $userProfile.setKey('name', profile.name);
  $userProfile.setKey('github_username', profile.github_username);
  $userProfile.setKey('portfolio', profile.portfolio);
  $userProfile.setKey('bio', profile.bio);

  // Populate user technologies
  if(profile.data_fetched_from_github) {
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