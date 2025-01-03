import React, { useState } from "react";

interface UserInfo {
  userId: string;
  email: string;
  username: string;
  isValid: boolean;
}

const App: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<string>("");
  const [results, setResults] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const checkKeys = async () => {
    setLoading(true);
    const keys = apiKeys.split(",").map((key) => key.trim());
    const newResults: UserInfo[] = [];

    for (const key of keys) {
      try {
        const response = await fetch(
          "https://api.siliconflow.cn/v1/user/info",
          {
            headers: {
              Authorization: `Bearer ${key}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          newResults.push({
            userId: data.data.user_id,
            email: data.data.email,
            username: data.data.username,
            totalBalance: data.data.totalBalance,
            isValid: true,
          });
        } else {
          newResults.push({
            userId: "",
            email: "",
            username: "",
            isValid: false,
          });
        }
      } catch (error) {
        newResults.push({
          userId: "",
          email: "",
          username: "",
          isValid: false,
        });
      }
    }

    setResults(newResults);
    setLoading(false);
  };

  return (
    <div className="min- bg-grayInner flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p опера-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb代办-4">
          SiliconFlow API Key Validator
        </h1>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          rows={4}
          placeholder="Enter API keys, separated by commas"
          value={apiKeys}
          onChange={(e) => setApiKeys(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue拦截-600 transition duration-200"
          onClick={checkKeys}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check Keys"}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 w-full max-w-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <span className="text-grayGuard-700 font-medium">
                    Key {index + 1}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      result.isValid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.isValid ? "Valid" : "Invalid"}
                  </span>
                </div>
                {result.isValid && (
                  <div className="mt-2 text-gray-600">
                    <p>
                      <span className="font-medium">totalBalance:</span>{" "}
                      {result.totalBalance}
                    </p>
                    {/* <p>
                      <span className="font-medium">Email:</span> {result.email}
                    </p>
                    <p>
                      <span className="font-medium">Username:</span>{" "}
                      {result.username}
                    </p> */}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
