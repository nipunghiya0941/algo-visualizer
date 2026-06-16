import React, { useState, useRef } from 'react';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, countingSort, radixSort } from '../algorithms/sorting';
import { linearSearch, binarySearch } from '../algorithms/searching';
import { bfs, dfs, dijkstra, DEFAULT_GRAPH, DIJKSTRA_GRAPH } from '../algorithms/graph';
import { stackDemo, queueDemo, linkedListDemo, arrayDemo } from '../algorithms/datastructures';
import { buildBST, inorder, preorder, postorder, getTreeLayout } from '../algorithms/tree';

const ALGO_CONFIG = {
  bubble: { name: 'Bubble Sort', complexity: 'Time: O(n²)  |  Space: O(1)', code: ['for i in range(n):', '  for j in range(n-i-1):', '    if arr[j] > arr[j+1]:', '      swap(arr[j], arr[j+1])'], type: 'sort' },
  selection: { name: 'Selection Sort', complexity: 'Time: O(n²)  |  Space: O(1)', code: ['for i in range(n):', '  min_idx = i', '  for j in range(i+1, n):', '    if arr[j] < arr[min_idx]: min_idx = j', '  swap(arr[i], arr[min_idx])'], type: 'sort' },
  insertion: { name: 'Insertion Sort', complexity: 'Time: O(n²) avg | O(n) best  |  Space: O(1)', code: ['for i in range(1, n):', '  key = arr[i]', '  j = i - 1', '  while j >= 0 and arr[j] > key:', '    arr[j+1] = arr[j]', '    j -= 1', '  arr[j+1] = key'], type: 'sort' },
  merge: { name: 'Merge Sort', complexity: 'Time: O(n log n)  |  Space: O(n)', code: ['def merge_sort(arr, l, r):', '  if l < r:', '    mid = (l+r)//2', '    merge_sort(arr, l, mid)', '    merge_sort(arr, mid+1, r)', '    merge(arr, l, mid, r)'], type: 'sort' },
  quick: { name: 'Quick Sort', complexity: 'Time: O(n log n) avg | O(n²) worst  |  Space: O(log n)', code: ['def quick_sort(arr, lo, hi):', '  if lo < hi:', '    pivot = arr[hi]', '    i = lo - 1', '    for j in range(lo, hi):', '      if arr[j] <= pivot:', '        i++; swap(arr[i], arr[j])', '    swap(arr[i+1], arr[hi])'], type: 'sort' },
  heap: { name: 'Heap Sort', complexity: 'Time: O(n log n)  |  Space: O(1)', code: ['def heapify(arr, n, i):', '  largest = i, l = 2i+1, r = 2i+2', '  if arr[l] > arr[largest]: largest = l', '  if largest != i: swap(arr[i], arr[largest])', '  build_max_heap(arr)', '  for i from n-1 to 0:', '    swap(arr[0], arr[i])', '    heapify(arr, i, 0)'], type: 'sort' },
  counting: { name: 'Counting Sort', complexity: 'Time: O(n+k)  |  Space: O(k)', code: ['max_val = max(arr)', 'count = [0] * (max_val + 1)', 'for val in arr:', '  count[val] += 1', 'for i in range(max_val+1):', '  output count[i] times i'], type: 'sort' },
  radix: { name: 'Radix Sort', complexity: 'Time: O(nk)  |  Space: O(n+k)', code: ['for exp in [1, 10, 100...]:', '  count = [0] * 10', '  for val in arr: count[digit]++', '  for i in range(9): count[i]+=count[i-1]', '  place elements using count', '  arr = output'], type: 'sort' },
  linear: { name: 'Linear Search', complexity: 'Time: O(n)  |  Space: O(1)', code: ['for i in range(len(arr)):', '  if arr[i] == target:', '    return i', 'return -1'], type: 'search' },
  binary: { name: 'Binary Search', complexity: 'Time: O(log n)  |  Space: O(1)', code: ['lo, hi = 0, n-1', 'while lo <= hi:', '  mid = (lo+hi)//2', '  if arr[mid] == target: return mid', '  elif arr[mid] < target: lo = mid+1', '  else: hi = mid-1'], type: 'search' },
  bfs: { name: 'BFS', complexity: 'Time: O(V+E)  |  Space: O(V)', code: ['queue = [start]; visited = {start}', 'while queue:', '  node = queue.pop(0)', '  process(node)', '  for neighbor in graph[node]:', '    if neighbor not in visited:', '      visited.add(neighbor)', '      queue.append(neighbor)'], type: 'graph' },
  dfs: { name: 'DFS', complexity: 'Time: O(V+E)  |  Space: O(V)', code: ['def dfs(node):', '  visited.add(node)', '  for neighbor in graph[node]:', '    if neighbor not in visited:', '      dfs(neighbor)'], type: 'graph' },
  dijkstra: { name: 'Dijkstra', complexity: 'Time: O(V²)  |  Space: O(V)', code: ['dist[start]=0, all others=∞', 'while unvisited nodes:', '  node = min dist unvisited', '  visited.add(node)', '  for neighbor, weight in graph[node]:', '    newDist = dist[node] + weight', '    if newDist < dist[neighbor]:', '      dist[neighbor] = newDist'], type: 'graph' },
  inorder: { name: 'Inorder Traversal', complexity: 'Time: O(n)  |  Space: O(h)', code: ['def inorder(node):', '  inorder(node.left)', '  visit(node)', '  inorder(node.right)'], type: 'tree' },
  preorder: { name: 'Preorder Traversal', complexity: 'Time: O(n)  |  Space: O(h)', code: ['def preorder(node):', '  visit(node)', '  preorder(node.left)', '  preorder(node.right)'], type: 'tree' },
  postorder: { name: 'Postorder Traversal', complexity: 'Time: O(n)  |  Space: O(h)', code: ['def postorder(node):', '  postorder(node.left)', '  postorder(node.right)', '  visit(node)'], type: 'tree' },
  stack: { name: 'Stack', complexity: 'Push/Pop: O(1)', code: ['stack = []', 'stack.append(x)  # push', 'stack.pop()      # pop', 'stack[-1]        # peek'], type: 'ds' },
  queue: { name: 'Queue', complexity: 'Enqueue/Dequeue: O(1)', code: ['from collections import deque', 'q = deque()', 'q.append(x)    # enqueue', 'q.popleft()    # dequeue'], type: 'ds' },
  linkedlist: { name: 'Linked List', complexity: 'Insert at head: O(1) | at tail: O(n)', code: ['class Node:', '  def __init__(self, val):', '    self.val = val', '    self.next = None', 'head.next = new_node'], type: 'ds' },
  array: { name: 'Array', complexity: 'Access: O(1) | Search: O(n)', code: ['arr = [...]', 'arr[i]         # access', 'max(arr)       # max element'], type: 'ds' },
};

