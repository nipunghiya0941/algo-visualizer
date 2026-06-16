import React, { useState } from 'react';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { label: 'Home', page: 'home' },
        { label: 'Sorting', page: 'sorting' },
        { label: 'Searching', page: 'searching' },
        { label: 'Graph', page: 'graph' },
        { label: 'Trees', page: 'tree' },
        { label: 'Data Structures', page: 'ds' },
        { label: '🏁 Race', page: 'race' },
        { label: '📊 DP', page: 'dp' },
    ];

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg">
            <div className="flex items-center justify-between">
                <div
                    className="text-xl font-bold cursor-pointer text-green-400"
                    onClick={() => setCurrentPage('home')}
                >
                    AlgoVisualizer
                </div>

                {/* Desktop */}
                <div className="hidden md:flex gap-5 text-sm">
                    {links.map((l) => (
                        <button
                            key={l.page}
                            onClick={() => setCurrentPage(l.page)}
                            className={`hover:text-green-400 transition ${currentPage === l.page ? 'text-green-400 font-semibold' : 'text-gray-300'
                                }`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-gray-300 hover:text-white text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-3 flex flex-col gap-3 text-sm border-t border-gray-700 pt-3">
                    {links.map((l) => (
                        <button
                            key={l.page}
                            onClick={() => { setCurrentPage(l.page); setMenuOpen(false); }}
                            className={`text-left hover:text-green-400 transition ${currentPage === l.page ? 'text-green-400 font-semibold' : 'text-gray-300'
                                }`}
                        >
                            {l.label}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;