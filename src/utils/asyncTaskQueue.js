export function createAsyncTaskQueue(concurrency = 1) {
    const limit = Math.max(1, Number(concurrency) || 1);
    const pending = [];
    let activeCount = 0;

    const runNext = () => {
        while (activeCount < limit && pending.length > 0) {
            const item = pending.shift();
            activeCount += 1;
            Promise.resolve()
                .then(item.task)
                .then(item.resolve, item.reject)
                .finally(() => {
                    activeCount -= 1;
                    runNext();
                });
        }
    };

    return function enqueue(task) {
        return new Promise((resolve, reject) => {
            pending.push({ task, resolve, reject });
            runNext();
        });
    };
}
