import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

const ToastProvider = ({ children }) => {
  const [toastVisibility, setToastVisibility] = useState("hidden");
  const [toastText, setToastText] = useState("");
  const [toastColor, setToastColor] = useState({
    color: "",
    backgroundColor: "",
  });

  const toggleToast = (textToDisplay, textBgColor, textColor) => {
    setToastVisibility("visible");
    setToastText(textToDisplay);
    setToastColor({
      color: textColor,
      backgroundColor: textBgColor,
    });
    setTimeout(() => setToastVisibility("hidden"), 2000);
  };

  return (
    <ToastContext.Provider
      value={{ toggleToast, toastVisibility, toastText, toastColor }}
    >
      {children}
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

export { ToastProvider, useToast };
