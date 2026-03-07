import React from 'react';
import { Source } from '../types';
import { ExternalLink, Globe } from 'lucide-react';

interface FormattedMessageProps {
  text: string;
  sources?: Source[];
  role: 'user' | 'model';
}

const FormattedMessage: React.FC<FormattedMessageProps> = ({ text, sources, role }) => {
  // Basic Markdown Parser
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: React.ReactNode[] = [];

    const flushList = (keyPrefix: string) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`${keyPrefix}-list`} className="list-disc ml-4 mb-3 space-y-1">
            {listBuffer}
          </ul>
        );
        listBuffer = [];
      }
    };

    const processInline = (line: string) => {
        // Handle bold **text**
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-indigo-200">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('### ')) {
        flushList(`header-${index}`);
        elements.push(<h3 key={index} className="text-lg font-bold mt-4 mb-2 text-indigo-300">{processInline(trimmed.slice(4))}</h3>);
      } else if (trimmed.startsWith('## ')) {
        flushList(`header-${index}`);
        elements.push(<h2 key={index} className="text-xl font-bold mt-5 mb-3 text-white">{processInline(trimmed.slice(3))}</h2>);
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listBuffer.push(<li key={`li-${index}`} className="pl-1">{processInline(trimmed.slice(2))}</li>);
      } else {
        flushList(`p-${index}`);
        if (trimmed.length > 0) {
          elements.push(<p key={index} className="mb-3 leading-relaxed">{processInline(trimmed)}</p>);
        }
      }
    });

    flushList('end');
    return elements;
  };

  return (
    <div className={`max-w-[85%] rounded-2xl p-5 shadow-lg ${
      role === 'user' 
        ? 'bg-indigo-600 text-white rounded-br-none' 
        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
    }`}>
      <div className="text-sm md:text-base">
        {renderContent(text)}
      </div>

      {/* Structured Grounding Sources */}
      {role === 'model' && sources && sources.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-700/60">
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-slate-700/50 p-1 rounded">
                <Globe size={12} className="text-indigo-400" />
             </div>
             <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
               Sources
             </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {sources.map((source, i) => {
                let domain = '';
                try {
                    domain = new URL(source.uri).hostname.replace('www.', '');
                } catch (e) {
                    domain = 'web';
                }

                return (
                    <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex flex-col justify-between w-[160px] h-[70px] bg-slate-900 border border-slate-700 rounded-lg p-3 hover:border-indigo-500/50 hover:bg-slate-800 transition-all text-left"
                    >
                        <span className="text-xs text-slate-200 font-medium line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                            {source.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                             <img 
                                src={`https://www.google.com/s2/favicons?domain=${domain}`} 
                                alt="" 
                                className="w-3 h-3 opacity-70"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                             />
                            <span className="text-[10px] text-slate-500 truncate">{domain}</span>
                            <ExternalLink size={8} className="text-slate-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </a>
                );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormattedMessage;