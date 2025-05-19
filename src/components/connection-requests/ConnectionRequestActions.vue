<template>
    <div>
        <section class="flex flex-col gap-4 items-end justify-between h-full">
            <StatusBadge :status="request.status" class="hidden md:flex" />
            <div v-show="request.status === 'pending'" class="flex w-full gap-2">
                <button
                    v-show="authStore.userId === request.requester_user_id"
                    @click="cancelConnectionRequest"
                    class="px-3 py-1 bg-gray-600 text-sm text-white rounded-md transition-colors grow-1 md:grow-0"
                    :class="{ 'opacity-50 cursor-not-allowed': loading, 'hover:opacity-90 cursor-pointer': !loading }"
                    :disabled="loading"
                >
                    Cancel
                </button>
                <div v-show="authStore.userId === request.recipient_user_id" class="flex w-full gap-2">
                    <button
                        @click="acceptConnection"
                        class="px-3 py-1 bg-green-600 text-sm text-white rounded-md transition-colors grow-1 md:grow-0  "
                        :class="{ 'opacity-50 cursor-not-allowed': loading, 'hover:opacity-90 cursor-pointer': !loading }"
                        :disabled="loading"
                    >
                        Accept
                    </button>
                    <button
                        @click="rejectConnection"
                        class="px-3 py-1 bg-red-600 text-sm text-white rounded-md transition-colors grow-1 md:grow-0"
                        :class="{ 'opacity-50 cursor-not-allowed': loading, 'hover:opacity-90 cursor-pointer': !loading }"
                        :disabled="loading"
                    >
                        Reject
                    </button>
                </div>
                <SpinnerLoader v-if="loading" class="self-center size-6 border-r-white border-r-4 border-4" />
            </div>
        </section>
        <Toaster richColors position="top-right" />
    </div>
</template>

<script setup>
import StatusBadge from '@/components/connection-requests/StatusBadge.vue';
import { Toaster, toast } from 'vue-sonner';
import SpinnerLoader from '@/components/ui/SpinnerLoader.vue';

import { $authStore } from '@clerk/astro/client';
import { useStore } from '@nanostores/vue';

import { ref, computed, defineEmits } from 'vue';

const { request } = defineProps({
    request: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['requestCancelled']);

const authStore = useStore($authStore);

const loading = ref(false);

const acceptConnection = () => {
    updateConnectionRequest('accepted');
}

const rejectConnection = () => {
    updateConnectionRequest('rejected');
}

const cancelConnectionRequest = () => {
    deleteConnectionRequest();
}

const updateConnectionRequest = async (status) => {
    loading.value = true;
    try{
        const response = await fetch(`/api/connection-requests/${request.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });
        const data = await response.json();

        console.log({response, data})

        if (!response.ok) {
            toast.error(`Failed to ${status} connection request, please try again later`);
            return;
        }

        toast.success(`Connection request ${status} successfully`);
        request.status = status;
    }catch(error){
        console.error({error});
        toast.error(`Failed to ${status} connection request, please try again later`);
    }finally{
        loading.value = false;
    }
}

const deleteConnectionRequest = async () => {
    loading.value = true;
    try{
        const response = await fetch(`/api/connection-requests/${request.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();

        console.log({response, data})

        if (!response.ok) {
            toast.error(`Failed to cancel connection request, please try again later`);
            return;
        }

        toast.success(`Connection request cancelled successfully`);
        emit('requestCancelled', request.id);
    }catch(error){
        console.error({error});
        toast.error(`Failed to cancel connection request, please try again later`);
    }finally{
        loading.value = false;
    }
}
</script>
