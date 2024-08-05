import { useRecoilState } from "recoil";
import { $Server, $Token } from "@/store";
import { useEffect, useState } from "react";

export const useCheckToken = () => {
  const [$server] = useRecoilState($Server);
  const [$token] = useRecoilState($Token);
  const [res, setRes] = useState([]);
  useEffect(() => {
    if ($token) {
      setRes(true);
      //   axios
      //     .get(`${Server_Url}/php/index.php/api/projects/status`, {
      //       headers: {
      //         Authorization: `Bearer ${token}`,
      //       },
      //     })
      //     .then((res) => {
      //       setRes(res.data.data);
      //       status = res.data.data;
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //     });
    } else {
      setRes(false);
    }
  }, []);
  return res;
};
