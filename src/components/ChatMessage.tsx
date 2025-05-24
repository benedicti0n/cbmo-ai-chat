import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // 👈 You can pick other themes from highlight.js too
import { useThemeStore } from '@/stores/useThemeStore';

type Message = {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
};

interface ChatMessageProps {
    message: Message;
}

const ChatMessage = React.memo(({ message }: ChatMessageProps) => {
    const { theme } = useThemeStore();

    return (
        <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[60%] md:max-w-[80%] rounded-2xl p-2 ${message.isUser
                    ? `${theme === 'light'
                        ? 'bg-[#6A4DFC]/30 backdrop-blur-sm rounded-br-none text-[#3F29C7] border-[1px] border-[#6A4DFC]'
                        : 'bg-[#6A4DFC]/[30%] backdrop-blur-sm rounded-br-none text-white border-[1px] border-[#6A4DFC]'}`
                    : `${theme === 'light'
                        ? 'bg-white text-[#3F29C7] border-[1px] border-white/20'
                        : 'bg-white/10 text-[#3F29C7] border-[1px] border-white/20'} text-foreground rounded-bl-none`
                    }`}
            >
                <style jsx>{`
                    .custom-markdown {
                        color: ${theme === 'light' ? '#000' : '#fff'} !important;
                    }
                    .custom-markdown div, 
                    .custom-markdown span, 
                    .custom-markdown li, 
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
                `}</style>
                <div className="prose prose-sm dark:prose-invert max-w-none custom-markdown">
                    <ReactMarkdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            pre: ({ node, ...props }) => (
                                <pre {...props} />
                            ),
                            code: ({ node, inline, className, children, ...props }) => {
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
        prevProps.message.content === nextProps.message.content &&
        prevProps.message.timestamp.getTime() === nextProps.message.timestamp.getTime()
    );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;