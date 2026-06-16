import React from 'react';

const CodePanel = ({ code, highlightLines }) => {
    return (
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <div className="text-gray-400 text-xs mb-3 uppercase tracking-wider">Code</div>
            {code.map((line, i) => (
                <div
                    key={i}
                    className={`px-3 py-1 rounded transition-all duration-200 whitespace-pre ${highlightLines && highlightLines.includes(i)
                            ? 'bg-yellow-500 text-gray-900 font-semibold'
                            : 'text-gray-300'
                        }`}
                >
                    <span className="text-gray-500 mr-4 select-none">{i + 1}</span>
                    {line}
                </div>
            ))}
        </div>
    );
};

export default CodePanel;