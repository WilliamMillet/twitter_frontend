import LeftSidebar from "../../Components/LeftSidebar/LetftSidebar";
import RightSidebar from "../../Components/RightSidebar/RightSidebar";

const StandardLayout = ({ children, extendedVersion = false }) => {
  return (
    <div className={`${extendedVersion ? 'triple-grid-extended' : 'triple-grid'}`}>
      <LeftSidebar />
      <main className="center-grid-item">{children}</main>
      {!extendedVersion && <RightSidebar />}
    </div>
  );
};

export default StandardLayout;
