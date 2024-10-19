"use client";

import { store } from "@/store";
import { Provider } from "react-redux";
import SendForm from "@/components/SendForm";

const Page = () => {
  return (
    <Provider store={store}>
      <SendForm />
    </Provider>
  );
};

export default Page;
