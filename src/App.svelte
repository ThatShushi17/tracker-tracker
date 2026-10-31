<script lang="ts">
    import { trackerList } from "./lib/TrackerList.svelte";
    import List from "./lib/components/Tracker.svelte";

    let newTrackerName = $state('')
    const createTracker = (e: SubmitEvent) => {
        e.preventDefault()

        const trimmedName = newTrackerName.trim()
        if (!trimmedName) return

        trackerList.newTracker(trimmedName)
        newTrackerName = ''
    }

    const importJSONFileInput = document.createElement('input')
    importJSONFileInput.type = "file"
    importJSONFileInput.accept = ".json,application/json"
    importJSONFileInput.onchange = handleImport
    
    async function handleImport(e: Event) {
        const input = e.currentTarget as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) return;

        try {
            const data = JSON.parse(await file.text());
            trackerList.importData(data);
        } catch {
            alert('Invalid backup file.');
        }

        input.value = '';
    }
</script>

<main>
    <button onclick={() => importJSONFileInput.click()}>Import JSON</button>
    <button onclick={trackerList.exportData}>Export JSON</button>

    <form onsubmit={createTracker}>
        <input
            type="text"
            bind:value={newTrackerName}
            placeholder="Tracker Name"
            required
        />

        <button type="submit">Create Tracker</button>
    </form>

    <hr>

    <div class="mosaic">
        {#each trackerList.trackers as list (list.id)}
            <List id={list.id} />
        {/each}
    </div>
</main>

<style>
    .mosaic {
        display: grid;
        grid-template-columns: repeat(
            auto-fill,
            minmax(14rem, 1fr)
        );
        gap: 1rem;
    }
</style>