import React, {useEffect, useRef, useState} from "react";
import getApi from '../api/axios.ts';

export interface ApiData {
    data: any
    loaded: boolean
    error: boolean | Error
    setData: React.Dispatch<any>
}

export default function useApi(path: string, method: string, payload?: any): ApiData {
    const [data, setData] = useState(undefined as any | undefined);
    const [error, setError] = useState(false as boolean | Error);

    const isLoaded = useRef(false);

    useEffect(() => {
        isLoaded.current = false;
        console.log({path, method});
        (getApi() as any)[method](path, payload)
            .then((res: any) => {
                setData(res.data);
                setError(false)
                isLoaded.current = true;
            })
            .catch((e: Error) => {
                console.log(e)
                setData(null)
                setError(e);
                isLoaded.current = true;
            })
    }, [path, method, payload]);

    return {loaded: isLoaded.current, data: isLoaded.current ? data : undefined, error, setData};
}