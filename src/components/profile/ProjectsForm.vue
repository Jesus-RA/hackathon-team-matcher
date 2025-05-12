<template>
  <section class="light-dark-theme rounded-lg p-6 shadow-sm">
    <h2 class="text-xl font-bold mb-4">Projects</h2>
    <div class="space-y-6">
      <div v-for="(project, index) in projects" :key="index" class="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
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
</template>

<script setup>
import { $userProfile, addProject, removeProject } from '@/stores/profile.js';
import { useStore } from '@nanostores/vue';

const userProfile = useStore($userProfile);
const projects = $userProfile.projects;

const addNewProject = () => {
  addProject({
    name: '',
    url: '',
    description: '',
    technologies: '',
    role: ''
  });
};
</script>
