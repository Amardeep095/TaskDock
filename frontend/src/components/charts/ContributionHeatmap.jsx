import React from 'react';
import { motion } from 'framer-motion';

const ContributionHeatmap = () => {
    // Generate mock data for 52 weeks
    const weeks = 52;
    const daysPerWeek = 7;

    // Create a random activity map
    const generateActivity = () => {
        const data = [];
        for (let i = 0; i < weeks * daysPerWeek; i++) {
            // Random activity level 0-4
            const level = Math.floor(Math.random() * 5);
            // Bias towards 0 for a more realistic look
            data.push(Math.random() > 0.7 ? level : 0);
        }
        return data;
    };

    const activityData = generateActivity();

    const getColor = (level) => {
        switch (level) {
            case 0: return 'bg-slate-100';
            case 1: return 'bg-emerald-200';
            case 2: return 'bg-emerald-400';
            case 3: return 'bg-emerald-600';
            case 4: return 'bg-emerald-800';
            default: return 'bg-slate-100';
        }
    };

    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Activity Consistency</h3>
                    <p className="text-sm text-slate-500">Track your project contributions over time</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span>Less</span>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(l => (
                            <div key={l} className={`w-3 h-3 rounded-sm ${getColor(l)}`} />
                        ))}
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-2 custom-scrollbar">
                <div className="min-w-[800px]">
                    {/* Month Labels */}
                    <div className="flex mb-2 ml-8">
                        {months.map((m, i) => (
                            <div key={i} className="flex-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {m}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {/* Day Labels */}
                        <div className="flex flex-col gap-1 text-[10px] font-bold text-slate-400 uppercase pt-1">
                            <div className="h-3 flex items-center">Mon</div>
                            <div className="h-3"></div>
                            <div className="h-3 flex items-center">Wed</div>
                            <div className="h-3"></div>
                            <div className="h-3 flex items-center">Fri</div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 flex gap-1">
                            {Array.from({ length: weeks }).map((_, wIdx) => (
                                <div key={wIdx} className="flex flex-col gap-1">
                                    {Array.from({ length: daysPerWeek }).map((_, dIdx) => {
                                        const level = activityData[wIdx * daysPerWeek + dIdx];
                                        return (
                                            <motion.div
                                                key={dIdx}
                                                whileHover={{ scale: 1.3, zIndex: 10 }}
                                                className={`w-3 h-3 rounded-sm ${getColor(level)} cursor-pointer transition-colors hover:ring-2 hover:ring-primary-500 hover:ring-offset-1`}
                                                title={`${level} contributions on this day`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <button className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">
                    Learn how we count contributions
                </button>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Last 12 Months
                </p>
            </div>
        </div>
    );
};

export default ContributionHeatmap;
