<template>
  <dialog 
    class="light-dark-theme z-1 starting:open:opacity-0 opacity-0 open:opacity-100 transition-discrete duration-300"
    :open="isOpen"
    @close="handleClose"
  >
    <div class="fixed inset-0 flex items-center justify-center p-4 bg-gray-500/50">
      <div class="flex flex-col gap-y-10 bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
        <h3 class="text-2xl font-bold text-center">GitHub Profile Data Preview</h3>
        <!-- Basic Info Preview -->
        <section class="flex flex-col gap-y-2">
          <h4 class="text-lg font-semibold dark:text-gray-300">Basic Information:</h4>
          <div class="grid grid-cols-2 gap-y-4 gap-x-2">
              <div class="">
                <p class="text-normal text-gray-500 dark:text-gray-400">Name:</p>
                <p class="text-lg font-medium">{{ previewData.name }}</p>
              </div>
              <div class="">
                <p class="text-normal text-gray-500 dark:text-gray-400">Portfolio:</p>
                <p class="text-lg font-medium ">
                    {{ previewData.blog }}
                </p>
              </div>
              <div class="col-span-2">
                <p class="text-normal text-gray-500 dark:text-gray-400">Bio:</p>
                <p class="text-lg font-medium">{{ previewData.bio }}</p>
              </div>
          </div>
        </section>

        <!-- Technologies Preview -->
        <section class="flex flex-col gap-y-2">
          <h4 class="text-lg font-semibold dark:text-gray-300">Technologies:</h4>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tech in previewData.technologies" 
              :key="tech"
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
            >
              {{ tech }}
            </span>
          </div>
        </section>

        <!-- Warning -->
        <section>
          <p class="flex py-3 px-4 bg-orange-100/70 dark:bg-orange-400/10 text-orange-400 rounded-lg text-xs text-center">
            <span class="text-xl">⚠️</span>
            <span class="text-sm">
                Basic information will override your current data. Technologies will be added to your current list.
            </span>
          </p>
        </section>

        <!-- Action Buttons -->
        <section class="flex justify-end gap-2">
          <button 
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            @click="handleClose"
          >
            Cancel
          </button>
          <button 
            class="px-4 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md font-medium hover:opacity-90 transition-opacity cursor-pointer"
            @click="applyData"
          >
            Apply Changes
          </button>
        </section>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  previewData: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'apply']);

const handleClose = () => {
  emit('close');
};

const applyData = () => {
  emit('apply');
  handleClose();
};
</script>