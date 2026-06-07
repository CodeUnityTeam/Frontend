export const confirmModalPresets = {
  closeForm: {
    icon: "ph:warning-octagon",
    title: "Закрыть форму?",
    description:
      "Это действие приведёт к безвозвратному удалению всех несохранённых изменений",
    confirmText: "Закрыть",
    cancelText: "Отменить",
  },

  deleteProject: {
    icon: "ph:trash",
    title: "Удалить проект?",
    description:
      "Это действие приведёт к безвозвратному удалению всей информации о проекте",
    confirmText: "Удалить",
    cancelText: "Отменить",
  },
} as const;