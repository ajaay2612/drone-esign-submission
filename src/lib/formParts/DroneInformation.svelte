<script>
    import PhotoUploader from "$lib/components/PhotoUploader.svelte";
    export let form, previews, views;
</script>


<div class="flex flex-wrap gap-[1.6em] lg:gap-y-[2em] lg:gap-x-[3.5em]">
    <!-- Nickname Field -->
    <div class="droneRegInputFieldsContainer">
        <label for="nickname">Nickname</label>
        <input
            type="text"
            id="nickname"
            name="nickname"
            bind:value={form.nickname}
            placeholder="Give your drone a nickname"
            class="droneRegInputFields"
        />
    </div>

    <!-- Model Number Field -->
    <div class="droneRegInputFieldsContainer">
        <label for="modelNumber">Model Number</label>
        <input
            type="text"
            id="modelNumber"
            name="modelNumber"
            bind:value={form.modelNumber}
            placeholder="Mavic Air 2, ANAFI, EVO II Pro"
            class="droneRegInputFields"
        />
    </div>

    <!-- Serial Number Field -->
    <div class="droneRegInputFieldsContainer">
        <label for="serialNumber">Drone Serial Number</label>
        <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            bind:value={form.serialNumber}
            placeholder="Enter the unique serial number"
            class="droneRegInputFields"
        />
    </div>

    <!-- Manufacturer Field -->
    <div class="droneRegInputFieldsContainer">
        <label for="manufacturer">Drone Manufacturer</label>
        <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            bind:value={form.manufacturer}
            placeholder="DJI, Parrot, Autel Robotics"
            class="droneRegInputFields"
        />
    </div>
    <div class="droneRegInputFieldsContainer width-full">
        <label for="manufacturer" class="leading-[1.3em]">Please capture and upload photos of your drone</label>

        <div class="">
            <PhotoUploader bind:form={form} bind:previews={previews}  bind:views={views}/>
        </div>
    </div>
</div>
