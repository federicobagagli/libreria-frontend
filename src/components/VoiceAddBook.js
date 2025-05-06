// src/components/VoiceAddBook.js
import React, { useEffect, useRef, useState } from 'react';

const VoiceAddBook = ({ onFieldDetected }) => {
  const [status, setStatus] = useState("In attesa di 'ok libreria' o clic sul bottone...");
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const commandBuffer = useRef(""); // ✅ buffer condiviso

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Il tuo browser non supporta SpeechRecognition!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'it-IT';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("DEBUG trigger transcript:", transcript);

      if (!listening && transcript.includes("ok libreria")) {
        setStatus("Attivato! Ora puoi dire i comandi, chiudi con 'fine libreria'.");
        setListening(true);
        recognition.stop();
        startCommandRecognition();
      }
    };

    recognition.onerror = (e) => {
      console.error("Errore recognition trigger:", e);
    };

    recognition.start();
    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, []);

  const startCommandRecognition = () => {
    console.log("DEBUG: startCommandRecognition chiamato!");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const commandRecognition = new SpeechRecognition();
    commandRecognition.lang = 'it-IT';
    commandRecognition.interimResults = false;
    commandRecognition.continuous = true;

    setStatus(`Sto ascoltando... chiudi con 'fine libreria'. 
Esempio:
"titolo Il signore degli anelli fine titolo
autore Tolkien fine autore
anno 1954 fine anno
genere Fantasy fine genere
fine libreria"`);

    commandRecognition.onresult = (event) => {
      const partial = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("DEBUG partial transcript:", partial);

      commandBuffer.current += " " + partial;
      console.log("DEBUG commandBuffer:", commandBuffer.current);

      if (commandBuffer.current.includes("fine libreria")) {
        console.log("DEBUG: trovato 'fine libreria'!");

        const matchTitle = commandBuffer.current.match(/titolo\s+(.*?)(?=\s+fine titolo)/i);
        const matchAuthor = commandBuffer.current.match(/autore\s+(.*?)(?=\s+fine autore)/i);
        const matchAnno = commandBuffer.current.match(/anno\s+(\d{4}|\d{8})(?=\s+fine anno)/i);
        const matchGenere = commandBuffer.current.match(/genere\s+(.*?)(?=\s+fine genere)/i);

        const titolo = matchTitle ? matchTitle[1].trim() : "";
        const autore = matchAuthor ? matchAuthor[1].trim() : "";
        const anno = matchAnno ? matchAnno[1].trim() : "";
        const genere = matchGenere ? matchGenere[1].trim() : "";

        console.log("Estratto:", { titolo, autore, anno, genere });

        if (titolo) onFieldDetected('title', titolo);
        if (autore) onFieldDetected('author', autore);
        if (genere) onFieldDetected('genre', genere);

        if (anno) {
          let dateObj = null;
          if (/^\d{4}$/.test(anno)) {
            dateObj = new Date(parseInt(anno), 0, 1);
          } else if (/^\d{8}$/.test(anno)) {
            const year = parseInt(anno.substring(0,4));
            const month = parseInt(anno.substring(4,6)) - 1;
            const day = parseInt(anno.substring(6,8));
            dateObj = new Date(year, month, day);
          }

          if (dateObj && !isNaN(dateObj.getTime())) {
            onFieldDetected('publishDate', dateObj);
          } else {
            console.warn("Data non valida da comando vocale:", anno);
          }
        }

        setStatus(`Comando completato: Titolo: ${titolo}, Autore: ${autore}, Anno: ${anno}, Genere: ${genere}`);

        commandBuffer.current = "";
        setListening(false);
        commandRecognition.stop();
        try { commandRecognition.abort(); } catch {}

        if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
        recognitionRef.current.start();
        }

      }
    };

    commandRecognition.onerror = (e) => {
        console.error("Errore comando vocale:", e);
        setStatus("Errore. Riprova a dire 'ok libreria' o clicca il bottone");
        setListening(false);
        commandBuffer.current = "";
        commandRecognition.stop();
        try { commandRecognition.abort(); } catch {}
      
        if (recognitionRef.current) {
          try { recognitionRef.current.stop(); } catch {}
          recognitionRef.current.start();
        }
      };
      

    commandRecognition.start();
  };

  return (
    <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px' }}>
      <p style={{ whiteSpace: 'pre-wrap' }}>{status}</p>
      <button onClick={() => {
        if (!listening) {
          setStatus(`Attivato manualmente! Ora puoi dire i comandi, chiudi con 'fine libreria'.
Esempio:
"titolo Il signore degli anelli fine titolo
autore Tolkien fine autore
anno 1954 fine anno
genere Fantasy fine genere
fine libreria"`);
          setListening(true);
          startCommandRecognition();
        }
      }}>
        🎤 Attiva comando vocale
      </button>
    </div>
  );
};

export default VoiceAddBook;
