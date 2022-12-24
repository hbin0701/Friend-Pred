import { useState, useCallback, useEffect } from "react";
import { useBetween } from "use-between";


const useRouter = () => {
    const [result, setResult] = useState({"output": ""});
    const [isLoading, setIsLoading] = useState(false);
    const [question1, setQuestion1] = useState([null, null]);
    const [question2, setQuestion2] = useState([null, null]);

    console.log(result)

    return {
      result,
      isLoading,
      question1,
      question2,
      setResult,
      setIsLoading,
      setQuestion1,
      setQuestion2
    };
  };
  
  // Make a custom hook for sharing your form state between any components
  export const useSharedRouter = () => useBetween(useRouter);
  