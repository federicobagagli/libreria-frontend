import React, { useEffect, useRef, useState } from 'react';

const VoiceAddBook = ({ onFieldDetected, submitButtonRef }) => {
  const [status, setStatus] = useState("In attesa di comandi vocali...");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const commandBuffer = useRef("");

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Il tuo browser non supporta il riconoscimento vocale.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'it-IT';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("DEBUG transcript:", transcript);

      if (transcript.includes("ok libreria") && !listening) {
        setStatus(`Attivato! Ora puoi dire i comandi, chiudi con 'fine libreria'.\nEsempio:
"titolo Il signore degli anelli fine titolo
autore Tolkien fine autore
anno 1954 fine anno
genere Fantasy fine genere
fine libreria"`);
        setListening(true);
        return;
      }

      if (transcript.includes("salva libro") || transcript.includes("conferma inserimento")) {
        console.log("DEBUG: salva libro rilevato!");
        if (submitButtonRef?.current) {
          submitButtonRef.current.click();
        }
        return;
      }

      if (listening) {
        commandBuffer.current += " " + transcript;
        console.log("DEBUG buffer:", commandBuffer.current);

        if (commandBuffer.current.includes("fine libreria")) {
          processBufferedCommands();
        }
      }
    };

    recognition.onerror = (e) => {
      console.error("Errore riconoscimento:", e);
    };

    try {
      recognition.start();
    } catch (err) {
      console.warn("Errore avvio riconoscimento:", err);
    }

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch {}
    };
  }, [listening, submitButtonRef]);

  const processBufferedCommands = () => {
    const str = commandBuffer.current;

    const matchTitle = str.match(/titolo\s+(.*?)(?=\s+fine titolo)/i);
    const matchAuthor = str.match(/autore\s+(.*?)(?=\s+fine autore)/i);
    const matchAnno = str.match(/anno\s+(\d{4}|\d{8})(?=\s+fine anno)/i);
    const matchGenere = str.match(/genere\s+(.*?)(?=\s+fine genere)/i);

    const titolo = matchTitle?.[1]?.trim() ?? "";
    const autore = matchAuthor?.[1]?.trim() ?? "";
    const anno = matchAnno?.[1]?.trim() ?? "";
    const genere = matchGenere?.[1]?.trim() ?? "";

    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);
    if (titolo) onFieldDetected('title', capitalize(titolo));
    if (autore) onFieldDetected('author', capitalize(autore));
    if (genere) onFieldDetected('genre', capitalize(genere));

    if (anno) {
      let dateObj = null;
      if (/^\d{4}$/.test(anno)) {
        dateObj = new Date(parseInt(anno), 0, 1);
      } else if (/^\d{8}$/.test(anno)) {
        const y = parseInt(anno.substring(0,4));
        const m = parseInt(anno.substring(4,6)) - 1;
        const d = parseInt(anno.substring(6,8));
        dateObj = new Date(y, m, d);
      }
      if (dateObj && !isNaN(dateObj.getTime())) {
        onFieldDetected('publishDate', dateObj);
      }
    }

    setStatus(`Comando completato: Titolo: ${titolo}, Autore: ${autore}, Anno: ${anno}, Genere: ${genere}`);
    commandBuffer.current = "";
    setListening(false);
  };

  return (
    <div style={{ marginTop: '20px', backgroundColor: '#f0f0f0', padding: '10px' }}>
      <p style={{ whiteSpace: 'pre-wrap' }}>{status}</p>
      <p style={{ fontSize: '12px', color: '#555' }}>
        ✅ Puoi dire:
        <br />– <strong>"ok libreria"</strong> per iniziare a dettare i dati
        <br />– <strong>"salva libro"</strong> o <strong>"conferma inserimento"</strong> per salvare
        <br />– Ricorda di dire <strong>"fine titolo"</strong>, <strong>"fine autore"</strong>, ecc. dopo ogni campo
      </p>
      <button onClick={() => {
        if (!listening) {
          setStatus(`Attivato manualmente! Ora puoi dire i comandi, chiudi con 'fine libreria'.\nEsempio:
"titolo Il signore degli anelli fine titolo
autore Tolkien fine autore
anno 1954 fine anno
genere Fantasy fine genere
fine libreria"`);
          setListening(true);
        }
      }}>
        🎤 Attiva comando vocale
      </button>
    </div>
  );
};

export default VoiceAddBook;
