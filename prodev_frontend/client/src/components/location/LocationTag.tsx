// src/components/location/LocationTag.tsx
export const LocationTag = ({ name }: { name: string }) => (
  <span className="text-xs bg-green-200 text-green-900 px-2 py-1 rounded-full">
    {name}
  </span>
);
