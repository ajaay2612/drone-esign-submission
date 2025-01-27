<script>
    import { mount, onMount } from "svelte";

    export let error = false
    export let form

    onMount(() => {
        if (form?.error) {
            setTimeout(() => {
                form.error = null
            }, 5000)
        }
    })

</script>


{#if form}
    {#if error}
        <div 
            class="text-[1.1em] bg-red-100 border border-red-400 text-red-700 px-[1em] py-[0.7em] rounded-[0.5em] relative"
            role="alert"
        >
            <span class="block sm:inline">{form.error}</span>
        </div>
    {:else}
        <div
            class="text-[1.1em] bg-green-100 border border-green-400 text-green-700 px-[1em] py-[0.7em] rounded-[0.5em] relative"
            role="alert"
        >
            <span class="block sm:inline"><slot/></span>
        </div>
    {/if}
{/if}