
<script>
    import { onMount } from "svelte";

    
    export let drone = {
        user: {
            firstName: "John",
            lastName: "Doe",
            streetAddress: "123 Main St",
            city: "Anytown",
            state: "NY",
            stateCode: "NY",
            zipCode: "12345",
            email: "ajay@gmail.com",
            countryCode: "+1",
            phoneNumber: "123-456-7890",
        },
        modelNumber: "Mavic Air 2",
        serialNumber: "123456789",
        manufacturer: "DJI",
        droneId: "123456",
        registrationId: "123456",
        registrationType: "Recreational"
    }, page = 2, droneImages =[
        {
            src: "assets/drone1.jpg",
            name: "Front View"
        },
        {
            src: "assets/drone2.jpg",
            name: "Side View"
        },
        {
            src: "assets/drone3.jpg",
            name: "Top View"
        }
    ] 

    let userName = drone.user.firstName+" "+drone.user.lastName;
    let userAddress = drone.user.streetAddress+", "+drone.user.city+", "+drone.user.state+", "+drone.user.zipCode;
    let userContact = drone.user.email+", "+drone.user.countryCode +" "+drone.user.phoneNumber;
    
    let logoBase64 = "";
    onMount(() => {
        async function fetchBase64Logo(logoPath) {
            return fetch(logoPath)
            .then(response => response.text())
            .then(svgText => `data:image/svg+xml;base64,${btoa(svgText)}`);
        }

        // In your Svelte script

        fetchBase64Logo('assets/onlyLogo.svg').then(base64 => {
            logoBase64 = base64;
        });
    });
  
</script>

