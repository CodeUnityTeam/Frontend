import { Icon } from "@iconify/react";
import { useCallback, type ReactNode } from "react";
import {
  useLikePerson,
  type Person,
} from "@/entities/profile";
import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Tag } from "@/shared/ui/tag";

type PersonCardProps = {
  person: Person;

  badge?: ReactNode;

  subtitle?: ReactNode;

  footer?: ReactNode;
};

export function PersonCard({
  person,
  badge,
  subtitle,
  footer,
}: PersonCardProps) {
  const { mutate: toggleLike } = useLikePerson();

  const {
    userId,
    firstName,
    lastName,
    avatarUrl,
    specializations,
    skills,
    city,
    isLiked,
  } = person;

  const handleLike = useCallback(() => {
    toggleLike({
      userId,
      liked: !isLiked,
    });
  }, [toggleLike, userId, isLiked]);

  const fullName = `${firstName} ${lastName}`.trim();

  const initials =
    `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  const specs = specializations
    .map((item) => item.name)
    .join(", ");

  return (
    <div className="flex h-full flex-col rounded-lg border border-border p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        {badge ?? <span />}

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLike}
          aria-label={
            isLiked
              ? "Убрать из избранного"
              : "Добавить в избранное"
          }
        >
          <Icon
            icon={
              isLiked
                ? "ph:heart-straight-fill"
                : "ph:heart-straight"
            }
            className={cn(
              "text-xl",
              isLiked && "text-primary",
            )}
          />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Avatar className="size-12">
          <AvatarImage
            src={avatarUrl || undefined}
            alt={fullName}
          />

          <AvatarFallback>
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <h2 className="truncate text-[18px] font-semibold">
            {fullName}
          </h2>

          {specs && (
            <p className="truncate text-[14px] text-muted-foreground">
              {specs}
            </p>
          )}
        </div>
      </div>

      {subtitle && (
        <div className="mt-2">
          {subtitle}
        </div>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        {skills.map((skill) => (
          <Tag
            key={skill.skillId}
            label={skill.name}
            className="rounded-2xl bg-(--secondary-button) text-[13px] font-normal"
          />
        ))}
      </div>

      <div className="mt-4 flex grow flex-col justify-end gap-4">
        {city && (
          <div className="flex items-center gap-1 text-[14px]">
            <Icon
              icon="ph:map-pin"
              className="text-xl text-muted-foreground"
            />
            <span className="truncate">{city}</span>
          </div>
        )}

        {footer}
      </div>
    </div>
  );
}