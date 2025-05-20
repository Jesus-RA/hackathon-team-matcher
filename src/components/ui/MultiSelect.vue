<template>
  <div class="w-full relative">
    <!-- Select container -->
    <div 
      class="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer"
      @click="isOpen = !isOpen"
      :class="{ 'border-gray-500': hasError, 'ring-2 ring-gray-500': hasFocus }"
    >
      <div class="flex items-center justify-between p-3">
        <!-- Selected items -->
        <div class="flex flex-wrap gap-2 flex-1">
          <template v-if="selectedItems.length > 0">
            <template v-if="selectedItems.length <= props.maxDisplayedItems">
              <span
                v-for="item in selectedItems"
                :key="item.id"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium"
              >
                {{ item.name }}
                <button
                  type="button"
                  @click.stop="removeItem(item)"
                  class="ml-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </span>
            </template>
            <template v-else>
              <span
                v-for="item in selectedItems.slice(0, props.maxDisplayedItems)"
                :key="item.id"
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium"
              >
                {{ item.name }}
                <button
                  type="button"
                  @click.stop="removeItem(item)"
                  class="ml-1 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </span>
              <span
                class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs font-medium"
              >
                +{{ selectedItems.length - props.maxDisplayedItems }} more
              </span>
            </template>
          </template>
          <template v-else>
            <span class="text-gray-400 dark:text-gray-500">{{ placeholder }}</span>
          </template>
        </div>
        <!-- Clear selections button -->
        <button
          v-if="selectedItems.length > 0"
          type="button"
          @click="clearSelections"
          class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 ml-2"
        >
          Clear
        </button>
        <!-- Arrow icon -->
        <div class="flex items-center">
          <svg
            class="w-4 h-4 text-gray-400 dark:text-gray-500"
            :class="{ 'rotate-180': isOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Options dropdown -->
    <div
      v-if="isOpen"
      class="absolute w-full mt-1 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 z-50"
      :class="{ 'max-h-64 overflow-y-auto': options.length > 6 }"
    >
      <div class="p-3">
        <input
          v-if="search"
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          @keydown.esc="searchQuery = ''"
        />
      </div>
      <div
        v-for="option in filteredOptions"
        :key="option.id"
        class="px-3 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer"
        :class="{ 'bg-gray-100 dark:bg-gray-700': isSelected(option) }"
        @click="toggleOption(option)"
      >
        <div class="flex items-center justify-between">
          <span>{{ option.name }}</span>
          <span
            v-if="isSelected(option)"
            class="text-gray-600 dark:text-blue-400"
          >✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select options...'
  },
  search: {
    type: Boolean,
    default: true
  },
  hasError: {
    type: Boolean,
    default: false
  },
  hasFocus: {
    type: Boolean,
    default: false
  },
  maxDisplayedItems: {
    type: Number,
    default: 2
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');

const selectedItems = computed(() => {
  return props.options.filter(option => 
    props.modelValue.some(selected => selected.id === option.id)
  );
});

const filteredOptions = computed(() => {
  if (!props.search || !searchQuery.value) {
    return props.options;
  }
  
  return props.options.filter(option => 
    option.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const isSelected = (option) => {
  return props.modelValue.some(selected => selected.id === option.id);
};

const toggleOption = (option) => {
  const newSelection = isSelected(option)
    ? props.modelValue.filter(item => item.id !== option.id)
    : [...props.modelValue, option];
  
  emit('update:modelValue', newSelection);
};

const removeItem = (item) => {
  const newSelection = props.modelValue.filter(selected => selected.id !== item.id);
  emit('update:modelValue', newSelection);
};

const clearSelections = () => {
  emit('update:modelValue', []);
};

watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

const handleClickOutside = (event) => {
  const selectElement = event.target.closest('.w-full.relative');
  if (!selectElement) {
    isOpen.value = false;
  }
};
</script>
