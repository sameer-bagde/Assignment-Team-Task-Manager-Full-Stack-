import { useNavigate } from "react-router-dom";

const Notfound: React.FC = () => {
  const navigate = useNavigate();
  function backToHome() {
    navigate("/account");
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-4xl font-bold mb-2 text-red-600">404</h2>
      <p className=" text-2xl text-grey-600 mb-2">The page does not exist.</p>
      <button
        className="text-green-600"
        id="backToHomeButton"
        onClick={backToHome}
      >
        Back to Home
      </button>
    </div>
  );
};
export default Notfound;
