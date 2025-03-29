export default function Message({ text, self }) {
    return (
      <div className={`flex ${self ? "justify-end" : "justify-start"}`}>
        <div
          className={`p-3 rounded-lg max-w-xs text-white ${
            self ? "bg-blue-500" : "bg-gray-300 text-black"
          }`}
        >
          {text}
        </div>
      </div>
    );
  }
  