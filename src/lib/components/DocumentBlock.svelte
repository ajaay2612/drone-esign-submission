<script>
    import QRCode from 'qrcode';
    import { onMount,onDestroy } from 'svelte';
    import { enhance } from "$app/forms";
    export let docData,agreementId
    import Showloader from "$lib/stores/Showloader";
    
    $: status = docData.status;
    $: signers = docData.recipients?.signers || [];
    $: expireDateTime = docData.expireDateTime;
    // unused
    $: currentRecipient = docData.currentRecipient;
    $: completedRecipients = docData.completedRecipients;
    $: currentSigner = signers.find(signer => signer.status !== 'completed');
    
    let qrCodeDataUrl = ''; // This will store the generated QR code image

    // Generate the QR code on mount
    onMount(async () => {
        try {
            if (docData.qrCodeUrl) {
                qrCodeDataUrl = await QRCode.toDataURL(docData.qrCodeUrl, {
                errorCorrectionLevel: 'H', // High error correction for better readability
                width: 200, // Set QR code size
                });
            }
        } catch (error) {
            console.error('Error generating QR Code:', error);
        }
    });

    function downloadQRCode() {
        if (!qrCodeDataUrl) return;

        const link = document.createElement('a'); // Create a temporary link element
        link.href = qrCodeDataUrl; // Set the href to the Base64 image URL
        link.download = `${docData.droneId}.png`; // Set the download attribute with the desired filename
        link.click(); // Programmatically trigger a click to download the image
    }
    // $:console.log(docData.envelopeDocumentDownloadUrl)   
    
    // Get list of completed signers
    $: completedSigners = signers.filter(signer => signer.status === 'completed');

    // Helper function to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString();
    };

    // Calculate time remaining
    const getTimeRemaining = (expireDate) => {
        if (!expireDate) return null;
        
        const now = new Date();
        const expiry = new Date(expireDate);
        const diff = expiry - now;
        
        if (diff <= 0) return { expired: true };
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return { days, hours, minutes, expired: false };
    };

    // Update time remaining every minute
    let timeRemaining;
    let timeRemainingInterval;

    const updateTimeRemaining = () => {
        timeRemaining = getTimeRemaining(expireDateTime);
    };

    $: if (expireDateTime) {
        updateTimeRemaining();
        if (timeRemainingInterval) clearInterval(timeRemainingInterval);
        timeRemainingInterval = setInterval(updateTimeRemaining, 60000); // Update every minute
    }

    // Cleanup on component destroy
    onDestroy(() => {
        if (timeRemainingInterval) clearInterval(timeRemainingInterval);
    });


    const openPdfInFrontend = () => {
        // window.open(docData.envelopeDocumentDownloadUrl, '_blank');
        const link = document.createElement('a');
        link.href = docData.envelopeDocumentDownloadUrl;
        link.download = `${docData.droneId}.pdf`;
        link.click();
    };
</script>

