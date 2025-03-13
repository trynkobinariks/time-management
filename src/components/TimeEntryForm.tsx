'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';

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
        hours: parseFloat(formData.hours)
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }
  };
  
  return (
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
  );
} 