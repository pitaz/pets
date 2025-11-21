import { redirect } from "next/navigation";

// This is a placeholder - in production, implement proper auth check
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add authentication check here
  // For now, this is a placeholder
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                View Site
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="container-custom py-8">{children}</main>
    </div>
  );
}
