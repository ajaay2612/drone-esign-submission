<script>
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";

    export let form

    onMount(() => {
        form.registrationType = options[selectedOption].name
    })

    let options = [
        {   
            name:"Part 107",
            desc:"Commercial drone pilots or anyone flying for non-recreational purposes."
        },
        {
            name:"Recreational Flyer",
            desc:"Hobbyists flying drones purely for recreation."
        }
    ]
    let selectedOption = 1
</script>

<div class="flex items-center flex-col gap-1em md:flex-row">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    {#each options as option, i}
        <div on:click={()=> {selectedOption = i, form.registrationType = option.name}} class:activeRgType={selectedOption == i} 
            class="hover:scale-[1.03]  transition-[colors,transform] cursor-pointer border h-[12.5em] flex flex-col gap-[0.85em] border-[#D7D7D7] w-full p-[1.4em] rounded-[0.5em]">
            <div class="transition-colors flex justify-center items-center rgDot size-[1.2em] border rounded-full border-[#D7D7D7]">
                {#if selectedOption == i}
                    <div transition:scale={{start:0.9}} class="bg-[#00D980] size-[50%] rounded-full"></div>
                {/if}
            </div>
            <p class="text-[1.5em]">{option.name}</p>
            <p class="text-[0.9em] text-[#707070] leading-[1.25em]">{option.desc}</p>
        </div>
    {/each}
</div>

