'use client';

import React from 'react';
import { Project, ProjectType } from '../lib/types';
import { useProjectContext } from '../contexts/ProjectContext';
import { useClientTranslation } from '../hooks/useClientTranslation';
import Badge from './Badge';
import { useDeleteConfirmation } from './ui/DeleteConfirmationProvider';

interface ProjectCardProps {
  project: Project;
  onEditClick: () => void;
}

export default function ProjectCard({
  project,
  onEditClick,
}: ProjectCardProps) {
  const { deleteProject } = useProjectContext();
  const { t } = useClientTranslation();
  const { showDeleteConfirmation } = useDeleteConfirmation();

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleDeleteClick = () => {
    showDeleteConfirmation({
      title: t('projects.popup.delete'),
      message: `${t('projects.popup.deleteConfirmation')} "${project.name}"?`,
      onConfirm: handleDelete,
    });
  };

  const getBadgeVariant = () => {
    if (project.type === ProjectType.INTERNAL) {
      return 'internal';
    }
    return 'commercial';
  };

  return (
    <div className="p-4 sm:pl-6 relative min-h-24">
      <div className="absolute top-2 right-2 flex flex-col space-y-1">
        <button
          onClick={onEditClick}
          className="p-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full cursor-pointer transition-colors"
          aria-label="Edit project"
          title="Edit project"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </button>
        <button
          onClick={handleDeleteClick}
          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full cursor-pointer transition-colors"
          aria-label="Delete project"
          title="Delete project"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
      <div className="flex justify-between items-start pr-12">
        <div>
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: project.color || '#374151' }}
            />
            <h3 className="text-sm font-medium text-[var(--text-primary)]">
              {project.name}
            </h3>
            <div className="ml-2">
              <Badge
                variant={getBadgeVariant()}
                label={
                  project.type === ProjectType.INTERNAL
                    ? t('projects.popup.typeInternal') || 'Internal'
                    : t('projects.popup.typeCommercial') || 'Commercial'
                }
              />
            </div>
          </div>
          {project.description && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {project.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
