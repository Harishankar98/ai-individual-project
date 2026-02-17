import React from 'react';

interface VerdictBadgeProps {
    verdict: string;
    score: number;
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, score }) => {
    const getVerdictStyles = () => {
        if (score >= 70) {
            return {
                bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
                icon: 'fa-circle-check',
                text: 'text-white'
            };
        } else if (score >= 40) {
            return {
                bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
                icon: 'fa-circle-exclamation',
                text: 'text-white'
            };
        } else {
            return {
                bg: 'bg-gradient-to-r from-red-500 to-rose-500',
                icon: 'fa-circle-xmark',
                text: 'text-white'
            };
        }
    };

    const styles = getVerdictStyles();

    return (
        <div className={`${styles.bg} ${styles.text} px-8 py-4 rounded-2xl shadow-2xl inline-flex items-center space-x-3 transform hover:scale-105 transition-all duration-300`}>
            <i className={`fa-solid ${styles.icon} text-2xl`}></i>
            <div>
                <p className="text-sm font-medium opacity-90">Final Verdict</p>
                <p className="text-xl font-bold">{verdict}</p>
            </div>
        </div>
    );
};

export default VerdictBadge;
