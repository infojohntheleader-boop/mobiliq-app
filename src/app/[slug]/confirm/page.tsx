export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--emerald-muted)', border: '1px solid var(--emerald-muted)' }}
        >
          <svg width="32" height="32" fill="none" stroke="var(--emerald)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16l6 6L26 10"/></svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Thank you for your booking. You&apos;ll receive a confirmation email shortly.</p>
      </div>
    </div>
  );
}
