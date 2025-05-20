<template>
  <div class="grid grid-rows-[auto_1fr_auto] gap-y-6 p-6 shadow-xl rounded-lg light-dark-theme outline outline-gray-100 dark:outline-none">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-xl font-bold">{{ user.name }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ user.job_title }}</p>
      </div>
      <span class="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
        {{ user.matching_score.total_percentage.toFixed(0) }}% Match
      </span>
    </div>
    
    <div class="flex flex-col gap-y-6">
      <p class="text-sm">{{ user.bio }}</p>
      
      <section>
        <h3 class="text-sm font-medium mb-2">Technologies</h3>
        <div class="flex flex-wrap gap-2">
          <template v-if="!user.technologies.length">
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">No technologies listed</span>
          </template>
          <template v-else>
            <span 
              v-for="tech in user.technologies" 
              :key="tech.name"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs"
            >
              {{ tech.name }}
            </span>
          </template>
        </div>
      </section>
      
      <section>
        <h3 class="text-sm font-medium mb-2">Would like to work on</h3>
        <div class="flex flex-wrap gap-2">
          <template v-if="!user.interests?.length">
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Nothing listed</span>
          </template>
          <template v-else>
            <span 
              v-for="interest in user.interests" 
              :key="interest.name"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs"
            >
              {{ interest.name }}
            </span>
          </template>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-medium mb-2">Looking for</h3>
        <div class="flex flex-wrap gap-2">
          <template v-if="!user.looking_for?.length">
            <span class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs">Nothing listed</span>
          </template>
          <template v-else>
            <span 
              v-for="looking_for in user.looking_for" 
              :key="looking_for.name"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs"
            >
              {{ looking_for.name }} ({{ mapRequiredPeople(looking_for.required_people) }})
            </span>
          </template>
        </div>
      </section>

      <section class="mt-auto">
        <h3 class="text-sm font-medium mb-2">Matching details</h3>
        <ul class="flex flex-wrap gap-2">
          <template v-if="Object.values(user.matching_score).length > 0">
            <li 
              v-for="category in user.matching_score.categories" 
              :key="category.name"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs"
            >
              {{ category.name }}: {{ category.score }}/{{ category.max_score }}
            </li>
          </template>
        </ul>
      </section>
    </div>

    <div class="mt-6 flex gap-2">
      <RequestConnectionButton 
        :user-id="user.clerk_user_id" 
        :existing-connection="user.existing_connection" 
      />
    </div>
  </div>
</template>

<script setup>
import RequestConnectionButton from '@/components/find-teammates/RequestConnectionButton.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const mapRequiredPeople = (required_people) => {
  return required_people === 5 ? '5+' : required_people > 1 ? `${required_people} people` : '1 person';
}
</script>
