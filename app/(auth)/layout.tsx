export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-linear-to-br from-stone-900 via-stone-800 to-amber-950">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight">
              Stilbaai Gallery
            </h1>
            <p className="mt-2 text-stone-400 text-lg">
              Artist Submissions Portal
            </p>
          </div>
          <div className="space-y-6">
            <blockquote className="text-2xl font-serif italic text-stone-300 leading-relaxed">
              &ldquo;Art enables us to find ourselves and lose ourselves at the
              same time.&rdquo;
            </blockquote>
            <p className="text-stone-500">— Thomas Merton</p>
          </div>
          <div className="text-stone-500 text-sm">
            © {new Date().getFullYear()} Stilbaai Gallery. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-stone-50">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