<section class="drone-registration-container">
    <div class="registration-header">
        <div class="registration-header-logo">
            <svg viewBox="0 0 55 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="13.3721" y="11.8857" width="28.2287" height="28.2287" fill="url(#paint0_linear_817_236)"/>
                <path d="M50.1639 18.3711C50.7894 17.7456 51.2327 16.9503 51.4686 16.0305C51.7046 15.1107 51.7284 14.0845 51.5389 13.0105C51.3493 11.9364 50.9501 10.8355 50.364 9.77069C49.7778 8.70585 49.0163 7.69791 48.1228 6.8044C47.2293 5.9109 46.2213 5.14934 45.1565 4.5632C44.0916 3.97706 42.9908 3.57782 41.9167 3.38828C40.8426 3.19874 39.8164 3.22261 38.8966 3.45852C37.9769 3.69444 37.1816 4.13778 36.5561 4.76323L43.36 11.5671L50.1639 18.3711Z" fill="url(#paint1_linear_817_236)"/>
                <path d="M18.3711 4.76282C17.7456 4.13737 16.9503 3.69403 16.0305 3.45811C15.1107 3.2222 14.0845 3.19833 13.0105 3.38787C11.9364 3.57741 10.8355 3.97665 9.77069 4.56279C8.70585 5.14893 7.69791 5.91049 6.8044 6.80399C5.9109 7.6975 5.14934 8.70544 4.5632 9.77028C3.97706 10.8351 3.57782 11.936 3.38828 13.0101C3.19874 14.0841 3.22261 15.1103 3.45852 16.0301C3.69444 16.9499 4.13778 17.7452 4.76323 18.3707L11.5671 11.5667L18.3711 4.76282Z" fill="url(#paint2_linear_817_236)"/>
                <path d="M36.5557 47.2367C37.1811 47.8621 37.9765 48.3055 38.8962 48.5414C39.816 48.7773 40.8422 48.8012 41.9163 48.6116C42.9903 48.4221 44.0912 48.0229 45.1561 47.4367C46.2209 46.8506 47.2288 46.089 48.1224 45.1955C49.0159 44.302 49.7774 43.2941 50.3636 42.2292C50.9497 41.1644 51.3489 40.0635 51.5385 38.9894C51.728 37.9154 51.7041 36.8892 51.4682 35.9694C51.2323 35.0496 50.789 34.2543 50.1635 33.6289L43.3596 40.4328L36.5557 47.2367Z" fill="url(#paint3_linear_817_236)"/>
                <path d="M4.76282 33.6285C4.13737 34.2539 3.69403 35.0492 3.45811 35.969C3.2222 36.8888 3.19833 37.915 3.38787 38.989C3.57741 40.0631 3.97665 41.164 4.56279 42.2288C5.14893 43.2937 5.91049 44.3016 6.80399 45.1951C7.6975 46.0886 8.70544 46.8502 9.77028 47.4363C10.8351 48.0225 11.936 48.4217 13.0101 48.6112C14.0841 48.8008 15.1103 48.7769 16.0301 48.541C16.9499 48.3051 17.7452 47.8617 18.3707 47.2363L11.5667 40.4324L4.76282 33.6285Z" fill="url(#paint4_linear_817_236)"/>
                <defs>
                <linearGradient id="paint0_linear_817_236" x1="16.8222" y1="14.8675" x2="28.4963" y2="39.6385" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00D980"/>
                <stop offset="1" stop-color="#007344"/>
                </linearGradient>
                <linearGradient id="paint1_linear_817_236" x1="41.9759" y1="2.66983" x2="35.8024" y2="14.9216" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00D980"/>
                <stop offset="1" stop-color="#007344"/>
                </linearGradient>
                <linearGradient id="paint2_linear_817_236" x1="2.66983" y1="12.9509" x2="14.9216" y2="19.1243" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00D980"/>
                <stop offset="1" stop-color="#007344"/>
                </linearGradient>
                <linearGradient id="paint3_linear_817_236" x1="52.2569" y1="39.0486" x2="40.0051" y2="32.8752" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00D980"/>
                <stop offset="1" stop-color="#007344"/>
                </linearGradient>
                <linearGradient id="paint4_linear_817_236" x1="12.9509" y1="49.3297" x2="19.1243" y2="37.0779" gradientUnits="userSpaceOnUse">
                <stop stop-color="#00D980"/>
                <stop offset="1" stop-color="#007344"/>
                </linearGradient>
                </defs>
            </svg>                     
        </div>
        <h1 class="registration-title">Drone Registration Agreement</h1>
        <p class="registration-subtitle">Issued in Compliance with Drone Management Authority Regulations</p>
    </div>

    {#if page == 0 }
        <div class="registration-content">
            <div class="registrant-details">
                <p>This Drone Registration Agreement (the "Agreement") is made and entered into as of the date of issuance, by and between:</p>
                <p>Dronova, an authorized drone registration entity acting in compliance with Drone Management Authority regulations</p>
    
                <div class="registrant-details-innerCont">
                    <p><span style="padding-right:5px;">Registrant Name:</span> {userName}</p>
                    <p><span style="padding-right:5px;" >Address:</span> {userAddress}</p>
                    <p><span style="padding-right:5px;" >Contact Information:</span> {userContact}</p>
                </div>
            </div>
    
            <div class="reg-fields">
                <h2 ><span  style="padding-right:5px;">1.</span> Purpose</h2>
                <p>The purpose of this Agreement is to outline the terms and conditions under which the Registrant's drone(s) will be registered, as well as the operational guidelines and limitations that must be adhered to under Drone Management Authority regulations.</p>
            </div>
            
            <div class="reg-fields">
                <h2><span  style="padding-right:5px;">2.</span> Drone Details</h2>
                <div class="reg-fields-grid">
                    <p><span   style="padding-right:5px;">Model Number:</span>{drone.modelNumber}</p>
                    <p><span   style="padding-right:5px;">Drone Serial Number:</span> {drone.serialNumber}</p>
                    <p><span   style="padding-right:5px;">Manufacturer:</span> {drone.manufacturer}</p>
                    <p><span   style="padding-right:5px;">Drone ID:</span> {drone.droneId || "temp"}</p>
                    <p><span   style="padding-right:5px;">Registration ID:</span> {drone.registrationId}</p>
                    <p><span   style="padding-right:5px;">Registration Type:</span> {drone.registrationType}</p>
                </div>  
            </div>
    
            <div class="reg-fields">
                <h2><span  style="padding-right:5px;">3.</span> Operational Limitations and Conditions</h2>
                <p>The drone shall not operate in Drone Management Authority-designated no-fly zones and shall not exceed a maximum altitude of 400 feet unless specifically authorized by the Drone management authority. The drone must only be operated during daylight hours or twilight with appropriate anti-collision lighting, within visual line of sight of the operator, and in full compliance with local, state, and federal regulations. Failure to adhere to these conditions may result in the suspension or revocation of the registration.</p>
            </div>
    
        </div>
    {/if}
    {#if page == 1 }
        <div class="registration-content">
            <div class="reg-fields">
                <h2><span  style="padding-right:5px;">4.</span> Drone Images</h2>
                <p>Images of the drone(s) are provided below for reference:
                    Please refer to the images to get a better understanding of the drone(s).</p>
                <div class="droneImagesContainer">
                    {#each droneImages as image}
                        <div class="droneImagesInnerContainer">
                            <img class="droneImages" src={image.src}>
                            <p >{image.name}</p>
                        </div>
                    {/each}
                </div>
            </div>
    
        </div>
    {/if}

    {#if page == 2 }
        <div class="registration-content">
           
            <div class="reg-fields">
                <h2><span  style="padding-right:5px;">5.</span>  Registrant Obligations</h2>
                <p>The Registrant is required to operate the drone in a safe and responsible manner, maintain current and valid contact information with the Drone management authority and the company, and promptly report any incidents, crashes, or loss of the drone to the Drone management authority or relevant authorities.</p>
            </div>
            
            <div class="reg-fields">
                <h2><span  style="padding-right:5px;">6.</span>  Terms and Validity</h2>
                <div class="registrant-details-innerCont">
                    <p>The drone registration is valid for a period of <span><u>3 Years</u></span> from the Date of Issue.
                    </p>
                    <p>
                        The Registrant is required to operate the drone in a safe and responsible manner, maintain current and valid contact information with the Drone management authority and the company, and promptly report any incidents, crashes, or loss of the drone to the Drone management authority or relevant authorities.
                    </p>
                </div>
            </div>
            <div class="reg-fields">
                <h2><span  style="padding-right:5px;">7.</span>  Signatures</h2>
                <p>By signing this Agreement, the Registrant acknowledges that they have read, understood, and agreed to the terms and conditions outlined herein.</p>
            </div>


            <div class="signerStage">
                <div class="">
                    <p><span style="padding-right:5px;">Registrant Signature:</span> <span style="color: white;" class="signField">signer1sig</span></p>
                    <p><span style="padding-right:5px;">Date:</span> <span style="color: white;" class="signField">signer1date</span></p>
                </div>
                <div class="">
                    <p><span style="padding-right:5px;">Authorized Representative Signature:</span> <span style="color: white;" class="signField">signer2sig</span></p>
                    <p><span style="padding-right:5px;">Date:</span> <span style="color: white;" class="signField">signer2date</span></p>
                </div>
            </div>

        </div>
    {/if}


</section>

<style>

    
    .ptag{
        @apply text-[#707070] font-plus-jakara font-medium ;
    }

    svg{
        @apply w-full;
    }

    .signField{
        @apply text-white border-b border-black w-[8em] inline-block;
    }

    .signerStage{
        @apply space-y-2hem;
    }
    
    .signerStage > div{
        @apply space-y-[0.8em];
    }

    .h2tag{
        @apply font-inter font-medium text-[1.25em] ;
    }

    .droneImagesContainer{
        @apply grid grid-cols-2 gap-x-[1em] gap-y-[1.5em];
    }

    .droneImages{
        @apply aspect-[16/9] w-full border border-[#707070] object-contain;
    }

    .droneImagesInnerContainer{
        @apply space-y-[0.2em];
    }

    .registrant-details p{
        @apply ptag ;
    }

    p > span{
        @apply text-black;
    }

    .reg-fields{
        @apply space-y-[1.3em];
    }
    .reg-fields h2{
        @apply h2tag;
    }
    .reg-fields p{
        @apply ptag;
    }
    .reg-fields-grid{
        @apply grid grid-cols-2 gap-x-[0em] gap-y-[0.5em];
    }

    .registrant-details{
        @apply space-y-[1.5em];
        
    }

    .registrant-details-innerCont{
        @apply space-y-[0.5em];
    }

    .drone-registration-container {
        @apply font-inter text-[1rem] leading-[1.5em] py-[2em] px-[3.4em] mx-auto ;
    }
    /* .drone-registration-container {
        @apply font-inter text-[1.65624rem] leading-[1.5em] mx-auto ;
    } */

    .registration-header-logo{
        @apply mx-auto w-[3.5em] mb-1em mt-[0.6em];
    }

    .registration-header {
        @apply text-center mb-[1.5em];
    }

    .registration-title {
        @apply text-[1.4em] font-medium ;
    }

    .registration-subtitle {
        @apply text-[0.75em] text-[#707070];
    }

    .registration-content {
        @apply space-y-[2.8em] mt-[3.6em] text-[0.75em] leading-[1.3em];
    }
</style>