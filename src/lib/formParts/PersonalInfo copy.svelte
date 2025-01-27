<script>
    export let form;
    const today = new Date().toISOString().split("T")[0];

</script>
<!-- Basic Information -->
<h3 class="text-[1.4em] font-semibold mb-0hem">Basic Information</h3>
<div class="mainContainer dashContainer flex flex-wrap gap-1hem ">
    <div class="droneRegInputFieldsContainer">
        <label for="name">Drone Name</label>
        <input
            type="text"
            id="name"
            name="name"
            required

            placeholder="DJI Phantom 4 Pro"
            class="droneRegInputFields"
        />
    </div>
    <div class="droneRegInputFieldsContainer">
        <label for="modelNumber">Model Number</label>
        <input
            type="text"
            id="modelNumber"
            name="modelNumber"
            required
            placeholder="PH4P"
            class="droneRegInputFields"
        />
    </div>
    <div class="droneRegInputFieldsContainer">
        <label for="serialNumber">Serial Number</label>
        <input
            type="text"
            id="serialNumber"
            name="serialNumber"
            required
            placeholder="PH4P123456"
            class="droneRegInputFields"
        />
    </div>
    <div class="droneRegInputFieldsContainer">
        <label for="batteryLife">Battery Life</label>
        <input
            type="text"
            id="batteryLife"
            name="batteryLife"
            required
            placeholder="30 minutes"
            class="droneRegInputFields"
        />
    </div>
    <div class="droneRegInputFieldsContainer">
        <label for="manufacturer">Manufacturer</label>
        <input
            type="text"
            id="manufacturer"
            name="manufacturer"
            required
            placeholder="DJI"
            class="droneRegInputFields"
        />
    </div>
    <!-- Technical Specifications -->
    <div class="droneRegInputFieldsContainer">
        <label for="purchaseDate">Purchase Date</label>
        <input
            type="date"
            id="purchaseDate"
            name="purchaseDate"
            required
            value=""
            max={today}
            class="droneRegInputFields"
        />
    </div>
    <div class="droneRegInputFieldsContainer">
        <label for="weight">Weight (g)</label>
        <input
            type="number"
            step="0.01"
            id="weight"
            name="weight"
            required
            placeholder="250"
            class="droneRegInputFields"
        />
    </div>
    <div class="droneRegInputFieldsContainer">
        <label for="flightRange">Flight Range (km)</label>
        <input
            type="text"
            id="flightRange"
            name="flightRange"
            required
            placeholder="7"
            class="droneRegInputFields"
        />
    </div>
    <div class="droneRegInputFieldsContainer">
        <label for="maxAltitude">Maximum Altitude (m)</label>
        <input
            type="text"
            id="maxAltitude"
            name="maxAltitude"
            required
            placeholder="500"
            class="droneRegInputFields"
        />
    </div>
</div>