<script>
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    export let data;

    let showProfile = false;
    let showNotification = false;
    const handleWindowClick = (e) => {
        if (showProfile) {
            if (!e.target.closest(".ignoreClickProfile")) {
                showProfile = false;
            }
        }
        if (showNotification) {
            if (!e.target.closest(".ignoreClickNotification")) {
                showNotification = false;
            }
        }
    };

    let colors = {
        "document declined":"#BA4848",
        "document signed":"#009E5F",
        "document received":"#BA9348",
        "document completed":"#009E5F",
    }

    let prevReadState = data.userData.notifications;

    let link = data.userData.superUser ? "/admin/" : "/dashboard/view-fleet/";

    const updateRead = async () => {
        fetch('/api/update-read')
        .then(res => res.json())
        .then(resdData => {
            data.userData.notifications = resdData.notifications || [];
        })
    }

</script>

<svelte:window on:click={handleWindowClick} />

<header
    class="w-full fixed left-0 top-0 z-[98]"
>
    <div class="w-full border-b absolute left-0 top-0 z-[100] block bg-white border-[#DBDBDB]">
        <div class="mainContainer py-1hem flex justify-between items-center
        md:text-[1.1em] md:py-[1.2em]">
            <div class="flex justify-center gap-[1.1em] items-center lg:gap-[2.5em]">
                <div class="w-[1.2em]">
                    <svg
                        viewBox="0 0 19 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M1 1H18" stroke="#707070" stroke-linecap="round" />
                        <path d="M1 7H18" stroke="#707070" stroke-linecap="round" />
                        <path
                            d="M1 13H18"
                            stroke="#707070"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>
                <a href="/" class="w-[9em]">
                    <img
                        class="object-cover w-full h-full"
                        src="/assets/logo.svg"
                        alt=""
                    />
                </a>
            </div>
            <div class="flex justify-center gap-[0.5em] items-center lg:gap-[0.6em]">
                <div class="size-2hem">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="20" cy="20" r="20" fill="#F6F6F6" />
                        <ellipse
                            cx="18.6533"
                            cy="18.7352"
                            rx="5.65331"
                            ry="5.73524"
                            stroke="#949494"
                            stroke-width="1.2"
                        />
                        <path
                            d="M27.7856 28.0001L24.3066 24.4707"
                            stroke="#949494"
                            stroke-width="1.2"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button on:click={()=> {showNotification = !showNotification, updateRead() }} class="ignoreClickNotification md:relative size-2hem">
                    <svg
                        viewBox="0 0 40 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle cx="20" cy="20" r="20" fill="#F6F6F6" />
                        <path
                            d="M15.1721 16.4951C15.4454 14.035 17.5248 12.1738 20 12.1738V12.1738C22.4753 12.1738 24.5547 14.035 24.828 16.4951L25.047 18.4657C25.1593 19.4766 25.4883 20.4514 26.0116 21.3236L26.5143 22.1613C26.8649 22.7456 27.0402 23.0378 27.0573 23.2757C27.0864 23.6778 26.8711 24.0581 26.5113 24.2401C26.2985 24.3477 25.9578 24.3477 25.2764 24.3477H14.7237C14.0423 24.3477 13.7016 24.3477 13.4887 24.2401C13.129 24.0581 12.9137 23.6778 12.9427 23.2757C12.9599 23.0378 13.1352 22.7456 13.4858 22.1613L13.9884 21.3236C14.5117 20.4514 14.8408 19.4766 14.9531 18.4657L15.1721 16.4951Z"
                            stroke="#949494"
                        />
                        <path
                            d="M17.4801 24.7008C17.6288 25.3479 17.9563 25.9198 18.4119 26.3276C18.8675 26.7355 19.4257 26.9565 19.9999 26.9565C20.5742 26.9565 21.1324 26.7355 21.588 26.3276C22.0436 25.9198 22.3711 25.3479 22.5198 24.7008"
                            stroke="#949494"
                            stroke-linecap="round"
                        />
                    </svg>
                    {#if data.userData.notifications.some(item => !item.read)}
                        <div class="absolute size-[0.4em] top-[0.65em] right-[.8em] rounded-full bg-[#FE8049]"></div>
                    {/if}
                    {#if showNotification}
                        <div transition:fly={{y:-10}} class="max-h-[15em] overflow-y-scroll ignoreClickNotification px-[0.5em] border border-[#D7D7D7] text-[1.24em] text-right absolute z-[99] top-5em  md:rounded-[0.3em] right-0 bg-[#fff] shadow-md w-full 
                        md:text-[1.1em]
                        md:right-0 md:top-3em
                        md:w-[16em]">
                            {#if data.userData.notifications.length === 0}
                                <p class="text-[#B4B4B4] text-[0.9em] text-center py-[1em]">No notifications</p>
                            {:else}
                                {#each data.userData.notifications as item, i}
                                    <a 
                                    style="opacity: {prevReadState[i].read ? 0.5: 1};"
                                    href="{link}{item.droneId}" class="group flex gap-[0.5em] justify-between text-left py-[1em] px-[0.5em] border-b border-[#D7D7D7] last:border-0">
                                        <div class="grow">
                                            <p
                                            style="color:{ colors[item.event] }"
                                            class="capitalize font-medium mb-[0.2em]">{item.event}</p>
                                            <p class="text-[#B4B4B4] group-hover:text-[#818181] text-[0.7em] leading-[1.1em]">{item.message}</p>
                                            
                                        </div>
    
                                        <div class="w-[0.5em] shrink-0">
                                            <svg  viewBox="0 0 21 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path class="group-hover:stroke-[#818181]" d="M2 2.5L17 17.5L2 32.5" stroke="#B4B4B4" stroke-width="5"/>
                                            </svg>                        
                                        </div>
                                    </a>
    
                                {/each}
                            {/if}
                        </div>
                    {/if}
                </button>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button on:click={()=> showProfile = !showProfile} class="ignoreClickProfile ml-1em lg:ml-[1.1em] flex justify-center items-center gap-[0.5em] md:relative">
                    <div class="size-3em">
                        {#if data?.user?.image}

                            <img
                                class="object-cover w-full h-full rounded-full"
                                src={data.user.image}
                                alt=""
                                on:error={() => (data.user.image = null)}
                            />
                        {:else}
                            <svg
                                viewBox="0 0 46 46"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="23" cy="23" r="23" fill="#F6F6F6" />
                                <circle
                                    cx="22.425"
                                    cy="17.825"
                                    r="5.75"
                                    stroke="#949494"
                                    stroke-width="1.15"
                                />
                                <path
                                    d="M33.925 30.4753C33.925 31.5371 32.9409 32.6899 30.8958 33.6102C28.9046 34.5062 26.1136 35.0753 23 35.0753C19.8864 35.0753 17.0954 34.5062 15.1042 33.6102C13.0591 32.6899 12.075 31.5371 12.075 30.4753C12.075 29.4135 13.0591 28.2607 15.1042 27.3404C17.0954 26.4444 19.8864 25.8753 23 25.8753C26.1136 25.8753 28.9046 26.4444 30.8958 27.3404C32.9409 28.2607 33.925 29.4135 33.925 30.4753Z"
                                    stroke="#949494"
                                    stroke-width="1.15"
                                />
                            </svg>
                        {/if}
                    </div>
                    <div
                    style={showProfile ? "rotate: 180deg;":""}
                    class="hidden transition-[rotate] duration-[400ms] lg:block w-1em">
                        <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 1L7 7L1 1" stroke="#C4C4C4"/>
                        </svg>
                    </div>



                    {#if showProfile}
                        <div transition:fly={{y:-10}} class="max-h-[15em]  ignoreClickNotification px-[0.5em] border border-[#D7D7D7] text-[1.24em] text-right absolute z-[99] top-5em  md:rounded-[0.3em] right-0 bg-[#fff] shadow-md w-full 
                        md:text-[1.1em]
                        md:right-0 md:top-3em
                        md:w-[16em]">
                            <div class="px-[0.5em]">
                                <p class="text-[#545454] text-right mr-[0.3em] gap-[0.5em] justify-between font-medium py-[1.2em] md:py-[1em]">{data.user.email}</p>
                                
                                <a data-sveltekit-preload-data="false" href="/signout" class="mb-1hem ml-auto text-[0.75em] font-medium gradButton bg-[#00D980] text-white capitalize text-center py-[0.6em] rounded-[0.5em] w-[9em] block">sign out</a>
                            </div>
                        </div>
                    {/if}
        
                </button>
            </div>
        </div>

    
    </div>

   
   


</header>

<!-- dummy -->
<div class="h-6hem md:h-6em"></div>
