import { useRef } from "react";
import type { FormEvent, ChangeEvent, Dispatch, SetStateAction } from "react";
import { Icon } from "@iconify/react";
import { Textarea } from "@/shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { useUploadQuestionFile } from "@/entities/question";
import type { QuestionAnswerImage} from "@/entities/question";

export function QuestionAnswerForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  images,
  onImagesChange,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  images: QuestionAnswerImage[];
  onImagesChange: Dispatch<SetStateAction<QuestionAnswerImage[]>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);                        

  const { mutateAsync: uploadFile } = useUploadQuestionFile();

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const data = await uploadFile(file);

        return {
          image_url: data.imageUrl,
          original_name: data.originalName,
          file_size: data.fileSize,
          mime_type: data.mimeType,
        };
      }),
    );

    onImagesChange((prev) => [
      ...prev,
      ...uploadedImages,
    ]);

    event.target.value = "";
  };
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

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((image) => (
                <div key={image.image_url} className="relative">
                  <img
                    src={image.image_url}
                    alt={image.original_name}
                    className="h-28 w-28 rounded-xl object-cover"
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={() =>
                      onImagesChange((prev) =>
                        prev.filter((i) => i.image_url !== image.image_url),
                      )
                    }
                  >
                    <Icon icon="ph:x" className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => inputRef.current?.click()}
            >
              <Icon icon="ph:image-square" height={24} />
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />
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