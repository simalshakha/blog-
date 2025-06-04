import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "@/blockSchema";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { Tags } from "lucide-react";

interface EditorState {
  title: string;
  description: string;
  bannerImage: string;
  tags: string[];
  content: string;
}

const MAX_DESCRIPTION_LENGTH = 200;

export function Editor() {
  const [editorState, setEditorState] = useState<EditorState>({
    title: "",
    description: "",
    bannerImage: "",
    tags: [],
    content: "",
  });
  
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  
  const editor = useEditor({
    extensions,
    content: editorState.content,
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      setEditorState(prev => ({
        ...prev,
        content: editor.getHTML()
      }));
    },
  });

  const handleBannerUpload = (url: string) => {
    setEditorState(prev => ({
      ...prev,
      bannerImage: url
    }));
    setShowImageUpload(false);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const newTag = e.currentTarget.value.trim();
      if (newTag && !editorState.tags.includes(newTag)) {
        setEditorState(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditorState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handlePublish = async () => {
    const post = {
      ...editorState,
      isDraft,
      publishedAt: new Date().toISOString(),
    };
    
    // Save to localStorage for now
    localStorage.setItem(`blog-${Date.now()}`, JSON.stringify(post));
    alert(isDraft ? "Draft saved successfully!" : "Post published successfully!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Banner Image Section */}
        <div className="relative h-[300px] rounded-xl overflow-hidden bg-gray-100">
          {editorState.bannerImage ? (
            <img
              src={editorState.bannerImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <button
              onClick={() => setShowImageUpload(true)}
              className="absolute inset-0 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Banner Image
              </span>
            </button>
          )}
        </div>

        {/* Title Input */}
        <input
          type="text"
          value={editorState.title}
          onChange={(e) => setEditorState(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Your post title"
          className="w-full text-4xl font-bold focus:outline-none"
        />

        {/* Description Input */}
        <div className="relative">
          <textarea
            value={editorState.description}
            onChange={(e) => {
              if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                setEditorState(prev => ({ ...prev, description: e.target.value }));
              }
            }}
            placeholder="Add a brief description (max 200 characters)"
            className="w-full h-20 p-3 border rounded-lg resize-none"
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
          <span className="absolute bottom-2 right-2 text-sm text-gray-500">
            {editorState.description.length}/{MAX_DESCRIPTION_LENGTH}
          </span>
        </div>

        {/* Tags Input */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {editorState.tags.map(tag => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Tags className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Add tags (press Enter)"
              onKeyDown={handleTagInput}
              className="flex-1 focus:outline-none"
            />
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="border rounded-lg">
          <EditorContent editor={editor} />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            onClick={() => {
              setIsDraft(true);
              handlePublish();
            }}
            variant="secondary"
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => {
              setIsDraft(false);
              handlePublish();
            }}
          >
            Publish Post
          </Button>
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUpload && (
        <ImageUpload
          onUpload={handleBannerUpload}
          onClose={() => setShowImageUpload(false)}
        />
      )}
    </div>
  );
}