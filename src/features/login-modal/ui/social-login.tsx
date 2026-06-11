import { Icon } from "@/shared/ui/icon";

export function SocialLogin() {
  return (
    <div className="mt-8 flex w-full flex-col items-center gap-2.5">
      <p className="w-full border-b border-primary pb-3 text-center text-[18px] text-foreground">
        Войдите через
      </p>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Войти через Яндекс"
          onClick={() => alert("Раздел в разработке")}
          className="flex cursor-pointer transition-opacity hover:opacity-80"
        >
          <Icon name="yandex" size={32} />
        </button>

        <button
          type="button"
          aria-label="Войти через Почту"
          onClick={() => alert("Раздел в разработке")}
          className="flex cursor-pointer transition-opacity hover:opacity-80"
        >
          <Icon name="mail-ru" size={32} />
        </button>
      </div>
    </div>
  );
}
