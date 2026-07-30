import { Icon } from "@iconify/react";

import { useRole } from "@/entities/profile";
import { ProjectModal } from "@/features/project-modal";
import { InviteUserModal } from "@/features/invite-user";
import { useIsAuthed } from "@/shared/lib/auth";
import { Button } from "@/shared/ui/button";
import {
  AlertModal,
  AlertModalAction,
  AlertModalCancel,
  AlertModalDescription,
  AlertModalFooter,
  AlertModalHeader,
  AlertModalTitle,
} from "@/shared/ui/modal/alert-modal";
import { PageContainer } from "@/shared/ui/page-container";
import {
  FiltersBar,
  FiltersMobile,
  FiltersProvider,
  FiltersSidebar,
  SortMobile,
} from "@/widgets/filters";
import { FilterTabs, projectTabs } from "@/widgets/filter-tabs";
import { ProjectsCatalog } from "@/widgets/projects-catalog";
import { Search } from "@/widgets/search";

import { useProjectsPage } from "./model/use-projects-page";
import { PeopleList } from "./ui/people-list";
import { PeopleResponsesList } from "./ui/people-responses-list";
import { ProjectsGridSkeleton } from "./ui/projects-grid-skeleton";
import { ProjectsList } from "./ui/projects-list";
import { ProjectsResponsesList } from "./ui/projects-responses-list";

function ProjectsPage() {
  const isAuthed = useIsAuthed();
  const { role, isRolePending } = useRole();
  const isEmployer = role === "employer";

  const {
    activeTab,
    status,
    setTab,

    search,
    setSearch,

    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,

    editProjectId,
    editProject,
    openEditModal,
    closeEditModal,

    deleteProjectId,
    askDeleteProject,
    closeDeleteModal,
    confirmDeleteProject,

    inviteModal,
    // inviteProjects,
    openInviteModal,
    closeInviteModal,
  } = useProjectsPage(isEmployer, isAuthed);

  const visibleTabs = isAuthed
    ? projectTabs
    : projectTabs.filter((item) => item.value === "catalog");

  return (
    <FiltersProvider>
      <PageContainer className="py-8">
        <Search
          onSearch={setSearch}
          placeholder="Поиск проектов и команд"
        />

        <div className="mb-6 flex items-center justify-between gap-4 md:hidden">
          <FiltersMobile />
          <SortMobile />
        </div>

        <FiltersBar className="mb-6 hidden md:flex" />

        <div className="md:flex md:items-start md:gap-5">
          <FiltersSidebar className="hidden md:flex" />

          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <FilterTabs
                items={visibleTabs}
                value={activeTab}
                onValueChange={setTab}
              />

              {activeTab === "my-projects" && isEmployer && (
                <>
                  <Button
                    variant="ghost"
                    type="button"
                    className="hidden h-auto shrink-0 p-0 text-[18px] font-semibold md:flex"
                    onClick={openCreateModal}
                  >
                    Создать проект
                    <Icon icon="ph:plus-circle" />
                  </Button>

                  <Button
                    variant="ghost"
                    type="button"
                    size="icon"
                    className="shrink-0 md:hidden"
                    aria-label="Создать проект"
                    onClick={openCreateModal}
                  >
                    <Icon icon="ph:plus-circle" />
                  </Button>
                </>
              )}
            </div>

            {isRolePending ? (
              <ProjectsGridSkeleton />
            ) : (
              <ProjectsCatalog
                tab={activeTab}
                catalog={
                  isEmployer ? (
                    <PeopleList
                      search={search}
                      onInvite={openInviteModal}
                    />
                  ) : (
                    <ProjectsList search={search} status={status} />
                  )
                }
                favorites={
                  isEmployer ? (
                    <PeopleList
                      search={search}
                      favourites
                      emptyTitle="В избранном пусто"
                      emptyDescription="Добавляйте специалистов в избранное — нажимайте на сердечко в карточке."
                      onInvite={openInviteModal}
                    />
                  ) : (
                    <ProjectsList
                      search={search}
                      favourites
                      status={status}
                      emptyTitle="В избранном пусто"
                      emptyDescription="Добавляйте проекты в избранное — нажимайте на сердечко в карточке."
                    />
                  )
                }
                responses={
                  isEmployer ? (
                    <PeopleResponsesList />
                  ) : (
                    <ProjectsResponsesList />
                  )
                }
                myProjects={
                  <ProjectsList
                    search={search}
                    status={status}
                    myProject
                    isOwner={isEmployer}
                    showResponseButton={false}
                    emptyTitle={
                      isEmployer
                        ? "У вас пока нет проектов"
                        : "Вы пока не участвуете ни в одном проекте"
                    }
                    emptyDescription={
                      isEmployer
                        ? "Создайте проект — он появится здесь."
                        : "После того как вас примут в проект, он появится здесь."
                    }
                    onEdit={isEmployer ? openEditModal : undefined}
                    onDelete={isEmployer ? askDeleteProject : undefined}
                  />
                }
              />
            )}
          </div>
        </div>

        <ProjectModal
          open={isCreateModalOpen}
          onOpenChange={(open) => !open && closeCreateModal()}
          mode="create"
        />

        <ProjectModal
          open={Boolean(editProjectId)}
          onOpenChange={(open) => !open && closeEditModal()}
          mode="edit"
          project={editProject}
        />

        <InviteUserModal
          open={inviteModal.open}
          onOpenChange={(open) => !open && closeInviteModal()}
          userId={inviteModal.userId}
        />

        <AlertModal
          open={Boolean(deleteProjectId)}
          onOpenChange={(open) => !open && closeDeleteModal()}
        >
          <AlertModalHeader className="gap-2">
            <Icon
              icon="ph:trash"
              className="size-16 text-foreground"
            />

            <AlertModalTitle>
              Удалить проект?
            </AlertModalTitle>

            <AlertModalDescription className="text-base">
              Это действие приведёт к безвозвратному удалению всей информации о
              проекте
            </AlertModalDescription>
          </AlertModalHeader>

          <AlertModalFooter>
            <AlertModalAction onClick={confirmDeleteProject}>
              Удалить
            </AlertModalAction>

            <AlertModalCancel>Отменить</AlertModalCancel>
          </AlertModalFooter>
        </AlertModal>
      </PageContainer>
    </FiltersProvider>
  );
}

export const Component = ProjectsPage;