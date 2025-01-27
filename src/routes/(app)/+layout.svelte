<script>
    export let data;
    import Header from "$lib/sections/Header.svelte";
</script>


<div class="
lg:text-[0.9em]
xl:text-[1.3em]
2xl:text-[1.1em]
">
    <Header {data} />
</div>

<slot />
