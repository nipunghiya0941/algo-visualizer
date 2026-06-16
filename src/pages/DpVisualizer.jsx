import React, { useState, useRef } from 'react';

const DPVisualizer = () => {
    const [mode, setMode] = useState('knapsack');
    const [playing, setPlaying] = useState(false);
    const [steps, setSteps] = useState([]);
    const [stepIdx, setStepIdx] = useState(0);
    const [speed, setSpeed] = useState(5);
    const [msg, setMsg] = useState('Press Generate then Play.');
    const timerRef = useRef(null);

    // Knapsack inputs
    const [capacity, setCapacity] = useState(10);
    const [weights, setWeights] = useState('2,3,4,5');
    const [values, setValues] = useState('3,4,5,6');

    // LCS inputs
    const [str1, setStr1] = useState('ABCBDAB');
    const [str2, setStr2] = useState('BDCAB');

    const stopPlaying = () => { setPlaying(false); clearInterval(timerRef.current); };

    const generateKnapsack = () => {
        stopPlaying();
        const W = capacity;
        const wt = weights.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        const val = values.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        const n = Math.min(wt.length, val.length);
        const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
        const generated = [];

        generated.push({ dp: dp.map(r => [...r]), activeCell: null, msg: 'DP table initialized with 0s.' });

        for (let i = 1; i <= n; i++) {
            for (let w = 0; w <= W; w++) {
                if (wt[i - 1] <= w) {
                    const include = val[i - 1] + dp[i - 1][w - wt[i - 1]];
                    const exclude = dp[i - 1][w];
                    dp[i][w] = Math.max(include, exclude);
                    generated.push({
                        dp: dp.map(r => [...r]),
                        activeCell: [i, w],
                        highlightCells: [[i - 1, w], [i - 1, w - wt[i - 1]]],
                        msg: `Item ${i} (wt=${wt[i - 1]}, val=${val[i - 1]}), capacity=${w}: include=${include}, exclude=${exclude} → dp[${i}][${w}]=${dp[i][w]}`,
                    });
                } else {
                    dp[i][w] = dp[i - 1][w];
                    generated.push({
                        dp: dp.map(r => [...r]),
                        activeCell: [i, w],
                        highlightCells: [[i - 1, w]],
                        msg: `Item ${i} too heavy (wt=${wt[i - 1]} > cap=${w}) → dp[${i}][${w}]=${dp[i][w]}`,
                    });
                }
            }
        }
        generated.push({ dp: dp.map(r => [...r]), activeCell: null, msg: `Max value = ${dp[n][W]}` });
        setSteps(generated); setStepIdx(0);
        setMsg('Ready. Press Play or Step.');
    };

    const generateLCS = () => {
        stopPlaying();
        const s1 = str1.trim();
        const s2 = str2.trim();
        const m = s1.length, n = s2.length;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
        const generated = [];

        generated.push({ dp: dp.map(r => [...r]), activeCell: null, s1, s2, msg: 'LCS table initialized.' });

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s1[i - 1] === s2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                    generated.push({
                        dp: dp.map(r => [...r]), activeCell: [i, j],
                        highlightCells: [[i - 1, j - 1]], s1, s2,
                        msg: `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}]+1 = ${dp[i][j]}`,
                    });
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                    generated.push({
                        dp: dp.map(r => [...r]), activeCell: [i, j],
                        highlightCells: [[i - 1, j], [i, j - 1]], s1, s2,
                        msg: `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}' → dp[${i}][${j}] = max(${dp[i - 1][j]},${dp[i][j - 1]}) = ${dp[i][j]}`,
                    });
                }
            }
        }
        generated.push({ dp: dp.map(r => [...r]), activeCell: null, s1, s2, msg: `LCS length = ${dp[m][n]}` });
        setSteps(generated); setStepIdx(0);
        setMsg('Ready. Press Play or Step.');
    };

    const onGenerate = () => {
        if (mode === 'knapsack') generateKnapsack();
        else generateLCS();
    };

    const onStep = () => {
        if (!steps.length) return;
        if (stepIdx >= steps.length) { setMsg('Done! Press Reset.'); return; }
        setMsg(steps[stepIdx]?.msg || '');
        setStepIdx(p => p + 1);
    };

    const onPlayPause = () => {
        if (playing) { stopPlaying(); return; }
        if (!steps.length) return;
        setPlaying(true);
        const delay = Math.round(1200 / speed);
        timerRef.current = setInterval(() => {
            setStepIdx(prev => {
                if (prev >= steps.length) { stopPlaying(); return prev; }
                setMsg(steps[prev]?.msg || '');
                return prev + 1;
            });
        }, delay);
    };

    const onReset = () => { stopPlaying(); setSteps([]); setStepIdx(0); setMsg('Press Generate then Play.'); };

    const currentStep = steps[stepIdx - 1];

    const renderKnapsackTable = (step) => {
        if (!step?.dp) return null;
        const dp = step.dp;
        const wt = weights.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
        const val = values.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));

        return (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: '12px', minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '6px 10px', color: '#9ca3af', textAlign: 'center' }}>Item\Cap</th>
                            {Array.from({ length: capacity + 1 }, (_, w) => (
                                <th key={w} style={{ padding: '6px 8px', color: '#9ca3af', textAlign: 'center' }}>{w}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dp.map((row, i) => (
                            <tr key={i}>
                                <td style={{ padding: '6px 10px', color: '#6b7280', textAlign: 'center', fontSize: '11px' }}>
                                    {i === 0 ? '—' : `#${i}(w=${wt[i - 1]},v=${val[i - 1]})`}
                                </td>
                                {row.map((cell, j) => {
                                    const isActive = step.activeCell?.[0] === i && step.activeCell?.[1] === j;
                                    const isHighlight = step.highlightCells?.some(([r, c]) => r === i && c === j);
                                    return (
                                        <td key={j} style={{
                                            padding: '6px 8px', textAlign: 'center', fontWeight: isActive ? '700' : '400',
                                            backgroundColor: isActive ? '#eab308' : isHighlight ? '#1d4ed8' : i % 2 === 0 ? '#1f2937' : '#111827',
                                            color: isActive ? '#111827' : isHighlight ? 'white' : '#d1d5db',
                                            border: '1px solid #374151', borderRadius: '2px', transition: 'background-color 0.2s',
                                        }}>{cell}</td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderLCSTable = (step) => {
        if (!step?.dp) return null;
        const dp = step.dp;
        const s1 = step.s1 || '';
        const s2 = step.s2 || '';

        return (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '6px 10px', color: '#9ca3af' }}></th>
                            <th style={{ padding: '6px 10px', color: '#9ca3af' }}>—</th>
                            {s2.split('').map((c, j) => (
                                <th key={j} style={{ padding: '6px 10px', color: '#60a5fa', textAlign: 'center' }}>{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dp.map((row, i) => (
                            <tr key={i}>
                                <td style={{ padding: '6px 10px', color: '#f87171', fontWeight: '600' }}>
                                    {i === 0 ? '—' : s1[i - 1]}
                                </td>
                                {row.map((cell, j) => {
                                    const isActive = step.activeCell?.[0] === i && step.activeCell?.[1] === j;
                                    const isHighlight = step.highlightCells?.some(([r, c]) => r === i && c === j);
                                    return (
                                        <td key={j} style={{
                                            padding: '6px 10px', textAlign: 'center', fontWeight: isActive ? '700' : '400',
                                            backgroundColor: isActive ? '#eab308' : isHighlight ? '#1d4ed8' : i % 2 === 0 ? '#1f2937' : '#111827',
                                            color: isActive ? '#111827' : isHighlight ? 'white' : '#d1d5db',
                                            border: '1px solid #374151', transition: 'background-color 0.2s', minWidth: '36px',
                                        }}>{cell}</td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-yellow-400 mb-2">Dynamic Programming</h1>
                <p className="text-gray-400 text-sm mb-6">Watch the DP table fill up step by step.</p>

                {/* Mode Toggle */}
                <div className="flex gap-3 mb-6">
                    <button onClick={() => { setMode('knapsack'); onReset(); }} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'knapsack' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>🎒 Knapsack</button>
                    <button onClick={() => { setMode('lcs'); onReset(); }} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'lcs' ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>🔤 LCS</button>
                </div>

                {/* Inputs */}
                {mode === 'knapsack' ? (
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Capacity</span>
                            <input type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-20" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Weights</span>
                            <input type="text" value={weights} onChange={(e) => setWeights(e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-36" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Values</span>
                            <input type="text" value={values} onChange={(e) => setValues(e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-36" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>String 1</span>
                            <input type="text" value={str1} onChange={(e) => setStr1(e.target.value.toUpperCase())} className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-36" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>String 2</span>
                            <input type="text" value={str2} onChange={(e) => setStr2(e.target.value.toUpperCase())} className="bg-gray-800 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm w-36" />
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex flex-wrap gap-3 mb-4">
                    <button onClick={onGenerate} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">🔄 Generate</button>
                    <button onClick={onPlayPause} className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-lg px-4 py-2 text-sm font-semibold transition">{playing ? '⏸ Pause' : '▶ Play'}</button>
                    <button onClick={onStep} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">→ Step</button>
                    <button onClick={onReset} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 text-sm transition">✕ Reset</button>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>Speed</span>
                        <input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(parseInt(e.target.value))} className="w-24" />
                        <span className="text-white">{speed}</span>
                    </div>
                    <span className="text-xs text-gray-500 self-center">Step {stepIdx}/{steps.length}</span>
                </div>

                {/* Message */}
                <div className="bg-gray-800 rounded-lg px-4 py-2 text-sm text-yellow-300 mb-4 min-h-9">{msg}</div>

                {/* Legend */}
                <div className="flex gap-4 mb-4 text-xs text-gray-400">
                    <div className="flex items-center gap-2"><div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#eab308' }} /> Current cell</div>
                    <div className="flex items-center gap-2"><div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: '#1d4ed8' }} /> Referenced cells</div>
                </div>

                {/* DP Table */}
                <div className="bg-gray-900 rounded-xl p-4">
                    {mode === 'knapsack' ? renderKnapsackTable(currentStep) : renderLCSTable(currentStep)}
                    {!currentStep && (
                        <div className="text-gray-500 text-sm text-center py-8">Press Generate to build the DP table</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DPVisualizer;