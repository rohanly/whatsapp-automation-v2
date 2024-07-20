import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { counterState, squaredState } from "@/atoms/example";
import { Button } from "@/components/ui/button";
import { pb } from "@/lib/pocketbase";
// import { useLoaderData } from "react-router-dom";

const HomePage: React.FC = () => {
  const [counter, setCounter] = useRecoilState(counterState);
  const squared = useRecoilValue(squaredState);

  useEffect(() => {
    const fetchData = async () => {
      const authData = await pb.admins.authWithPassword(
        "rohanopdev@gmail.com",
        "rohanB@3011"
      );

      // after the above you can also access the auth data from the authStore
      console.log(authData);

      const records = await pb.collection("todos").getFullList({
        sort: "-created",
      });
      console.log(records);
    };

    fetchData();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="font-bold text-4xl">Home Page</h1>
      <Button onClick={() => setCounter((prev) => prev + 1)}>+</Button>
      <span>Count : {counter}</span>
      <span> Squared : {squared}</span>
      <Button onClick={() => setCounter((prev) => prev - 1)}>-</Button>
    </div>
  );
};

export default HomePage;
