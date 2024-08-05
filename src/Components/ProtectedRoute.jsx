import { useCheckToken } from "@/customHooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute(props) {
  const navigate = useNavigate();
  const check = useCheckToken();
  useEffect(() => {
    if (!check) {
      navigate(props.route);
    }
  }, [check, navigate, props.route]);

  return check ? props.component : null;
}
