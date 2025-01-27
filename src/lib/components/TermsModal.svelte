<script>
    export let showModal = false;
    export let onAccept;
    export let onClose;

    function handleAccept() {
        onAccept();
        showModal = false;
    }

    function handleClose() {
        onClose();
        showModal = false;
    }
</script>

{#if showModal}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center p-4"
    >
        <div
            class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl"
        >
            <div class="p-6">
                <h2 class="text-2xl font-semibold mb-4">
                    Drone Registration Terms
                </h2>

                <div class="prose prose-sm max-h-[60vh] overflow-y-auto mb-6">
                    <p class="mb-4">
                        Before proceeding with the drone registration, please
                        review and accept the following terms:
                    </p>

                    <ol class="space-y-4">
                        <li>
                            I confirm that all information provided in this
                            registration form is accurate and complete to the
                            best of my knowledge.
                        </li>
                        <li>
                            I understand that I am responsible for operating the
                            drone in accordance with all applicable local and
                            federal aviation regulations.
                        </li>
                        <li>
                            I acknowledge that registration of this drone may be
                            required by law and that I must maintain current
                            registration and documentation.
                        </li>
                        <li>
                            I agree to maintain appropriate insurance coverage
                            for drone operations as required by applicable
                            regulations.
                        </li>
                        <li>
                            I understand that providing false information in
                            this registration may result in penalties under
                            applicable laws.
                        </li>
                    </ol>
                </div>

                <div class="flex justify-end space-x-4">
                    <button
                        class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                        on:click={handleClose}
                    >
                        Cancel
                    </button>
                    <button
                        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        on:click={handleAccept}
                    >
                        I Accept
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