<div class="lg:border lg:border-[#D7D7D7] lg:p-2em lg:py-2hem rounded-[0.5em]">
    <h1 class="text-[2em] border-b border-[#D7D7D7] pb-[0.52em]">Document Status</h1>
    
    {#if status == "completed"}
        <div class="text-[1em] bg-[#D4F9EA] text-[#009E5F] px-[1.5em] py-[1.1em] rounded-[0.5em] mt-[1.7em] ">
            <p class="text-black">Current Status:</p>
            <div class="">
                <p class="">Document has been approved</p>            
            </div>
        </div>

    {:else if status == "declined"}
        <div class="text-[1em] bg-[#EFD4D4] text-[#BA4848] px-[1.5em] py-[1.1em] rounded-[0.5em] mt-[1.7em] ">
            <p class="text-black">Current Status:</p>
            <div class="">
                <p class="">{docData.declined.message}</p>            
            </div>
        </div>

    {:else}
        {#if timeRemaining}
            <div class:redHighlightOnlyColor={timeRemaining.expired} class="text-[1em] bg-[#F4EDE0] text-[#BA9348] px-[1.5em] py-[1.1em] rounded-[0.5em] mt-[1.7em] ">
                <p class="text-black">Current Status:</p>
                <div class="">
                    {#if timeRemaining.expired}
                        <p class="">Document has expired</p>
                    {:else}
                        <p class="">Pending Aviation Authority Review and Approval</p>
                        <!-- <p class="">Time Remaining:</p>
                        <p class="{timeRemaining.days < 2 ? 'text-[#BA4848]' : ''}">
                            {timeRemaining.days} days, {timeRemaining.hours} hours, {timeRemaining.minutes} minutes
                        </p> -->
                    {/if}
                </div>
            </div>
            {#if !timeRemaining.expired}
                <div class="text-[1em] bg-[#F4EDE0] text-[#BA9348] px-[1.5em] py-[1.1em] rounded-[0.5em] mt-[0.5em] ">
                    <p class="text-black">Time Remaining:</p>
                    <p class="{timeRemaining.days < 2 ? 'text-[#BA4848]' : ''}">
                        {timeRemaining.days} days, {timeRemaining.hours} hours, {timeRemaining.minutes} minutes
                    </p>
                </div>
            {/if}
        {/if}
    
    {/if}
    


    {#if signers.length > 0}
        <div class="mt-2em space-y-[1em]">
            <h2 class="text-[1.4em] ">All Signers</h2>
            <div class="space-y-1em">
                {#each signers as signer}
                    <div class="flex justify-between text-[0.95em]">
                        <div>
                            <p class="">{signer.name}</p>
                            <p class="text-[0.78em] text-[#707070]">{signer.email}</p>
                        </div>
                        <div class="text-right capitalize">
                            <span class={signer.status === 'completed' ? 'text-[#009E5F]' : 'text-[#BA9348]'}>
                                {signer.status}
                            </span>
                            {#if signer.signedDateTime}
                                <p class="text-[0.78em] text-[#707070]">
                                    Signed: {formatDate(signer.signedDateTime)}
                                </p>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
    <div class="text-[0.95em] mt-3em flex justify-between items-center">
        <div class=" text-[1.15em] capitalize">
            {#if status == "sent" || status == "pending"}
                <div class="flex items-center gap-[0.3em]">
                    <div class="w-[.78em]">
                        <svg viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.27778 6.5L8.68094 8.81644C9.22809 9.18887 9.55556 9.80789 9.55556 10.4698V11.5C9.55556 11.7761 9.3317 12 9.05555 12H1.5C1.22386 12 1 11.7761 1 11.5V10.4698C1 9.80789 1.32746 9.18887 1.87462 8.81644L5.27778 6.5ZM5.27778 6.5L8.68094 4.18356C9.22809 3.81113 9.55556 3.19211 9.55556 2.53023V1.5C9.55556 1.22386 9.3317 1 9.05556 1H1.5C1.22386 1 1 1.22386 1 1.5V2.53023C1 3.19211 1.32746 3.81113 1.87462 4.18356L5.27778 6.5Z" stroke="#BA9348" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7.72214 10.7493V11.85C7.72214 11.9328 7.65498 12 7.57214 12H2.98325C2.90041 12 2.83325 11.9328 2.83325 11.85V10.7493C2.83325 10.5769 2.92206 10.4167 3.06825 10.3253L4.8537 9.20944C5.11311 9.04731 5.44228 9.04731 5.7017 9.20944L7.48714 10.3253C7.63333 10.4167 7.72214 10.5769 7.72214 10.7493Z" fill="#BA9348"/>
                        </svg>
                    </div>
                    <p>Pending Review</p>
                </div>
            {:else if status == "completed"}
                <div class="flex items-center gap-[0.3em]">
                    <div class="size-[.85em] mt-[0.2em]">
                        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="7" cy="8" r="7" fill="#D4EFE4"/>
                            <path d="M3 7L7 10L14 1" stroke="#009E5F" stroke-width="1.2"/>
                        </svg>                            
                    </div>
                    <p>Approved</p>
                </div>
            {:else if status == "declined"}
                <div class="flex items-center gap-[0.3em]">
                    <div class="w-[.85em]">
                        <svg     viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="6.5" cy="6.5" r="5.5" stroke="#BA4848"/>
                            <path d="M10.1665 10.1667L2.83317 2.83333" stroke="#BA4848"/>
                        </svg>                            
                    </div>
                    <p>Declined</p>
                </div>
            {/if}
        </div>
        <div class="flex justify-center items-center gap-[1em]">
            {#if status == "completed"}

                
                <button on:click={downloadQRCode} class="relative group">
                    <div class=" absolute bottom-full pb-0hem pointer-events-none group-hover:pointer-events-auto">
                        <div class="shadow-md qrCode opacity-0  group-hover:opacity-100 translate-y-[40%]  group-hover:translate-y-0   border border-[#D7D7D7] rounded-[0.5em] p-[0.2em] w-full aspect-square">
                            {#if qrCodeDataUrl}
                                <img src={qrCodeDataUrl} alt="QR Code" class="w-full h-full object-cover" />
                            {/if}
                        </div>
                    </div>

                    <div class="relative bg-white QRbutton group-hover:shadow-md group-hover:scale-[1.02] border border-[#D7D7D7] text-[0.95em]  rounded-[0.5em] block py-[0.65em] px-[2em]  ">
                        Print QR code
                    </div>
                </button>

                <button on:click={openPdfInFrontend} class="text-[0.95em]  rounded-[0.5em] block py-[0.65em] px-[2em] text-[#FFFFFF] gradButton">
                    View Document
                </button>
            {/if}       
            
            {#if docData.canSign && status !== "declined"}
                <form class="" method="POST" use:enhance>
                    <input type="hidden" name="agreementId" value="{agreementId}">
                    <button on:click={()=>$Showloader = true} type="submit" class="text-[1em]  rounded-[0.5em] block py-[0.65em] px-[2.9em] text-[#FFFFFF] gradButton">
                        Sign
                    </button>
                </form>
            {/if}
        </div>
    </div>
</div>