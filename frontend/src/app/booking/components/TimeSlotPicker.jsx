export default function TimeSlotPicker({ slots, selectedSlot, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          onClick={() => onSelect(slot)}
          className={`py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${selectedSlot === slot 
            ? 'bg-blue-100 text-blue-800 border-2 border-blue-500' 
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'}`}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}