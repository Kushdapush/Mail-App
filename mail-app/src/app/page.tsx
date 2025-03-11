"use client";

import { useState } from "react";
import AddMailForm from "@/components/AddMailForm";
import UploadForm from "@/components/UploadForm";

export default function Home() {
  const [message, setMessage] = useState<string>("");

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen bg-[#f0f8ff] p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#3b82f6]">Email Sender App</h1>
      </header>
      
      <main className="flex flex-col items-center gap-12">
        <section className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#3b82f6] mb-6 text-center">Add a Mail Address</h2>
          <AddMailForm setMessage={setMessage} />
        </section>
        
        <section className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#3b82f6] mb-6 text-center">Upload Email List</h2>
          <UploadForm setMessage={setMessage} />
        </section>
        
        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md w-full max-w-md">
            {message}
          </div>
        )}
      </main>
      
      <footer className="text-center text-gray-500 text-sm mt-12">
        © {new Date().getFullYear()} Email Sender App
      </footer>
    </div>
  );
}