import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const apiError = await res.json();
        setError(apiError.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPrompt("");
      setResponse(data.result || "No response from AI.");
    } catch {
      setError("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    if (!response) return;
    const blob = new Blob([response], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setResponse("");
    setError("");
  };

  type CodeProps = React.ComponentPropsWithoutRef<"code"> & {
    inline?: boolean;
  };
  type PreProps = React.ComponentPropsWithoutRef<"pre">;
  type ListItemProps = React.ComponentPropsWithoutRef<"li">;

  const CodeRenderer = ({
    inline,
    className,
    children,
    ...rest
  }: CodeProps) => (
    <code
      className={
        "bg-[#232a41] rounded px-1 py-0.5 text-[#B9FF66] text-base" +
        (className ? ` ${className}` : "") +
        (inline ? "" : " block my-2 p-2 overflow-x-auto")
      }
      {...rest}
    >
      {children}
    </code>
  );

  const PreRenderer = ({ children, ...rest }: PreProps) => (
    <pre className="bg-[#232a41] rounded-xl p-3 my-2 overflow-x-auto" {...rest}>
      {children}
    </pre>
  );

  const ListItemRenderer = ({ children, ...rest }: ListItemProps) => (
    <li className="ml-4 list-disc" {...rest}>
      {children}
    </li>
  );

  const markdownComponents: Components = {
    code: CodeRenderer,
    pre: PreRenderer,
    li: ListItemRenderer,
  };

  return (
    <div className="rounded-3xl bg-[#ffffff] px-30 py-16 shadow-2xl drop-shadow-neutral-800 flex flex-col gap-6 w-[98wv] m-3 h-full dark:bg-[#181B20] border border-gray-200 dark:border-[#232a41]">
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Gemini Text Generator
      </div>
      <p className="text-gray-500 dark:text-gray-300 mb-2 text-base">
        Enter a prompt and let Gemini generate creative, helpful, or informative
        text for you. Try the example prompts below or write your own!
      </p>
      {/* Example prompts */}
      <div className="flex flex-wrap gap-4 mb-2">
        {[
          "Write a short poem about a cat.",
          "Summarize the plot of Hamlet.",
          "Describe the benefits of AI in healthcare.",
          "Suggest a catchy slogan for a new coffee shop.",
        ].map((ex, i) => (
          <button
            key={i}
            type="button"
            className="px-6 py-2 rounded-xl bg-[#232a41] text-white text-sm hover:bg-[#3D55B6] border border-[#3D55B6] transition"
            onClick={() => setPrompt(ex)}
            disabled={loading}
          >
            {ex}
          </button>
        ))}
      </div>
      {/* Prompt guidance */}
      <div className="text-xs text-[#7ED957] mb-1 font-medium">
        Tips:{" "}
        <span className="text-gray-400 font-normal">
          Be specific. Use keywords. Describe the desired tone or style. Try
          creative, technical, or summarization tasks!
        </span>
      </div>
      <form className="flex flex-col gap-3" onSubmit={handleFormSubmit}>
        <label
          className="font-semibold text-gray-900 dark:text-white"
          htmlFor="prompt"
        >
          Enter your prompt here
        </label>
        <textarea
          id="prompt"
          className="bg-[#ffffff] dark:bg-[#181B20] border rounded-xl p-4 text-base resize-none  focus:border-[#black] transition min-h-[60px]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="Ask the AI anything..."
          required
        />
        <div className="flex gap-4 mt-1">
          <button
            type="submit"
            className="flex items-center gap-2 px-10 py-3 bg-black text-white text-sm rounded-full font-semibold shadow-black/80 hover:shadow-md cursor-pointer relative md hover:shadow-green-400 transition-all hover:scale-105 group"
            disabled={loading}
          >
            {loading ? "Running..." : "Run AI"}
          </button>
        </div>
      </form>
      {/* AI result output placeholder */}
      <div className="dark:bg-[#181B20] rounded-xl min-h-[60px] mt-2 text-lg relative overflow-x-auto">
        {loading ? (
          <span className="opacity-60 animate-pulse">
            Generating AI response...
          </span>
        ) : error ? (
          <span className="text-red-400">{error}</span>
        ) : response ? (
          <>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {response}
              </ReactMarkdown>
            </div>
            <div className="flex gap-2 mt-4 items-center">
              {/* Copy */}
              <div className="relative group w-fit">
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {copied ? "Copied!" : "Copy"}
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#232a41] transition cursor-pointer"
                  aria-label="Copy"
                >
                  {copied ? (
                    <svg
                      className="h-6 w-6 transition"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-gray-500 group-hover:text-blue-500 transition"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                      />
                      <rect
                        x="3"
                        y="3"
                        width="13"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Download */}
              <div className="relative group w-fit">
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {"Download"}
                </div>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#232a41] transition cursor-pointer"
                  aria-label="Download"
                >
                  <svg
                    className="h-6 w-6 text-gray-500 group-hover:text-indigo-500 transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke="currentColor" />
                    <rect
                      x="5"
                      y="19"
                      width="14"
                      height="2"
                      rx="1"
                      stroke="currentColor"
                    />
                  </svg>
                </button>
              </div>
              {/* Clear */}
              <div className="relative group w-fit">
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {"Clear"}
                </div>
                <button
                  type="button"
                  onClick={handleClear}
                  className="group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#232a41] transition cursor-pointer"
                  aria-label="Clear"
                >
                  <svg
                    className="h-6 w-6 text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <span className="opacity-60">AI output will appear here...</span>
        )}
      </div>
    </div>
  );
};

export default TextGenerator;
