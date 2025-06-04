import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

interface BlockProps {
  node: any;
  updateAttributes: (attrs: any) => void;
}

const Block: React.FC<BlockProps> = ({ node, updateAttributes }) => {
  return (
    <NodeViewWrapper className="block-wrapper">
      <div className="block-content">
        <NodeViewContent className="content" />
      </div>
    </NodeViewWrapper>
  );
};

export default Block;