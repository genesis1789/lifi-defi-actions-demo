import { track } from '../lib/telemetry';

interface CodeBlockProps {
  code: string;
  showCopy?: boolean;
  snippetName?: string;
}

export function CodeBlock({ code, showCopy = false, snippetName }: CodeBlockProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    if (snippetName) {
      track('copy_snippet_clicked', { snippet: snippetName });
    }
  };

  return (
    <div style={{
      position: 'relative',
      backgroundColor: '#1f2937',
      borderRadius: '6px',
      overflow: 'hidden',
    }}>
      {showCopy && (
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#374151',
            color: '#d1d5db',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Copy
        </button>
      )}
      <pre style={{
        margin: 0,
        padding: '14px',
        overflowX: 'auto',
        fontSize: '12px',
        lineHeight: 1.5,
        color: '#e5e7eb',
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
