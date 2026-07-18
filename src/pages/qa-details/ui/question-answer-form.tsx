import type { FormEvent } from "react";
import { Textarea } from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";

export function QuestionAnswerForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}) {
  return (
    <Card className="rounded-[24px] border border-input">
      <CardHeader className="gap-2 p-6 pb-0">
        <CardTitle className="text-[24px] leading-[1.2] font-semibold">
          Добавить комментарий
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Поделитесь опытом, уточните деталь или оставьте полезный ответ.
        </CardDescription>
      </CardHeader>
      <CardContent className="!p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Textarea
            label="Комментарий"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="rounded-2xl border-foreground [&>textarea]:min-h-[160px] [&>textarea]:min-w-0 [&>textarea]:overflow-auto"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || !value.trim()}
              className="min-w-[180px]"
            >
              {isSubmitting ? "Отправка..." : "Отправить"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}