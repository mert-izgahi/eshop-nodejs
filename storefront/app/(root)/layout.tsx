import { RootFooter } from "@/components/layouts/root-footer";
import RootHeader from "@/components/layouts/root-header";
import * as React from "react";

const Layout: React.FC = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="min-h-screen flex-col flex gap-4">
      <RootHeader />
      <main className="flex-1">{children}</main>
      <RootFooter />
    </div>
  );
};

export default Layout;
