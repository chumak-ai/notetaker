export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          NoteTaker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Your intelligent note-taking companion
        </p>
        <div className="space-x-4">
          <a
            href="/app"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
}
