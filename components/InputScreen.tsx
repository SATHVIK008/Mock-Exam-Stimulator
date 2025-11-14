import React, { useState } from 'react';
import { Question, SectionName } from '../types';
import { SECTIONS_ORDER, QUESTIONS_PER_SECTION } from '../constants';

const DEFAULT_VARC_TEXT = `[PASSAGE START]
This is the first VARC passage. It contains several sentences to test reading comprehension. The main idea is often subtle and requires careful reading of the entire text.
[Q] What is the primary purpose of Passage 1?
[O] To inform
[O] To persuade
[O] To entertain
[O] To describe
[C] To describe
[Q] Which of the following is stated in Passage 1?
[O] Fact A
[O] Fact B
[O] Fact C
[O] Fact D
[C] Fact A
[Q] The author of Passage 1 would most likely agree with which statement?
[O] Agreement A
[O] Agreement B
[O] Agreement C
[O] Agreement D
[C] Agreement C
[Q] What is the tone of Passage 1?
[O] Optimistic
[O] Pessimistic
[O] Neutral
[O] Sarcastic
[C] Neutral
[PASSAGE END]

[PASSAGE START]
This is the second VARC passage, focusing on a different topic. It might present an argument or a narrative.
[Q] What is the main argument in Passage 2?
[O] Argument A
[O] Argument B
[O] Argument C
[O] Argument D
[C] Argument B
[Q] The word "subtle" in Passage 2 most nearly means:
[O] Obvious
[O] Delicate
[O] Loud
[O] Harsh
[C] Delicate
[Q] What does Passage 2 imply about its subject?
[O] Implication A
[O] Implication B
[O] Implication C
[O] Implication D
[C] Implication D
[Q] Which is the best summary for Passage 2?
[O] Summary A
[O] Summary B
[O] Summary C
[O] Summary D
[C] Summary A
[PASSAGE END]

[PASSAGE START]
This is the third VARC passage. It is slightly more complex than the previous ones and may use advanced vocabulary.
[Q] Question 1 for Passage 3.
[O] P3Q1 O1
[O] P3Q1 O2
[O] P3Q1 O3
[O] P3Q1 O4
[C] P3Q1 O2
[Q] Question 2 for Passage 3.
[O] P3Q2 O1
[O] P3Q2 O2
[O] P3Q2 O3
[O] P3Q2 O4
[C] P3Q2 O3
[Q] Question 3 for Passage 3.
[O] P3Q3 O1
[O] P3Q3 O2
[O] P3Q3 O3
[O] P3Q3 O4
[C] P3Q3 O4
[Q] Question 4 for Passage 3.
[O] P3Q4 O1
[O] P3Q4 O2
[O] P3Q4 O3
[O] P3Q4 O4
[C] P3Q4 O1
[PASSAGE END]

[PASSAGE START]
This is the fourth and final VARC passage for this section.
[Q] Question 1 for Passage 4.
[O] P4Q1 O1
[O] P4Q1 O2
[O] P4Q1 O3
[O] P4Q1 O4
[C] P4Q1 O3
[Q] Question 2 for Passage 4.
[O] P4Q2 O1
[O] P4Q2 O2
[O] P4Q2 O3
[O] P4Q2 O4
[C] P4Q2 O2
[Q] Question 3 for Passage 4.
[O] P4Q3 O1
[O] P4Q3 O2
[O] P4Q3 O3
[O] P4Q3 O4
[C] P4Q3 O1
[Q] Question 4 for Passage 4.
[O] P4Q4 O1
[O] P4Q4 O2
[O] P4Q4 O3
[O] P4Q4 O4
[C] P4Q4 O4
[PASSAGE END]

[Q] Standalone Question 1 (e.g., Para Jumble).
[O] Option A
[O] Option B
[O] Option C
[O] Option D
[C] Option A
[Q] Standalone Question 2 (e.g., Para Summary).
[O] Option A
[O] Option B
[O] Option C
[O] Option D
[C] Option B
[Q] Standalone Question 3.
[O] Option A
[O] Option B
[O] Option C
[O] Option D
[C] Option C
[Q] Standalone Question 4.
[O] Option A
[O] Option B
[O] Option C
[O] Option D
[C] Option D
[Q] Standalone Question 5.
[O] Option A
[O] Option B
[O] Option C
[O] Option D
[C] Option A
[Q] Standalone Question 6.
[O] Option A
[O] Option B
[O] Option C
[O] Option D
[C] Option B
[Q] Standalone Question 7.
[O] Option A
[O] Option B
[O] Option C
[O] Option D
[C] Option C
[Q] Standalone Question 8.
[O] Option A
[O] Option B
[O] Option C
[O] Option D
[C] Option D
`;

