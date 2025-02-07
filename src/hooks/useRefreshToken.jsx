import { useEffect, useRef } from "react";
import { parseJwt } from "../utils/parseJwt";

const useTokenRefresh = (refreshTokenEndpoint, onTokenRefresh) => {
    const refreshTimeout = useRef(null)
}