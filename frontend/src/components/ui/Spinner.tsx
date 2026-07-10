
import { ClipLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <ClipLoader size={50} />
    </div>
  );
};

export default Spinner;