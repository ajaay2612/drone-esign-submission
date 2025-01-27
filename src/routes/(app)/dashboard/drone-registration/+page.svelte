<script>
    import RegistrationType from "$lib/formParts/RegistrationType.svelte";
    import DroneInformation from "$lib/formParts/DroneInformation.svelte";
    import { scale } from "svelte/transition";
    import Showloader from "$lib/stores/Showloader";

    let showError = false;

    let clickWrapData = null;
    let views = ["top", "bottom", "front", "back"];
    let previews = Object.fromEntries(views.map((view) => [view, null]));

    let form = {
        registrationType: "Recreational Flyer",
        nickname: "",
        modelNumber: "",
        serialNumber: "",
        manufacturer: "",
        images: {}
    };

    let finalValidation = () => {
        return false
        // return !form.nickname || !form.modelNumber || !form.serialNumber || !form.manufacturer || !form.images.image_top || !form.images.image_bottom || !form.images.image_front || !form.images.image_back;
    };


    
    async function submit() {
        const formData = new FormData();

        // Append simple form fields
        for (const [key, value] of Object.entries(form)) {
            if (key !== 'images') {
                formData.append(key, value);
            }
        }

        // Append images if any
        for (const [view, file] of Object.entries(form.images)) {
            if (file) {
                formData.append(`image_${view}`, file);
            }
        }

        formData.append(`clickWrapData`, JSON.stringify(clickWrapData));


        try {
            const response = await fetch('', {
                method: 'POST',
                body: formData,
                headers: {
                // No need to manually set Content-Type for FormData
                'x-sveltekit-action': 'true',
            }
        });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            let data = await response.json();
            // console.log('Raw result:', JSON.stringify(data, null, 2));
            if (data.location) {
                location.href = data.location;
            }else{
                $Showloader = false
                showError = true;
                setTimeout(() => {
                    showError = false;
                }, 5000);
                console.log('error', data);
            }

        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    let steps = [
        {name: "Registration Type", title:"Registration Type"},
        {name: "Drone Information",title:"Drone Information & Specifications"},
    ]
    let currentStep = 0


    // clickwrap
    let showClickwrap = false;

    async function handleSubmit(event) {
        $Showloader = true

        // First, get the clickwrap URL
        const response = await fetch('',{
            headers: {
                // No need to manually set Content-Type for FormData
                // 'x-sveltekit-action': 'true',
            }
        });

        const data = await response.json();
        console.log('Clickwrap data:', data);
        showClickwrap = true;       

        let events = {
            onAgreed: (agData) => {
                console.log("Terms accepted!",agData);
                showClickwrap = false;
                clickWrapData = {agreementId:agData.agreementId,clickwrapId:agData.clickwrapId};

                submit();
            },
            onDeclined: () => {
                console.log("Terms declined");
                showClickwrap = false;
            }
        };

        let style = {
            agreeButton: {
                color: "#15553a",
                backgroundColor: "#d0f8e7",
                width: "100%",
                padding: "0.5em",
                borderRadius: "0.4em"
            },
            container: {
                borderWidth:"0"
            },
        };
        
        docuSignClick.Clickwrap.render({...data,style,...events},'#clickwrap-container')
    }

    
</script>


{#if showError}
    <div transition:scale={{start:0.8}} class="shadow-md z-[99] leading-[1.1em] fixed left-1/2 -translate-x-1/2 top-[5.85em] bg-[#EFD4D4] text-[#BA4848] flex w-[19em] md:w-fit px-[1.2em] md:px-[1.9em] justify-center text-[1.23em] items-center gap-[0.95em] py-[1.1em] rounded-[0.5em] 
    lg:top-[7.6em] lg:text-[1.1em]
    xl:top-[5.6em] xl:text-[1.3em]">
        <div class="w-[2em] md:w-[0.9em]">
            <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.25 18L0 12.75V5.25L5.25 0H12.75L18 5.25V12.75L12.75 18H5.25ZM6.15 13.25L9 10.4L11.85 13.25L13.25 11.85L10.4 9L13.25 6.15L11.85 4.75L9 7.6L6.15 4.75L4.75 6.15L7.6 9L4.75 11.85L6.15 13.25ZM6.1 16H11.9L16 11.9V6.1L11.9 2H6.1L2 6.1V11.9L6.1 16Z" fill="#BA4848"/>
            </svg>                            
        </div>
        <p class="md:whitespace-nowrap">Unexpected error occurred! Please try again later</p>
  
    </div>
{/if}

<div
style={showClickwrap ? 'display:flex' : 'display:none'}
class="fixed z-[999] inset-0 flex items-center justify-center">
    <div id="clickwrap-container" class="bg-white overflow-hidden rounded-[0.5em] w-full max-w-3xl">
        
    </div>
</div>

<main
    class=" relative pt-2hem
    lg:text-[0.85em]
    xl:text-[1em]  xl:pt-3em
    2xl:text-[0.95em] 2xl:pt-4em"
>
    <div class="mainContainer dashContainer md:w-[90%] lg:w-[45%] md:mx-auto space-y-1em
    text-[1.5em]">

        <div class="flex flex-col gap-1em
        md:flex-row md:justify-between md:items-center md:gap-0 md:mb-2hem md:mt-[0hem]">
            {#each steps as step, index}
                <div style="z-index:{3-index}" class="relative  flex items-center gap-1em
                md:flex-col-reverse md:gap-0.5em md:items-center
                md:w-[14em] md:text-center ">
                    <div 
                    class:currentTab={currentStep == index}
                    class:inactiveTab={currentStep != index}
                    class:finishedTab={currentStep > index}
                    class="flex justify-center items-center relative size-[0.9em] bg-[#00D980] rounded-full
                    ">
                        <div class:hidden={index == 0} class="line absolute left-1/2 -translate-y-1/2 -translate-x-1/2 w-[2px] h-[2.5em] bg-[#00D980]
                        md:w-[16em] lg:w-[17em] xl:w-[21.5em] 2xl:w-[25em] md:h-[2px] md:-translate-x-full md:top-1/2
                        "></div>
                        {#if currentStep == index}
                            <div transition:scale={{start:0.9}} class="relative  size-[70%] bg-white rounded-full"></div>
                        {/if}
                    </div>
                    <p style="color:{currentStep == index ?"#009E5F":''}" class="text-[#707070] font-plus-jakara font-medium">{step.name}</p>
                </div>
            {/each}
        </div>
        
    </div>

    <div class="text-[1.2em] mt-2em">

        <h3 class="mainContainer dashContainer drRegContainer text-[1.9em] font-medium leading-[1.3em] mt-1em mb-1em md:text-center md:text-[2.15em] lg:text-[2.25em] lg:mb-[1.2em]">
            {steps[currentStep].title}
        </h3>

        {#if currentStep == 0}
            <div class="mainContainer dashContainer lg:w-[50%] ">
                <RegistrationType bind:form={form}/>
            </div>
        {:else if currentStep == 1}
            <div class="mainContainer dashContainer drRegContainer ">
                <DroneInformation bind:form={form} bind:previews={previews}  bind:views={views}/>
            </div>
        {/if}
      
        <div class="text-[1.1em] mt-3em w-full flex justify-center gap-1hem items-center py-1em">
            {#if currentStep != 0}
                <button
                    type="button"
                    class="gradButton bg-[#00D980] text-white capitalize text-center py-[0.6em] rounded-[0.5em] w-[9em] block"
                    on:click={() => currentStep = currentStep - 1}            
                >
                    back
                </button>
            {/if}
            {#if currentStep == steps.length - 1}
                <button
                    on:click={handleSubmit}
                    type="button"
                    class="disabled:opacity-75 disabled:pointer-events-none gradButton bg-[#00D980] text-white capitalize text-center py-[0.6em] rounded-[0.5em] w-[9em] block"
                    disabled = {finalValidation()}
                    >submit</button
                >
            {:else}
                <button
                    type="button"
                    class="disabled:opacity-75 disabled:pointer-events-none gradButton bg-[#00D980] text-white capitalize text-center py-[0.6em] rounded-[0.5em] w-[9em] block"
                    on:click={() => currentStep = currentStep + 1}
                    disabled = {currentStep == steps.length - 1}
                    
                >
                    next
                </button>
            {/if}
        </div>

    </div>
</main>
