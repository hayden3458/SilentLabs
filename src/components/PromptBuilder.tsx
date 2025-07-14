import React, { useState } from 'react';
import './PromptLibrary.css';

const subjects = ['Math', 'Science', 'Literature', 'History', 'Art'];
const grades = ['Elementary', 'Middle', 'High', 'College'];
const promptTypes = [
  { id: 'question', label: 'Question', example: 'What is the capital of France?' },
  { id: 'creative', label: 'Creative', example: 'Write a short story about a time-traveling cat.' },
  { id: 'analysis', label: 'Analysis', example: 'Analyze the main theme of the poem.' },
  { id: 'explanation', label: 'Explanation', example: 'Explain the process of photosynthesis.' },
];

const PromptBuilder: React.FC = () => {
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState(subjects[0]);
  const [grade, setGrade] = useState(grades[0]);
  const [type, setType] = useState(promptTypes[0].id);
  const [details, setDetails] = useState('');
  const [builtPrompt, setBuiltPrompt] = useState('');

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleFinish = () => {
    const typeObj = promptTypes.find(t => t.id === type);
    const prompt = `${typeObj ? typeObj.label + ': ' : ''}${details} (Subject: ${subject}, Grade: ${grade})`;
    setBuiltPrompt(prompt);
    setStep(4);
  };

  return (
    <div className="prompt-library-container" style={{ maxWidth: 500 }}>
      <h2>Interactive Prompt Builder</h2>
      <div className="mb-4 flex items-center gap-2">
        {[1,2,3,4].map(n => (
          <div key={n} className={`w-6 h-2 rounded ${step === n ? 'bg-green-500' : 'bg-green-200'}`}></div>
        ))}
      </div>
      {step === 1 && (
        <div>
          <label className="block mb-2 font-semibold">Select Subject:</label>
          <select value={subject} onChange={e => setSubject(e.target.value)} className="mb-4 w-full p-2 rounded">
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="block mb-2 font-semibold">Select Grade:</label>
          <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full p-2 rounded">
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="flex justify-end mt-6">
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <label className="block mb-2 font-semibold">Choose Prompt Type:</label>
          <div className="mb-4">
            {promptTypes.map(pt => (
              <label key={pt.id} className="block mb-2 cursor-pointer">
                <input
                  type="radio"
                  name="promptType"
                  value={pt.id}
                  checked={type === pt.id}
                  onChange={() => setType(pt.id)}
                  className="mr-2"
                />
                {pt.label} <span className="text-gray-500 text-sm">(e.g., {pt.example})</span>
              </label>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={handleBack}>Back</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <label className="block mb-2 font-semibold">Enter Prompt Details:</label>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            rows={4}
            className="w-full p-2 rounded border"
            placeholder="Type your prompt details here..."
          />
          <div className="text-sm text-gray-500 mt-2">Tip: Be specific and clear. Example: "List three reasons why recycling is important."</div>
          <div className="flex justify-between mt-6">
            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={handleBack}>Back</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleFinish} disabled={!details.trim()}>Finish</button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div>
          <label className="block mb-2 font-semibold">Your Generated Prompt:</label>
          <div className="bg-white/80 text-gray-900 rounded p-4 mb-4 border border-green-200">
            {builtPrompt}
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => {navigator.clipboard.writeText(builtPrompt)}}
          >Copy</button>
          <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded" onClick={() => setStep(1)}>Build Another</button>
        </div>
      )}
    </div>
  );
};

export default PromptBuilder; 