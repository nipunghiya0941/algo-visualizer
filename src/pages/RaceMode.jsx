import React, { useState, useRef } from 'react';
import { bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort, countingSort, radixSort } from '../algorithms/sorting';

const SORT_ALGOS = {
    bubble: { name: 'Bubble Sort', complexity: 'O(n²)' },
    selection: { name: 'Selection Sort', complexity: 'O(n²)' },
    insertion: { name: 'Insertion Sort', complexity: 'O(n²)' },
    merge: { name: 'Merge Sort', complexity: 'O(n log n)' },
    quick: { name: 'Quick Sort', complexity: 'O(n log n)' },
    heap: { name: 'Heap Sort', complexity: 'O(n log n)' },
    counting: { name: 'Counting Sort', complexity: 'O(n+k)' },
    radix: { name: 'Radix Sort', complexity: 'O(nk)' },
};

const generateArr = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 80) + 10);

const getSteps = (algo, arr) => {
    if (algo === 'bubble') return bubbleSort(arr);
    if (algo === 'selection') return selectionSort(arr);
    if (algo === 'insertion') return insertionSort(arr);
    if (algo === 'merge') return mergeSort(arr);
    if (algo === 'quick') return quickSort(arr);
    if (algo === 'heap') return heapSort(arr);
    if (algo === 'counting') return countingSort(arr);
    if (algo === 'radix') return radixSort(arr);
    return [];
};

const RaceBars = ({ step, color }) => {
    if (!step || !step.arr) return (
        <div style={{ height: '160px', backgroundColor: '#1f2937', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '13px' }}>Press Start Race</span>
        </div>
    );
    const arr = step.arr;
    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '2px', height: '160px', backgroundColor: '#1f2937', borderRadius: '12px', padding: '8px 8px 4px' }}>
            {arr.map((val, i) => {
                const isActive = step.active?.includes(i);
                const isCompare = step.compare?.includes(i);
                const isSorted = step.sortedFrom !== undefined && i >= step.sortedFrom && step.sortedFrom < arr.length;
                const barColor = isActive ? '#facc15' : isCompare ? '#f87171' : isSorted ? '#22c55e' : color;
                const heightPx = Math.round(((val - minVal + 5) / (maxVal - minVal + 5)) * 110) + 20;
                return (
                    <div key={i} style={{ flex: '1', maxWidth: '20px', height: `${heightPx}px`, backgroundColor: barColor, borderRadius: '3px 3px 0 0', transition: 'height 0.15s, background-color 0.15s' }} />
                );
            })}
        </div>
    );
};

