'use client';

import React, { useState } from 'react';
import { useProjectContext } from '../contexts/ProjectContext';
import { Project, ProjectType } from '../lib/types';
import { useClientTranslation } from '../hooks/useClientTranslation';

// Project color palette - modern, accessible colors
const PROJECT_COLORS = [
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#84CC16', // Lime
];

interface ProjectFormProps {
  project?: Project;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProjectForm({
  project,
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const { addProject, updateProject } = useProjectContext();
  const { t } = useClientTranslation();

  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    type: project?.type || ProjectType.INTERNAL,
    color: project?.color || PROJECT_COLORS[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
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
      newErrors.name = t('projects.popup.errors.nameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color || undefined,
        type: formData.type,
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
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1 cursor-pointer"
        >
          {t('projects.popup.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full rounded-md border ${
            errors.name ? 'border-red-500' : 'border-[var(--card-border)]'
          } px-3 py-2 text-[var(--text-primary)] bg-[var(--card-background)] focus:outline-none focus:ring-1 focus:ring-[var(--card-border)] cursor-text`}
          placeholder={t('projects.popup.namePlaceholder')}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1 cursor-pointer"
        >
          {t('projects.popup.description')}
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-md border border-[var(--card-border)] px-3 py-2 text-[var(--text-primary)] bg-[var(--card-background)] focus:outline-none focus:ring-1 focus:ring-[var(--card-border)] cursor-text"
          placeholder={t('projects.popup.descriptionPlaceholder')}
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-[var(--text-primary)] mb-1 cursor-pointer"
        >
          {t('projects.popup.type') || 'Project Type'}
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="type"
              value={ProjectType.INTERNAL}
              checked={formData.type === ProjectType.INTERNAL}
              onChange={handleChange}
              className="sr-only"
            />
            <span
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                formData.type === ProjectType.INTERNAL
                  ? 'bg-blue-600 text-white'
                  : 'bg-[var(--card-background)] text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              {t('projects.popup.typeInternal') || 'Internal'}
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="type"
              value={ProjectType.EXTERNAL}
              checked={formData.type === ProjectType.EXTERNAL}
              onChange={handleChange}
              className="sr-only"
            />
            <span
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                formData.type === ProjectType.EXTERNAL
                  ? 'bg-blue-600 text-white'
                  : 'bg-[var(--card-background)] text-[var(--text-primary)] border border-[var(--card-border)]'
              }`}
            >
              {t('projects.popup.typeCommercial') || 'Commercial'}
            </span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1 cursor-pointer">
          {t('projects.popup.color')}
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                formData.color === color
                  ? 'border-[var(--text-primary)] scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--card-background)] border border-[var(--card-border)] rounded-md hover:bg-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--card-border)] cursor-pointer"
        >
          {t('projects.popup.cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
        >
          {project ? t('projects.popup.update') : t('projects.popup.create')}
        </button>
      </div>
    </form>
  );
}
