const tipLinks = {
  five: "https://buy.stripe.com/test_9B66oBbVCdZzdM2ge08g000",
  ten: "https://buy.stripe.com/test_bJe7sFf7Og7H0Zg8Ly8g001",
  fifteen: "https://buy.stripe.com/test_8x2dR3e3KbRrdM22na8g002",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 p-6 shadow-sm">
        <p className="text-sm text-gray-500 text-center mb-2">Tip directly</p>

        <h1 className="text-3xl font-bold text-center text-gray-900">
          Tip Maria
        </h1>

        <p className="text-center text-gray-600 mt-2 mb-6">No cash needed</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href={tipLinks.five}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gray-300 py-3 text-lg font-semibold hover:bg-gray-50 text-center cursor-pointer"
          >
            $5
          </a>

          <a
            href={tipLinks.ten}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gray-300 py-3 text-lg font-semibold hover:bg-gray-50 text-center cursor-pointer"
          >
            $10
          </a>

          <a
            href={tipLinks.fifteen}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-gray-300 py-3 text-lg font-semibold hover:bg-gray-50 text-center cursor-pointer"
          >
            $15
          </a>

          <button className="rounded-xl border border-gray-300 py-3 text-lg font-semibold hover:bg-gray-50">
            Custom
          </button>
        </div>

        <a
          href={tipLinks.ten}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-xl bg-black text-white py-3 text-lg font-semibold hover:opacity-90 text-center cursor-pointer"
        >
          Tip now
        </a>

        <p className="text-xs text-gray-400 text-center mt-4">
          Powered by Thankly
        </p>
      </div>
    </main>
  );
}