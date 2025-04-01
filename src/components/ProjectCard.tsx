'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { useProjectContext } from '@/contexts/ProjectContext';

interface ProjectCardProps {
  project: Project;
  onEditClick: () => void;
}

export default function ProjectCard({ project, onEditClick }: ProjectCardProps) {
  const { deleteProject } = useProjectContext();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center">
          <div
            className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
            style={{ backgroundColor: project.color || '#374151' }}
          />
          <h3 className="text-sm font-medium text-[var(--text-primary)]">
            {project.name}
          </h3>
        </div>
        {project.description && (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {project.description}
          </p>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onEditClick}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-border)] rounded-full cursor-pointer transition-colors"
          aria-label="Edit project"
          title="Edit project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full cursor-pointer transition-colors"
          aria-label="Delete project"
          title="Delete project"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[var(--card-background)] rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4">Delete Project</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete &ldquo;{project.name}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--card-background)] border border-[var(--card-border)] rounded-md hover:bg-[var(--card-border)] focus:outline-none focus:ring-2 focus:ring-[var(--card-border)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
