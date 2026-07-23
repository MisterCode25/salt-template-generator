import assert from "node:assert/strict";
import test from "node:test";
import { createAsyncTaskQueue } from "../src/utils/asyncTaskQueue.js";

test("createAsyncTaskQueue respects its concurrency limit", async () => {
    const enqueue = createAsyncTaskQueue(2);
    let active = 0;
    let peak = 0;
    const releases = [];

    const tasks = Array.from({ length: 5 }, (_, index) => enqueue(async () => {
        active += 1;
        peak = Math.max(peak, active);
        await new Promise((resolve) => releases.push(resolve));
        active -= 1;
        return index;
    }));

    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(active, 2);
    assert.equal(peak, 2);

    while (releases.length || active) {
        releases.splice(0).forEach((release) => release());
        await new Promise((resolve) => setImmediate(resolve));
    }

    assert.deepEqual(await Promise.all(tasks), [0, 1, 2, 3, 4]);
    assert.equal(peak, 2);
});
