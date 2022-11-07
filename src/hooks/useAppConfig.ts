import { useFusionContext } from '../core/FusionContext';
import { useCallback, useEffect, useState } from 'react';

/**
 * Public facing model for config.
 */
export type AppEnvironmentConfig<TConfig> = {
    environment: Partial<TConfig>;
    endpoints: { [key: string]: string };
};

/**
 * Configuration for an app.
 * The fetching prop will indicate that the config is loading from the api.
 * Tag is populated with whichever tag is requested from the hook.
 */
type AppConfig<T> = {
    isFetching: boolean;
    value: AppEnvironmentConfig<T> | null;
    tag?: string | null;
    error?: Error | null;
};

/**
 * Fetch config for the app stored in the portal.
 * The config can be updated by pushing to the config endpoint. /api/apps/{app-key}/config.
 *
 * Configs support pushing special configs to a tag. This config will live independently from the default config.
 * This can be used if introducing breaking changes.
 * The pipeline can push two configs, ex. default & v2.0. The app can then call the hook with useAppConfig("v2.0").
 * This will allow existing published apps to still use the default config, while the preview version can use the v2.0.
 * Default can be overridden when all versions are using the v2.0, and 2.0 can be deleted
 *
 * Config is returned as a Partial<TConfig>. This is to remind the consumer that the object returned from the API is not guaranteed to honor the specified ts type.
 * All nested config types should also think of the same issue, however this is not enforced by the framework.
 *
 * @param tag The tag for the config version, defaults to null (main config)
 * @returns App config element
 */
export const useAppConfig = <T>(tag?: string | null): AppConfig<T> => {
    const fusion = useFusionContext();

    const [config, setConfig] = useState<AppEnvironmentConfig<T> | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchConfigAsync = useCallback(
        async (tag?: string | null, cancellationToken?: AbortSignal) => {
            setIsFetching(true);
            setError(null);

            try {
                // Using the fusion context as a repository for configs, so we can cache values between usage.
                const config = await fusion.app.container.getConfigAsync(tag, cancellationToken);

                // Model should be safe to just cast. If the api model from the app container changes we might have to transform
                setConfig(config as AppEnvironmentConfig<T>);
            } catch (err) {
                // Track error
                fusion.logging.telemetry.trackException({ exception: err as Error });
                fusion.logging.telemetry.trackTrace({
                    message: `Could not load config for app ${
                        fusion.app.container.currentApp?.key
                    } @ tag ${tag}: ${(err as Error).message}`,
                });

                setConfig(null);
                setError(err as Error);
            } finally {
                setIsFetching(false);
            }
        },
        [fusion.app.container, fusion.logging.telemetry]
    );

    useEffect(() => {
        const cancellationSource = new AbortController();

        fetchConfigAsync(tag, cancellationSource.signal);

        return () => {
            cancellationSource.abort();
        };
    }, [tag, fusion.app.container, fetchConfigAsync]);

    return {
        isFetching: isFetching,
        tag,
        value: config,
        error,
    };
};

export default useAppConfig;
