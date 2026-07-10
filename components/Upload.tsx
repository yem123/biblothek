"use client";

import { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          if (!e.target.files?.length) return;
          setFile(e.target.files[0]);
        }}
      />

      {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
    </div>
  );
}
