export function bubbleSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    let sortedFrom = n;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            steps.push({
                arr: [...a],
                active: [j, j + 1],
                compare: [j, j + 1],
                sortedFrom,
                codeLines: [0, 1, 2],
                msg: `Comparing arr[${j}]=${a[j]} and arr[${j + 1}]=${a[j + 1]}`,
            });
            if (a[j] > a[j + 1]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
                steps.push({
                    arr: [...a],
                    active: [j, j + 1],
                    compare: [],
                    sortedFrom,
                    codeLines: [0, 1, 2, 3],
                    msg: `Swapped → arr[${j}]=${a[j]}, arr[${j + 1}]=${a[j + 1]}`,
                });
            }
        }
        sortedFrom--;
        steps.push({
            arr: [...a],
            active: [],
            compare: [],
            sortedFrom,
            codeLines: [0],
            msg: `Pass ${i + 1} done. ${a[n - i - 1]} is in place.`,
        });
    }
    steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 0, codeLines: [], msg: 'Sorted!' });
    return steps;
}

export function selectionSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;

    for (let i = 0; i < n; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            steps.push({
                arr: [...a], active: [min_idx], compare: [j], sortedFrom: i,
                codeLines: [0, 1, 2, 3], msg: `Scanning: arr[${j}]=${a[j]} vs min arr[${min_idx}]=${a[min_idx]}`,
            });
            if (a[j] < a[min_idx]) {
                min_idx = j;
                steps.push({
                    arr: [...a], active: [min_idx], compare: [j], sortedFrom: i,
                    codeLines: [0, 1, 2, 3, 4], msg: `New min at index ${min_idx}: ${a[min_idx]}`,
                });
            }
        }
        [a[i], a[min_idx]] = [a[min_idx], a[i]];
        steps.push({
            arr: [...a], active: [i], compare: [], sortedFrom: i + 1,
            codeLines: [0, 1, 5], msg: `Placed min ${a[i]} at index ${i}`,
        });
    }
    steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 0, codeLines: [], msg: 'Sorted!' });
    return steps;
}

export function insertionSort(arr) {
    const steps = [];
    const a = [...arr];
    const n = a.length;

    steps.push({ arr: [...a], active: [0], compare: [], sortedFrom: n, codeLines: [], msg: 'Index 0 is trivially sorted.' });
    for (let i = 1; i < n; i++) {
        let key = a[i], j = i - 1;
        steps.push({ arr: [...a], active: [i], compare: [], sortedFrom: n, codeLines: [0, 1, 2], msg: `Key = arr[${i}] = ${key}` });
        while (j >= 0 && a[j] > key) {
            steps.push({ arr: [...a], active: [i], compare: [j], sortedFrom: n, codeLines: [0, 1, 2, 3, 4], msg: `arr[${j}]=${a[j]} > key=${key}, shifting right` });
            a[j + 1] = a[j]; j--;
            steps.push({ arr: [...a], active: [j + 1], compare: [], sortedFrom: n, codeLines: [0, 1, 2, 3, 4, 5], msg: `Shifted. j=${j}` });
        }
        a[j + 1] = key;
        steps.push({ arr: [...a], active: [j + 1], compare: [], sortedFrom: n, codeLines: [0, 1, 2, 3, 6], msg: `Inserted key ${key} at index ${j + 1}` });
    }
    steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 0, codeLines: [], msg: 'Sorted!' });
    return steps;
}

export function mergeSort(arr) {
    const steps = [];
    const a = [...arr];

    function merge(arr, l, m, r) {
        const L = arr.slice(l, m + 1), R = arr.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < L.length && j < R.length) {
            steps.push({ arr: [...arr], active: [k], compare: [l + i, m + 1 + j], sortedFrom: 999, codeLines: [5], msg: `Merging [${l}..${r}]: comparing ${L[i]} and ${R[j]}` });
            if (L[i] <= R[j]) arr[k++] = L[i++];
            else arr[k++] = R[j++];
            steps.push({ arr: [...arr], active: [k - 1], compare: [], sortedFrom: 999, codeLines: [5], msg: `Placed ${arr[k - 1]} at index ${k - 1}` });
        }
        while (i < L.length) { arr[k++] = L[i++]; steps.push({ arr: [...arr], active: [k - 1], compare: [], sortedFrom: 999, codeLines: [5], msg: `Copy left: ${arr[k - 1]}` }); }
        while (j < R.length) { arr[k++] = R[j++]; steps.push({ arr: [...arr], active: [k - 1], compare: [], sortedFrom: 999, codeLines: [5], msg: `Copy right: ${arr[k - 1]}` }); }
    }

    function ms(arr, l, r) {
        if (l < r) {
            const m = Math.floor((l + r) / 2);
            steps.push({ arr: [...arr], active: [], compare: [], sortedFrom: 999, codeLines: [0, 1, 2], msg: `Divide [${l}..${r}] → [${l}..${m}] and [${m + 1}..${r}]` });
            ms(arr, l, m); ms(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
    ms(a, 0, a.length - 1);
    steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 0, codeLines: [], msg: 'Sorted!' });
    return steps;
}

