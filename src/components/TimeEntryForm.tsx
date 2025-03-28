'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import VoiceTimeEntry from './VoiceTimeEntry';
import { ParsedTimeEntry } from '@/lib/aiParser';

interface TimeEntryFormProps {
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TimeEntryForm({ projectId, onSuccess, onCancel }: TimeEntryFormProps) {
  const { projects, timeEntries, addTimeEntry } = useProjectContext();
  
  const [formData, setFormData] = useState({
    project_id: projectId || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: '',
    description: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleVoiceData = (parsedData: ParsedTimeEntry) => {
    // Find the project ID from the project name
    const projectMatch = projects.find(p => 
      p.name.toLowerCase() === parsedData.project_name.toLowerCase()
    );
    
    if (projectMatch) {
      setFormData({
        project_id: projectMatch.id,
        date: parsedData.date,
        hours: parsedData.hours.toString(),
        description: parsedData.description,
      });
      
      // Clear any existing errors
      setErrors({});
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.project_id) {
      newErrors.project_id = 'Please select a project';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      // Check weekly hours limit
      const entryDate = new Date(formData.date);
      const weekStart = startOfWeek(entryDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      
      const weekEntries = timeEntries.filter(entry => {
        const date = new Date(entry.date);
        return date >= weekStart && date <= weekEnd;
      });
      
      const weeklyHours = weekEntries.reduce((sum, entry) => sum + entry.hours, 0);
      const newHours = parseFloat(formData.hours) || 0;
      const totalHours = weeklyHours + newHours;
      
      if (totalHours > 40) {
        newErrors.hours = `Adding ${newHours}h would exceed the 40h weekly limit (${weeklyHours.toFixed(1)}h used)`;
      }
    }
    
    if (!formData.hours) {
      newErrors.hours = 'Hours are required';
    } else {
      const hours = parseFloat(formData.hours);
      if (isNaN(hours) || hours <= 0) {
        newErrors.hours = 'Hours must be a positive number';
      } else if (hours > 24) {
        newErrors.hours = 'Hours cannot exceed 24 per day';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addTimeEntry({
        project_id: formData.project_id,
        date: formData.date,
        hours: parseFloat(formData.hours),
        description: formData.description
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="project_id" className="block text-sm font-medium text-gray-700 mb-1">
            Project
          </label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            disabled={!!projectId}
            className={`w-full rounded-md border ${
              errors.project_id ? 'border-gray-400' : 'border-gray-300'
            } px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer`}
          >
            <option value="">Select a project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.project_id && (
            <p className="mt-1 text-sm text-gray-700">{errors.project_id}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full rounded-md border ${
              errors.date ? 'border-gray-400' : 'border-gray-300'
            } px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-gray-700">{errors.date}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
            Hours
          </label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
            step="0.25"
            min="0.25"
            max="24"
            className={`w-full rounded-md border ${
              errors.hours ? 'border-gray-400' : 'border-gray-300'
            } px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500`}
            placeholder="0.0"
          />
          {errors.hours && (
            <p className="mt-1 text-sm text-gray-700">{errors.hours}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="Describe what you worked on..."
          />
        </div>
        
        <div>
          <button 
            type="button" 
            onClick={() => setShowVoiceInput(!showVoiceInput)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
            {showVoiceInput ? 'Hide Voice Input' : 'Use Voice Input'}
          </button>
          
          {showVoiceInput && (
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <VoiceTimeEntry onDataCapture={handleVoiceData} />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors"
          >
            Save Time Entry
          </button>
        </div>
      </form>
    </div>
  );
} 