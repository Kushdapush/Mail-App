"use client";

import { useState } from "react";

interface AddMailFormProps {
  setMessage: (message: string) => void;
}

export default function AddMailForm({ setMessage }: AddMailFormProps) {
  const [newReceiver, setNewReceiver] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/mail/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newReceiver }),
      });
      
      if (response.ok) {
        setNewReceiver("");
        setMessage("Email added and sent successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to add email");
      }
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error instanceof Error ? error.message : "Failed to add email"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full p-6 border border-[#e0e0e0] rounded-md bg-[#e8f0fe] shadow-md"
    >
      <input
        type="email"
        value={newReceiver}
        onChange={(e) => setNewReceiver(e.target.value)}
        placeholder="Email Address"
        className="w-full p-2 mb-4 border border-[#ccc] rounded-md"
        required
      />
      <div className="flex justify-center">
        <button 
          type="submit" 
          className="bg-[#2980b9] text-white px-5 py-2 rounded-md hover:bg-[#2471a3] transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}