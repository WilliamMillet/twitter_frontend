import { useState } from "react";

// The useFetchData is a resusable utility for fetching data from API's while managing loading and error states

// includeAuth determines whether or not a JSON Web Token should be used for authentication

// Bodies will be stringified in the fetchUserData function, so there is no need to stringify bodies parsed as an argument

const useFetchData = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem("jsonwebtoken")) || null;

  // 'Options' are ways of applying headers to the fetch request without having to provide these headers in full (Although some are just headers). These currently include:
  // includeAuth - This expects a boolean value that will lead to this hook dealing with the JWT 
  // contentType - This allows you to add a content type

  // The callback param allows you to invoke callbacks given certain conditions. There is an onSuccess, onError and onFinally paramter that can be passed

  const fetchData = async (url, method, options = {}, body = null, callbacks = {}) => {
    setLoading(true);
    setError(null);

    const { onSuccess, onError, onFinally } = callbacks;

    try {
      // Begin building headers
      // Default content type is application/json


      const headers = {
        "Content-Type": options.contentType || "application/json",
      };

      if (options?.includeAuth) {
        if (!token) {
          throw new Error("Missing or invalid token in localStorage");
        }
        headers["Authorization"] = `Bearer ${token}`;
      }

      let requestBody = null

      if (headers['Content-Type'] === 'application/json' && body) {
        requestBody = JSON.stringify(body)
      } else {
        requestBody = body 
      }

      // Perform the fetch



      const response = await fetch(url, {
        method,
        headers,
        body: requestBody
      });

      // Go to catch statement if an invalid status code is found

      if (!response.ok)
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      
      let data = null

      if (response.headers.get("Content-Type")?.includes("application/json")) {
        data = await response.json();
      }
      
      setSuccess(true);
      setResponse(data);
      if (onSuccess) onSuccess(data);
    } catch (err) {
      setSuccess(false);
      console.error("Error fetching data:", err);
      if (onError) onError(err);
      setError(err.message);
    } finally {
      setLoading(false);
      if (onFinally) onFinally();
    }
  };

  return { response, error, loading, success, fetchData };
};

export default useFetchData;

