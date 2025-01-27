<script>
    import "../app.css";
    import Showloader from "$lib/stores/Showloader";
    import { navigating } from '$app/state';
    import { fade } from "svelte/transition";
    
</script>


{#if navigating.to || $Showloader}
    <div in:fade={{duration:300, delay:200}} out:fade={{duration:200}}  class="w-full z-[999] fixed h-screen bg-[#00000043] flex justify-center items-center">
        <div class="w-[2em] md:w-[3.5em] lg:w-5em">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200" style="shape-rendering: auto; display: block; background: transparent;"><g><circle stroke-linecap="round" fill="none" stroke-dasharray="50.26548245743669 50.26548245743669" stroke="#005934" stroke-width="8" r="32" cy="50" cx="50">
                <animateTransform values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" repeatCount="indefinite" type="rotate" attributeName="transform"/>
            </circle><g/></g></svg>
        </div>
    </div>
{/if}


<div class="sectionController">
    <slot />
</div>