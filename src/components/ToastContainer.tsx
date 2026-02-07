/**
 * ToastContainer Component - React Island
 * 
 * Wrapper for react-toastify notifications
 * Positioned bottom-right with RTL support
 */
import { ToastContainer as ReactToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastContainer() {
  return (
    <ReactToastContainer
      position="bottom-right"
      rtl
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}
