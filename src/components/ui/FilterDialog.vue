<template>
  <dialog
    ref="dialog"
    class="light-dark-theme z-1 starting:open:opacity-0 opacity-0 open:opacity-100 transition-discrete duration-300"
    :open="visible"
    @close="handleDialogClose"
  >
    <div class="fixed inset-0 flex items-center justify-center p-4 bg-gray-500/50">
      <main class="light-dark-theme w-full md:max-w-4xl xl:max-w-7xl p-6 rounded-lg">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Filters</h2>
          <button
            @click="close"
            class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
    
        <!-- Filter content -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <!-- Matching Score -->
          <div>
            <label class="block text-sm font-medium mb-1">Matching Score</label>
            <select
              v-model="filters.matchingScore"
              class="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none"
            >
              <option value="0">Any</option>
              <option value="50">50+</option>
              <option value="75">75+</option>
              <option value="90">90+</option>
            </select>
          </div>
    
          <!-- Technologies -->
          <div>
            <label class="block text-sm font-medium mb-1">Technologies</label>
            <MultiSelect
              v-model="filters.technologies"
              :options="technologies"
              placeholder="Select technologies..."
              :search="true"
              :max-displayed-items="2"
            />
          </div>
    
          <!-- Interests -->
          <div>
            <label class="block text-sm font-medium mb-1">Interests</label>
            <MultiSelect
              v-model="filters.interests"
              :options="positions"
              placeholder="Select interests..."
              :search="true"
              :max-displayed-items="2"
            />
          </div>
    
          <!-- Looking For -->
          <div>
            <label class="block text-sm font-medium mb-1">Looking For</label>
            <MultiSelect
              v-model="filters.lookingFor"
              :options="positions"
              placeholder="Select positions..."
              :search="true"
              :max-displayed-items="2"
            />
          </div>
        </div>
    
        <!-- Action buttons -->
        <div class="mt-6 flex justify-end gap-2">
          <button
            @click="resetFilters"
            class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 hover:opacity-90 transition-opacity cursor-pointer"
          >
            Reset
          </button>
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-gray-800 dark:bg-white text-white dark:text-gray-800 rounded-md font-medium text-xs hover:opacity-90 transition-opacity cursor-pointer"
          >
            Apply
          </button>
        </div>
      </main>
    </div>
  </dialog>
</template>

<script setup>
import { ref, useTemplateRef, defineProps, defineEmits, watch, onMounted, onUnmounted } from 'vue';
import MultiSelect from '@/components/ui/MultiSelect.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      matchingScore: 50,
      technologies: [],
      interests: [],
      lookingFor: []
    })
  },
  technologies: {
    type: Array,
    required: true
  },
  positions: {
    type: Array,
    required: true
  },
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'close', 'applyFilters']);

const dialog = useTemplateRef('dialog');
const filters = ref({ ...props.modelValue });

const show = () => {
  console.log('show')
  dialog.value.showModal();
};

const close = () => {
  dialog.value.close();
  emit('close');
};

const handleDialogClose = () => {
  emit('close');
};

const resetFilters = () => {
  filters.value = {
    matchingScore: 50,
    technologies: [],
    interests: [],
    lookingFor: []
  };
  applyFilters();
};

watch(() => props.visible, (dialogOpened) => {
  if (dialogOpened) {
    dialog.value.showModal();
  } else {
    dialog.value.close();
  }
})

const applyFilters = () => {
  emit('applyFilters', filters.value);
  close();
};

// Expose methods to parent component
const expose = {
  show,
  close
};

// Handle keyboard events
onMounted(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      close();
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });
});
</script>
