import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TestUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    const storageRef = ref(storage, `test-uploads/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setUrl(downloadURL);
      console.log("File uploaded successfully:", downloadURL);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };
  return (
    <div className="p-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="bg-black text-white"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Upload
      </button>
      {url && (
        <div className="mt-4">
          <p>Download URL:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
          <img src={url} alt="Uploaded" className="mt-2 max-w-md" />
        </div>
      )}
    </div>
  );
};

export default TestUpload;
