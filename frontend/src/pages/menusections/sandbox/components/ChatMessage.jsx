import React, { useState } from 'react';

const ChatMessage = ({ message, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  // Helper function to format the message content
  const formatContent = (content) => {
    return (
      <div className="prose prose-sm max-w-none">
        {content.split('\n').map((line, index) => (
          <p key={index} className="mb-2 last:mb-0">
            {line}
          </p>
        ))}
      </div>
    );
  };

  if (message.type === 'user' || !isEditing) {
    return (
      <div 
        className={`p-6 rounded-lg mb-4 shadow-sm ${
          message.type === 'user' 
            ? 'bg-gray-50 border border-gray-100' 
            : 'bg-blue-50 border border-blue-100'
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            {formatContent(message.content)}
          </div>
          {message.type === 'assistant' && (
            <button 
              onClick={() => setIsEditing(true)}
              className="shrink-0 text-sm text-blue-600 hover:text-blue-800 
                transition-colors px-2 py-1 rounded hover:bg-blue-50"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <textarea
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-teal 
          focus:border-transparent resize-vertical min-h-[100px]"
        rows={4}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-3 py-1.5 text-gray-600 hover:text-gray-800 
            hover:bg-gray-50 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onEdit(editedContent);
            setIsEditing(false);
          }}
          className="px-3 py-1.5 bg-teal text-white rounded-md 
            hover:bg-teal/90 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
