import { useParams } from 'react-router-dom';

export default function Room() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4">Focus Room: {id}</h2>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white p-6 shadow-sm border border-gray-200 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-400">Timer and Participants</p>
        </div>
        <div className="col-span-1 bg-white p-6 shadow-sm border border-gray-200 rounded-lg h-96 flex flex-col">
          <h3 className="font-semibold border-b pb-2 mb-4">Chat</h3>
          <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">
            Chat messages...
          </div>
        </div>
      </div>
    </div>
  );
}
