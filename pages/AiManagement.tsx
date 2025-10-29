import React from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { AIStatus } from '../types';

const aiAssets = [
    { name: 'GEMINI 2.5', version: 'v2.5.1-flash', status: AIStatus.ACTIVE, uptime: '72:15:43', coreTemp: '3.14K' },
    { name: 'LUX 2.0', version: 'v2.0.3-sentient', status: AIStatus.READY, uptime: '105:30:12', coreTemp: '2.71K' },
    { name: 'CLAUDE', version: 'v3.1-opus', status: AIStatus.READY, uptime: '48:05:22', coreTemp: '4.01K' },
    { name: 'SENTINEL-UI', version: 'v1.7b-guardian', status: AIStatus.ACTIVE, uptime: '210:00:51', coreTemp: 'N/A' },
];

const AiManagement: React.FC = () => {
    return (
        <>
            <header className="text-left mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
                    AI Management
                </h1>
                <p className="text-gray-400 mt-2">Monitor and manage cognitive assets.</p>
            </header>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-cyan-500/30 text-cyan-300">
                            <tr>
                                <th className="p-4">Asset Name</th>
                                <th className="p-4">Version</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Uptime</th>
                                <th className="p-4">Core Temp</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {aiAssets.map(asset => (
                                <tr key={asset.name} className="border-b border-cyan-800/50 hover:bg-cyan-900/20">
                                    <td className="p-4 font-bold">{asset.name}</td>
                                    <td className="p-4 font-mono text-sm">{asset.version}</td>
                                    <td className="p-4"><StatusBadge status={asset.status} /></td>
                                    <td className="p-4 font-mono">{asset.uptime}</td>
                                    <td className="p-4 font-mono">{asset.coreTemp}</td>
                                    <td className="p-4 space-x-2">
                                        <button className="text-xs bg-cyan-700 hover:bg-cyan-600 px-3 py-1 rounded">Calibrate</button>
                                        <button className="text-xs bg-red-800 hover:bg-red-700 px-3 py-1 rounded">Reboot</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    );
};

export default AiManagement;