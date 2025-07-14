import React from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
  icon: string;
}

interface PromptTemplatesProps {
  onSelectTemplate: (template: string) => void;
  selectedCategory: string;
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ onSelectTemplate, selectedCategory }) => {
  const templates: Template[] = [
    {
      id: '1',
      name: 'Content Writer',
      description: 'Create engaging blog posts',
      template: 'Write a blog post about [topic] that is [tone] and targets [audience]. Include [specific elements].',
      category: 'creative',
      icon: '✍️'
    },
    {
      id: '2',
      name: 'Email Professional',
      description: 'Professional email templates',
      template: 'Write a [tone] email to [recipient] about [subject]. The email should be [length] and include [key points].',
      category: 'business',
      icon: '📧'
    },
    {
      id: '3',
      name: 'Code Helper',
      description: 'Programming assistance',
      template: 'Help me write [language] code that [functionality]. The code should be [requirements] and include [features].',
      category: 'technical',
      icon: '💻'
    },
    {
      id: '4',
      name: 'Marketing Copy',
      description: 'Persuasive marketing content',
      template: 'Create marketing copy for [product/service] that appeals to [target audience]. Focus on [benefits] and use [tone].',
      category: 'marketing',
      icon: '📢'
    },
    {
      id: '5',
      name: 'Academic Research',
      description: 'Research and analysis',
      template: 'Analyze [topic] from an academic perspective. Consider [aspects] and provide [type of analysis] with [sources].',
      category: 'academic',
      icon: '📚'
    },
    {
      id: '6',
      name: 'Creative Story',
      description: 'Creative writing prompts',
      template: 'Write a [genre] story about [main character] who [conflict]. The story should be [mood] and include [elements].',
      category: 'creative',
      icon: '📖'
    }
  ];

  const filteredTemplates = selectedCategory === 'general' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="font-medium text-gray-100 mb-4">Prompt Templates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.template)}
            className="p-4 rounded-xl border border-white/10 hover:border-accent-500 hover:bg-accent-500/10 transition-all duration-300 text-left backdrop-blur-sm bg-white/5 hover:bg-white/10"
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl">{template.icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm text-gray-100">{template.name}</div>
                <div className="text-xs text-gray-300 mt-1">{template.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptTemplates; 