export function quickSort(arr) {
    const steps = [];
    const a = [...arr];

    function qs(arr, lo, hi) {
        if (lo < hi) {
            const pivot = arr[hi];
            steps.push({ arr: [...arr], active: [], compare: [hi], pivot: hi, sortedFrom: 999, codeLines: [0, 1, 2, 3], msg: `Pivot = arr[${hi}] = ${pivot}` });
            let i = lo - 1;
            for (let j = lo; j < hi; j++) {
                steps.push({ arr: [...arr], active: [j], compare: [hi], pivot: hi, sortedFrom: 999, codeLines: [4, 5], msg: `Compare arr[${j}]=${arr[j]} ≤ pivot=${pivot}?` });
                if (arr[j] <= pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    steps.push({ arr: [...arr], active: [i, j], compare: [hi], pivot: hi, sortedFrom: 999, codeLines: [4, 5, 6], msg: `Yes → swap arr[${i}] and arr[${j}]` });
                }
            }
            [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
            steps.push({ arr: [...arr], active: [i + 1], compare: [], pivot: i + 1, sortedFrom: 999, codeLines: [7], msg: `Pivot ${arr[i + 1]} placed at index ${i + 1}` });
            qs(arr, lo, i); qs(arr, i + 2, hi);
        }
    }
    qs(a, 0, a.length - 1);
    steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 0, codeLines: [], msg: 'Sorted!' });
    return steps;
}

export function heapSort(arr) {
  const steps = [];
  const a = [...arr];
  const n = a.length;

  function heapify(arr, n, i) {
    let largest = i, l = 2 * i + 1, r = 2 * i + 2;
    steps.push({ arr: [...arr], active: [i], compare: [l, r].filter(x => x < n), sortedFrom: 999, codeLines: [0, 1], msg: `Heapify at index ${i}, largest=${largest}` });
    if (l < n && arr[l] > arr[largest]) largest = l;
    if (r < n && arr[r] > arr[largest]) largest = r;
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({ arr: [...arr], active: [i, largest], compare: [], sortedFrom: 999, codeLines: [2, 3], msg: `Swap arr[${i}]=${arr[i]} and arr[${largest}]=${arr[largest]}` });
      heapify(arr, n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(a, n, i);
  steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 999, codeLines: [4], msg: 'Max heap built!' });

  for (let i = n - 1; i > 0; i--) {
    [a[0], a[i]] = [a[i], a[0]];
    steps.push({ arr: [...a], active: [0, i], compare: [], sortedFrom: i, codeLines: [5, 6], msg: `Move max ${a[i]} to position ${i}` });
    heapify(a, i, 0);
  }
  steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 0, codeLines: [], msg: 'Sorted!' });
  return steps;
}

export function countingSort(arr) {
  const steps = [];
  const a = [...arr];
  const max = Math.max(...a);
  const count = new Array(max + 1).fill(0);

  steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 999, codeLines: [0, 1], msg: `Max value = ${max}. Creating count array of size ${max + 1}` });

  a.forEach((val, i) => {
    count[val]++;
    steps.push({ arr: [...a], active: [i], compare: [], sortedFrom: 999, codeLines: [2, 3], msg: `count[${val}]++ = ${count[val]}` });
  });

  const output = [];
  for (let i = 0; i <= max; i++) {
    for (let j = 0; j < count[i]; j++) {
      output.push(i);
      steps.push({ arr: [...output, ...a.slice(output.length)], active: [output.length - 1], compare: [], sortedFrom: 999, codeLines: [4, 5], msg: `Placing ${i} at position ${output.length - 1}` });
    }
  }
  steps.push({ arr: [...output], active: [], compare: [], sortedFrom: 0, codeLines: [], msg: 'Sorted!' });
  return steps;
}

export function radixSort(arr) {
  const steps = [];
  let a = [...arr];
  const max = Math.max(...a);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(a.length).fill(0);
    const count = new Array(10).fill(0);

    steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 999, codeLines: [0, 1], msg: `Sorting by digit at place value ${exp}` });

    a.forEach((val, i) => {
      const digit = Math.floor(val / exp) % 10;
      count[digit]++;
      steps.push({ arr: [...a], active: [i], compare: [], sortedFrom: 999, codeLines: [2], msg: `arr[${i}]=${val}, digit=${digit}, count[${digit}]=${count[digit]}` });
    });

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = a.length - 1; i >= 0; i--) {
      const digit = Math.floor(a[i] / exp) % 10;
      output[count[digit] - 1] = a[i];
      count[digit]--;
      steps.push({ arr: [...a], active: [i], compare: [], sortedFrom: 999, codeLines: [3, 4], msg: `Placing ${a[i]} at position ${count[digit]}` });
    }

    a = [...output];
    steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 999, codeLines: [5], msg: `Pass done. Array: [${a.join(', ')}]` });
  }
  steps.push({ arr: [...a], active: [], compare: [], sortedFrom: 0, codeLines: [], msg: 'Sorted!' });
  return steps;
}