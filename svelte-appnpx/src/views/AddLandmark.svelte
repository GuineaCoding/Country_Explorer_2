<script>
    import { addLandmark } from '../models/landmarkModel';
    import { navigate } from 'svelte-routing';

    let landmarkName = '';
    let description = '';
    let latitude = '';
    let longitude = '';
    let category = '';
    let error = '';

    const categories = ['Park', 'Trails', 'Museum', 'Historic Site', 'Art Gallery', 'Garden', 'Beach']; 

    async function handleSubmit() {
        // Basic client-side validation
        if (!landmarkName || !description || !latitude || !longitude || !category) {
            error = 'All fields must be filled!';
            return;
        }

        try {
            const result = await addLandmark({ landmarkName, description, latitude, longitude, category });
            if (result) {
                alert('Landmark added successfully!');
                resetForm();
                navigate('/home'); // or wherever appropriate
            } else {
                error = 'Failed to add landmark. Please try again.';
            }
        } catch (e) {
            error = `Error: ${e.message}`;
        }
    }

    function resetForm() {
        landmarkName = '';
        description = '';
        latitude = '';
        longitude = '';
        category = '';
        error = ''; 
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    {#if error}
        <p class="error">{error}</p>
    {/if}

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
        {#each categories as cat}
        <option value={cat}>{cat}</option>
        {/each}
    </select>

    <button type="submit">Add Landmark</button>
</form>

<style>
    .error {
        color: red;
        margin-bottom: 10px;
    }
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
