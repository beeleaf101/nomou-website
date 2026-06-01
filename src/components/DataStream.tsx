export default function DataStream() {
  const dataText =
    'SOIL: 28% | AIR: 42 AQI | WATER: 7.24 pH | TEMP: 31.2°C | HUM: 64% | SOIL: 28% | AIR: 42 AQI | WATER: 7.24 pH | TEMP: 31.2°C | HUM: 64% | SOIL: 28% | AIR: 42 AQI | WATER: 7.24 pH | TEMP: 31.2°C | HUM: 64% | SOIL: 28% | AIR: 42 AQI | WATER: 7.24 pH | TEMP: 31.2°C | HUM: 64% | ';

  return (
    <div className="w-full h-12 bg-forest overflow-hidden flex items-center relative">
      <div className="animate-data-stream whitespace-nowrap flex items-center">
        <span className="font-mono text-sm text-lime/60 tracking-wider">{dataText}</span>
        <span className="font-mono text-sm text-lime/60 tracking-wider">{dataText}</span>
      </div>
    </div>
  );
}
