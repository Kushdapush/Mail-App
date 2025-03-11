"use client";

import { useState } from "react";

interface UploadFormProps {
  setMessage: (message: string) => void;
}

export default function UploadForm({ setMessage }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setMessage("Please select a file");
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("emailList", file);
    
    try {
      const response = await fetch("/api/mail/upload", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        setFile(null);
        // Reset the file input
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        
        setMessage("Email list uploaded and sent successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload file");
      }
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error instanceof Error ? error.message : "Failed to upload file"}`);
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
        id="file-upload"
        type="file"
        onChange={(e) => e.target.files && setFile(e.target.files[0])}
        accept=".csv"
        className="w-full p-2 mb-4"
        required
      />
      <div className="flex justify-center">
        <button 
          type="submit" 
          className="bg-[#2980b9] text-white px-5 py-2 rounded-md hover:bg-[#2471a3] transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </form>
  );
}