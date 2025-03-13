'use client';

import React, { useState } from 'react';
import { useProjectContext } from '@/lib/ProjectContext';
import ProjectForm from '@/components/ProjectForm';

export default function Projects() {
  const { projects, deleteProject } = useProjectContext();
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? All time entries associated with this project will also be deleted.')) {
      deleteProject(projectId);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage your projects and their weekly hour allocations
          </p>
        </div>
        
        <button
          onClick={() => setShowAddProject(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          Add Project
        </button>
      </div>
      
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first project to start tracking time
          </p>
          <button
            onClick={() => setShowAddProject(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weekly Hours
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map(project => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="h-8 w-8 rounded-full mr-3" 
                        style={{ backgroundColor: project.color }}
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {project.weeklyHoursAllocation} hours
                      <span className="text-xs text-gray-500 ml-1">
                        ({(project.weeklyHoursAllocation / 40 * 100).toFixed(0)}% FTE)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 line-clamp-2">
                      {project.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingProject(project.id)}
                      className="text-primary-600 hover:text-primary-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Project</h2>
            <ProjectForm 
              onSuccess={() => setShowAddProject(false)}
              onCancel={() => setShowAddProject(false)}
            />
          </div>
        </div>
      )}
      
      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Project</h2>
            <ProjectForm 
              project={projects.find(p => p.id === editingProject)!}
              onSuccess={() => setEditingProject(null)}
              onCancel={() => setEditingProject(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 