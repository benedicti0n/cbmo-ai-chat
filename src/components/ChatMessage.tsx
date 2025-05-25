import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // 👈 You can pick other themes from highlight.js too
import { useThemeStore } from '@/stores/useThemeStore';
import { Copy, Check } from 'lucide-react';
import { Button } from './ui/button';

type Message = {
    id: string;
    content: string;
    role: 'user' | 'ai';
    timestamp: Date;
};

interface ChatMessageProps {
    message: Message;
}

const ChatMessage = React.memo(({ message }: ChatMessageProps) => {
    const { theme } = useThemeStore();
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [copiedMessage, setCopiedMessage] = useState(false);

    const copyToClipboard = async (text: string, type: 'code' | 'message') => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'code') {
                console.log('text', text, type);
                setCopiedCode(text);
                setTimeout(() => setCopiedCode(null), 2000);
            } else {
                console.log('text', text, type);
                setCopiedMessage(true);
                setTimeout(() => setCopiedMessage(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[80%] md:max-w-[80%] rounded-2xl p-2 relative group ${message.role === 'user'
                    ? `${theme === 'light'
                        ? 'bg-[#6A4DFC]/30 backdrop-blur-sm rounded-br-none text-[#3F29C7] border-[1px] border-[#6A4DFC]'
                        : 'bg-[#6A4DFC]/[30%] backdrop-blur-sm rounded-br-none text-white border-[1px] border-[#6A4DFC]'}`
                    : `${theme === 'light'
                        ? 'bg-white text-[#3F29C7] border-[1px] border-white/20'
                        : 'bg-white/10 text-[#3F29C7] border-[1px] border-white/20'} text-foreground rounded-bl-none`
                    }`}
            >
                {/* Message Copy Button */}
                <Button
                    variant="ghost"
                    onClick={() => copyToClipboard(message.content, 'message')}
                    className={`
                        absolute -bottom-8 transition-all duration-200 rounded-md
                        ${copiedMessage && `bg-emerald-500/50 hover:bg-emerald-500/50 border-[1px] border-emerald-500 hover:ring-0 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                        ${message.role === 'user' ? 'right-0' : 'left-0'}
                        `}
                    title="Copy message"
                    style={{ height: '12px', width: '12px', padding: '12px' }}
                >
                    {copiedMessage ? (
                        <Check style={{ height: '12px', width: '12px' }} />
                    ) : (
                        <Copy style={{ height: '12px', width: '12px' }} />
                    )}
                </Button>

                <style jsx>{`
                    .custom-markdown {
                        color: ${theme === 'light' ? '#000' : '#fff'} !important;
                    }
                    .custom-markdown div, 
                    .custom-markdown span, 
                    .custom-markdown li,
                    .custom-markdown ::marker,
                    .custom-markdown h1, 
                    .custom-markdown h2, 
                    .custom-markdown h3, 
                    .custom-markdown h4, 
                    .custom-markdown h5, 
                    .custom-markdown h6,
                    .custom-markdown strong {
                        color: ${theme === 'light' ? '#000' : '#fff'} !important;
                        font-weight: 800 !important;
                    }
                    .custom-markdown code {
                        background-color: rgba(106, 77, 252, 0.3);
                        color: ${theme === 'light' ? '#000' : '#fff'} !important;
                        padding: 0.2em 0.4em !important;
                        border-radius: 4px !important;
                        font-size: 0.7rem !important;
                        font-family: monospace !important;
                    }
                    .code-block-container {
                        position: relative;
                        margin: 0 !important;
                    }
                    .custom-markdown pre {
                        background-color: #1e1e1e !important;
                        margin: 0 !important;
                        padding: 1rem !important;
                        border-radius: 0.75rem !important;
                        overflow: hidden !important;
                        scrollbar-color: transparent !important;
                        scrollbar-width: none !important;
                    }
                    .custom-markdown pre code {
                        background-color: transparent !important;
                        color: #fff !important;
                        padding: 0 !important;
                        scrollbar-color: transparent !important;
                        scrollbar-width: none !important;
                    }
                    .copy-button {
                        position: absolute;
                        top: 0.5rem;
                        right: 0.5rem;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 0.375rem;
                        padding: 0.375rem;
                        color: #fff;
                        cursor: pointer;
                        opacity: 0;
                        transition: all 0.2s ease;
                        backdrop-filter: blur(4px);
                    }
                    .copy-button.copied {
                        background: #22c55e;
                        border-color: #22c55e;
                    }
                    .copy-button:not(.copied) {
                        background: rgba(255, 255, 255, 0.1);
                    }
                    .code-block-container:hover .copy-button {
                        opacity: 1;
                    }
                    .copy-button:not(.copied):hover {
                        background: rgba(255, 255, 255, 0.2);
                    }
                `}</style>

                <div className="prose prose-sm dark:prose-invert max-w-none custom-markdown">
                    <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            pre: ({ node, children, ...props }) => {
                                // Function to extract text from React node
                                const extractText = (node: React.ReactNode): string => {
                                    if (typeof node === 'string') {
                                        return node;
                                    }
                                    if (Array.isArray(node)) {
                                        return node.map(extractText).join('');
                                    }
                                    if (React.isValidElement(node)) {
                                        // If it's a code element, get its children
                                        if (node.type === 'code') {
                                            return extractText(node.props.children);
                                        }
                                        // For other elements, recursively process children
                                        return extractText(node.props.children);
                                    }
                                    return '';
                                };

                                // Extract and clean the code text
                                const codeText = extractText(children).trim();

                                return (
                                    <div className="code-block-container relative group">
                                        <Button
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyToClipboard(codeText, 'code');
                                            }}
                                            className={`
                                                absolute top-2 right-2 transition-all duration-200 rounded-md z-20
                                                ${copiedCode === codeText
                                                    ? 'bg-emerald-500/50 hover:bg-emerald-500/50 border-[1px] border-emerald-500 hover:ring-0 text-white'
                                                    : ''}
                                            `}
                                            title="Copy code"
                                            style={{ height: '12px', width: '12px', padding: '12px' }}
                                        >
                                            {copiedCode === codeText ? (
                                                <Check style={{ height: '12px', width: '12px' }} />
                                            ) : (
                                                <Copy style={{ height: '12px', width: '12px' }} />
                                            )}
                                        </Button>
                                        <pre {...props} className="relative">
                                            {children}
                                        </pre>
                                    </div>
                                );
                            },
                            code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
                                return <code className={className} {...props}>{children}</code>;
                            },
                            p: ({ node, ...props }) => (
                                <p {...props} />
                            ),
                            h1: ({ node, ...props }) => (
                                <h1 {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3 {...props} />
                            ),
                            h4: ({ node, ...props }) => (
                                <h4 {...props} />
                            ),
                            h5: ({ node, ...props }) => (
                                <h5 {...props} />
                            ),
                            h6: ({ node, ...props }) => (
                                <h6 {...props} />
                            ),
                            strong: ({ node, ...props }) => (
                                <strong {...props} />
                            ),
                            em: ({ node, ...props }) => (
                                <em {...props} />
                            ),
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
                <p className={`text-xs mt-1 text-right ${message.isUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                </p>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    return (
        prevProps?.message?.content === nextProps?.message?.content &&
        prevProps?.message?.timestamp?.getTime() === nextProps?.message?.timestamp?.getTime()
    );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;