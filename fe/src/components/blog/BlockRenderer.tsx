import React, { JSX } from 'react';
import { motion } from 'framer-motion';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';

interface BlockData {
  type: string;
  data: any;
}

interface BlockRendererProps {
  block: BlockData;
  index: number;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({ block, index }) => {
  const { type, data } = block;

  const blockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.1
      }
    }
  };

  const renderBlock = () => {
    switch (type) {
      case 'paragraph':
        return (
          <p
            className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6"
            dangerouslySetInnerHTML={{ __html: data.text }}
          />
        );

      case 'header':
        const HeaderTag = `h${data.level}` as keyof JSX.IntrinsicElements;
        const headerClasses = {
          1: 'text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 mt-12',
          2: 'text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-10',
          3: 'text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4 mt-8',
          4: 'text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 mt-6',
          5: 'text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-4',
          6: 'text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-4'
        };
        
        return (
          <HeaderTag className={headerClasses[data.level as keyof typeof headerClasses]}>
            {data.text}
          </HeaderTag>
        );

      case 'list':
        const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
        const listClasses = data.style === 'ordered' 
          ? 'list-decimal list-inside space-y-2 mb-6 pl-4'
          : 'list-disc list-inside space-y-2 mb-6 pl-4';
        
        return (
          <ListTag className={listClasses}>
            {data.items.map((item: string, itemIndex: number) => (
              <li
                key={itemIndex}
                className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </ListTag>
        );

      case 'checklist':
        return (
          <div className="space-y-3 mb-6">
            {data.items.map((item: { text: string; checked: boolean }, itemIndex: number) => (
              <div key={itemIndex} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  readOnly
                  className="mt-1 w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span
                  className={`text-lg leading-relaxed ${
                    item.checked
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            ))}
          </div>
        );

      case 'quote':
        return (
          <blockquote className="border-l-4 border-blue-500 pl-6 py-4 mb-8 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
            <p
              className="text-xl italic text-gray-800 dark:text-gray-200 mb-2"
              dangerouslySetInnerHTML={{ __html: data.text }}
            />
            {data.caption && (
              <cite className="text-sm text-gray-600 dark:text-gray-400">
                — {data.caption}
              </cite>
            )}
          </blockquote>
        );

      case 'code':
        const highlightedCode = data.code ? 
          Prism.highlight(data.code, Prism.languages[data.language || 'javascript'] || Prism.languages.javascript, data.language || 'javascript')
          : '';
        
        return (
          <div className="mb-8">
            <div className="bg-gray-900 rounded-t-lg px-4 py-2 flex items-center justify-between">
              <span className="text-sm text-gray-400 font-mono">
                {data.language || 'code'}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(data.code)}
                className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded bg-gray-800 hover:bg-gray-700"
              >
                Copy
              </button>
            </div>
            <pre className="bg-gray-900 rounded-b-lg p-4 overflow-x-auto">
              <code
                className={`language-${data.language || 'javascript'} text-sm`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </pre>
          </div>
        );

      case 'image':
        return (
          <figure className="mb-8">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={data.file?.url || data.url}
                alt={data.caption || ''}
                className="w-full h-auto"
              />
            </div>
            {data.caption && (
              <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                {data.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'embed':
        if (data.service === 'youtube') {
          const videoId = data.source.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
          return (
            <div className="mb-8">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={data.caption || 'YouTube video'}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
              {data.caption && (
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3 italic">
                  {data.caption}
                </p>
              )}
            </div>
          );
        }
        
        if (data.service === 'twitter') {
          return (
            <div className="mb-8 flex justify-center">
              <div className="max-w-lg w-full">
                <blockquote className="twitter-tweet">
                  <a href={data.source}>Loading tweet...</a>
                </blockquote>
              </div>
            </div>
          );
        }
        
        return (
          <div className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <a
              href={data.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {data.caption || data.source}
            </a>
          </div>
        );

      case 'delimiter':
        return (
          <div className="flex justify-center my-12">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        );

      case 'table':
        return (
          <div className="mb-8 overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <tbody>
                {data.content.map((row: string[], rowIndex: number) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
                  >
                    {row.map((cell: string, cellIndex: number) => {
                      const CellTag = rowIndex === 0 ? 'th' : 'td';
                      return (
                        <CellTag
                          key={cellIndex}
                          className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-left ${
                            rowIndex === 0
                              ? 'font-semibold text-gray-900 dark:text-white'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}
                          dangerouslySetInnerHTML={{ __html: cell }}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200">
              Unsupported block type: {type}
            </p>
            <pre className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <motion.div
      variants={blockVariants}
      initial="hidden"
      animate="visible"
      className="block-content"
    >
      {renderBlock()}
    </motion.div>
  );
};

export default BlockRenderer;