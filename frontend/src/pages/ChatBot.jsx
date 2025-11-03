import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import useToken from "../context/token";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm PrakritiAI 🌿 Your eco-friendly assistant. How can I help you with sustainability today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const {tokenId} = useToken()
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const leaf1Ref = useRef(null);
  const leaf2Ref = useRef(null);
  const leaf3Ref = useRef(null);
  const botRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Sample eco-friendly responses
  const botResponses = [
    "That's a great question about sustainability! 🌱",
    "I love discussing eco-friendly practices! ♻️",
    "Did you know that recycling one aluminum can saves enough energy to run a TV for 3 hours?",
    "Consider using reusable bags instead of plastic ones!",
    "Planting trees is one of the most effective ways to combat climate change.",
    "You can save water by taking shorter showers and fixing leaks promptly.",
    "Composting food waste reduces methane emissions from landfills.",
    "Using public transportation or biking helps reduce air pollution significantly.",
    "Energy-efficient appliances can reduce your electricity consumption by up to 50%!",
  ];

  useEffect(() => {
    // Floating leaves animation
    gsap.to(leaf1Ref.current, {
      y: 20,
      rotate: 15,
      duration: 4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to(leaf2Ref.current, {
      y: -25,
      rotate: -20,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 0.5,
    });

    gsap.to(leaf3Ref.current, {
      y: 15,
      rotate: 10,
      duration: 4.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 1,
    });

    // Bot gentle sway
    gsap.to(botRef.current, {
      y: 10,
      rotate: 5,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // Initial chat container animation
    gsap.from(chatContainerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "back.out(1.7)",
    });
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/chat/get-response`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from server");
      }

      const data = await response.json();
      console.log(data)
      const botMessage = {
        id: Date.now() + 1,
        text: data.response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback to random responses if API fails
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. " + randomResponse,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-100 to-teal-200 dark:from-gray-900 dark:via-green-950 dark:to-emerald-900 p-4 pt-10.5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating leaves */}
        <div
          ref={leaf1Ref}
          className="absolute top-20 left-0 rotate-6 w-12 h-12 opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-green-400"
          >
            <path d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1.41-1.41C9.69,19.22,12.18,16.24,17,8Z" />
          </svg>
        </div>

        <div
          ref={leaf2Ref}
          className="absolute top-40 right-0 w-16 h-16 opacity-70 rotate-90"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-emerald-500"
          >
            <path d="M12,3C16.97,3,21,7.03,21,12c0,4.97-4.03,9-9,9s-9-4.03-9-9C3,7.03,7.03,3,12,3z M12,5c-3.87,0-7,3.13-7,7 c0,1.96,0.81,3.73,2.11,5l9.78-9.78C15.73,5.81,13.96,5,12,5z" />
          </svg>
        </div>

        <div
          ref={leaf3Ref}
          className="absolute bottom-40 left-2 w-14 h-14 opacity-70"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-teal-400"
          >
            <path d="M12,2C13.66,2,15,3.34,15,5c0,1.31-0.84,2.41-2,2.82V10h-2V7.82C9.84,7.41,9,6.31,9,5C9,3.34,10.34,2,12,2z M19,11 c0.55,0,1-0.45,1-1s-0.45-1-1-1s-1,0.45-1,1S18.45,11,19,11z M5,11c0.55,0,1-0.45,1-1s-0.45-1-1-1s-1,0.45-1,1S4.45,11,5,11z M18.95,21 c-0.39,0-0.76-0.23-0.92-0.61l-2.28-5.09l-1.43,1.43l2.66,5.97c0.21,0.47,0.71,0.77,1.22,0.77c0.55,0,1.05-0.3,1.28-0.78l3.47-7.44 l-1.43-1.43L18.95,21z M10.49,16.31l-1.43-1.43L5.05,21c-0.39,0-0.76-0.23-0.92-0.61l-2.28-5.09l-1.43,1.43l2.66,5.97 c0.21,0.47,0.71,0.77,1.22,0.77c0.55,0,1.05-0.3,1.28-0.78l3.47-7.44L10.49,16.31z" />
          </svg>
        </div>

        {/* Animated bubbles */}
        <div className="absolute bottom-0 left-1/4 w-8 h-8 bg-green-300/30 rounded-full animate-float">
          <div className="absolute inset-0 bg-green-400/20 rounded-full animate-ping"></div>
        </div>
        <div
          className="absolute top-1/3 right-1/4 w-8 h-8 bg-emerald-300/40 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        >
          <div
            className="absolute inset-0 bg-emerald-400/30 rounded-full animate-ping"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div
        ref={chatContainerRef}
        className="relative w-[96.5%] max-w-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-200 dark:border-emerald-700 overflow-hidden opacity-95 z-10"
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 flex items-center space-x-4">
          <div ref={botRef} className="flex-shrink-0">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600">
                <path
                  fill="currentColor"
                  d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">PrakritiAI 🌿</h1>
            <p className="text-green-100 text-xs mt-1 mb-1">
              Your Eco-Friendly Assistant
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="h-81.5 text-sm overflow-y-auto p-3 space-y-4 bg-gradient-to-b from-white to-green-50/30 dark:from-gray-800 dark:to-emerald-900/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                  message.isBot
                    ? "bg-green-100 dark:bg-emerald-900/50 text-gray-800 dark:text-green-100 rounded-bl-none"
                    : "bg-[#e5fcb4] text-gray-700 rounded-br-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-green-100 dark:bg-emerald-900/50 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-green-200 dark:border-emerald-700"
        >
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about sustainability, recycling, or eco-friendly tips..."
                className="w-full px-4 py-2 bg-green-50 dark:bg-emerald-900/30 border border-green-300 dark:border-emerald-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 dark:text-white placeholder-green-600 dark:placeholder-emerald-400 opacity-100"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className="w-5 h-5 text-green-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12,2C13.66,2,15,3.34,15,5c0,1.31-0.84,2.41-2,2.82V10h-2V7.82C9.84,7.41,9,6.31,9,5C9,3.34,10.34,2,12,2z M19,11 c0.55,0,1-0.45,1-1s-0.45-1-1-1s-1,0.45-1,1S18.45,11,19,11z M5,11c0.55,0,1-0.45,1-1s-0.45-1-1-1s-1,0.45-1,1S4.45,11,5,11z M18.95,21 c-0.39,0-0.76-0.23-0.92-0.61l-2.28-5.09l-1.43,1.43l2.66,5.97c0.21,0.47,0.71,0.77,1.22,0.77c0.55,0,1.05-0.3,1.28-0.78l3.47-7.44 l-1.43-1.43L18.95,21z M10.49,16.31l-1.43-1.43L5.05,21c-0.39,0-0.76-0.23-0.92-0.61l-2.28-5.09l-1.43,1.43l2.66,5.97 c0.21,0.47,0.71,0.77,1.22,0.77c0.55,0,1.05-0.3,1.28-0.78l3.47-7.44L10.49,16.31z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-6 py-2 bg-green-600 hover:bg-green-600 disabled:bg-green-400 dark:disabled:bg-green-700 text-white rounded-2xl font-medium transition-colors duration-200 shadow-lg hover:shadow-xl disabled:shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <span>Send</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Bottom wave decoration */}
      <svg
        className="absolute bottom-0 w-full h-32"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#10b981"
          fillOpacity="0.3"
          d="M0,192L48,165.3C96,139,192,85,288,85.3C384,85,480,139,576,154.7C672,171,768,149,864,154.7C960,160,1056,192,1152,197.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z"
        ></path>
      </svg>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
