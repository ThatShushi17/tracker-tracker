<script lang="ts">
    import { trackerList } from "../TrackerList.svelte";

    let { id }: { id: string } =  $props()
    let tracker = $derived(
        trackerList.trackers.find(l => l.id === id)
    )

    let newItemName = $state('')

    const createItem = (e: SubmitEvent) => {
        e.preventDefault()

        const trimmedName = newItemName.trim()
        if (!trimmedName) return

        trackerList.addItem(id, trimmedName)
        newItemName = ''
    }
</script>

{#if tracker}
    <div class="list">
        <div class="title">{tracker.name}</div>
        <ul class="items">
            {#each tracker.items as item, itemId}
                <li class="item">
                    <span class="item-value">{item}</span>
                    <button onclick={() => trackerList.removeItem(id, itemId)}>Delete</button>
                </li>
            {/each}
        </ul>

        <form onsubmit={createItem}>
            <input
                type="text"
                bind:value={newItemName}
                placeholder="Item Name"
                required
            />

            <button type="submit">Add Item</button>
        </form>

        <button onclick={() => trackerList.deleteTracker(id)}>Delete Tracker</button>
    </div>
{/if}

<style>
    .list {
        background-color: rgba(20, 20, 20, 0.2);
        border-radius: 1rem;
        padding: 0.5rem 0.5rem;
    }
    .title {
        font-weight: 600;
        font-size: 1.2rem;

    }
    .items {
        min-height: 4lh;
        max-height: 6lh;
        margin: 0;
    }
</style>