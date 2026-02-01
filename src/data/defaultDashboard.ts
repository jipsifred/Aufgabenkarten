/**
 * DEFAULT DASHBOARD DATA - SIMPLIFIED
 */

import { Folder, DashboardTask } from '../types';
import { DEFAULT_TASK_DATA } from './defaultTask';

export const DEFAULT_FOLDERS: Folder[] = [
  {
    id: 'exam-1',
    name: 'Klausur WS 2023/24',
    type: 'exam',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-2',
    name: 'Klausur SS 2023',
    type: 'exam',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'exam-3',
    name: 'Probeklausur 2024',
    type: 'exam',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'topic-1',
    name: 'Thermodynamik',
    type: 'topic',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'topic-2',
    name: 'Reaktionstechnik',
    type: 'topic',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'topic-3',
    name: 'Phasengleichgewichte',
    type: 'topic',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_TASKS: DashboardTask[] = [
  {
    id: 'task-1',
    taskData: DEFAULT_TASK_DATA,
    examFolderIds: ['exam-1'],
    topicFolderIds: ['topic-1', 'topic-3'],
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    taskData: {
      titel: 'Aufgabe 2: Isotherme Expansion eines idealen Gases',
      teilaufgaben: [
        {
          frage: 'Berechnung der Arbeit $W$',
          steps: [
            {
              title: 'Ansatz für isotherme Arbeit',
              origin: 'W = \\int_{V_1}^{V_2} p \\, dV',
              application: 'W = nRT \\ln\\left(\\frac{V_2}{V_1}\\right)',
              explanation: 'Für ein ideales Gas bei konstanter Temperatur kann das Integral analytisch gelöst werden.',
            },
          ],
        },
      ],
    },
    examFolderIds: ['exam-1', 'exam-2'],
    topicFolderIds: ['topic-1'],
    images: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    taskData: {
      titel: 'Aufgabe 5: Reaktorauslegung für exotherme Reaktion',
      teilaufgaben: [
        {
          frage: 'Verweilzeit $\\tau$ im CSTR',
          steps: [
            {
              title: 'Stoffbilanz für CSTR',
              origin: '0 = \\dot{n}_{ein} - \\dot{n}_{aus} + V \\cdot r',
              application: '\\tau = \\frac{c_{A0} - c_A}{r_A}',
              explanation: 'Die Verweilzeit ergibt sich aus der stationären Stoffbilanz.',
            },
          ],
        },
      ],
    },
    examFolderIds: ['exam-2'],
    topicFolderIds: ['topic-2'],
    images: [],
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_DASHBOARD_DATA = {
  folders: DEFAULT_FOLDERS,
  tasks: DEFAULT_TASKS,
};
