export function linearSearch(arr, target) {
    const steps = [];

    for (let i = 0; i < arr.length; i++) {
        steps.push({
            arr: [...arr],
            active: [i],
            compare: [],
            sortedFrom: 999,
            codeLines: [0, 1],
            msg: `Checking arr[${i}]=${arr[i]} == ${target}?`,
        });
        if (arr[i] === target) {
            steps.push({
                arr: [...arr],
                active: [i],
                compare: [],
                sortedFrom: 999,
                found: i,
                codeLines: [0, 1, 2],
                msg: `Found ${target} at index ${i}!`,
            });
            return steps;
        } else {
            steps.push({
                arr: [...arr],
                active: [],
                compare: [i],
                sortedFrom: 999,
                codeLines: [0, 1],
                msg: `${arr[i]} ≠ ${target}, continue`,
            });
        }
    }
    steps.push({
        arr: [...arr],
        active: [],
        compare: [],
        sortedFrom: 999,
        codeLines: [3],
        msg: `${target} not found in array.`,
    });
    return steps;
}

export function binarySearch(arr, target) {
    const steps = [];
    const sorted = [...arr].sort((a, b) => a - b);
    let lo = 0, hi = sorted.length - 1;

    steps.push({
        arr: [...sorted],
        active: [],
        compare: [],
        sortedFrom: 999,
        codeLines: [0],
        msg: `Array sorted. Searching for ${target}`,
    });

    while (lo <= hi) {
        const mid = Math.floor((lo + hi) / 2);
        steps.push({
            arr: [...sorted],
            active: [mid],
            compare: [],
            sortedFrom: 999,
            lo, hi,
            codeLines: [1, 2],
            msg: `lo=${lo}, hi=${hi}, mid=${mid}, arr[mid]=${sorted[mid]}`,
        });
        if (sorted[mid] === target) {
            steps.push({
                arr: [...sorted],
                active: [mid],
                compare: [],
                sortedFrom: 999,
                found: mid,
                codeLines: [3],
                msg: `Found ${target} at index ${mid}!`,
            });
            return steps;
        } else if (sorted[mid] < target) {
            steps.push({
                arr: [...sorted],
                active: [],
                compare: [],
                sortedFrom: 999,
                eliminated: [lo, mid],
                lo: mid + 1, hi,
                codeLines: [4],
                msg: `${sorted[mid]} < ${target} → search right half`,
            });
            lo = mid + 1;
        } else {
            steps.push({
                arr: [...sorted],
                active: [],
                compare: [],
                sortedFrom: 999,
                eliminated: [mid, hi],
                lo, hi: mid - 1,
                codeLines: [5],
                msg: `${sorted[mid]} > ${target} → search left half`,
            });
            hi = mid - 1;
        }
    }
    steps.push({
        arr: [...sorted],
        active: [],
        compare: [],
        sortedFrom: 999,
        codeLines: [],
        msg: `${target} not found.`,
    });
    return steps;
}