import type { Tracker } from "../types"
import { TRACKER_DATA_KEY } from "../constants"

const loadTrackers = () => {
    try {
        return JSON.parse(
            localStorage.getItem(TRACKER_DATA_KEY) ?? "[]"
        )
    } catch {
        return []
    }
}

class TrackerList {
    trackers = $state<Tracker[]>(loadTrackers())

    private save() {
        localStorage.setItem(
            TRACKER_DATA_KEY,
            this.getJSON()
        )
    }

    private getJSON() {
        return JSON.stringify(this.trackers)
    }

    exportData() {
        const json = this.getJSON()
        const blob = new Blob([json], {
            type: "application/json"
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'tracker_export.json'
        a.click()

        URL.revokeObjectURL(url)
    }

    importData(data: Tracker[]) {
        if (!Array.isArray(data)) {
            throw new Error('Invalid backup format');
        }

        this.trackers = data;
        this.save();
    }

    newTracker(name: string) {
        this.trackers.push({
            id: crypto.randomUUID(),
            name: name,
            items: []
        })

        this.save()
    }

    addTracker(tracker: Tracker) {
        this.trackers.push(tracker)
    }

    deleteTracker(id: string) {
        this.trackers = this.trackers.filter(t => t.id !== id)

        this.save()
    }

    addItem(trackerId: string, item: string) {
        const tracker = this.trackers.find(t => t.id === trackerId)
        if (!tracker) return

        tracker.items.push(item)
        this.save()
    }

    
    removeItem(trackerId: string, itemId: number) {
        const tracker = this.trackers.find(t => t.id === trackerId)
        if (!tracker) return

        tracker.items.splice(itemId, 1)
        this.save()
    }
}

export const trackerList = new TrackerList()