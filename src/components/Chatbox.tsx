import React, { useEffect, useRef } from 'react';

interface CustomTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '25px'; // Reset height, so that it not only grows but also shrinks
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight <= 200) {
        textareaRef.current.style.height = `${scrollHeight}px`;
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = 'auto';
      }
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      id="chatbox"
      ref={textareaRef}
      placeholder='Send a message..'
      value={value}
      onChange={onChange}
      style={{
        minHeight: '25px',
        maxHeight: '200px',
        width: '100%',

      }}
    />
  );
};

export default CustomTextarea;
