export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-primary-900 border-t border-accent-green/20 flex justify-around py-2">
      <a href="/" className="flex-1 text-center py-2">Home</a>
      <a href="/search" className="flex-1 text-center py-2">Search</a>
      <a href="/account" className="flex-1 text-center py-2">Account</a>
      <a href="/orders" className="flex-1 text-center py-2">Orders</a>
    </nav>
  );
}
