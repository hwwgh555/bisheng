export interface Menu {
  id: number;
  title: string;
  active: boolean;
}

export interface MenuItemProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

const Index = (props: MenuItemProps) => {
  const { active, onClick, title } = props;
  const basicClassNames =
    "group w-[148px] first:mt-0 mt-[1px] hover:bg-indigo-100  px-4 py-[9px] cursor-pointer rounded-lg";

  return (
    <div
      className={basicClassNames + (active ? " bg-indigo-100" : "")}
      onClick={onClick}
    >
      <div className={"text-sm" + (active ? " text-blue-500" : "")}>
        {title}
      </div>
    </div>
  );
};

export default Index;
