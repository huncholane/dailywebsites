import React from "react";

type Props = {
  children: React.ReactNode;
};

const Skeleton = (props: Props) => {
  return (
    <div className="h-screen w-screen fixed flex">
      <div className="w-96 h-screen bg-neutral-900 text-white">sidebar</div>
      <div className="w-full h-full flex flex-col">
        <div className="p-3 h-full">{props.children}</div>
      </div>
    </div>
  );
};

export default Skeleton;
