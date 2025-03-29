'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { useProjectContext } from '@/lib/ProjectContext';

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
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: project.color || '#374151' }}
            />
            <div>
              <h3 className="text-base font-medium text-gray-800">{project.name}</h3>
            </div>
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
        )}

        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div className="flex space-x-3">
            <button
              onClick={onEditClick}
              className="text-sm text-gray-700 hover:text-gray-900 font-medium cursor-pointer transition-colors"
            >
              Edit Project
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 cursor-pointer transition-colors p-1 rounded-full hover:bg-red-50"
              aria-label="Delete project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Project</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete &ldquo;{project.name}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
