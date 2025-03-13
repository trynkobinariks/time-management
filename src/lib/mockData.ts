import { DailyLimit, Project, TimeEntry, WeeklyLimit } from './types';
import { formatDate, getWeekStartDate } from './utils';

// Helper to create dates relative to today
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const weekStartDate = getWeekStartDate(today);

// Mock projects
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Redesigning the company website with new branding',
    color: '#3B82F6', // Blue
    weeklyHoursAllocation: 20, // 0.5 FTE
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Building a new mobile app for clients',
    color: '#10B981', // Green
    weeklyHoursAllocation: 10, // 0.25 FTE
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    name: 'Client Support',
    description: 'Providing support to existing clients',
    color: '#F59E0B', // Amber
    weeklyHoursAllocation: 5, // 0.125 FTE
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03'),
  },
  {
    id: '4',
    name: 'Internal Training',
    description: 'Training sessions for team members',
    color: '#EC4899', // Pink
    weeklyHoursAllocation: 5, // 0.125 FTE
    createdAt: new Date('2023-01-04'),
    updatedAt: new Date('2023-01-04'),
  },
];

// Mock time entries
export const mockTimeEntries: TimeEntry[] = [
  // Website Redesign entries
  {
    id: '101',
    projectId: '1',
    date: twoDaysAgo,
    hours: 4,
    notes: 'Worked on wireframes',
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
  },
  {
    id: '102',
    projectId: '1',
    date: yesterday,
    hours: 6,
    notes: 'Implemented homepage design',
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: '103',
    projectId: '1',
    date: today,
    hours: 3,
    notes: 'Client meeting and revisions',
    createdAt: today,
    updatedAt: today,
  },
  
  // Mobile App Development entries
  {
    id: '201',
    projectId: '2',
    date: twoDaysAgo,
    hours: 2,
    notes: 'API integration',
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
  },
  {
    id: '202',
    projectId: '2',
    date: yesterday,
    hours: 1,
    notes: 'Bug fixes',
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: '203',
    projectId: '2',
    date: today,
    hours: 3,
    notes: 'New feature implementation',
    createdAt: today,
    updatedAt: today,
  },
  
  // Client Support entries
  {
    id: '301',
    projectId: '3',
    date: yesterday,
    hours: 1,
    notes: 'Troubleshooting client issues',
    createdAt: yesterday,
    updatedAt: yesterday,
  },
  {
    id: '302',
    projectId: '3',
    date: today,
    hours: 1.5,
    notes: 'Client calls',
    createdAt: today,
    updatedAt: today,
  },
];

// Mock daily limits
export const mockDailyLimits: DailyLimit[] = [
  {
    id: '1',
    date: new Date(formatDate(today)),
    maxHours: 8,
    createdAt: today,
    updatedAt: today,
  },
  {
    id: '2',
    date: new Date(formatDate(tomorrow)),
    maxHours: 6, // Reduced hours for tomorrow
    createdAt: today,
    updatedAt: today,
  },
];

// Mock weekly limit
export const mockWeeklyLimits: WeeklyLimit[] = [
  {
    id: '1',
    weekStartDate: weekStartDate,
    maxHours: 40,
    createdAt: weekStartDate,
    updatedAt: weekStartDate,
  },
]; 