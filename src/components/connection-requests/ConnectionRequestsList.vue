<template>
    <article
        v-for="request in connnectionRequests"
        :key="request.id"
        class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
    >
        <div class="flex justify-between ">
            <div class="flex flex-col gap-3">
                <div>
                    <h3 class="text-lg font-medium">{{ request.recipient.name }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ request.recipient.job_title }}</p>
                </div>
                <p class="text-gray-600 dark:text-gray-400">{{ request.recipient.bio }}</p>
            </div>

            <ConnectionRequestActions :request="request" @request-cancelled="handleRequestCancelled" />
        </div>
    </article>
</template>

<script setup>
import ConnectionRequestActions from './ConnectionRequestActions.vue';

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
