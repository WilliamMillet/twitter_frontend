import LeftSidebar from "../../Components/LeftSidebar/LetftSidebar";
import RightSidebar from "../../Components/RightSidebar/RightSidebar";

const StandardLayout = ({ children, extendedVersion = false, doubleViewHeightCenterGridItem = false}) => {
  return (
    <div className={`${extendedVersion ? 'triple-grid-extended' : 'triple-grid'}`}>
      <LeftSidebar />
      <main className={`center-grid-item ${doubleViewHeightCenterGridItem ? 'two-hundred-vh' : ''}`}>{children}</main>
      {!extendedVersion && <RightSidebar />}
    </div>
  );
};

export default StandardLayout;
