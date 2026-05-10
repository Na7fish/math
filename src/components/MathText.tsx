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
          // Check if it's a simple math string or mixed content
          const isMixed = /[\u0980-\u09FF]/.test(math) || math.includes(' ');
          
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
