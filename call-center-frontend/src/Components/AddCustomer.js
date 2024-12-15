import React, { useState,useRef  } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import AudioContext from 'audio-context';
import { jsPDF } from "jspdf";
import { saveAs } from 'file-saver';

const AddCustomer = () => {
   const navigate = useNavigate();
  const getUserCookie = () => {
    const user = Cookies.get('user');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  };
  const user = getUserCookie();
  

    const defaultValue = {
        name: "",
        age: 0,
        email:"",
        phone:"",
        address:"",
        agentUsername:user ?user.username:"",

  };
  
  const [customerData, setcustomerData] = useState(defaultValue);
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setcustomerData((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const handleSubmit = async () => {
    if (
      customerData.name !== "" &&
      customerData.age > 0 &&
      customerData.email !== "" &&
      customerData.phone !== "" &&
      customerData.address !== "" &&
      customerData.agentUsername !== ""
    ) {
      const response = await fetch("http://localhost:5000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerData.name,
          age: parseInt(customerData.age, 10),
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          agentUsername: customerData.agentUsername,
        }),
      });
  
      if (response.ok) {
        // Create PDF
        const doc = new jsPDF();
  
        // Add content to the PDF
        doc.text("Customer Information", 20, 20);
        doc.text(`Name: ${customerData.name}`, 20, 30);
        doc.text(`Age: ${customerData.age}`, 20, 40);
        doc.text(`Email: ${customerData.email}`, 20, 50);
        doc.text(`Phone: ${customerData.phone}`, 20, 60);
        doc.text(`Address: ${customerData.address}`, 20, 70);
        doc.text(`Agent Name: ${user.name}`, 20, 80);
  
        // Generate the PDF as a Blob
      const pdfBlob = doc.output('blob');

      // Use file-saver to download the file
      saveAs(pdfBlob, "customer_data.pdf");

  
        console.log("Added Successfully");
  
        // Reset form data
        setcustomerData(defaultValue);
  
        // Navigate to another page (if needed)
        navigate("/agent");
      } else {
        console.error("Error adding customer data");
      }
    } else {
      console.log("Please fill in all fields.");
    }
  };


 
  

  const convertAudioToPCM16 = async (audioBlob) => {
    // Create an audio context to handle the conversion
    const audioContext = new AudioContext({ sampleRate: 44100 });
    
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Create a WAV file in PCM format
    const pcmData = audioBuffer.getChannelData(0); // Assuming mono audio
    const wavBuffer = encodeWAV(pcmData, audioBuffer.sampleRate);

    // Create a new Blob from the WAV buffer and return it as a File
    const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
    const wavFile = new File([wavBlob], 'converted_audio.wav', { type: 'audio/wav' });

    return wavFile;
};

// Helper function to encode PCM data as WAV
const encodeWAV = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // PCM format
    view.setUint16(20, 1, true);  // Linear PCM
    view.setUint16(22, 1, true);  // Mono audio
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // Byte rate
    view.setUint16(32, 2, true);  // Block align
    view.setUint16(34, 16, true); // 16-bit
    writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return buffer;
};

const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};


  
  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

                    // Convert the audio to the desired format (PCM 16-bit, 44.1 kHz)
                    const convertedAudioFile = await convertAudioToPCM16(audioBlob);

                    // Set the converted audio file for upload
                    setAudioFile(convertedAudioFile);
                    setAudioBlob(audioBlob);
                    setAudioURL(URL.createObjectURL(audioBlob));
                    audioChunksRef.current = [];
                };

                mediaRecorderRef.current.start();
                setIsRecording(true);
            })
            .catch((error) => {
                console.error('Error accessing media devices:', error);
            });
    }
};


  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleAudioUpload = async () => {
    console.log("Start")
    console.log("Audio file:",audioFile)
    if (audioFile) {
      const formData = new FormData();
      formData.append('audio', audioFile);
      console.log(formData)
      const response = await fetch('http://localhost:5000/api/agent/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.transcription) {
        setTranscription(result.transcription);
      }
      console.log("done")
    }
  };

  const handleTranscriptiontoFilling=async ()=>{
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body:JSON.stringify({
        "model": "llama3-8b-8192",
        "messages": [{
        "role": "user",
        "content": `Extract phone number, address, name, email and age if present from the following sentences and only give the labels and answer in response. Give the responce in the format. NAME: name, ADDRESS: address, PHONE: phone number, EMAIL: email, AGE: age.Here is the sentence ${transcription}`
        }]
      })
    })
    const data = await response.json();
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      const extractedData = {};

      // Split the response content by commas
      const items = content.split(',');

      // Loop through each item, and split by colon to separate label and value
      items.forEach(item => {
        const [label, value] = item.split(':').map(str => str.trim());
        if (label && value) {
          // Store the extracted value in the object
          extractedData[label] = value;
          setcustomerData((prev) => {
            return { ...prev, [label.toLowerCase()]: value };
          });
        }
      });

      console.log('Extracted Data:', extractedData);
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
    },
  });
  return (
    <>
    <div className="p-6 bg-gray-100 min-h-screen">
    <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Add Customer Details
          </h2>
      {/* Audio Upload Section */}
      <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Insert Audio (Drag & Drop or Select or Record)
          </h3>
          <div
            {...getRootProps({
              className:
                "w-full p-6 border-2 border-dashed border-gray-300 rounded-lg bg-white text-center cursor-pointer",
            })}
          >
            <input {...getInputProps()} />
            <p className="text-gray-500">
              {audioFile ? audioFile.name : "Drag and drop an audio file here, or click to select one"}
            </p>
          </div>

          {/* Recording Buttons */}
          <div className="flex justify-center space-x-4 mt-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 transition"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-500 text-white rounded-lg px-6 py-2 hover:bg-red-600 transition"
              >
                Stop Recording
              </button>
            )}
          </div>

          {/* Display audio player if a file is uploaded or recorded */}
          {audioURL && (
            <>
              <audio controls className="w-full mt-4">
                <source src={audioURL} type={audioFile ? audioFile.type : "audio/wav"} />
                Your browser does not support the audio element.
              </audio>
              <button
                onClick={handleAudioUpload}
                className="bg-green-500 mt-5 text-white rounded-lg px-6 py-2 hover:bg-green-600 transition"
              >
                Convert Audio to Text
              </button>
            </>
          )}
        </div>

    
       {/* Transcription Display */}
       {transcription && (
           <div className="bg-gray-100 p-4 rounded-md mb-6">
             <h4 className="font-semibold text-gray-700 mb-2">Transcription:</h4>
             <p className="text-gray-800">{transcription}</p>
             <button
                onClick={handleTranscriptiontoFilling}
                className="bg-green-500 mt-5 text-white rounded-lg px-6 py-2 hover:bg-green-600 transition"
              >
                AutoFill
              </button>
           </div>
         )}

          {/* Form Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1">
            <label className="block text-gray-600 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={customerData.name}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={customerData.age}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex-1">
            <label className="block text-gray-600 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={`${customerData.email}@gmail.com`}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-600 font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={customerData.phone}
              onChange={handleChange}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={customerData.address}
            onChange={handleChange}
            className="w-full p-3 border-2 border-gray-300 rounded-md focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate("/agent")}
          className="bg-gray-300 text-gray-800 rounded-lg px-6 py-2 hover:bg-gray-400 transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          id="addCustomer"
          className="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600 transition"
        >
          Add & Save Pdf
        </button>
      </div>
    </div>
    </>
  );
};

export default AddCustomer;
