import { PageProps} from "rakkasjs";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/shadcn/ui/tabs";
import { LocalDBAuthForm } from "./components/LocalDBAuthForm";
import { RemoteDBAuthForm } from "./components/RemoteDBAuthForm";



export default function LoginPage({}: PageProps) {
  return (
    <div className="w-full flex items-center justify-center overflow-auto">
      <Tabs defaultValue="local" className="w-[90%] md:w-[70%] lg:w-[60%] py-10">
        <TabsList className="grid w-full h-full grid-cols-2 sticky top-0">
          <TabsTrigger value="local">Local</TabsTrigger>
          <TabsTrigger value="remote">Remote</TabsTrigger>
        </TabsList>
        <TabsContent value="local">
          <LocalDBAuthForm />
        </TabsContent>
        <TabsContent value="remote">
          <RemoteDBAuthForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}




