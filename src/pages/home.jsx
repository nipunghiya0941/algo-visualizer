import React from 'react';

const categories = [
  { title: 'Sorting Algorithms', desc: 'Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix — step by step.', page: 'sorting', color: '#22c55e', icon: '📊' },
  { title: 'Searching Algorithms', desc: 'Linear Search and Binary Search with live highlights.', page: 'searching', color: '#38bdf8', icon: '🔍' },
  { title: 'Graph Algorithms', desc: 'BFS, DFS, and Dijkstra on interactive node-edge graphs.', page: 'graph', color: '#a78bfa', icon: '🕸️' },
  { title: 'Tree Traversals', desc: 'Inorder, Preorder, Postorder on a live BST.', page: 'tree', color: '#fb923c', icon: '🌳' },
  { title: 'Data Structures', desc: 'Stack, Queue, Linked List, Array — watch every operation live.', page: 'ds', color: '#f87171', icon: '🗂️' },
  { title: 'Algorithm Race', desc: 'Same array, multiple algorithms — who finishes first?', page: 'race', color: '#c084fc', icon: '🏁' },
  { title: 'Dynamic Programming', desc: '0/1 Knapsack and LCS — watch the DP table fill step by step.', page: 'dp', color: '#facc15', icon: '📐' },
];

const Home = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-green-400">Algorithm Visualizer</h1>
        <p className="text-gray-400 text-lg">Learn DSA visually — step by step, with code highlights and explanations.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories.map((cat) => (
          <div
            key={cat.page}
            onClick={() => setCurrentPage(cat.page)}
            className="cursor-pointer bg-gray-900 border border-gray-700 rounded-xl p-6 hover:scale-105 transition-all duration-200"
            style={{ borderTop: `3px solid ${cat.color}` }}
          >
            <div className="text-4xl mb-3">{cat.icon}</div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: cat.color }}>{cat.title}</h2>
            <p className="text-gray-400 text-sm">{cat.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12">
        {[
          { val: '13+', label: 'Algorithms' },
          { val: '7', label: 'Categories' },
          { val: 'Live', label: 'Code Highlight' },
          { val: '🔊', label: 'Sound Effects' },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <div className="text-3xl font-bold text-green-400">{s.val}</div>
            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default Home;