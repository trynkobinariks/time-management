'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import { Project } from '@/lib/types';

// Project color palette - modern, accessible colors
const PROJECT_COLORS = [
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
  '#A855F7', // Purple
  '#06B6D4', // Cyan
];

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({ project, onSuccess, onCancel }: ProjectFormProps) {
  const { addProject, updateProject } = useProjectContext();
  
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    weeklyHoursAllocation: project?.weeklyHoursAllocation?.toString() || '',
    color: project?.color || PROJECT_COLORS[0],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  
  const handleColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    if (!formData.weeklyHoursAllocation) {
      newErrors.weeklyHoursAllocation = 'Weekly hours allocation is required';
    } else {
      const hours = parseFloat(formData.weeklyHoursAllocation);
      if (isNaN(hours) || hours <= 0) {
        newErrors.weeklyHoursAllocation = 'Hours must be a positive number';
      } else if (hours > 168) { // 24 * 7 = 168 hours in a week
        newErrors.weeklyHoursAllocation = 'Hours cannot exceed 168 per week';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        weeklyHoursAllocation: parseFloat(formData.weeklyHoursAllocation),
        color: formData.color,
      };
      
      if (project) {
        // Update existing project
        updateProject({
          ...project,
          ...projectData,
        });
      } else {
        // Add new project
        addProject(projectData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full rounded-md border ${
            errors.name ? 'border-gray-400' : 'border-gray-300'
          } px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500`}
          placeholder="Enter project name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-gray-700">{errors.name}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500"
          placeholder="Describe the project"
        />
      </div>
      
      <div>
        <label htmlFor="weeklyHoursAllocation" className="block text-sm font-medium text-gray-700 mb-1">
          Weekly Hours Allocation
        </label>
        <input
          type="number"
          id="weeklyHoursAllocation"
          name="weeklyHoursAllocation"
          value={formData.weeklyHoursAllocation}
          onChange={handleChange}
          step="0.5"
          min="0.5"
          max="168"
          className={`w-full rounded-md border ${
            errors.weeklyHoursAllocation ? 'border-gray-400' : 'border-gray-300'
          } px-3 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500`}
          placeholder="0.0"
        />
        {errors.weeklyHoursAllocation && (
          <p className="mt-1 text-sm text-gray-700">{errors.weeklyHoursAllocation}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          For example, 20 hours = 0.5 FTE (based on 40-hour work week)
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Color
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                formData.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
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
          {project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
} 