const DEFAULT_LRDI_TEXT = `[SET START]
This is the first LRDI set. It describes a scenario about people sitting around a circular table.
[Q] Question 1 for Set 1.
[O] S1Q1 O1
[O] S1Q1 O2
[O] S1Q1 O3
[O] S1Q1 O4
[C] S1Q1 O1
[Q] Question 2 for Set 1.
[O] S1Q2 O1
[O] S1Q2 O2
[O] S1Q2 O3
[O] S1Q2 O4
[C] S1Q2 O2
[Q] Question 3 for Set 1.
[O] S1Q3 O1
[O] S1Q3 O2
[O] S1Q3 O3
[O] S1Q3 O4
[C] S1Q3 O3
[Q] Question 4 for Set 1.
[O] S1Q4 O1
[O] S1Q4 O2
[O] S1Q4 O3
[O] S1Q4 O4
[C] S1Q4 O4
[SET END]

[SET START]
This is the second LRDI set. It contains a table of data to be interpreted.
[IMAGE]data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACvSURBVHhe7dZBCoAwDATB/f+l9cQFEy4g5yDKxU4khS1g7g4AKpmgAGmSQAGSJgESpEkCJEiaBEiQNgmQIG0SIEG6JECCdEmABOmSAAnSmAAp0iUBEqRLAkygEwJMoBMCTKATAsxg2ARMoBMCTKATAsxg2ARMoBMCTKATAsxg2ATMoBMCTKATAsxg2ATMoBMCTKATAsyg+fAD4g9I/LVw9g/4gR8wYIImSJA2CZAgXRJgAP0DAwMIZNz0f14UAAAAAElFTkSuQmCC[IMAGE END]
[Q] Based on the image, what is the value for Category A?
[O] 10
[O] 20
[O] 30
[O] 40
[C] 20
[Q] What is the trend shown in the image?
[O] Increasing
[O] Decreasing
[O] Stable
[O] Fluctuating
[C] Increasing
[Q] Question 3 for Set 2.
[O] S2Q3 O1
[O] S2Q3 O2
[O] S2Q3 O3
[O] S2Q3 O4
[C] S2Q3 O3
[Q] Question 4 for Set 2.
[O] S2Q4 O1
[O] S2Q4 O2
[O] S2Q4 O3
[O] S2Q4 O4
[C] S2Q4 O4
[SET END]

[SET START]
This is the third LRDI set.
[Q] Question 1 for Set 3.
[O] S3Q1 O1
[O] S3Q1 O2
[O] S3Q1 O3
[O] S3Q1 O4
[C] S3Q1 O1
[Q] Question 2 for Set 3.
[O] S3Q2 O1
[O] S3Q2 O2
[O] S3Q2 O3
[O] S3Q2 O4
[C] S3Q2 O2
[Q] Question 3 for Set 3.
[O] S3Q3 O1
[O] S3Q3 O2
[O] S3Q3 O3
[O] S3Q3 O4
[C] S3Q3 O3
[Q] Question 4 for Set 3.
[O] S3Q4 O1
[O] S3Q4 O2
[O] S3Q4 O3
[O] S3Q4 O4
[C] S3Q4 O4
[SET END]

[SET START]
This is the fourth LRDI set.
[Q] Question 1 for Set 4.
[O] S4Q1 O1
[O] S4Q1 O2
[O] S4Q1 O3
[O] S4Q1 O4
[C] S4Q1 O1
[Q] Question 2 for Set 4.
[O] S4Q2 O1
[O] S4Q2 O2
[O] S4Q2 O3
[O] S4Q2 O4
[C] S4Q2 O2
[Q] Question 3 for Set 4.
[O] S4Q3 O1
[O] S4Q3 O2
[O] S4Q3 O3
[O] S4Q3 O4
[C] S4Q3 O3
[Q] Question 4 for Set 4.
[O] S4Q4 O1
[O] S4Q4 O2
[O] S4Q4 O3
[O] S4Q4 O4
[C] S4Q4 O4
[SET END]

[SET START]
This is the fifth LRDI set.
[Q] Question 1 for Set 5.
[O] S5Q1 O1
[O] S5Q1 O2
[O] S5Q1 O3
[O] S5Q1 O4
[C] S5Q1 O1
[Q] Question 2 for Set 5.
[O] S5Q2 O1
[O] S5Q2 O2
[O] S5Q2 O3
[O] S5Q2 O4
[C] S5Q2 O2
[Q] Question 3 for Set 5.
[O] S5Q3 O1
[O] S5Q3 O2
[O] S5Q3 O3
[O] S5Q3 O4
[C] S5Q3 O3
[Q] Question 4 for Set 5.
[O] S5Q4 O1
[O] S5Q4 O2
[O] S5Q4 O3
[O] S5Q4 O4
[C] S5Q4 O4
[SET END]

[SET START]
This is the sixth LRDI set.
[Q] Question 1 for Set 6.
[O] S6Q1 O1
[O] S6Q1 O2
[O] S6Q1 O3
[O] S6Q1 O4
[C] S6Q1 O1
[Q] Question 2 for Set 6.
[O] S6Q2 O1
[O] S6Q2 O2
[O] S6Q2 O3
[O] S6Q2 O4
[C] S6Q2 O2
[Q] Question 3 for Set 6.
[O] S6Q3 O1
[O] S6Q3 O2
[O] S6Q3 O3
[O] S6Q3 O4
[C] S6Q3 O3
[Q] Question 4 for Set 6.
[O] S6Q4 O1
[O] S6Q4 O2
[O] S6Q4 O3
[O] S6Q4 O4
[C] S6Q4 O4
[SET END]
`;

