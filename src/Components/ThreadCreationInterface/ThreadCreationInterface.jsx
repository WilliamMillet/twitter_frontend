import { useState } from "react";
import "./ThreadCreationInterface.css";
import ThreadCreationDraftItem from "./ThreadCreationDraftItem";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const ThreadCreationInterface = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm();

  // Implement a solution using UUIds for the thread indicies

  const [activeThreadId, setActiveThreadId] = useState(0);
  const [threadReplies, setThreadReplies] = useState([
    {id: uuidv4()}
  ]);

  const handleAddToThread = (insertAfterId = null) => {
    const newReply = { id: uuidv4() };
    if (!insertAfterId) {
      setThreadReplies((prevReplies) => [...prevReplies, newReply]);
    } else {
      setThreadReplies((prevReplies) => {
        const index = prevReplies.findIndex((reply) => reply.id === insertAfterId);
        if (index === -1) return prevReplies;
        const newReplies = [...prevReplies];
        newReplies.splice(index + 1, 0, newReply);
        return newReplies;
      });
    }
  };

  const handleActivateThreadId = (id) => {
    setActiveThreadId(id);
  };


  

  // The first thread is not included in this, as it is a post



  return (
    <div className="image-popup-dark-overlay">
      <div className="thread-creation-interface-popup-container">
        <ThreadCreationDraftItem
          isBasePost={true}
          id={0}
          register={register}
          activeThreadId={activeThreadId}
          handleAddToThread={handleAddToThread}
          handleActivateThreadId={handleActivateThreadId}
        />
        {threadReplies.map(reply => (
          <ThreadCreationDraftItem
            key={reply.id}
            id={reply.id}
            isBasePost={false}
            register={register}
            activeThreadId={activeThreadId}
            handleActivateThreadId={handleActivateThreadId}
            handleAddToThread={handleAddToThread}
          />
        ))}
      </div>
    </div>
  );
};

export default ThreadCreationInterface;
