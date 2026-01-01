interface FormStripProps {
  form: string[]; // e.g., ["W", "W", "L", "D", "W"]
}

export default function FormStrip({ form }: FormStripProps) {
  return (
    <div className="flex space-x-1">
      {form.map((result, idx) => (
        <div
          key={idx}
          className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${
            result === 'W'
              ? 'bg-green-500 text-white'
              : result === 'D'
              ? 'bg-yellow-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {result}
        </div>
      ))}
    </div>
  );
}

