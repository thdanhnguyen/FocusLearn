export default function Timer({ remainingSeconds, isActive, onStart, onPause, onStop }) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="flex flex-col items-center">
      <div className="text-6xl font-mono mb-4">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="space-x-3">
        {!isActive ? (
          <button onClick={onStart} className="bg-green-500 text-white px-4 py-2 rounded">Start</button>
        ) : (
          <button onClick={onPause} className="bg-yellow-500 text-white px-4 py-2 rounded">Pause</button>
        )}
        <button onClick={onStop} className="bg-red-500 text-white px-4 py-2 rounded">Stop</button>
      </div>
    </div>
  );
}
