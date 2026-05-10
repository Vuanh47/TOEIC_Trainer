export const vocabProgressStore = {
  completedModules: new Set<number>(),
  markCompleted: (moduleId: number) => {
    vocabProgressStore.completedModules.add(moduleId);
  },
  isCompleted: (moduleId: number) => {
    return vocabProgressStore.completedModules.has(moduleId);
  }
};
