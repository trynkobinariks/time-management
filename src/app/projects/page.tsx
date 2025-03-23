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
    setShowAddForm(false);
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
    <div className="container mx-auto px-4 py-8 relative">
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

      {showAddForm && (
        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-white relative z-20">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Add New Project</h2>
          <ProjectForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
        </div>
      )}

      {editingProject && (
        <div className="mb-8 p-4 border border-gray-200 rounded-md bg-white relative z-20">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Edit Project</h2>
          <ProjectForm
            project={editingProject}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {projects.length === 0 && !showAddForm && !editingProject ? (
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
    </div>
  );
} 