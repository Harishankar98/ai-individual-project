import React from 'react';

interface ScoreCardProps {
    title: string;
    score: number;
    icon: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, icon }) => {
    const getColorClass = (value: number) => {
        if (value >= 70) return 'from-green-500 to-emerald-500';
        if (value >= 40) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-rose-500';
    };

    const getProgressColor = (value: number) => {
        if (value >= 70) return 'bg-green-500';
        if (value >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const colorClass = getColorClass(score);
    const progressColor = getProgressColor(score);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg`}>
                        <i className={`fa-solid ${icon} text-white text-xl`}></i>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400">{title}</h3>
                        <p className={`text-2xl font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}>
                            {score}%
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`absolute top-0 left-0 h-full ${progressColor} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{ width: `${score}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
            </div>

            {/* Score Range Label */}
            <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>0</span>
                <span className="font-medium">
                    {score >= 70 ? 'Excellent' : score >= 40 ? 'Good' : 'Needs Work'}
                </span>
                <span>100</span>
            </div>
        </div>
    );
};

export default ScoreCard;
