'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { formatDate } from '@/lib/utils';

interface TimeEntryFormProps {
  projectId?: string;
  date?: Date;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TimeEntryForm({ 
  projectId, 
  date = new Date(), 
  onSuccess, 
  onCancel 
}: TimeEntryFormProps) {
  const { projects, addTimeEntry } = useProjectContext();
  
  const [formData, setFormData] = useState({
    projectId: projectId || '',
    date: formatDate(date),
    hours: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }
    
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    
    if (!formData.hours) {
      newErrors.hours = 'Please enter hours';
    } else {
      const hours = parseFloat(formData.hours);
      if (isNaN(hours) || hours <= 0) {
        newErrors.hours = 'Hours must be a positive number';
      } else if (hours > 24) {
        newErrors.hours = 'Hours cannot exceed 24';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      addTimeEntry({
        projectId: formData.projectId,
        date: new Date(formData.date),
        hours: parseFloat(formData.hours),
        notes: formData.notes,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
          Project
        </label>
        <select
          id="projectId"
          name="projectId"
          value={formData.projectId}
          onChange={handleChange}
          className={`w-full rounded-md border ${
            errors.projectId ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500`}
        >
          <option value="">Select a project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {errors.projectId && (
          <p className="mt-1 text-sm text-red-600">{errors.projectId}</p>
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
            errors.date ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500`}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
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
            errors.hours ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500`}
          placeholder="0.00"
        />
        {errors.hours && (
          <p className="mt-1 text-sm text-red-600">{errors.hours}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="What did you work on?"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Save Entry
        </button>
      </div>
    </form>
  );
} 