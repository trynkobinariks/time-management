import React from 'react'

interface TranscribedTextProps {
  text: string;
}

const TranscribedText = ({ text }: TranscribedTextProps) => {
  return (
    <div className="mt-2 p-3 bg-[var(--card-background)] rounded-md w-full max-w-[90vw] shadow-md border border-[var(--card-border)]">
      <div className="text-sm text-[var(--text-primary)]">{text}</div>
    </div>
  );
}

export default TranscribedText