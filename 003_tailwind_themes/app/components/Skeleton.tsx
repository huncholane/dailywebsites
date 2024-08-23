import React from "react";

type Props = {
  children: React.ReactNode;
};

const Skeleton = (props: Props) => {
  return (
    <div className="h-screen w-screen flex fixed">
      <div className="w-64 h-full flex flex-col bg-background-dark">
        Sidebar
      </div>
      <div className="h-full w-full flex flex-col">
        <div className="h-28 w-full bg-background-dark text-primary">
          Header
        </div>
        <div className="w-full h-full overflow-auto">
          <div className="min-h-full flex flex-col justify-between">
            <div className="p-2">{props.children}</div>
            <div className="h-28 bg-background-dark">Footer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
