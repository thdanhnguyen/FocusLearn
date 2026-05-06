import { useState } from 'react';

export default function Chat({ messages = [], onSendMessage }) {
  const [text, setText] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-4 border border-gray-200 p-2 rounded">
        {messages.map((m, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-bold text-sm">{m.displayName}: </span>
            <span className="text-sm">{m.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex">
        <input 
          value={text} 
          onChange={e => setText(e.target.value)} 
          className="flex-grow border rounded-l px-2 py-1"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 rounded-r">Send</button>
      </form>
    </div>
  );
}
