<template>
    <span v-if="existingConnection && existingConnection.status === 'accepted'" class="flex items-center justify-center gap-x-2 outline outline-gray-300 dark:outline-gray-700 w-full px-4 py-2 rounded-md text-center text-sm">
        Connected ✅
    </span>

    <span v-if="existingConnection && existingConnection.status !== 'accepted'" class="flex items-center gap-x-2 outline outline-gray-300 dark:outline-gray-700 w-full px-4 py-2 rounded-md text-center text-sm">
        Connection request: <StatusBadge :status="existingConnection.status" />
    </span>

    <button
        v-if="!existingConnection"
        class="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md text-sm font-medium transition-opacity cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': loading, 'hover:opacity-90': !loading }"
        :disabled="loading"
        @click="sendConnectionRequest"
    >
        Connect <SpinnerLoader v-if="loading" />
    </button>

    <Toaster richColors position="top-right" />
</template>

<script setup>
import { Toaster, toast } from 'vue-sonner';
import StatusBadge from '@/components/connection-requests/StatusBadge.vue';
import SpinnerLoader from '@/components/ui/SpinnerLoader.vue';

import { ref, defineProps, onMounted } from 'vue';

const { user_id, existing_connection } = defineProps({
    user_id: {
        type: String,
        required: true
    },
    existing_connection: {
        type: Object,
        required: false,
    }
});

const existingConnection = ref(existing_connection);
const loading = ref(false);

const sendConnectionRequest = async () => {
    try {
        loading.value = true;

        const response = await fetch('/api/connection-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipient_user_id: user_id })
        });
        const data = await response.json();
        
        if(!response.ok) {
            const error = await response.json();
            error.error && toast.error(error.error);
            return;

            toast.error('Error connecting with dev, please try again later');
            return;
        }

        toast.success('Connection request sent successfully');
        existingConnection.value = {
            status: 'pending',
            id: data.requestId,
        };
    } catch (error) {
        console.error('Error connecting with dev:', error);
        toast.error('Error connecting with dev, please try again later');
    }finally{
        loading.value = false;
    }
}

</script>