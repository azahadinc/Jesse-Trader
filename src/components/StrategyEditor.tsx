import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StrategyEditorProps {
  code: string;
  onChange?: (code: string) => void;
}

export const StrategyEditor: React.FC<StrategyEditorProps> = ({ code, onChange }) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-bottom border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="text-xs font-mono text-zinc-500 ml-2">strategy.py</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Python 3.9</span>
      </div>
      <ScrollArea className="flex-1 p-4">
        <pre className="font-mono text-sm text-zinc-300 leading-relaxed">
          {code.split('\n').map((line, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-zinc-700 text-right w-6 select-none">{i + 1}</span>
              <span>{line}</span>
            </div>
          ))}
        </pre>
      </ScrollArea>
    </div>
  );
};
