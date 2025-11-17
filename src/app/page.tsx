
export default function HomePage() {

  return (
    <main className="min-h-screen bg-background px-4 sm:px-6">
      <div className="max-w-7xl mx-auto py-8 space-y-8">
        {/* Logo and Header */}
        <div>
          <img
            src="/images/politiqs.png"
            alt="Politiqs Logo"
            className="h-10 sm:h-12 w-auto select-none mb-8"
            draggable="false"
          />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground mb-2">
            Politiqs Platform
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            A modern, responsive foundation for PolitIQS web applications.
          </p>
        </div>

    
      </div>
    </main>
  );
}
