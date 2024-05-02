<script>
    let landmarkName = '';
    let description = '';
    let latitude = '';
    let longitude = '';
    let category = '';

    const categories = ['Park', 'Trails', 'Museum', 'Historic Site', 'Art Gallery', 'Garden', 'Beach']; 

    function handleSubmit() {
        console.log({
            landmarkName,
            description,
            latitude,
            longitude,
            category
        });
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <label for="name">Landmark Name:</label>
    <input id="name" type="text" bind:value={landmarkName} />

    <label for="description">Description:</label>
    <textarea id="description" bind:value={description}></textarea>

    <label for="latitude">Latitude:</label>
    <input id="latitude" type="text" bind:value={latitude} />

    <label for="longitude">Longitude:</label>
    <input id="longitude" type="text" bind:value={longitude} />

    <label for="category">Category:</label>
    <select bind:value={category}>
        <option disabled value="">Select a category</option>
        {#each categories as category}
        <option value={category}>{category}</option>
        {/each}
    </select>

    <button type="submit">Add Landmark</button>
</form>

<style>
    label {
        display: block;
        margin-top: 20px;
    }
    input, textarea, select {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
    }
    button {
        margin-top: 20px;
        padding: 10px 15px;
        background-color: #007BFF;
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
</style>
