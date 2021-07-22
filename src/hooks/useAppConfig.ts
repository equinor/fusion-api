import { useFusionContext } from '../core/FusionContext';


export type AppEnvironmentConfig<TConfig> = {
    Environment: TConfig,
    Endpoints: { [key: string]: string; }
}


type AppConfig<T> = {
    isFetching: boolean,
    config: AppEnvironmentConfig<T> | null,
    tag?: string | null
}

const useAppConfig = <T>(tag?: string | null) : AppConfig<T> => {

    const fusionCtx = useFusionContext();
        
    const app = fusionCtx.app.container.currentApp?.key;

    if (tag) {
        console.log(`Fetching config default for app ${app}@${tag}`);
    } else {
        console.log(`Fetching config default for app ${app}`);
    }

    return {
        isFetching: false,
        tag,
        config: null
    }
}

export default useAppConfig;

