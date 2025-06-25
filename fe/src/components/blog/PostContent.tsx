import React from 'react';
import { motion } from 'framer-motion';
import BlockRenderer from './BlockRenderer';

interface Block {
  type: string;
  data: any;
}

interface PostContentProps {
  blocks: Block[];
}

const PostContent: React.FC<PostContentProps> = ({ blocks }) => {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="prose prose-lg dark:prose-invert max-w-none"
    >
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <BlockRenderer
            key={index}
            block={block}
            index={index}
          />
        ))}
      </div>
    </motion.article>
  );
};

export default PostContent;