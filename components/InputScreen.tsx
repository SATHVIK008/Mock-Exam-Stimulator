import React, { useState, useCallback } from 'react';
import { Question, SectionName } from '../types';
import { SECTIONS_ORDER, QUESTIONS_PER_SECTION } from '../constants';

interface InputScreenProps {
  onStartExam: (questions: Question[], sections: SectionName[]) => void;
}

type InputStep = 'select_count' | 'select_type' | 'input_form';

interface InputQuestion {
  question: string;
  options: [string, string, string, string];
  correctOptionIndex: number | null;
}

interface InputGroup {
  type: 'passage' | 'set' | 'standalone';
  passageText?: string;
  passageImage?: string;
  questions: InputQuestion[];
}


const InputScreen: React.FC<InputScreenProps> = ({ onStartExam }) => {
  const [step, setStep] = useState<InputStep>('select_count');
  const [sections, setSections] = useState<SectionName[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [questionGroups, setQuestionGroups] = useState<Record<SectionName, InputGroup[]>>({
      [SectionName.VARC]: [],
      [SectionName.LRDI]: [],
      [SectionName.QA]: [],
  });
  
  const [activeTab, setActiveTab] = useState<SectionName>(SectionName.VARC);
  
  const handleNumSectionsSelect = (num: 1 | 3) => {
    if (num === 3) {
      setSections(SECTIONS_ORDER);
      setActiveTab(SECTIONS_ORDER[0]);
      setStep('input_form');
    } else {
      setStep('select_type');
    }
  };

  const handleSectionTypeSelect = (type: SectionName) => {
    setSections([type]);
    setActiveTab(type);
    setStep('input_form');
  };
  
  const handleAddGroup = (section: SectionName, type: 'passage' | 'set' | 'standalone') => {
      setQuestionGroups(prev => ({
          ...prev,
          [section]: [...prev[section], { type, questions: [ { question: '', options: ['', '', '', ''], correctOptionIndex: null }] }]
      }));
  };
  
  const handleAddQuestionToGroup = (section: SectionName, groupIndex: number) => {
      const newGroups = {...questionGroups};
      newGroups[section][groupIndex].questions.push({ question: '', options: ['', '', '', ''], correctOptionIndex: null });
      setQuestionGroups(newGroups);
  };

  const handleDeleteGroup = (section: SectionName, groupIndex: number) => {
    if (window.confirm('Are you sure you want to delete this entire group and all its questions?')) {
        setQuestionGroups(prev => {
            const newGroups = {...prev};
            newGroups[section] = newGroups[section].filter((_, i) => i !== groupIndex);
            return newGroups;
        });
    }
  };

  const handleDeleteQuestion = (section: SectionName, groupIndex: number, qIndex: number) => {
      setQuestionGroups(prev => {
          const newGroups = {...prev};
          const group = newGroups[section][groupIndex];
          
          if (group.questions.length === 1) {
              newGroups[section] = newGroups[section].filter((_, i) => i !== groupIndex);
          } else {
              group.questions = group.questions.filter((_, i) => i !== qIndex);
          }
          return newGroups;
      });
  };
  
  const handleGroupChange = (section: SectionName, groupIndex: number, field: 'passageText', value: string) => {
      const newGroups = {...questionGroups};
      newGroups[section][groupIndex][field] = value;
      setQuestionGroups(newGroups);
  }

  const handleImageUpload = (section: SectionName, groupIndex: number, file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const newGroups = {...questionGroups};
          newGroups[section][groupIndex].passageImage = reader.result as string;
          setQuestionGroups(newGroups);
      };
      reader.readAsDataURL(file);
  };
  
  const handleQuestionChange = (section: SectionName, groupIndex: number, qIndex: number, field: 'question' | 'options' | 'correctOptionIndex', value: any) => {
      const newGroups = {...questionGroups};
      const question = newGroups[section][groupIndex].questions[qIndex];
      if (field === 'options') {
          question.options[value.index] = value.text;
      } else {
          (question[field] as any) = value;
      }
      setQuestionGroups(newGroups);
  };

  const validateAndStart = () => {
    setError(null);
    let finalQuestions: Question[] = [];
    let questionIdCounter = 1;

    for (const section of sections) {
        const groups = questionGroups[section];
        const questionCount = groups.reduce((acc, group) => acc + group.questions.length, 0);

        if (questionCount !== QUESTIONS_PER_SECTION) {
            setError(`Error: Section ${section} must have exactly ${QUESTIONS_PER_SECTION} questions. Found ${questionCount}.`);
            return;
        }

        for (const group of groups) {
            for (const q of group.questions) {
                if (!q.question.trim() || q.options.some(opt => !opt.trim()) || q.correctOptionIndex === null) {
                    setError(`Error in Section ${section}: One or more questions are incomplete. Please fill all fields and select a correct answer.`);
                    return;
                }
                finalQuestions.push({
                    id: questionIdCounter++,
                    question: q.question,
                    options: [...q.options].sort(() => Math.random() - 0.5), // Shuffle options for the exam
                    correct: q.options[q.correctOptionIndex],
                    section: section,
                    passage: group.passageText,
                    image: group.passageImage,
                });
            }
        }
    }
    onStartExam(finalQuestions, sections);
  };
  
  const renderInputForm = (section: SectionName) => {
    const isPassageBased = section === SectionName.VARC || section === SectionName.LRDI;
    const groups = questionGroups[section];
    const questionCount = groups.reduce((acc, group) => acc + group.questions.length, 0);
    let questionNumberOffset = 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div className="space-x-2">
                    {isPassageBased && <button onClick={() => handleAddGroup(section, section === SectionName.VARC ? 'passage' : 'set')} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Add {section === SectionName.VARC ? 'Passage' : 'Set'}</button>}
                    <button onClick={() => handleAddGroup(section, 'standalone')} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Add Standalone Question</button>
                </div>
                 <p className="font-bold text-gray-600">Questions: {questionCount} / {QUESTIONS_PER_SECTION}</p>
            </div>
            
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                {groups.map((group, gIndex) => {
                    const groupElement = (
                    <div key={gIndex} className="bg-gray-100 p-4 rounded-lg border relative">
                        <button
                            onClick={() => handleDeleteGroup(section, gIndex)}
                            title="Delete entire group"
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl leading-none p-1 z-10"
                        >&times;</button>

                        {group.type !== 'standalone' && (
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg mb-2">{section === SectionName.VARC ? `Passage ${gIndex + 1}` : `Set ${gIndex + 1}`}</h3>
                                {section === SectionName.VARC && <textarea placeholder="Enter passage text here..." className="w-full h-24 p-2 border rounded" value={group.passageText || ''} onChange={e => handleGroupChange(section, gIndex, 'passageText', e.target.value)} />}
                                {section === SectionName.LRDI && (
                                    <div>
                                        <textarea placeholder="Enter set description here..." className="w-full h-16 p-2 border rounded mb-2" value={group.passageText || ''} onChange={e => handleGroupChange(section, gIndex, 'passageText', e.target.value)} />
                                        <label className="block text-sm font-medium text-gray-700">Upload Image/Table for Set:</label>
                                        <input type="file" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" onChange={e => e.target.files && handleImageUpload(section, gIndex, e.target.files[0])}/>
                                        {group.passageImage && <img src={group.passageImage} alt="preview" className="mt-2 rounded max-h-40"/>}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-4">
                        {group.questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-white p-3 rounded border border-gray-300 relative">
                                <button
                                    onClick={() => handleDeleteQuestion(section, gIndex, qIndex)}
                                    title="Delete this question"
                                    className="absolute top-1 right-2 text-gray-400 hover:text-red-600 font-semibold"
                                >&times;</button>
                                <label className="font-semibold block mb-1 pr-6">Question {questionNumberOffset + qIndex + 1}:</label>
                                <input type="text" placeholder="Question text" className="w-full p-2 border rounded" value={q.question} onChange={e => handleQuestionChange(section, gIndex, qIndex, 'question', e.target.value)} />
                                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {q.options.map((opt, optIndex) => (
                                        <div key={optIndex} className="flex items-center">
                                            <input type="radio" name={`correct_${gIndex}_${qIndex}`} checked={q.correctOptionIndex === optIndex} onChange={() => handleQuestionChange(section, gIndex, qIndex, 'correctOptionIndex', optIndex)} className="mr-2 h-4 w-4 text-blue-600"/>
                                            <input type="text" placeholder={`Option ${optIndex + 1}`} className="w-full p-2 border rounded" value={opt} onChange={e => handleQuestionChange(section, gIndex, qIndex, 'options', {index: optIndex, text: e.target.value})} />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-right">Click the circle to mark the correct answer.</p>
                            </div>
                        ))}
                        </div>
                        {group.type !== 'standalone' && <button onClick={() => handleAddQuestionToGroup(section, gIndex)} className="mt-4 text-blue-600 font-semibold text-sm hover:underline">+ Add another question to this {group.type}</button>}
                    </div>
                    );
                    questionNumberOffset += group.questions.length;
                    return groupElement;
                })}
            </div>
        </div>
    );
  }

  const renderContent = () => {
    switch (step) {
      case 'select_count':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Choose Exam Type</h2>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleNumSectionsSelect(1)} className="px-8 py-4 bg-white border-2 border-blue-500 text-blue-500 font-bold rounded-lg shadow-md hover:bg-blue-50 transition-transform transform hover:scale-105">Sectional Test (1 Section)</button>
              <button onClick={() => handleNumSectionsSelect(3)} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">Full Mock Test (3 Sections)</button>
            </div>
          </div>
        );
      case 'select_type':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Select Section</h2>
            <div className="flex justify-center gap-4">
                {SECTIONS_ORDER.map(section => (
                    <button key={section} onClick={() => handleSectionTypeSelect(section)} className="px-8 py-4 bg-white border-2 border-purple-500 text-purple-500 font-bold rounded-lg shadow-md hover:bg-purple-50 transition-transform transform hover:scale-105">{section}</button>
                ))}
            </div>
          </div>
        );
      case 'input_form':
        return (
          <>
            {sections.length > 1 && (
                <div className="mb-4 border-b">
                    <nav className="-mb-px flex space-x-6">
                    {sections.map(sec => (
                        <button key={sec} onClick={() => setActiveTab(sec)} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === sec ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {sec}
                        </button>
                    ))}
                    </nav>
                </div>
            )}
            {renderInputForm(activeTab)}
            {error && <p className="text-red-600 mt-4 text-center font-semibold">{error}</p>}
            <button
              onClick={validateAndStart}
              className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
            >
              Start Exam
            </button>
          </>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-2">CAT Exam Simulator Setup</h1>
        <p className="text-center text-gray-500 mb-6">Create your custom mock test.</p>
        {renderContent()}
      </div>
    </div>
  );
};

export default InputScreen;