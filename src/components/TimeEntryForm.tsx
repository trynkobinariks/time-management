'use client';

import React, { useState, useEffect } from 'react';
import { useProjectContext } from '@/contexts/ProjectContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { TimeEntry } from '@/lib/types';

interface TimeEntryFormProps {
  projectId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  editingEntry?: TimeEntry | null;
}

export default function TimeEntryForm({ projectId, onSuccess, onCancel, editingEntry }: TimeEntryFormProps) {
  const { projects, timeEntries, addTimeEntry, updateTimeEntry } = useProjectContext();
  
  const [formData, setFormData] = useState({
    project_id: projectId || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: '',
    description: '',
  });
  
  useEffect(() => {
    if (editingEntry) {
      setFormData({
        project_id: editingEntry.project_id,
        date: editingEntry.date,
        hours: editingEntry.hours.toString(),
        description: editingEntry.description || '',
      });
    }
  }, [editingEntry]);
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        if (editingEntry) {
          await updateTimeEntry({
            ...editingEntry,
            project_id: formData.project_id,
            date: formData.date,
            hours: parseFloat(formData.hours),
            description: formData.description,
          });
        } else {
          await addTimeEntry({
            project_id: formData.project_id,
            date: formData.date,
            hours: parseFloat(formData.hours),
            description: formData.description,
          });
        }
        
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Failed to save time entry:', error);
        
        // Show user-friendly error
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to save time entry. Please try again.';
          
        setErrors(prev => ({
          ...prev,
          submit: errorMessage
        }));
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {editingEntry ? 'Edit Time Entry' : 'Log Time'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project_id" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Project
            </label>
            <select
              id="project_id"
              name="project_id"
              value={formData.project_id}
              onChange={handleChange}
              disabled={!!projectId}
              className={`w-full rounded-md border ${
                errors.project_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer`}
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.project_id}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full rounded-md border ${
                errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 cursor-pointer`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.date}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
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
                errors.hours ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500`}
              placeholder="0.0"
            />
            {errors.hours && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.hours}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full rounded-md border ${
                errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500`}
              placeholder="What did you work on?"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-100 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {editingEntry ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
