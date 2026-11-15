// Keys go to the API; labels are shown in the UI.
const SLOTS = [
  { key: 'morning_fasting', label: 'Morning (fasting)' },
  { key: 'after_breakfast', label: 'After breakfast' },
  { key: 'after_lunch', label: 'After lunch' },
  { key: 'after_dinner', label: 'After dinner' },
];

export function normalizeSlotKey(key) {
  return String(key || '').toLowerCase();
}

export function getSlotLabel(key) {
  const normalizedKey = normalizeSlotKey(key);
  return SLOTS.find((slot) => slot.key === normalizedKey)?.label || key;
}

export default SLOTS;
