import React, { useState, useEffect } from 'react';

interface MathTextProps {
  math: string;
  block?: boolean;
  className?: string;
}

declare global {
  interface Window {
    katex: any;
  }
}

const MathText: React.FC<MathTextProps> = ({ math, block = false, className = "" }) => {
  const [html, setHtml] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const tryRender = () => {
      if (window.katex) {
        try {
          // If the string contains $, we split and render parts
          if (math.includes('$')) {
            const parts = math.split(/(\$.*?\$)/g);
            const renderedParts = parts.map(part => {
              if (part.startsWith('$') && part.endsWith('$')) {
                const formula = part.slice(1, -1);
                return window.katex.renderToString(formula, {
                  throwOnError: false,
                  displayMode: block,
                  trust: true
                });
              }
              return part;
            });
            if (mounted) {
              setHtml(renderedParts.join(''));
              setIsLoaded(true);
            }
            return;
          }

          // Check if it actually contains LaTeX-like patterns without $
          const hasLatex = /[\\^_{}]/.test(math);
          
          if (!hasLatex) {
            if (mounted) {
              setHtml(math);
              setIsLoaded(true);
            }
            return;
          }

          const rendered = window.katex.renderToString(math, {
            throwOnError: false,
            displayMode: block,
            trust: true,
            strict: false
          });
          
          if (mounted) {
            setHtml(rendered);
            setIsLoaded(true);
          }
        } catch (err) {
          if (mounted) {
            setHtml(math);
            setIsLoaded(true);
          }
        }
      }
    };

    if (window.katex) {
      tryRender();
    } else {
      const check = setInterval(() => {
        if (window.katex) {
          tryRender();
          clearInterval(check);
        }
      }, 50);
      return () => clearInterval(check);
    }
    return () => { mounted = false; };
  }, [math, block]);

  return (
    <span 
      className={className} 
      dangerouslySetInnerHTML={{ __html: isLoaded ? html : math }} 
    />
  );
};

export default MathText;
