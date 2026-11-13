export default function DataStream() {
  const dataText =
    'NOMOU V2 • SOIL MOISTURE • ROOT TEMPERATURE • AIR TEMPERATURE • HUMIDITY • PRESSURE • LIGHT • NH₃ • CO₂ • TDS • pH • UV • LIVE SOIL INTELLIGENCE • ';

  return (
    <div className="w-full h-12 bg-forest overflow-hidden flex items-center relative">
      <div className="animate-data-stream whitespace-nowrap flex items-center">
        <span className="font-mono text-sm text-lime/60 tracking-wider">{dataText}</span>
        <span className="font-mono text-sm text-lime/60 tracking-wider">{dataText}</span>
      </div>
    </div>
  );
}
