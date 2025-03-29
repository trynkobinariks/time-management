'use client';

import { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import ProjectCard from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const { projects } = useProjectContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingProject(null);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowAddForm(true);
  };

  const handleFormSuccess = () => {
    setShowAddForm(false);
    setEditingProject(null);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingProject(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-800">Projects</h1>
        <button
          onClick={handleAddClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleAddClick();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors active:bg-gray-600 touch-action-manipulation relative"
          aria-label="Add Project"
          role="button"
        >
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No projects yet. Add your first project to get started.</p>
          <button
            onClick={handleAddClick}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleAddClick();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors active:bg-gray-600 touch-action-manipulation z-20 relative"
            aria-label="Add Project"
            role="button"
          >
            Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEditClick={() => handleEditClick(project)}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={handleFormCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProjectForm
              project={editingProject || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
} 
