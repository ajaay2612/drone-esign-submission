<script>
    import { enhance } from '$app/forms';
    export let form, initialData;
    import Alert from "$lib/components/Alert.svelte";
    import { slide } from "svelte/transition";

    const today = new Date().toISOString().split("T")[0];

    const formatDate = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toISOString().slice(0, 10);
    }

    const states = {
        AL: "Alabama",
        AK: "Alaska",
        AZ: "Arizona",
        AR: "Arkansas",
        CA: "California",
        CO: "Colorado",
        CT: "Connecticut",
        DE: "Delaware",
        FL: "Florida",
        GA: "Georgia",
        HI: "Hawaii",
        ID: "Idaho",
        IL: "Illinois",
        IN: "Indiana",
        IA: "Iowa",
        KS: "Kansas",
        KY: "Kentucky",
        LA: "Louisiana",
        ME: "Maine",
        MD: "Maryland",
        MA: "Massachusetts",
        MI: "Michigan",
        MN: "Minnesota",
        MS: "Mississippi",
        MO: "Missouri",
        MT: "Montana",
        NE: "Nebraska",
        NV: "Nevada",
        NH: "New Hampshire",
        NJ: "New Jersey",
        NM: "New Mexico",
        NY: "New York",
        NC: "North Carolina",
        ND: "North Dakota",
        OH: "Ohio",
        OK: "Oklahoma",
        OR: "Oregon",
        PA: "Pennsylvania",
        RI: "Rhode Island",
        SC: "South Carolina",
        SD: "South Dakota",
        TN: "Tennessee",
        TX: "Texas",
        UT: "Utah",
        VT: "Vermont",
        VA: "Virginia",
        WA: "Washington",
        WV: "West Virginia",
        WI: "Wisconsin",
        WY: "Wyoming"
    };


</script>

<form class="mt-[1em]" method="POST" use:enhance>
 
    <div class="flex flex-wrap gap-[1.6em] lg:gap-y-[2em] lg:gap-x-[3.5em]">


        <div class="droneRegInputFieldsContainer">
            <label for="firstName">First Name</label>
            <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value="{initialData?.firstName}"
                placeholder="First Name"
                class="droneRegInputFields"
            />
        </div>
    
        <div class="droneRegInputFieldsContainer">
            <label for="lastName">Last Name</label>
            <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value="{initialData?.lastName}"
                placeholder="Last Name"
                class="droneRegInputFields"
            />
        </div>
        <div class="droneRegInputFieldsContainer">
            <label for="dateOfBirth">Date of Birth</label>
            <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                required
                value="{initialData?.dateOfBirth ? formatDate(initialData?.dateOfBirth) : ''}"
                max={today}
                class="droneRegInputFields"
            />
        </div>
    
        <div class="droneRegInputFieldsContainer">
            <label for="phoneNumber">Phone Number</label>
            <div class="flex gap-0hem">
                <div class="w-[5em]">
                    <input
                        type="tel"
                        id="countryCode"
                        name="countryCode"
                        required
                        value="{initialData?.countryCode}"
                        placeholder="+1"
                        class="droneRegInputFields  rounded-l-none"
                    />
                </div>
                <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    required
                    value="{initialData?.phoneNumber}"
                    placeholder="Phone Number"
                    class="droneRegInputFields flex-1 rounded-l-none"
                />
            </div>
        </div>
    </div>
    
    <div class="border-t border-[#DBDBDB] pt-[2.1em] mt-2hem flex flex-wrap gap-[1.6em]  lg:gap-y-[2em] lg:gap-x-[3.5em] mb-2em">
    
        <div class="droneRegInputFieldsContainer">
            <label for="streetAddress">Street Address</label>
            <input
                type="text"
                id="streetAddress"
                name="streetAddress"
                required
                value="{initialData?.streetAddress}"
                placeholder="123 Main St"
                class="droneRegInputFields"
            />
        </div>
    
        <div class="droneRegInputFieldsContainer">
            <label for="city">City</label>
            <input
                type="text"
                id="city"
                name="city"
                required
                value="{initialData?.city}"
                placeholder="Enter city"
                class="droneRegInputFields"
            />
        </div>
    
        <div class="droneRegInputFieldsContainer">
            <label for="state">State</label>
            <input
                type="hidden"
                id="state"
                name="state" 
                value="{states[initialData.stateCode]}"   
                placeholder="Enter state"
                class="droneRegInputFields"
            />
            <select
            id="stateCode"
            name="stateCode"
            required
            class="droneRegInputFields"
            value={initialData?.stateCode || ""}
            >
                <option value="" disabled selected>Select state</option>
                {#each Object.entries(states) as [key, value]}
                  <option on:click={() => initialData.stateCode = key} value={key}>{value}</option>
                {/each}
            </select>           
        </div>
    
        <div class="droneRegInputFieldsContainer">
            <label for="zipCode">ZIP Code</label>
            <input
                type="text"
                id="zipCode"
                name="zipCode"
                required
                value="{initialData?.zipCode}"
                placeholder="Enter ZIP code"
                class="droneRegInputFields"
            />
        </div>
    
    </div>

    {#if form?.error}
        <div transition:slide={{duration:300}} class=" mt-1em">
            <Alert bind:form={form} error={true} />
        </div>
    {/if}
    <button
        type="submit"
        class="disabled:opacity-75 mx-auto mt-1em disabled:pointer-events-none gradButton bg-[#00D980] text-white capitalize text-center py-[0.6em] rounded-[0.5em] w-[9em] block"
        >save
    </button>
</form>