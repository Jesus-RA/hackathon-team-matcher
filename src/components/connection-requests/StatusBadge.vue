<template>
    <span class="px-2 py-1 rounded-full text-xs" :class="status_color[status]">
        {{status.charAt(0).toUpperCase() + status.slice(1)}}
    </span>
</template>

<script setup>
const { status } = defineProps({
    status: {
        type: String,
        required: true
    }
});

const status_color = {
    pending: 'bg-gray-100 dark:bg-gray-700',
    accepted: 'bg-green-100 dark:bg-green-700',
    rejected: 'bg-red-100 dark:bg-red-700',
}
</script>