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

  const [activeThreadId, setActiveThreadId] = useState(1);

  // The first thread is not included in this, as it is a post

  const [threadItems, setThreadItems] = useState([{ id: 1 }, { id: uuidv4() }]);

  // Handle adding a new item to the thread.
  // If no insert id is found then the input is wrong, therefore an error should be provided and the function should stop
  // If the id is found, a new id is generated and inserted into the middle

  const handleAddToThread = (insertAfterId = null) => {
    if (!insertAfterId) {
      console.error("No insert after id provided");
      return;
    }

    setThreadItems((prevItems) => {
      const index = prevItems.findIndex((item) => item.id === insertAfterId);
      if (index === -1) {
        console.error("The insert after id cannot be found within the array");
        return prevItems;
      }
      const newReply = { id: uuidv4() };
      const newItems = [...prevItems];
      newItems.splice(index + 1, 0, newReply);
      return newItems;
    });
  };

  const handleActivateThreadId = (id) => {
    setActiveThreadId(id);
  };

  const onSubmit = () => {
    // Handle upload logic
  }

  return (
    <div className="image-popup-dark-overlay">
      <form onSubmit={handleSubmit(onSubmit)} className="thread-creation-interface-popup-container">
        {threadItems.map((item) => (
          <ThreadCreationDraftItem
            key={item.id}
            id={item.id}
            register={register}
            threadItems={threadItems}
            activeThreadId={activeThreadId}
            handleActivateThreadId={handleActivateThreadId}
            handleAddToThread={handleAddToThread}
          />
        ))}
      </form>
    </div>
  );
};

export default ThreadCreationInterface;
