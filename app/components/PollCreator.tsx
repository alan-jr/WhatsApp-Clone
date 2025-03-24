import React, { useState } from 'react';
import { Plus, Minus, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PollCreatorProps {
  onCreatePoll: (poll: {
    question: string;
    options: string[];
    expiresIn: number;
  }) => void;
  onCancel: () => void;
}

export const PollCreator: React.FC<PollCreatorProps> = ({
  onCreatePoll,
  onCancel,
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [expiresIn, setExpiresIn] = useState(24); // hours

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (question.trim() && options.every(opt => opt.trim())) {
      onCreatePoll({
        question,
        options: options.map(opt => opt.trim()),
        expiresIn,
      });
    }
  };

  return (
    <div className="p-4 bg-background border rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Create a Poll</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Question
          </label>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Options
          </label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {options.length < 10 && (
            <Button
              variant="ghost"
              className="mt-2"
              onClick={addOption}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Poll Duration
          </label>
          <select
            value={expiresIn}
            onChange={(e) => setExpiresIn(Number(e.target.value))}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value={1}>1 hour</option>
            <option value={6}>6 hours</option>
            <option value={12}>12 hours</option>
            <option value={24}>24 hours</option>
            <option value={48}>48 hours</option>
            <option value={72}>72 hours</option>
            <option value={168}>1 week</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!question.trim() || !options.every(opt => opt.trim())}
          >
            <Send className="w-4 h-4 mr-2" />
            Create Poll
          </Button>
        </div>
      </div>
    </div>
  );
}; 