import React from 'react';

const FontDebug = () => {
  // Rango de caracteres ASCII imprimibles (del 32 al 126)
  const asciiChars = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32));

  // Caracteres adicionales especiales si es necesario
  const specialChars = [
    'Ä', 'Ö', 'Ü', 'ä', 'ö', 'ü', 'ß', 'Ñ', 'ñ', 'Ç', 'ç',
    '€', '£', '¥', '©', '®', '™', '°', '·', '•', '…', '–', '—',
    '“', '”', '‘', '’', '«', '»', '‹', '›', '¿', '¡', '§', '¶',
    '†', '‡', '•', '‣', '⁃', '⁌', '⁍', '‣', '⁃', '⁌', '⁍'
  ];

  const allChars = [...asciiChars, ...specialChars];

  return (
    <div className="min-h-screen bg-black p-8">
      <h1 className="text-3xl font-bold font-anthony text-white mb-8">
        Anthony Font Debug
      </h1>

      <div className="grid grid-cols-8 gap-2">
        {allChars.map((char, index) => (
          <div
            key={index}
            className="w-[100px] h-[100px] border border-gray-700 flex items-center justify-center bg-gray-900"
          >
            <div className="text-center">
              <div className="font-anthony text-4xl text-white">
                {char}
              </div>
              <div className="text-xs text-gray-500 mt-1 font-mono">
                {char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FontDebug;