const DEFAULT_QA_TEXT = `[Q] QA Question 1
[O] 10
[O] 20
[O] 30
[O] 40
[C] 20
[Q] QA Question 2
[O] 10
[O] 20
[O] 30
[O] 40
[C] 30
[Q] QA Question 3
[O] 10
[O] 20
[O] 30
[O] 40
[C] 40
[Q] QA Question 4
[O] 10
[O] 20
[O] 30
[O] 40
[C] 10
[Q] QA Question 5
[O] 10
[O] 20
[O] 30
[O] 40
[C] 20
[Q] QA Question 6
[O] 10
[O] 20
[O] 30
[O] 40
[C] 30
[Q] QA Question 7
[O] 10
[O] 20
[O] 30
[O] 40
[C] 40
[Q] QA Question 8
[O] 10
[O] 20
[O] 30
[O] 40
[C] 10
[Q] QA Question 9
[O] 10
[O] 20
[O] 30
[O] 40
[C] 20
[Q] QA Question 10
[O] 10
[O] 20
[O] 30
[O] 40
[C] 30
[Q] QA Question 11
[O] 10
[O] 20
[O] 30
[O] 40
[C] 40
[Q] QA Question 12
[O] 10
[O] 20
[O] 30
[O] 40
[C] 10
[Q] QA Question 13
[O] 10
[O] 20
[O] 30
[O] 40
[C] 20
[Q] QA Question 14
[O] 10
[O] 20
[O] 30
[O] 40
[C] 30
[Q] QA Question 15
[O] 10
[O] 20
[O] 30
[O] 40
[C] 40
[Q] QA Question 16
[O] 10
[O] 20
[O] 30
[O] 40
[C] 10
[Q] QA Question 17
[O] 10
[O] 20
[O] 30
[O] 40
[C] 20
[Q] QA Question 18
[O] 10
[O] 20
[O] 30
[O] 40
[C] 30
[Q] QA Question 19
[O] 10
[O] 20
[O] 30
[O] 40
[C] 40
[Q] QA Question 20
[O] 10
[O] 20
[O] 30
[O] 40
[C] 10
[Q] QA Question 21
[O] 10
[O] 20
[O] 30
[O] 40
[C] 20
[Q] QA Question 22
[O] 10
[O] 20
[O] 30
[O] 40
[C] 30
[Q] QA Question 23
[O] 10
[O] 20
[O] 30
[O] 40
[C] 40
[Q] QA Question 24
[O] 10
[O] 20
[O] 30
[O] 40
[C] 10
`;

