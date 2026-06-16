import React from 'react';

const BarChart = ({ step }) => {
    if (!step || !step.arr) return null;

    const arr = step.arr;
    const maxVal = Math.max(...arr);

    return (
        <div className="flex items-end justify-center gap-1 h-48 bg-gray-800 rounded-lg p-4">
            {arr.map((val, i) => {
                const height = Math.round((val / maxVal) * 100);
                const isActive = step.active && step.active.includes(i);
                const isCompare = step.compare && step.compare.includes(i);
                const isSorted = step.sortedFrom !== undefined && i >= step.sortedFrom;
                const isPivot = step.pivot === i;
                const isFound = step.found === i;
                const isEliminated =
                    step.eliminated &&
                    i >= step.eliminated[0] &&
                    i <= step.eliminated[1];

                let barColor = 'bg-teal-400';
                if (isFound) barColor = 'bg-green-400';
                else if (isPivot) barColor = 'bg-purple-400';
                else if (isActive) barColor = 'bg-yellow-400';
                else if (isCompare) barColor = 'bg-red-400';
                else if (isEliminated) barColor = 'bg-gray-600';
                else if (isSorted && step.sortedFrom < arr.length) barColor = 'bg-green-500';

                return (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <span className="text-white text-xs font-medium">{val}</span>
                        <div
                            className={`w-8 rounded-t transition-all duration-300 ${barColor}`}
                            style={{ height: `${height}%` }}
                        />
                        <span className="text-gray-400 text-xs">{i}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default BarChart;