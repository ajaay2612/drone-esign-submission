<script>
    import { scale } from 'svelte/transition';

    export let data;
    
    const headerItems = [
        { key: "userName", label: "user", phone:true },
        { key: "nickname", label: "Nickname", phone:true, color:"#009E5F" },
        { key: "registrationId", label: "Reg ID", phone:false },
        { key: "droneId", label: "Drone ID", phone:false },
        { key: "modelNumber", label: "Model", phone:false },
        { key: "signatureStatus", label: "Status", phone:true, accent: { transfering: "yellowHighlight", transferred:"greenHighlight",declined:'redHighlight', pending: 'yellowHighlight', registered: 'greenHighlight' }},
        { key: "createdAt", label: "Date", phone:false },
        { key: "action", label: "action", phone:true },
    ];
    const trimRegistration = (id) => id?.slice(0, 4) + '...';



    const copyToClipboard = (droneIndex, text) => {
        navigator.clipboard.writeText(text);
        showCopyIndex = droneIndex;
        setTimeout(() => {
            showCopyIndex = null;
        }, 2000);
    }
    function formatDate(date) {
        return new Date(date).toLocaleDateString();
    }
    let showCopyIndex = null;

    function getStatusColor(status) {
        const statusColors = {
            pending: "bg-yellow-100 text-yellow-800",
            approved: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            default: "bg-gray-100 text-gray-800",
        };
        return statusColors[status.toLowerCase()] || statusColors.default;
    }

    let drones = data.allDrones;
    let activeDrones = data.activeDrones
    let pendingDrones = data.pendingDrones
    let rejectedDrones = data.rejectedDrones
        

    let droneAnalytics = [
        {
            label: "Total Registered Drones",
            value: drones.length,
        },
        {
            label: "Pending Verification Drones",
            value: pendingDrones[1]
        },
        {
            label: "Active Drones",
            value: activeDrones[1]
        },
        {
            label: "Rejected Drones",
            value: rejectedDrones[1],
        },
    ]

    let buttons = [
        {
            label : "view",
            link: (id) => {return `/admin/${id}`},
            preload : ""
        },
        // {
        //     label : "inactivate",
        //     link: (id) => {return `/admin/inactivate-drone/${id}`},
        //     preload : false

        // },
        // {
        //     label : "transfer ownership",
        //     link: (id) => {return `/admin/transfer-ownership/${id}`},
        //     preload : false
        // },


    ]

    // console.log(data);
</script>

<main
    class=" relative pt-2hem
    lg:text-[0.85em]
    xl:text-[1em]  xl:pt-3em
    2xl:text-[0.95em] 2xl:pt-4em"
>
    <div class="mainContainer dashContainer">
        <h1 class="font-medium text-[2.5em] lg:text-[3em]">Admin Panel</h1>

        <div class="lg:text-[0.9em]">
            {#if data?.drones?.length != 0}
                <div class="text-[1.2em]">
                    <div class="grid grid-cols-2 gap-[0.6em] gap-y-[1em] mt-2em lg:grid-cols-4">
                        {#each droneAnalytics as analytics}
                            <div
                            style="box-shadow: 0px -0.25em 0px #00D980"
                            class="gap-0hem p-[0.8em] lg:px-1em flex flex-col justify-between border border-t-0 border-[#D7D7D7] rounded-[0.4em]">
                                <h2 class="text-[#707070]">{analytics.label}</h2>
                                <p class="text-[1.5em]">{analytics.value}</p>
                            </div>
                        {/each}
                    </div>
                    <div class="text-[#707070] font-medium mt-2hem border border-[#D7D7D7] rounded-[0.4em]">
                        <div class="text-[0.86em] md:text-[1.09em] grid grid-cols-[0.9fr_1fr_1.3fr_0.6fr] lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.4fr_1fr_0.8fr]" >
                            {#each headerItems as header}
                                <div data-hidden={header.phone} class="capitalize px-[0.9em] py-[0.4em] md:p-[1em] md:px-[1.5em] data-[hidden=false]:hidden lg:data-[hidden=false]:block">
                                    {header.label}
                                </div>
                            {/each}
                        </div>
            
                        {#each drones as drone, droneIndex}
                            <div class="text-[0.86em] md:text-[1.09em] grid grid-cols-[0.9fr_1fr_1.3fr_0.6fr] lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_1.4fr_1fr_0.8fr] border-t border-[#D7D7D7]" >
                                {#each headerItems as header}
                                    <div
                                    style="{header.color? `color:${header.color}` : ''}"
                                    data-hidden={header.phone} class=" w-fit flex items-center capitalize px-[0.9em] py-[0.4em] md:p-[1em] md:px-[1.5em] data-[hidden=false]:hidden lg:data-[hidden=false]:flex">
                                        {#if header.key == "action"}
                                            <div class="relative group h-full">
                                                <div class="cursor-pointer px-[0.4em] h-full flex item-center">
                                                    <div class=" w-[1.2em]">
                                                        <svg viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="8" cy="2" r="1" transform="rotate(-90 8 2)" stroke="#707070" stroke-width="2" stroke-linecap="round"/>
                                                            <circle cx="2" cy="2" r="1" transform="rotate(-90 2 2)" stroke="#707070" stroke-width="2" stroke-linecap="round"/>
                                                            <circle cx="14" cy="2" r="1" transform="rotate(-90 14 2)" stroke="#707070" stroke-width="2" stroke-linecap="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div class="transition-opacity opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto space-y-[0.4em] absolute right-[0.3em] w-[14em] top-[calc(95%)] border border-[#D7D7D7] rounded-[0.3em] bg-white p-[0.5em]">
                                                    {#each buttons as button}
                                                        <a data-sveltekit-preload-data={button.preload} href={button.link(drone.id)} class="py-[0.5em] px-[0.8em] rounded-[0.5em] hover:bg-[#F6F6F6] font-medium block">
                                                            {button.label}
                                                        </a>
                                                    {/each}
                                                </div>
                                            </div>
                                        {:else if header.key == "droneId"}
                                            <button
                                            on:click={() => copyToClipboard(droneIndex, drone[header.key])}
                                            class="relative py-[0.3em]">
                                                {trimRegistration(drone[header.key])}
                                                {#if droneIndex == showCopyIndex}
                                                    <div transition:scale class="absolute py-[0.2em] bg-[#ffffff] border z-[10] px-[1.5em] text-[1.1em] top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 bg-[#e4e4e400] rounded-[0.3em]">Copied</div>
                                                {/if}
                                            </button>
                                        {:else if header.key == "createdAt"}
                                            <div class="py-[0.3em]">{formatDate(drone[header.key])}</div>
                                        {:else if header.key == "userName"}
                                            <div class="py-[0.3em]">{drone.user.firstName} {drone.user.lastName}</div>
                                        {:else}
                                            <div class="{header?.accent ? header.accent[drone[header.key]] :""} py-[0.3em]">{drone[header.key] == null ? "-" : drone[header.key] ==="transferred" ? "verified" :drone[header.key] }</div>
                                        {/if}
                                    </div>
                                {/each}
                            </div>
                        {/each}
                    </div>
                </div>
            {:else}
                <h2 class="capitalize mt-0hem text-[#707070] font-medium text-[1.5em] lg:text-[2em]">nothing yet</h2>
            {/if}
        </div>






    </div>
    
</main>
