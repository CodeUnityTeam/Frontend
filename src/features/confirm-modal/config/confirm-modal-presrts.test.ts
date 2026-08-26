import { describe, expect, it } from "vitest";

import { confirmModalPresets } from "./confirm-modal-presrts";

describe("confirmModalPresets", () => {
  it("provides complete close-form confirmation copy", () => {
    expect(confirmModalPresets.closeForm).toEqual({
      icon: "ph:warning-octagon",
      title: "Закрыть форму?",
      description: "Это действие приведёт к безвозвратному удалению всех несохранённых изменений",
      confirmText: "Закрыть",
      cancelText: "Отменить",
    });
  });

  it("provides complete destructive project-deletion copy", () => {
    expect(confirmModalPresets.deleteProject).toEqual({
      icon: "ph:trash",
      title: "Удалить проект?",
      description: "Это действие приведёт к безвозвратному удалению всей информации о проекте",
      confirmText: "Удалить",
      cancelText: "Отменить",
    });
  });
});
