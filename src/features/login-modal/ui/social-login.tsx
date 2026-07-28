import { Button } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/icon";
import { 
  useYandexAuthUrl, 
  useMailRuAuthUrl 
} from "@/entities/auth";

export function SocialLogin() {
  const { mutate: getYandexUrl, isPending: isYandexPending } = useYandexAuthUrl();
  const { mutate: getMailRuUrl, isPending: isMailRuPending } = useMailRuAuthUrl();

  const handleYandexLogin = () => {
    getYandexUrl();
  };

  const handleMailRuLogin = () => {
    getMailRuUrl();
  };
  
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
          onClick={handleYandexLogin}
          disabled={isYandexPending}
          className="p-0 transition-opacity hover:opacity-80 [&_svg]:size-8"
        >
          <Icon name="yandex" size={32} />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Войти через Mail.ru"
          onClick={handleMailRuLogin}
          disabled={isMailRuPending}
          className="p-0 transition-opacity hover:opacity-80 [&_svg]:size-8"
        >
          <Icon name="mail-ru" size={32} />
        </Button>

      </div>
    </div>
  );
}
