import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";

export function TabsLine () {
  return (
    <Tabs defaultValue="new">
      <TabsList className="">
        <TabsTrigger value="new">Новое</TabsTrigger>
        <TabsTrigger value="popular">Популярное</TabsTrigger>
        <TabsTrigger value="unanswered">Вопросы без ответа</TabsTrigger>
        <TabsTrigger value="my-questions">Мои вопросы</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}