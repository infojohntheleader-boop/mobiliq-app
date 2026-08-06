export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a0f' }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16l6 6L26 10"/></svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-gray-400">Thank you for your booking. You&apos;ll receive a confirmation email shortly.</p>
      </div>
    </div>
  );
}
