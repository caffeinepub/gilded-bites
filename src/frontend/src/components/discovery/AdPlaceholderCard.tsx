export function AdPlaceholderCard() {
  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        {/* Sponsored label - prominent and distinct with orange accent */}
        <div className="absolute top-6 left-6 px-4 py-2 bg-accent/20 border border-accent/50 rounded-full">
          <span className="text-accent font-bold text-sm tracking-wider uppercase">Sponsored</span>
        </div>
        
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-accent/20" />
        </div>
        <h3 className="text-xl font-semibold text-accent mb-2">Advertisement</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Swipe to continue discovering restaurants
        </p>
      </div>
    </div>
  );
}
