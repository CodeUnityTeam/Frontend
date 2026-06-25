import { Button } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";

export function SocialLogin() {
  return (
    <div className="mt-8 flex w-full flex-col items-center gap-2.5">
      <p className="w-full border-b border-primary pb-3 text-center text-[18px] text-foreground">
        Войдите через
      </p>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Войти через Яндекс"
          onClick={() => alert("Раздел в разработке")}
          className="p-0 transition-opacity hover:opacity-80 [&_svg]:size-8"
        >
          <Icon name="yandex" size={32} />
        </Button>

      </div>
    </div>
  );
}
