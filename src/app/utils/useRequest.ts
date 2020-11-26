import useSWR, { ConfigInterface, responseInterface } from 'swr'
import { AxiosResponse, AxiosError } from 'axios'

declare type fetcherFn<Data> = (...args: any) => Data | Promise<Data>

interface Return<Data, Error>
    extends Pick<responseInterface<AxiosResponse<Data>, AxiosError<Error>>, 'isValidating' | 'revalidate' | 'error' | 'mutate'> {
    data: AxiosResponse<Data> | undefined
}

interface Request<Data> {
    key: string
    fetcher?: fetcherFn<AxiosResponse<Data>>
    initialData?: Data | {}
}



export interface Config<Data = unknown, Error = unknown> extends Omit<ConfigInterface<AxiosResponse<Data>, AxiosError<Error>>, 'initialData'> {
    initialData?: unknown
}

export default function useRequest<Data = unknown, Error = unknown>(request: Request<Data>): Return<Data, Error> {
    const { data, error, isValidating, revalidate, mutate } = useSWR<AxiosResponse<Data>, AxiosError<Error>>(
        request.key,
        request.fetcher,
        request.initialData
    )

    return {
        data,
        error,
        isValidating,
        revalidate,
        mutate
    }
}
