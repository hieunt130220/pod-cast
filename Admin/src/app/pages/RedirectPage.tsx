import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const RedirectPage = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      navigate("/users");
    } else {
      navigate("/login");
    }
  }, []);
  return <></>;
};

export default RedirectPage;
