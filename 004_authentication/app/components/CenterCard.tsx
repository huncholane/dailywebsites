import React from "react";

type Props = {
  children?: React.ReactNode;
};

const Card = (props: Props) => {
  return (
    <div className="h-full flex flex-col justify-center">
      <div className="w-96 p-8 h-5/6 border shadow-md">{props.children}</div>
    </div>
  );
};

export default Card;
