<template>
    <article
        v-for="request in connnectionRequests"
        :key="request.id"
        class="light-dark-theme rounded-lg p-6 shadow-lg outline outline-gray-100 dark:outline-none"
    >
        <div class="flex flex-col md:flex-row justify-between gap-4">
            <div class="flex flex-col gap-3">
                <div>
                    <div class="flex items-center justify-between gap-x-2">
                        <h3 class="text-lg font-medium">{{ request.recipient.name }}</h3>
                        <StatusBadge :status="request.status" class="flex md:hidden" />
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ request.recipient.job_title }}</p>
                    <p v-if="request.status === 'accepted' && request.recipient.email" class="flex items-center gap-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail class="size-4" /> {{ request.recipient.email }}
                    </p>
                </div>
                <p class="text-gray-600 dark:text-gray-400">{{ request.recipient.bio }}</p>
            </div>

            <ConnectionRequestActions :request="request" @request-cancelled="handleRequestCancelled" />
        </div>
    </article>
</template>

<script setup>
import ConnectionRequestActions from './ConnectionRequestActions.vue';
import StatusBadge from '@/components/connection-requests/StatusBadge.vue';
import Mail from '@/components/icons/Mail.vue';


import { ref } from 'vue';

const { requests } = defineProps({
    requests: {
        type: Array,
        required: true,
    },
});

const connnectionRequests = ref(requests);

const handleRequestCancelled = (requestId) => {
    connnectionRequests.value = connnectionRequests.value.filter((request) => request.id !== requestId);
}
</script>