const LEGEND = {
  sort: [{ color: '#2dd4bf', label: 'Unsorted' }, { color: '#facc15', label: 'Active' }, { color: '#f87171', label: 'Comparing' }, { color: '#22c55e', label: 'Sorted' }, { color: '#c084fc', label: 'Pivot' }],
  search: [{ color: '#2dd4bf', label: 'Unchecked' }, { color: '#facc15', label: 'Checking' }, { color: '#4ade80', label: 'Found' }, { color: '#f87171', label: 'Not match' }, { color: '#4b5563', label: 'Eliminated' }],
};

const SORT_ALGOS = ['bubble', 'selection', 'insertion', 'merge', 'quick'];

const generateArr = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 10);

const getSteps = (algo, arr, target) => {
  if (algo === 'bubble') return bubbleSort(arr);
  if (algo === 'selection') return selectionSort(arr);
  if (algo === 'insertion') return insertionSort(arr);
  if (algo === 'merge') return mergeSort(arr);
  if (algo === 'quick') return quickSort(arr);
  return [];
};

const Visualizer = ({ category }) => {
  const algosByCategory = {
    sorting: ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap', 'counting', 'radix'],
    searching: ['linear', 'binary'],
    graph: ['bfs', 'dfs', 'dijkstra'],
    tree: ['inorder', 'preorder', 'postorder'],
    ds: ['stack', 'queue', 'linkedlist', 'array'],
  };

  const [selectedAlgo, setSelectedAlgo] = useState(algosByCategory[category][0]);
  const [inputVal, setInputVal] = useState('');
  const [arrSize, setArrSize] = useState(12);
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [msg, setMsg] = useState('Press Generate then Play or Step.');
  const [target, setTarget] = useState('');
  const [swaps, setSwaps] = useState(0);
  const [comparisons, setComparisons] = useState(0);

  // Race mode
  const [raceMode, setRaceMode] = useState(false);
  const [raceAlgo1, setRaceAlgo1] = useState('bubble');
  const [raceAlgo2, setRaceAlgo2] = useState('quick');
  const [raceSteps1, setRaceSteps1] = useState([]);
  const [raceSteps2, setRaceSteps2] = useState([]);
  const [raceIdx1, setRaceIdx1] = useState(0);
  const [raceIdx2, setRaceIdx2] = useState(0);
  const [racePlaying, setRacePlaying] = useState(false);
  const [raceWinner, setRaceWinner] = useState('');
  const raceTimer1 = useRef(null);
  const raceTimer2 = useRef(null);

  const timerRef = useRef(null);
  const audioCtxRef = useRef(null);

  const algo = ALGO_CONFIG[selectedAlgo];

  const playBeep = (frequency = 300) => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
    } catch (e) { }
  };

  const getInputArr = (n) => {
    const size = n || arrSize;
    if (inputVal.trim()) {
      const parsed = inputVal.split(',').map((x) => parseInt(x.trim())).filter((x) => !isNaN(x));
      if (parsed.length) return parsed;
    }
    return generateArr(size);
  };

  const generateSteps = () => {
    stopPlaying();
    const arr = getInputArr();
    let generated = [];
    if (selectedAlgo === 'bubble') generated = bubbleSort(arr);
    else if (selectedAlgo === 'selection') generated = selectionSort(arr);
    else if (selectedAlgo === 'insertion') generated = insertionSort(arr);
    else if (selectedAlgo === 'merge') generated = mergeSort(arr);
    else if (selectedAlgo === 'quick') generated = quickSort(arr);
    else if (selectedAlgo === 'heap') generated = heapSort(arr);
    else if (selectedAlgo === 'counting') generated = countingSort(arr);
    else if (selectedAlgo === 'radix') generated = radixSort(arr);
    else if (selectedAlgo === 'linear') { const t = target ? parseInt(target) : arr[Math.floor(Math.random() * arr.length)]; generated = linearSearch(arr, t); }
    else if (selectedAlgo === 'binary') { const t = target ? parseInt(target) : arr[Math.floor(Math.random() * arr.length)]; generated = binarySearch(arr, t); }
    else if (selectedAlgo === 'bfs') generated = bfs(DEFAULT_GRAPH, 'A');
    else if (selectedAlgo === 'dfs') generated = dfs(DEFAULT_GRAPH, 'A');
    else if (selectedAlgo === 'dijkstra') generated = dijkstra(DIJKSTRA_GRAPH, 'A');
    else if (selectedAlgo === 'inorder') { const root = buildBST(arr); generated = inorder(root); }
    else if (selectedAlgo === 'preorder') { const root = buildBST(arr); generated = preorder(root); }
    else if (selectedAlgo === 'postorder') { const root = buildBST(arr); generated = postorder(root); }
    else if (selectedAlgo === 'stack') generated = stackDemo(arr.slice(0, 6));
    else if (selectedAlgo === 'queue') generated = queueDemo(arr.slice(0, 6));
    else if (selectedAlgo === 'linkedlist') generated = linkedListDemo(arr.slice(0, 6));
    else if (selectedAlgo === 'array') generated = arrayDemo(arr.slice(0, 8));
    setSteps(generated); setStepIdx(0); setSwaps(0); setComparisons(0);
    setMsg('Ready. Press Play or Step.');
  };

  const stopPlaying = () => { setPlaying(false); clearInterval(timerRef.current); };

  const onStep = () => {
    if (!steps.length) return;
    if (stepIdx >= steps.length) { setMsg('Done! Press Reset.'); return; }
    const s = steps[stepIdx];
    setMsg(s?.msg || '');
    if (s?.active?.length) setSwaps((p) => p + (s.codeLines?.includes(3) || s.codeLines?.includes(6) ? 1 : 0));
    if (s?.compare?.length) setComparisons((p) => p + 1);
    if (s?.active?.length) playBeep(200 + (s.arr?.[s.active[0]] * 3));
    setStepIdx((prev) => prev + 1);
  };

  const onPlayPause = () => {
    if (playing) { stopPlaying(); return; }
    if (!steps.length) return;
    setPlaying(true);
    const delay = Math.round(1200 / speed);
    timerRef.current = setInterval(() => {
      setStepIdx((prev) => {
        if (prev >= steps.length) { stopPlaying(); return prev; }
        const s = steps[prev];
        setMsg(s?.msg || '');
        if (s?.compare?.length) setComparisons((p) => p + 1);
        if (s?.codeLines?.includes(3) || s?.codeLines?.includes(6)) setSwaps((p) => p + 1);
        if (s?.active?.length) playBeep(200 + (s.arr?.[s.active[0]] * 3));
        return prev + 1;
      });
    }, delay);
  };

  const onReset = () => {
    stopPlaying(); setSteps([]); setStepIdx(0); setSwaps(0); setComparisons(0);
    setMsg('Press Generate then Play or Step.');
  };

  // RACE MODE
  const startRace = () => {
    clearInterval(raceTimer1.current); clearInterval(raceTimer2.current);
    setRaceWinner(''); setRaceIdx1(0); setRaceIdx2(0);
    const arr = generateArr(arrSize);
    const s1 = getSteps(raceAlgo1, [...arr]);
    const s2 = getSteps(raceAlgo2, [...arr]);
    setRaceSteps1(s1); setRaceSteps2(s2);
    setRacePlaying(true);
    const delay = Math.round(1200 / speed);
    let done1 = false, done2 = false;
    let idx1 = 0, idx2 = 0;

    raceTimer1.current = setInterval(() => {
      if (idx1 >= s1.length) { clearInterval(raceTimer1.current); done1 = true; if (!done2) setRaceWinner(ALGO_CONFIG[raceAlgo1].name); return; }
      setRaceIdx1(++idx1);
    }, delay);

    raceTimer2.current = setInterval(() => {
      if (idx2 >= s2.length) { clearInterval(raceTimer2.current); done2 = true; if (!done1) setRaceWinner(ALGO_CONFIG[raceAlgo2].name); return; }
      setRaceIdx2(++idx2);
    }, delay);
  };

  const stopRace = () => {
    clearInterval(raceTimer1.current); clearInterval(raceTimer2.current);
    setRacePlaying(false);
  };

  const currentStep = steps[stepIdx - 1];

  const renderBars = (step, compact = false) => {
    if (!step || !step.arr) return null;
    const arr = step.arr;
    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    const h = compact ? 160 : 260;
    const maxBarH = compact ? 110 : 180;
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: compact ? '2px' : '4px', height: `${h}px`, backgroundColor: '#1f2937', borderRadius: '12px', padding: compact ? '8px 8px 4px' : '16px 16px 8px' }}>
        {arr.map((val, i) => {
          const isActive = step.active?.includes(i);
          const isCompare = step.compare?.includes(i);
          const isSorted = step.sortedFrom !== undefined && i >= step.sortedFrom && step.sortedFrom < arr.length;
          const isPivot = step.pivot === i;
          const isFound = step.found === i;
          const isElim = step.eliminated && i >= step.eliminated[0] && i <= step.eliminated[1];
          const barColor = isFound ? '#4ade80' : isPivot ? '#c084fc' : isActive ? '#facc15' : isCompare ? '#f87171' : isElim ? '#4b5563' : isSorted ? '#22c55e' : '#2dd4bf';
          const heightPx = Math.round(((val - minVal + 5) / (maxVal - minVal + 5)) * maxBarH) + 20;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', maxWidth: compact ? '20px' : '44px' }}>
              {!compact && <span style={{ color: 'white', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>{val}</span>}
              <div style={{ width: '100%', height: `${heightPx}px`, backgroundColor: barColor, borderRadius: '4px 4px 0 0', transition: 'height 0.2s, background-color 0.2s' }} />
              {!compact && <span style={{ color: '#6b7280', fontSize: '10px', marginTop: '4px' }}>{i}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const renderGraph = (step) => {
    const nodes = Object.keys(DEFAULT_GRAPH);
    const positions = { A: [300, 50], B: [160, 140], C: [440, 140], D: [80, 230], E: [240, 230], F: [440, 230] };
    return (
      <svg width="100%" height="290" className="bg-gray-800 rounded-xl">
        {Object.entries(DEFAULT_GRAPH).map(([node, neighbors]) => neighbors.map((nb) => { const [x1, y1] = positions[node]; const [x2, y2] = positions[nb]; return <line key={`${node}-${nb}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4B5563" strokeWidth="2" />; }))}
        {nodes.map((node) => { const [x, y] = positions[node]; const isVisited = step?.visited?.includes(node); const isCurrent = step?.current === node; return (<g key={node}><circle cx={x} cy={y} r={26} fill={isCurrent ? '#EF9F27' : isVisited ? '#1D9E75' : '#374151'} stroke={isCurrent ? '#F59E0B' : '#6B7280'} strokeWidth="2" /><text x={x} y={y + 5} textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">{node}</text></g>); })}
      </svg>
    );
  };

  const renderTree = (step) => {
    const arr = getInputArr();
    const root = buildBST(arr);
    const { nodes, edges } = getTreeLayout(root);
    return (
      <svg width="100%" height="290" className="bg-gray-800 rounded-xl">
        {edges.map((e, i) => <line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke="#4B5563" strokeWidth="2" />)}
        {nodes.map((n, i) => { const isCurrent = step?.current === n.val; const isVisited = step?.visited?.includes(n.val); return (<g key={i}><circle cx={n.x} cy={n.y} r={22} fill={isCurrent ? '#EF9F27' : isVisited ? '#1D9E75' : '#374151'} stroke={isCurrent ? '#F59E0B' : '#6B7280'} strokeWidth="2" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{n.val}</text></g>); })}
      </svg>
    );
  };

  const renderDS = (step) => {
    if (!step?.items) return null;
    if (selectedAlgo === 'stack') return (<div className="flex flex-col-reverse items-center gap-2 bg-gray-800 rounded-xl p-6 min-h-56 justify-end">{step.items.length === 0 && <span className="text-gray-500 text-sm">Stack empty</span>}{step.items.map((v, i) => <div key={i} className={`w-28 h-10 rounded-lg flex items-center justify-center font-bold text-gray-900 text-sm ${i === step.items.length - 1 ? 'bg-yellow-400' : 'bg-teal-400'}`}>{v}</div>)}</div>);
    if (selectedAlgo === 'queue') return (<div className="flex items-center gap-2 bg-gray-800 rounded-xl p-6 min-h-56 justify-center flex-wrap">{step.items.length === 0 && <span className="text-gray-500 text-sm">Queue empty</span>}{step.items.map((v, i) => <div key={i} className={`w-16 h-10 rounded-lg flex items-center justify-center font-bold text-gray-900 text-sm ${i === 0 ? 'bg-yellow-400' : 'bg-teal-400'}`}>{v}</div>)}</div>);
    if (selectedAlgo === 'linkedlist') return (<div className="flex items-center gap-1 bg-gray-800 rounded-xl p-6 min-h-56 justify-center flex-wrap">{step.items.length === 0 && <span className="text-gray-500 text-sm">List empty</span>}{step.items.map((v, i) => <div key={i} className="flex items-center gap-1"><div className={`w-14 h-10 rounded-lg flex items-center justify-center font-bold text-gray-900 text-sm ${i === step.active ? 'bg-yellow-400' : 'bg-teal-400'}`}>{v}</div>{i < step.items.length - 1 && <span className="text-gray-400 text-xl font-bold">→</span>}</div>)}</div>);
    if (selectedAlgo === 'array') return (<div className="flex items-end gap-1 bg-gray-800 rounded-xl p-6 min-h-56 justify-center">{step.items.map((v, i) => <div key={i} className="flex flex-col items-center gap-1"><span className="text-white text-xs font-semibold">{v}</span><div className={`w-10 rounded-t-md ${i === step.active ? 'bg-yellow-400' : 'bg-teal-400'}`} style={{ height: `${Math.round((v / Math.max(...step.items)) * 120)}px` }} /><span className="text-gray-500 text-xs">{i}</span></div>)}</div>);
    return null;
  };

  const isBarType = algo.type === 'sort' || algo.type === 'search';
  const isSortCategory = category === 'sorting';

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-green-400 mb-6">{algo.name}</h1>

        {/* Race Mode Toggle */}
        {isSortCategory && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => { setRaceMode(!raceMode); stopRace(); onReset(); }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${raceMode ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              🏁 {raceMode ? 'Race Mode ON' : 'Race Mode'}
            </button>
          </div>
        )}

        {/* RACE MODE UI */}
        {raceMode && isSortCategory ? (
          <div>
            <div className="flex flex-wrap gap-3 mb-4 items-center">
              <select value={raceAlgo1} onChange={(e) => setRaceAlgo1(e.target.value)} className="bg-purple-900 border border-purple-500 text-white rounded-lg px-3 py-2 text-sm">
                {SORT_ALGOS.map((a) => <option key={a} value={a}>{ALGO_CONFIG[a].name}</option>)}
              </select>
              <span className="text-gray-400 font-bold">vs</span>
              <select value={raceAlgo2} onChange={(e) => setRaceAlgo2(e.target.value)} className="bg-blue-900 border border-blue-500 text-white rounded-lg px-3 py-2 text-sm">
                {SORT_ALGOS.map((a) => <option key={a} value={a}>{ALGO_CONFIG[a].name}</option>)}
              </select>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Size</span>
                <input type="range" min="5" max="40" value={arrSize} onChange={(e) => setArrSize(parseInt(e.target.value))} className="w-24" />
                <span className="text-white">{arrSize}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Speed</span>
                <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-24" />
                <span className="text-white">{speed}</span>
              </div>
              <button onClick={startRace} className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2 text-sm font-semibold">🚀 Start Race</button>
              <button onClick={stopRace} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm">✕ Stop</button>
            </div>

            {raceWinner && (
              <div className="bg-yellow-500 text-gray-900 rounded-lg px-4 py-2 text-sm font-bold mb-4">
                🏆 Winner: {raceWinner} finished in fewer steps!
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-purple-400 font-semibold text-sm mb-2">{ALGO_CONFIG[raceAlgo1].name} — {raceIdx1} steps</div>
                {renderBars(raceSteps1[raceIdx1 - 1], true)}
              </div>
              <div>
                <div className="text-blue-400 font-semibold text-sm mb-2">{ALGO_CONFIG[raceAlgo2].name} — {raceIdx2} steps</div>
                {renderBars(raceSteps2[raceIdx2 - 1], true)}
              </div>
            </div>

            {/* Complexity Comparison */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-900 rounded-xl p-4 text-xs text-gray-400 border border-purple-800">
                <div className="text-purple-400 font-semibold mb-1">{ALGO_CONFIG[raceAlgo1].name}</div>
                {ALGO_CONFIG[raceAlgo1].complexity}
              </div>
              <div className="bg-gray-900 rounded-xl p-4 text-xs text-gray-400 border border-blue-800">
                <div className="text-blue-400 font-semibold mb-1">{ALGO_CONFIG[raceAlgo2].name}</div>
                {ALGO_CONFIG[raceAlgo2].complexity}
              </div>
            </div>
          </div>
        ) : (
          // NORMAL MODE
          <div>
            <div className="flex flex-wrap gap-3 mb-4">
              <select value={selectedAlgo} onChange={(e) => { setSelectedAlgo(e.target.value); onReset(); }} className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm">
                {algosByCategory[category].map((a) => <option key={a} value={a}>{ALGO_CONFIG[a].name}</option>)}
              </select>
              {(algo.type === 'sort' || algo.type === 'ds') && (
                <input type="text" placeholder="e.g. 5,3,8,1,9" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-40" />
              )}
              {algo.type === 'search' && (
                <input type="number" placeholder="Target value" value={target} onChange={(e) => setTarget(e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-32" />
              )}
              <button onClick={generateSteps} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">🔄 Generate</button>
              <button onClick={onPlayPause} className="bg-green-600 hover:bg-green-500 text-white rounded-lg px-4 py-2 text-sm transition font-semibold">{playing ? '⏸ Pause' : '▶ Play'}</button>
              <button onClick={onStep} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">→ Step</button>
              <button onClick={onReset} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">✕ Reset</button>
            </div>

            <div className="flex items-center gap-6 mb-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Speed</span>
                <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-28" />
                <span className="text-white font-medium">{speed}</span>
              </div>
              {algo.type === 'sort' && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Size</span>
                  <input type="range" min="5" max="40" value={arrSize} onChange={(e) => { setArrSize(parseInt(e.target.value)); onReset(); }} className="w-28" />
                  <span className="text-white font-medium">{arrSize}</span>
                </div>
              )}
              <div className="text-xs text-gray-500">Step {stepIdx}/{steps.length}</div>
              {isBarType && <>
                <div className="text-xs text-gray-400">Comparisons: <span className="text-yellow-400 font-semibold">{comparisons}</span></div>
                <div className="text-xs text-gray-400">Swaps: <span className="text-red-400 font-semibold">{swaps}</span></div>
              </>}
            </div>

            <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm text-yellow-300 mb-4 min-h-9">{msg}</div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
              <div style={{ minHeight: '260px' }}>
                {isBarType && renderBars(currentStep)}
                {algo.type === 'graph' && renderGraph(currentStep)}
                {algo.type === 'tree' && renderTree(currentStep)}
                {algo.type === 'ds' && renderDS(currentStep)}
              </div>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                <div className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Code</div>
                {algo.code.map((line, i) => (
                  <div key={i} className={`px-3 py-1 rounded transition-all duration-200 whitespace-pre ${currentStep?.codeLines?.includes(i) ? 'bg-yellow-500 text-gray-900 font-semibold' : 'text-gray-300'}`}>
                    <span className="text-gray-600 mr-3 select-none">{i + 1}</span>{line}
                  </div>
                ))}
                <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400">{algo.complexity}</div>
              </div>
            </div>

            {(algo.type === 'sort' || algo.type === 'search') && (
              <div className="flex gap-4 flex-wrap">
                {LEGEND[algo.type].map((l) => (
                  <div key={l.label} className="flex items-center gap-2 text-xs text-gray-400">
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualizer;