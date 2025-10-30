import React, { useState } from 'react';
import { Card } from '../components/Card';
import { performCryptoOperation } from '../services/geminiService';
import { CryptoOperation } from '../types';
import { useNotifications } from '../hooks/useNotifications';

const CryptoTool: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card className="flex-1 min-w-[300px]">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center tracking-wider">{title}</h2>
        {children}
    </Card>
);

const ResultDisplay: React.FC<{ result: string | null; error: string | null }> = ({ result, error }) => {
    if (!result && !error) return null;

    return (
        <div className="mt-4">
            <label className="block text-cyan-300 mb-2 text-sm">Result</label>
            <div className={`w-full p-3 bg-gray-900/70 border ${error ? 'border-red-500/50 text-red-300' : 'border-cyan-500/50 text-cyan-200'} rounded-md font-mono break-words`}>
                {error || result}
            </div>
        </div>
    );
};


const CryptoLab: React.FC = () => {
    const { addNotification } = useNotifications();

    // Hashing state
    const [hashInput, setHashInput] = useState('');
    const [hashAlgo, setHashAlgo] = useState('SHA-256');
    const [hashResult, setHashResult] = useState<string | null>(null);
    const [hashError, setHashError] = useState<string | null>(null);
    const [isHashing, setIsHashing] = useState(false);

    // Encryption/Decryption state
    const [cipherInput, setCipherInput] = useState('');
    const [cipherKey, setCipherKey] = useState('');
    const [cipherResult, setCipherResult] = useState<string | null>(null);
    const [cipherError, setCipherError] = useState<string | null>(null);
    const [isCiphering, setIsCiphering] = useState(false);

    const handleHash = async () => {
        if (!hashInput.trim()) return;
        setIsHashing(true);
        setHashResult(null);
        setHashError(null);
        try {
            const result = await performCryptoOperation(CryptoOperation.HASH, hashInput, hashAlgo);
            setHashResult(result);
            addNotification(`Hashing successful.`, 'success');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setHashError(msg);
            addNotification(`Hashing failed: ${msg}`, 'error');
        } finally {
            setIsHashing(false);
        }
    };
    
    const handleCipher = async (operation: CryptoOperation.ENCRYPT | CryptoOperation.DECRYPT) => {
        if (!cipherInput.trim() || !cipherKey.trim()) return;
        setIsCiphering(true);
        setCipherResult(null);
        setCipherError(null);
        try {
            const result = await performCryptoOperation(operation, cipherInput, 'AES', cipherKey);
            if (result === 'DECRYPTION_FAILED') {
                throw new Error('Decryption failed. Check key or input text.');
            }
            setCipherResult(result);
            addNotification(`${operation === CryptoOperation.ENCRYPT ? 'Encryption' : 'Decryption'} successful.`, 'success');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setCipherError(msg);
            addNotification(`${operation === CryptoOperation.ENCRYPT ? 'Encryption' : 'Decryption'} failed: ${msg}`, 'error');
        } finally {
            setIsCiphering(false);
        }
    }


    return (
        <>
            <header className="text-left mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
                    Crypto Lab
                </h1>
                <p className="text-gray-400 mt-2">Perform cryptographic operations via LUX protocol.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                <CryptoTool title="Hashing Utility">
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="hashInput" className="block text-cyan-300 mb-2">Input Data</label>
                            <textarea
                                id="hashInput"
                                value={hashInput}
                                onChange={(e) => setHashInput(e.target.value)}
                                placeholder="Enter text to hash..."
                                className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-mono"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label htmlFor="hashAlgo" className="block text-cyan-300 mb-2">Algorithm</label>
                            <select
                                id="hashAlgo"
                                value={hashAlgo}
                                onChange={(e) => setHashAlgo(e.target.value)}
                                className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                            >
                                <option>SHA-256</option>
                                <option>SHA-1</option>
                                <option>MD5</option>
                            </select>
                        </div>
                        <button
                            onClick={handleHash}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white py-2.5 rounded-md font-bold transition-colors shadow-lg shadow-cyan-600/30"
                            disabled={isHashing || !hashInput.trim()}
                        >
                            {isHashing ? 'GENERATING...' : 'GENERATE HASH'}
                        </button>
                        <ResultDisplay result={hashResult} error={hashError} />
                    </div>
                </CryptoTool>

                <CryptoTool title="Symmetric Cipher (AES)">
                     <div className="space-y-4">
                         <div>
                            <label htmlFor="cipherInput" className="block text-cyan-300 mb-2">Input Data</label>
                            <textarea
                                id="cipherInput"
                                value={cipherInput}
                                onChange={(e) => setCipherInput(e.target.value)}
                                placeholder="Enter text to encrypt/decrypt..."
                                className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-mono"
                                rows={4}
                            />
                        </div>
                        <div>
                            <label htmlFor="cipherKey" className="block text-cyan-300 mb-2">Secret Key</label>
                            <input
                                id="cipherKey"
                                type="password"
                                value={cipherKey}
                                onChange={(e) => setCipherKey(e.target.value)}
                                placeholder="Enter secret key..."
                                className="w-full p-2.5 bg-gray-900/50 border border-cyan-500/50 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all font-mono"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleCipher(CryptoOperation.ENCRYPT)}
                                className="w-1/2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white py-2.5 rounded-md font-bold transition-colors shadow-lg shadow-green-600/30"
                                disabled={isCiphering || !cipherInput.trim() || !cipherKey.trim()}
                            >
                                {isCiphering ? '...' : 'ENCRYPT'}
                            </button>
                             <button
                                onClick={() => handleCipher(CryptoOperation.DECRYPT)}
                                className="w-1/2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 text-white py-2.5 rounded-md font-bold transition-colors shadow-lg shadow-yellow-600/30"
                                disabled={isCiphering || !cipherInput.trim() || !cipherKey.trim()}
                            >
                               {isCiphering ? '...' : 'DECRYPT'}
                            </button>
                        </div>
                        <ResultDisplay result={cipherResult} error={cipherError} />
                    </div>
                </CryptoTool>
            </div>
        </>
    );
};

export default CryptoLab;
