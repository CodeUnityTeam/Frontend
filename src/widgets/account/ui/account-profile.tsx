import React from "react";
import { Button } from "@/shared/ui/button";
import { Icon } from "@iconify/react";
import { EmptyState } from "@/widgets/account/ui/empty-state";
import avatarImg from "@/shared/assets/images/account-avatar.jpg";
import { accountData } from "@/widgets/account/model/account-data";
import type { AccountProfileProps } from "@/widgets/account/model/types";

export const AccountProfile = ({
  profile,
  skills,
  qualities,
  about,
  experience,
}: AccountProfileProps) => {
  const [tab, setTab] = React.useState<"profile" | "experience">("profile");
  const profileData = profile ?? {
    ...accountData.profile,
    avatar: accountData.profile.avatar || avatarImg,
  };

  const skillsData = skills && skills.length > 0 ? skills : accountData.skills;

  const qualitiesData =
    qualities && qualities.length > 0 ? qualities : accountData.qualities;

  const aboutData =
    about && about.trim().length > 0 ? about : accountData.about;

  const experienceData =
    experience && experience.length > 0 ? experience : accountData.experience;

  const hasProfileData =
    skillsData.length > 0 || qualitiesData.length > 0 || Boolean(aboutData);

  return (
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[413px_1fr]">
      <aside className="w-full rounded-[20px] border border-border bg-card px-5 py-6 sm:px-8 sm:pt-10 sm:pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Icon icon="mdi:star-outline" className="h-7 w-7" />
            <span className="text-[14px] leading-[140%] font-normal text-foreground">
              {profileData.rating?.toFixed(1)}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => alert("В разработке")}
            className="h-6 w-6 p-0"
          >
            <Icon
              icon="ph:pencil-simple-line"
              className="h-5 w-5 text-foreground"
            />
          </Button>
        </div>

        <div className="mt-1 flex flex-col items-center text-center">
          {profileData.avatar && (
            <img
              src={profileData.avatar || avatarImg}
              alt={profileData.name}
              className="h-32 w-32 rounded-full object-cover sm:h-45 sm:w-45"
            />
          )}

          {profileData.status && (
            <p className="mt-6 text-[16px] leading-[150%] text-muted-foreground">
              {profileData.status}
            </p>
          )}

          {profileData.name && (
            <h2 className="mt-2 text-[26px] leading-8 font-bold text-foreground">
              {profileData.name}
            </h2>
          )}

          {profileData.role && (
            <p className="mt-2 text-[18px] leading-[150%] text-foreground">
              {profileData.role}
            </p>
          )}

          {profileData.location && (
            <div className="mt-4 flex items-center gap-1 text-[16px] leading-[150%] text-muted-foreground">
              <Icon icon="mdi:map-marker" className="h-6 w-6" />
              <span>{profileData.location}</span>
            </div>
          )}
        </div>
      </aside>

      <main className="flex flex-col rounded-xl border border-border bg-card px-5 py-6 font-raleway sm:px-8 sm:pt-10 sm:pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setTab("profile")}
              className={`cursor-pointer pb-2 text-[18px] leading-[150%] ${
                tab === "profile"
                  ? "border-b border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Профиль
            </button>

            <button
              onClick={() => setTab("experience")}
              className={`cursor-pointer pb-2 text-[18px] leading-[150%] ${
                tab === "experience"
                  ? "border-b border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Опыт работы
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => alert("В разработке")}
            className="text-foreground hover:text-foreground"
          >
            <Icon icon="ph:pencil-simple-line" className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-5 flex flex-col divide-y divide-border *:py-6">
          {tab === "profile" && (
            <>
              {!hasProfileData ? (
                <div className="py-10">
                  <EmptyState title="Информации о пользователе пока нет" />
                </div>
              ) : (
                <>
                  {skillsData.length > 0 && (
                    <section>
                      <h3 className="mb-4 text-[18px] leading-[130%] font-semibold text-foreground">
                        Навыки и инструменты
                      </h3>

                      <div className="flex flex-wrap gap-1">
                        {skillsData.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-[16px] bg-[#D3E9F7] px-3 py-1 text-[13px] leading-[130%] text-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {qualitiesData.length > 0 && (
                    <section>
                      <h3 className="mb-5 text-[18px] leading-[130%] font-semibold text-foreground">
                        Личные качества
                      </h3>

                      <div className="flex flex-wrap gap-x-1 gap-y-2">
                        {qualitiesData.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-[16px] bg-[#D3E9F7] px-3 py-1 text-[13px] leading-[130%] text-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {aboutData && (
                    <section>
                      <h3 className="mb-5 text-[18px] leading-[130%] font-semibold text-foreground">
                        О себе
                      </h3>

                      <p className="text-[16px] leading-[150%] text-foreground">
                        {aboutData}
                      </p>
                    </section>
                  )}
                </>
              )}
            </>
          )}

          {tab === "experience" && (
            <>
              {!experienceData.length ? (
                <div className="py-10">
                  <EmptyState title="Информации о опыте работы пока нет" />
                </div>
              ) : (
                <>
                  {experienceData.map((item, i) => (
                    <section key={i}>
                      <h4 className="text-[20px] leading-[130%] font-semibold text-foreground">
                        {item.company}
                      </h4>

                      <div className="mt-4 text-[14px] leading-[100%] text-muted-foreground">
                        {item.from} — {item.to ?? "По настоящее время"}
                      </div>

                      <div className="mt-2 text-[16px] leading-[150%] text-foreground">
                        {item.position}
                      </div>

                      {item.responsibilities && (
                        <>
                          <div className="mt-6 text-[16px] leading-[150%] font-semibold text-foreground">
                            Обязанности
                          </div>

                          <p className="mt-2 text-[16px] leading-[150%] text-foreground">
                            {item.responsibilities}
                          </p>
                        </>
                      )}
                    </section>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};
