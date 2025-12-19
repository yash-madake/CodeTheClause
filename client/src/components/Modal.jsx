import { Fragment } from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Fragment>
      <div className="fixed inset-0 z-40 bg-black opacity-50"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
        <div className="relative w-auto max-w-lg mx-auto my-6">
          <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
            <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={onClose}
              >
                <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            <div className="relative flex-auto p-6">{children}</div>
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
              <button
                className="px-6 py-2 text-sm font-bold text-red-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                type="button"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Modal;
