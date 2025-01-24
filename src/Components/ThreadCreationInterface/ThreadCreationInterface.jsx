import { useState } from "react";
import "./ThreadCreationInterface.css";
import ThreadCreationDraftItem from "./ThreadCreationDraftItem";
import { useForm } from "react-hook-form";

const ThreadCreationInterface = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm();

  // Implement a solution using UUIds for the thread indicies

  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const [threadReplyIndices, setThreadReplyIndices] = useState([1]);

  const handleActivateThreadIndex = (index) => {
    setActiveThreadIndex(index);
  };

  const handleAddToThread = () => {
    const itemToAdd = threadReplyIndices.length + 1
    setThreadReplyIndices(prevIndices => [
        ...prevIndices,
        itemToAdd
    ])
  }

  

  // The first thread is not included in this, as it is a post



  return (
    <div className="image-popup-dark-overlay">
        {threadReplyIndices.map(index => (
            <p>{index}</p>
        ))}
      <div className="thread-creation-interface-popup-container">
        <ThreadCreationDraftItem
          isBasePost={true}
          index={0}
          register={register}
          activeThreadIndex={activeThreadIndex}
          handleAddToThread={handleAddToThread}
          handleActivateThreadIndex={handleActivateThreadIndex}
        />
        {threadReplyIndices.map((index) => (
          <ThreadCreationDraftItem
            key={index}
            index={index}
            isBasePost={false}
            register={register}
            activeThreadIndex={activeThreadIndex}
            handleActivateThreadIndex={handleActivateThreadIndex}
            handleAddToThread={handleAddToThread}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreadCreationInterface;
