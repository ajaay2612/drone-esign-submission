<script>
    import { onMount } from "svelte";

    export let views, previews, form;
    
    let dragOver = null;


    function handleFileSelect(view, event) {
        const file = event.target?.files?.[0] || event;
        form.images[view] = file;
        // console.log(file);
        if (file && file.type?.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previews[view] = e.target.result;
                previews = previews; // trigger reactivity
            };
            reader.readAsDataURL(file);
        }
    }

    function handleDelete(view) {
        previews[view] = null;
        previews = previews; // trigger reactivity
    }

    function handleDragOver(event, view) {
        event.preventDefault();
        dragOver = view;
    }

    function handleDragLeave(event) {
        event.preventDefault();
        dragOver = null;
    }

    function handleDrop(event, view) {
        event.preventDefault();
        dragOver = null;
        const file = event.dataTransfer.files[0];
        handleFileSelect(view, file);
    }
</script>




<div class="flex flex-wrap gap-1hem mt-1em w-full">
    {#each views as view, i}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="w-[calc((100%-1.5em)/2)] md:w-[calc((100%-4.5em)/4)]">
            <div
                class="droneRegInputFieldsContainer width-full  {dragOver === view
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300'}"
                on:dragover={(e) => handleDragOver(e, view)}
                on:dragleave={handleDragLeave}
                on:drop={(e) => handleDrop(e, view)}
            >
                <!-- svelte-ignore a11y_label_has_associated_control -->
            
                <input
                    type="file"
                    name="image_{view}"
                    accept="image/*"
            
                    class="hidden"
                    on:change={(e) =>
                        handleFileSelect(
                            view,
                            e.target.files[0],
                        )}
                    id="file-{view}"
                />
                {#if !previews[view]}
                    <div class="relative">
            
                        <label
                            for="file-{view}"
                            class="gap-0hem flex flex-col items-center w-full aspect-square justify-center border border-[#DBDBDB] rounded-[0.5em] cursor-pointer hover:bg-[#dbdbdb28]"
                        >
                            <span class="size-2em">
                                <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.931641 9.24268L17.1789 9.24268" stroke="#DBDBDB" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M9.05518 1.11914L9.05518 17.3664" stroke="#DBDBDB" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                        </label>
                    </div>
                {:else}
                    <div class="relative">
                        <img
                            src={previews[view]}
                            alt="{view} view preview"
                            class="w-full aspect-square object-contain border border-[#DBDBDB]  rounded-lg"
                        />
                        <!-- svelte-ignore a11y_consider_explicit_label -->
                        <button
                            on:click={() => handleDelete(view)}
                            class="text-[0.9em] absolute top-0hem right-0hem"
                        >
                            <div class="size-[2.5em] bg-red-50 hover:bg-red-100 p-[0.5em] rounded-[0.5em]">
            
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 12V17" stroke="#ff3d3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 12V17" stroke="#ff3d3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#ff3d3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#ff3d3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ff3d3d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            
                            </div>
                        </button>
                    </div>
                {/if}
              
            </div>
        </div>
    {/each}
</div>
