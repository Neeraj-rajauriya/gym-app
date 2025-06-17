'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Error loading progress</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}