interface InputScreenProps {
  onStartExam: (questions: Question[], sections: SectionName[]) => void;
}

type InputStep = 'select_count' | 'select_type' | 'input_form';

const InputScreen: React.FC<InputScreenProps> = ({ onStartExam }) => {
  const [step, setStep] = useState<InputStep>('select_count');
  const [sections, setSections] = useState<SectionName[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [rawTextInputs, setRawTextInputs] = useState<Record<SectionName, string>>({
      [SectionName.VARC]: DEFAULT_VARC_TEXT,
      [SectionName.LRDI]: DEFAULT_LRDI_TEXT,
      [SectionName.QA]: DEFAULT_QA_TEXT,
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
  
  const parseAndValidate = () => {
    setError(null);
    let finalQuestions: Question[] = [];
    let questionIdCounter = 1;

    try {
        for (const section of sections) {
            const text = rawTextInputs[section];
            if (!text.trim()) {
                throw new Error(`Input for section ${section} is empty.`);
            }

            const sectionQuestions: Question[] = [];
            const passageRegex = /\[PASSAGE START\]([\s\S]*?)\[PASSAGE END\]|\[SET START\]([\s\S]*?)\[SET END\]/g;
            let lastIndex = 0;
            let match;

            while ((match = passageRegex.exec(text)) !== null) {
                // Process standalone questions before this match
                const standaloneText = text.substring(lastIndex, match.index);
                if (standaloneText.trim()) {
                    sectionQuestions.push(...parseQuestions(standaloneText, section, null, null));
                }
                
                // Process passage/set
                const isPassage = !!match[1];
                const content = isPassage ? match[1] : match[2];
                const { context, image } = extractContext(content, isPassage);
                sectionQuestions.push(...parseQuestions(content, section, context, image));

                lastIndex = match.index + match[0].length;
            }

            // Process remaining standalone questions
            const remainingText = text.substring(lastIndex);
            if (remainingText.trim()) {
                sectionQuestions.push(...parseQuestions(remainingText, section, null, null));
            }

            if (sectionQuestions.length !== QUESTIONS_PER_SECTION) {
                throw new Error(`Section ${section} must have exactly ${QUESTIONS_PER_SECTION} questions. Found ${sectionQuestions.length}.`);
            }
            
            finalQuestions.push(...sectionQuestions);
        }

        // Assign final IDs
        finalQuestions.forEach(q => q.id = questionIdCounter++);

        onStartExam(finalQuestions, sections);

    } catch (e: any) {
        setError(e.message);
    }
  };

  const extractContext = (content: string, isPassage: boolean) => {
    const imageRegex = /\[IMAGE\](.*?)\[IMAGE END\]/;
    const imageMatch = content.match(imageRegex);
    let image: string | null = null;
    let context = content;

    if (imageMatch) {
        image = imageMatch[1].trim();
        context = context.replace(imageRegex, '').trim();
    }
    
    // For passages, the context is the whole content block minus questions. For sets, it's the description part.
    const questionStart = context.indexOf('[Q]');
    context = questionStart !== -1 ? context.substring(0, questionStart).trim() : context.trim();

    return { context: isPassage ? context : (context || null), image };
  };

  const parseQuestions = (block: string, section: SectionName, passage: string | null, image: string | null): Question[] => {
      const questions: Question[] = [];
      const questionBlocks = block.split('[Q]').slice(1);

      if(questionBlocks.length === 0 && block.includes('[Q]')) { // handle case where [Q] is at start
          questionBlocks.push(block.substring(block.indexOf('[Q]') + 3));
      }

      for (const qBlock of questionBlocks) {
          const lines = qBlock.trim().split('\n').filter(l => l.trim());
          const questionText = lines.shift()?.trim();
          if (!questionText) continue;

          const options: string[] = [];
          let correct = '';

          for (const line of lines) {
              if (line.startsWith('[O]')) {
                  options.push(line.substring(3).trim());
              } else if (line.startsWith('[C]')) {
                  correct = line.substring(3).trim();
              }
          }

          if (options.length < 2) { // Allow for para jumbles etc. with fewer options, but CAT usually has 4. Let's keep it flexible but error for 0/1.
               throw new Error(`Parsing Error in ${section}: A question must have at least 2 options. Found: "${questionText}" with ${options.length} options.`);
          }
          if (!correct) {
              throw new Error(`Parsing Error in ${section}: Correct answer [C] not specified for question: "${questionText}"`);
          }
          if (!options.includes(correct)) {
              throw new Error(`Parsing Error in ${section}: Correct answer "${correct}" is not listed as an option for question: "${questionText}"`);
          }
          
          questions.push({
              id: 0, // temporary ID
              question: questionText,
              options: [...options].sort(() => Math.random() - 0.5), // Shuffle options
              correct,
              section,
              passage,
              image,
          });
      }
      return questions;
  };
  
  const renderInputForm = (section: SectionName) => {
    const questionCount = (rawTextInputs[section].match(/\[Q\]/g) || []).length;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-700">{section} Questions</h3>
                <p className="font-bold text-gray-600">Questions Detected: {questionCount} / {QUESTIONS_PER_SECTION}</p>
            </div>
            
            <textarea
                value={rawTextInputs[section]}
                onChange={e => setRawTextInputs(prev => ({...prev, [section]: e.target.value}))}
                placeholder={`Paste all questions for ${section} here...`}
                className="w-full h-64 p-3 border rounded-lg font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
            
            <details className="mt-4 text-sm">
                <summary className="cursor-pointer font-semibold text-blue-600 hover:underline">Formatting Help</summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-lg text-gray-700">
                    <p className="font-bold mb-2">Use these tags to format your questions:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><code>[PASSAGE START]...[PASSAGE END]</code>: For VARC passages. Place related questions inside.</li>
                        <li><code>[SET START]...[SET END]</code>: For LRDI sets. Place related questions inside.</li>
                        <li><code>[IMAGE]...[IMAGE END]</code>: Inside a SET, paste the base64 string of your image.</li>
                        <li><code>[Q]</code>: Marks the beginning of a question's text.</li>
                        <li><code>[O]</code>: Marks one of the options.</li>
                        <li><code>[C]</code>: Marks the correct answer. The text must match one of the [O] options.</li>
                    </ul>
                    <pre className="mt-3 p-2 bg-white rounded text-xs overflow-x-auto">
{`[PASSAGE START]
This is the reading passage text. All questions for this passage must go in here.
[Q] What is the main idea?
[O] Option A
[O] Option B
[C] Option B
[Q] Another question on the same passage.
[O] Yes
[O] No
[C] Yes
[PASSAGE END]

[Q] This is a standalone question...
[O] 1
[O] 2
[C] 1
`}
                    </pre>
                </div>
            </details>
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
            {error && <p className="text-red-600 mt-4 text-center font-semibold bg-red-100 p-3 rounded-lg">{error}</p>}
            <button
              onClick={parseAndValidate}
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
        <p className="text-center text-gray-500 mb-6">Create your custom mock test by pasting formatted questions.</p>
        {renderContent()}
      </div>
    </div>
  );
};

export default InputScreen;
