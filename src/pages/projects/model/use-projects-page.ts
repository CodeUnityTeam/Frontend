import { useState } from "react";
import {
  useDeleteProject,
  useProject,
} from "@/entities/project";

export function useProjectsPage() {
  const [tab, setTab] = useState("catalog");
  const [search, setSearch] = useState("");

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  const [inviteModal, setInviteModal] = useState<{
    open: boolean;
    userId: string | null;
  }>({
    open: false,
    userId: null,
  });

  // ==========================
  // API
  // ==========================

  const { mutate: removeProject } = useDeleteProject();

  const { data: editProject } = useProject(editProjectId ?? undefined);

  // ==========================
  // Actions
  // ==========================

  const openCreateModal = () => {
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const openEditModal = (projectId: string) => {
    setEditProjectId(projectId);
  };

  const closeEditModal = () => {
    setEditProjectId(null);
  };

  const askDeleteProject = (projectId: string) => {
    setDeleteProjectId(projectId);
  };

  const closeDeleteModal = () => {
    setDeleteProjectId(null);
  };

  const confirmDeleteProject = () => {
    if (!deleteProjectId) return;

    removeProject(deleteProjectId);

    setDeleteProjectId(null);
  };

  const openInviteModal = (userId: string) => {
    setInviteModal({
      open: true,
      userId,
    });
  };

  const closeInviteModal = () => {
    setInviteModal({
      open: false,
      userId: null,
    });
  };

  return {
    // filters
    tab,
    setTab,

    search,
    setSearch,

    // create
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,

    // edit
    editProjectId,
    editProject,
    openEditModal,
    closeEditModal,

    // delete
    deleteProjectId,
    askDeleteProject,
    closeDeleteModal,
    confirmDeleteProject,

    // invite
    inviteModal,
    openInviteModal,
    closeInviteModal,
  };
}