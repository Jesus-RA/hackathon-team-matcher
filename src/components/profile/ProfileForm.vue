<template>
    <div class="space-y-8">
      <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-4">Basic Information</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-sm font-medium mb-1">Full Name</label>
            <input 
              id="name" 
              v-model="profile.name" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label for="title" class="block text-sm font-medium mb-1">Job Title</label>
            <input 
              id="title" 
              v-model="profile.title" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium mb-1">Email</label>
            <input 
              id="email" 
              v-model="profile.email" 
              type="email" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            />
          </div>
          <div>
            <label for="location" class="block text-sm font-medium mb-1">Location</label>
            <input 
              id="location" 
              v-model="profile.location" 
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            />
          </div>
          <div class="md:col-span-2">
            <label for="bio" class="block text-sm font-medium mb-1">Bio</label>
            <textarea 
              id="bio" 
              v-model="profile.bio" 
              rows="3" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            ></textarea>
          </div>
        </div>
      </section>
  
      <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-4">Technologies</h2>
        <div class="space-y-4">
          <div v-for="(tech, index) in profile.technologies" :key="index" class="flex gap-2">
            <input 
              v-model="tech.name" 
              type="text" 
              placeholder="Technology name" 
              class="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            />
            <select 
              v-model="tech.level" 
              class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <button 
              @click="removeTechnology(index)" 
              class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
            </button>
          </div>
          <button 
            @click="addTechnology" 
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Add Technology
          </button>
        </div>
      </section>
  
      <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-4">Interests</h2>
        <div class="space-y-4">
          <div v-for="(interest, index) in profile.interests" :key="index" class="flex gap-2">
            <input 
              v-model="interest.name" 
              type="text" 
              placeholder="Interest" 
              class="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            />
            <button 
              @click="removeInterest(index)" 
              class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
            </button>
          </div>
          <button 
            @click="addInterest" 
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Add Interest
          </button>
        </div>
      </section>
  
      <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-4">Looking For</h2>
        <div class="space-y-4">
          <div v-for="(lookingFor, index) in profile.lookingFor" :key="index" class="flex gap-2">
            <input 
              v-model="lookingFor" 
              type="text" 
              placeholder="What are you looking for in a teammate?" 
              class="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
            />
            <button 
              @click="removeLookingFor(index)" 
              class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
            </button>
          </div>
          <button 
            @click="addLookingFor" 
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Add Requirement
          </button>
        </div>
      </section>
  
      <section class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 class="text-xl font-bold mb-4">Projects</h2>
        <div class="space-y-6">
          <div v-for="(project, index) in profile.projects" :key="index" class="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex justify-between">
              <h3 class="text-lg font-medium">Project {{ index + 1 }}</h3>
              <button 
                @click="removeProject(index)" 
                class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2">
                  <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                </svg>
              </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label :for="`project-name-${index}`" class="block text-sm font-medium mb-1">Project Name</label>
                <input 
                  :id="`project-name-${index}`" 
                  v-model="project.name" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <label :for="`project-url-${index}`" class="block text-sm font-medium mb-1">Project URL</label>
                <input 
                  :id="`project-url-${index}`" 
                  v-model="project.url" 
                  type="url" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                />
              </div>
              <div class="md:col-span-2">
                <label :for="`project-description-${index}`" class="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  :id="`project-description-${index}`" 
                  v-model="project.description" 
                  rows="2" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                ></textarea>
              </div>
              <div>
                <label :for="`project-tech-${index}`" class="block text-sm font-medium mb-1">Technologies Used</label>
                <input 
                  :id="`project-tech-${index}`" 
                  v-model="project.technologies" 
                  type="text" 
                  placeholder="Comma separated list" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                />
              </div>
              <div>
                <label :for="`project-role-${index}`" class="block text-sm font-medium mb-1">Your Role</label>
                <input 
                  :id="`project-role-${index}`" 
                  v-model="project.role" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900"
                />
              </div>
            </div>
          </div>
          <button 
            @click="addProject" 
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Add Project
          </button>
        </div>
      </section>
  
      <div class="flex justify-end">
        <button 
          @click="saveProfile" 
          class="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Save Profile
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const profile = ref({
    name: '',
    title: '',
    email: '',
    location: '',
    bio: '',
    technologies: [{ name: '', level: 'intermediate' }],
    interests: [{ name: '' }],
    lookingFor: [''],
    projects: [{
      name: '',
      url: '',
      description: '',
      technologies: '',
      role: ''
    }]
  });
  
  onMounted(() => {
    // Load profile from localStorage if available
    const savedProfile = localStorage.getItem('devMatcherProfile');
    if (savedProfile) {
      profile.value = JSON.parse(savedProfile);
    }
  });
  
  function addTechnology() {
    profile.value.technologies.push({ name: '', level: 'intermediate' });
  }
  
  function removeTechnology(index) {
    profile.value.technologies.splice(index, 1);
    if (profile.value.technologies.length === 0) {
      addTechnology();
    }
  }
  
  function addInterest() {
    profile.value.interests.push({ name: '' });
  }
  
  function removeInterest(index) {
    profile.value.interests.splice(index, 1);
    if (profile.value.interests.length === 0) {
      addInterest();
    }
  }
  
  function addLookingFor() {
    profile.value.lookingFor.push('');
  }
  
  function removeLookingFor(index) {
    profile.value.lookingFor.splice(index, 1);
    if (profile.value.lookingFor.length === 0) {
      addLookingFor();
    }
  }
  
  function addProject() {
    profile.value.projects.push({
      name: '',
      url: '',
      description: '',
      technologies: '',
      role: ''
    });
  }
  
  function removeProject(index) {
    profile.value.projects.splice(index, 1);
    if (profile.value.projects.length === 0) {
      addProject();
    }
  }
  
  function saveProfile() {
    // Save to localStorage for demo purposes
    localStorage.setItem('devMatcherProfile', JSON.stringify(profile.value));
    alert('Profile saved successfully!');
  }
  </script>
  