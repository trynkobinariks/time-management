'use client';

import { useState } from 'react';
import { useProjectContext } from '@/contexts/ProjectContext';
import ProjectCard from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import { Project } from '@/lib/types';
import { useClientTranslation } from '@/hooks/useClientTranslation';

export default function ProjectsPage() {
  const { projects } = useProjectContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { t } = useClientTranslation();

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-gray-800 dark:text-white">{t('projects.title')}</h1>
        <button
          onClick={handleAddClick}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleAddClick();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors active:bg-gray-600 touch-action-manipulation relative"
          aria-label={t('projects.addProject')}
          role="button"
        >
          {t('projects.addProject')}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">{t('projects.allProjects')}</h2>
        </div>

        {projects.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">{t('projects.noProjects')}</p>
            <button
              onClick={handleAddClick}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleAddClick();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer transition-colors active:bg-gray-600 touch-action-manipulation"
              aria-label={t('projects.addProject')}
              role="button"
            >
              {t('projects.addProject')}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {projects.map((project) => (
              <div key={project.id} className="px-6 py-4">
                <ProjectCard
                  project={project}
                  onEditClick={() => handleEditClick(project)}
                />
              </div>
            ))}

            <div className="px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-4">
                <span className="w-8"></span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('projects.totalProjects')}
                </span>
              </div>

              <div className="flex-1 mx-8"></div>

              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {projects.length} {projects.length === 1 ? t('projects.project') : t('projects.projects')}
                </span>
                <span className="w-16"></span>
              </div>
            </div>
          </div>
        )}
      </div>

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
