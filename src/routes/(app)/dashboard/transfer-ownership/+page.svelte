<script>
    import { enhance } from '$app/forms';
    import Alert from "$lib/components/Alert.svelte";
    import { slide } from 'svelte/transition';
    import Showloader from '$lib/stores/Showloader.js';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    export let data
    export let form;


    $: if(form?.error){
        $Showloader = false;
    }

    let activeDrones = data.activeDrones[0];

    let drones = data.activeDrones[0].map(drone => {
        return {
            droneId: drone.droneId,
            id: drone.id
        }
    });

    let initialValue = ""

    onMount(() => {
        const urlParams = $page.url.searchParams;
        const droneId = urlParams.get('droneId');

        console.log(droneId);
        if (droneId) {
            initialValue = droneId;
            urlParams.delete('droneId');
            window.history.replaceState({}, '', `${window.location.pathname}`);
        }
        


        // const droneId = urlParams.get('droneId');
        // if (droneId) {
        //     const selectedDrone = drones.find(drone => drone.id === droneId);
        //     if (selectedDrone) {
        //         activeDrones = [selectedDrone];
        //     }
        // }
    });

</script>

<main
    class=" relative
    lg:text-[0.85em]
    xl:text-[1em]
    2xl:text-[0.95em]"
>
    <div class="mainContainer dashContainer ">
        <div class="flex justify-center items-center h-[calc(100dvh-11em)]">
            <div class="">
                <h1 class="text-center font-medium text-[2.5em] lg:text-[3em]">Transfer Ownership</h1>
                <p class="text-center text-[1.2em] font-plus-jakara font-medium text-[#707070]"> Please enter the email address of the new owner below</p>
            
                <form method="POST" on:submit={() => $Showloader = true} 
                    use:enhance                    
                    class="mt-[4em] space-y-[1.7em] border border-[#DBDBDB] rounded-[0.6em] w-full md:w-[44em] px-[1.7em] md:px-[4.5em] pt-2hem  md:pt-[4em] pb-[1.5em] md:pb-3em">
                    <div class="space-y-[1.4em]">
                        <div class="space-y-[0.4em]">
                            <label for="email" class="text-[1.3em] font-plus-jakara font-medium">Enter email address</label>
                            <div class="text-[1.2em]"><input placeholder="abc@gmail.com" type="email" id="email" name="email" value="" class="droneRegInputFields" required></div>
                        </div>
                        <div class="space-y-[0.4em]">
                            <label for="drone" class="text-[1.3em] font-plus-jakara font-medium">Select Drone</label>
                            <div class="text-[1.2em]">
                                <select 
                                value={initialValue}
                                id="drone" name="droneId" class="droneRegInputFields h-[2.6em]" required>
                                    <option value="" disabled selected>Select a drone</option>
                                    {#each drones as drone}
                                        <option value={drone.id}>{drone.droneId}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>

                    {#if form?.error}
                        <div transition:slide={{duration:300}} class=" mt-1em">
                            <Alert bind:form={form} error={true} />
                        </div>
                    {/if}
                    <div class="md:pt-[0.5em]">
                        <button 

                            type="submit"
                            class="text-[1.2em] disabled:opacity-75 mx-auto mt-1em disabled:pointer-events-none gradButton bg-[#00D980] text-white capitalize text-center py-[0.6em] rounded-[0.5em] w-[9em] block"
                            >transfer
                        </button>
                    </div>
                </form>
            </div>
        </div>
       
    </div>
    
</main>
