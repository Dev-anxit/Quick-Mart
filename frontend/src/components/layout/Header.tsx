export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-accent-green/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="font-syne text-2xl font-bold text-accent-green">🚀 Grocery</div>
        <input 
          type="text" 
          placeholder="Search products..." 
          className="hidden md:block px-4 py-2 bg-primary-800 rounded-lg input-focus w-80"
        />
        <div className="flex gap-4 items-center">
          <span className="text-sm">Cart</span>
          <span className="text-sm">Account</span>
        </div>
      </div>
    </header>
  );
}