const RaceMode = () => {
    const [algos, setAlgos] = useState(['bubble', 'quick', 'merge', 'insertion']);
    const [arrSize, setArrSize] = useState(20);
    const [speed, setSpeed] = useState(5);
    const [racing, setRacing] = useState(false);
    const [winner, setWinner] = useState('');
    const [finished, setFinished] = useState([]);
    const [stepIdxs, setStepIdxs] = useState([0, 0, 0, 0]);
    const [allSteps, setAllSteps] = useState([[], [], [], []]);
    const timers = useRef([null, null, null, null]);
    const doneFlags = useRef([false, false, false, false]);
    const finishOrder = useRef([]);

    const COLORS = ['#a78bfa', '#38bdf8', '#fb923c', '#34d399'];

    const stopAll = () => {
        timers.current.forEach((t) => clearInterval(t));
        setRacing(false);
    };

    const startRace = () => {
        stopAll();
        setWinner('');
        setFinished([]);
        finishOrder.current = [];
        doneFlags.current = [false, false, false, false];

        const arr = generateArr(arrSize);
        const steps = algos.map((a) => getSteps(a, [...arr]));
        setAllSteps(steps);
        setStepIdxs([0, 0, 0, 0]);
        setRacing(true);

        const delay = Math.round(1200 / speed);

        steps.forEach((s, idx) => {
            let i = 0;
            timers.current[idx] = setInterval(() => {
                if (i >= s.length) {
                    clearInterval(timers.current[idx]);
                    doneFlags.current[idx] = true;
                    finishOrder.current.push(algos[idx]);
                    if (finishOrder.current.length === 1) setWinner(SORT_ALGOS[algos[idx]].name);
                    setFinished([...finishOrder.current]);
                    if (doneFlags.current.every(Boolean)) setRacing(false);
                    return;
                }
                i++;
                setStepIdxs((prev) => { const n = [...prev]; n[idx] = i; return n; });
            }, delay);
        });
    };

    const algoColors = ['text-purple-400 border-purple-700', 'text-blue-400 border-blue-700', 'text-orange-400 border-orange-700', 'text-green-400 border-green-700'];

    return (
        <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-purple-400 mb-2">🏁 Algorithm Race Mode</h1>
                <p className="text-gray-400 text-sm mb-6">Same array, different algorithms — who finishes first?</p>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 mb-6 items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Size</span>
                        <input type="range" min="5" max="50" value={arrSize} onChange={(e) => setArrSize(parseInt(e.target.value))} className="w-24" />
                        <span className="text-white">{arrSize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Speed</span>
                        <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-24" />
                        <span className="text-white">{speed}</span>
                    </div>
                    <button onClick={startRace} className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-5 py-2 text-sm font-semibold transition">🚀 Start Race</button>
                    <button onClick={stopAll} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">✕ Stop</button>
                </div>

                {/* Algorithm Selectors */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {algos.map((algo, idx) => (
                        <select
                            key={idx}
                            value={algo}
                            onChange={(e) => { const n = [...algos]; n[idx] = e.target.value; setAlgos(n); }}
                            className={`bg-gray-800 border rounded-lg px-3 py-2 text-sm ${algoColors[idx]}`}
                        >
                            {Object.keys(SORT_ALGOS).map((a) => <option key={a} value={a}>{SORT_ALGOS[a].name}</option>)}
                        </select>
                    ))}
                </div>

                {/* Winner Banner */}
                {winner && (
                    <div className="bg-yellow-500 text-gray-900 rounded-xl px-6 py-3 text-center font-bold text-lg mb-4 animate-pulse">
                        🏆 {winner} wins!
                        {finishOrder.current.length > 1 && (
                            <span className="text-sm font-normal ml-3">
                                2nd: {SORT_ALGOS[finishOrder.current[1]]?.name}
                                {finishOrder.current[2] && ` · 3rd: ${SORT_ALGOS[finishOrder.current[2]]?.name}`}
                            </span>
                        )}
                    </div>
                )}

                {/* Race Bars */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {algos.map((algo, idx) => {
                        const isFinished = finishOrder.current.includes(algo);
                        const rank = finishOrder.current.indexOf(algo) + 1;
                        return (
                            <div key={idx}>
                                <div className={`text-sm font-semibold mb-1 flex items-center gap-2 ${algoColors[idx].split(' ')[0]}`}>
                                    {rank > 0 && <span className="text-yellow-400">#{rank}</span>}
                                    {SORT_ALGOS[algo].name}
                                    {isFinished && <span className="text-green-400 text-xs">✓</span>}
                                </div>
                                <div className="text-xs text-gray-500 mb-2">
                                    Steps: {stepIdxs[idx]}/{allSteps[idx]?.length || 0} · {SORT_ALGOS[algo].complexity}
                                </div>
                                <RaceBars step={allSteps[idx]?.[stepIdxs[idx] - 1]} color={COLORS[idx]} />
                            </div>
                        );
                    })}
                </div>

                {/* Step Count Comparison */}
                {allSteps[0].length > 0 && (
                    <div className="bg-gray-900 rounded-xl p-4 mt-2">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-3">Total Steps Comparison</div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {algos.map((algo, idx) => (
                                <div key={idx} className={`bg-gray-800 rounded-lg p-3 border ${algoColors[idx].split(' ')[1]}`}>
                                    <div className={`text-sm font-semibold ${algoColors[idx].split(' ')[0]}`}>{SORT_ALGOS[algo].name}</div>
                                    <div className="text-2xl font-bold text-white mt-1">{allSteps[idx]?.length || 0}</div>
                                    <div className="text-xs text-gray-500">total steps</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaceMode;