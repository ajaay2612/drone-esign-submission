<script>
    import { page } from "$app/stores";
    import { scale } from "svelte/transition";
    import { onDestroy, onMount } from 'svelte';
    import DocumentBlock from "$lib/components/DocumentBlock.svelte";
    export let data;
    // console.log(data)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString();
    };
    
    let drone = data.drone

    let showRegData = [
        {
            label:"Full Name",
            value: drone.userName,
        },
        {
            label:"Email",
            value: drone.userEmail,
        },
        {
            label:"Nickname",
            value: drone.nickname,
        },
        {
            label:"Registration ID",
            value: drone.registrationId,
        },
        {
            label:"drone ID",
            value:drone.droneId,
        },
        {
            label:"Model",
            value:drone.modelNumber,
        },
        {
            label:"Date of Registration",
            value:formatDate(drone.createdAt),
        },
        {
            label:"Active status",
            value:drone.active,
        }
      
    ]

    // console.log(data.drone)

    let showSigningSuccess = false;
    let showSigningDecline = false;
    let showSigningCancel = false;

    onMount(() => {
        if ($page.url.searchParams.get('event')) {
            if ($page.url.searchParams.get('event') === 'signing_complete') {
                showSigningSuccess = true;
                setTimeout(() => {
                    showSigningSuccess = false;
                }, 5000);
            }
            if ($page.url.searchParams.get('event') === 'decline') {
                showSigningDecline = true;
                setTimeout(() => {
                    showSigningDecline = false;
                }, 5000);
            }
            if ($page.url.searchParams.get('event') === 'cancel') {
                showSigningCancel = true;
                setTimeout(() => {
                    showSigningCancel = false;
                }, 5000);
            }

            const url = new URL($page.url);
            url.searchParams.delete('event');
            history.replaceState(null, '', url);
        }
    }); 

    let currentIndex = data.envelopeStatuses.length - 1 || 0;
    
    function nextDoc() {
        if (currentIndex < data.envelopeStatuses.length - 1) {
            currentIndex++;
        }
    }

    function prevDoc() {
        if (currentIndex > 0) {
            currentIndex--;
        }
    }

</script>

{#if showSigningSuccess}
    <div transition:scale={{start:0.8}} class="shadow-md z-[99] leading-[1.1em] fixed left-1/2 -translate-x-1/2 top-[5.85em] bg-[#D4F9EA] text-[#009E5F] flex w-[19em] md:w-fit px-[1.2em] md:px-[1.9em] justify-center text-[1.23em] items-center gap-[0.95em] py-[1.1em] rounded-[0.5em] 
    lg:top-[7.6em] lg:text-[1.1em]
    xl:top-[5.6em] xl:text-[1.3em]">
        <div class="w-[2em] md:w-[0.9em]">
            <svg  viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.42802 1.82622L7.08701 0.60656C8.7428 0.0546297 9.57069 -0.221335 10.0077 0.215681C10.4447 0.652697 10.1688 1.48059 9.61683 3.13638L8.39717 6.79537C7.64243 9.05959 7.26506 10.1917 6.5784 10.2224C6.54864 10.2237 6.51883 10.2237 6.48907 10.2224C5.81556 10.1923 5.43961 9.10255 4.71326 6.92424L5.93037 5.70707C6.32089 5.31654 6.32087 4.68337 5.93033 4.29286C5.5398 3.90234 4.90663 3.90236 4.51612 4.2929L3.299 5.51008C1.12079 4.78376 0.0311092 4.40781 0.000997961 3.73432C-0.000332654 3.70456 -0.000332654 3.67475 0.000997961 3.64499C0.0316979 2.95833 1.1638 2.58096 3.42802 1.82622Z" fill="#009E5F"/>
            </svg>              
        </div>
        <p class="md:whitespace-nowrap">Document has been signed</p>
    </div>
{/if}
{#if showSigningDecline}
    <div transition:scale={{start:0.8}} class="shadow-md z-[99] leading-[1.1em] fixed left-1/2 -translate-x-1/2 top-[5.85em] bg-[#EFD4D4] text-[#BA4848] flex w-[19em] md:w-fit px-[1.2em] md:px-[1.9em] justify-center text-[1.23em] items-center gap-[0.95em] py-[1.1em] rounded-[0.5em] 
    lg:top-[7.6em] lg:text-[1.1em]
    xl:top-[5.6em] xl:text-[1.3em]">
        <div class="w-[2em] md:w-[0.9em]">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.25 18L0 12.75V5.25L5.25 0H12.75L18 5.25V12.75L12.75 18H5.25ZM6.15 13.25L9 10.4L11.85 13.25L13.25 11.85L10.4 9L13.25 6.15L11.85 4.75L9 7.6L6.15 4.75L4.75 6.15L7.6 9L4.75 11.85L6.15 13.25ZM6.1 16H11.9L16 11.9V6.1L11.9 2H6.1L2 6.1V11.9L6.1 16Z" fill="#BA4848"/>
            </svg>                            
        </div>
        <p class="md:whitespace-nowrap">You have declined to sign the document </p>
  
    </div>
{/if}
{#if showSigningCancel}
    <div transition:scale={{start:0.8}} class="shadow-md z-[99] leading-[1.1em] fixed left-1/2 -translate-x-1/2 top-[5.85em] bg-[#F4EDE0] text-[#BA9348]  flex w-[19em] md:w-fit px-[1.2em] md:px-[1.9em] justify-center text-[1.23em] items-center gap-[0.95em] py-[1.1em] rounded-[0.5em] 
    lg:top-[7.6em] lg:text-[1.1em]
    xl:top-[5.6em] xl:text-[1.3em]">
        <div class="w-[2em] md:w-[0.9em]">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.25 18L0 12.75V5.25L5.25 0H12.75L18 5.25V12.75L12.75 18H5.25ZM6.15 13.25L9 10.4L11.85 13.25L13.25 11.85L10.4 9L13.25 6.15L11.85 4.75L9 7.6L6.15 4.75L4.75 6.15L7.6 9L4.75 11.85L6.15 13.25ZM6.1 16H11.9L16 11.9V6.1L11.9 2H6.1L2 6.1V11.9L6.1 16Z" fill="#BA9348"/>
            </svg>                            
        </div>
        <p class="md:whitespace-nowrap">You have cancelled to sign the document </p>
  
    </div>
{/if}

<main
    class=" relative pt-2hem
    lg:text-[0.85em]
    xl:text-[1em]  xl:pt-3em
    2xl:text-[0.95em] 2xl:pt-4em"
>
    <div class="mainContainer dashContainer font-medium  mb-3em lg:grid lg:grid-cols-2 lg:gap-5em
    md:text-[1.2em] lg:text-[1em] 2xl:text-[1.15em] lg:mt-1hem">

        <div class="space-y-[2em] relative">
            <DocumentBlock 
                allAggrements={data.envelopeStatuses} 
                agreementId={data.envelopeStatuses[currentIndex].agreementId} 
                docData={data.envelopeStatuses[currentIndex].agreementData}
            />
            <div class="absolute -left-5em top-[1em] rotate-90 w-5em flex justify-between items-center">
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button 
                disabled={currentIndex === 0}
                class="disabled:opacity-50 w-[1em]" on:click={prevDoc}>
                    <svg class="rotate-180" viewBox="0 0 30 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 3L24.5 25L2.5 47" stroke="black" stroke-width="3"/>
                    </svg>
                </button>

                <p class="-rotate-90">{currentIndex +1} / {data.envelopeStatuses.length}</p>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button
                disabled={currentIndex === data.envelopeStatuses.length - 1}
                class="disabled:opacity-50 w-[1em]" on:click={nextDoc}>
                    <svg viewBox="0 0 30 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 3L24.5 25L2.5 47" stroke="black" stroke-width="3"/>
                    </svg>
                </button>
            </div>
        </div>
    
        <div class="border-t border-[#D7D7D7] pt-2hem mt-2hem
        lg:m-0 lg:p-0 lg:border-0 lg:text-[1.2em]">
            <div class=" text-[1.1em] grid grid-cols-2 gap-x-[1em] gap-y-1hem mb-[1.5em]">
                {#each showRegData as item}
                    {#if item.label == "Active status"}
                        <div class="">
                            <p class="text-[0.9em] text-[#707070]">{item.label}:</p>
                            <p>{!item.value ? "Inactive":"Active"}</p>
                        </div>
                    {:else}
                        <div class="">
                            <p class="text-[0.9em] text-[#707070]">{item.label}:</p>
                            <p>{item.value || "-"}</p>
                        </div>
                    {/if}
                {/each}
            </div>

            <div class=" text-[1.1em]">
                <p class="text-[0.9em] text-[#707070] mb-[0.3em]">Drone Images</p>
                <div class="grid grid-cols-2 gap-[0.5em] md:grid-cols-4
                lg:grid-cols-4">
                    {#each drone.images as image}
                        <div class="aspect-square rounded-[0.5em] bg-[#00d17a15] block"><img class="w-full h-full object-contain " src="{Object.values(image)[0]}" alt=""></div>
                    {/each}                 
                </div>
            </div>



        </div>





    </div>
    
</main>

