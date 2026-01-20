import { createContext, useContext, useState } from "react";
import { Toast } from "../components/Toast/Toast";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children, ...props }) => {
  const [messages, setMessages] = useState([]);

  const removeMessage = (key) =>
    setMessages((arr) => arr.filter((m) => m.key !== key));

  return (
    <ToastContext.Provider
      value={{
        addMessage(message) {
          setMessages((arr) => [...arr, message]);
        },
      }}
    >
      {children}
      {messages.map((m) => (
        <Toast
          key={m.key}
          message={m}
          onExited={() => removeMessage(m.key)}
          {...props}
        />
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const { addMessage } = useContext(ToastContext);

  const show = (message, options) => {
    addMessage({ message, ...options, key: new Date().getTime() });
  };

  return {
    show,
    info(message) {
      show(message, { severity: "info" });
    },
    success(message) {
      show(message, { severity: "success" });
    },
    warning(message) {
      show(message, { severity: "warning" });
    },
    error(message) {
      show(message, { severity: "error" });
    },
  };
};
