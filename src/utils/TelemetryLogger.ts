import {
    ApplicationInsights,
    ITelemetryItem,
    IEventTelemetry,
    IPageViewTelemetry,
    IExceptionTelemetry,
    ITraceTelemetry,
    IDependencyTelemetry,
} from '@microsoft/applicationinsights-web';
import { useFusionContext } from '../core/FusionContext';
import { useEffect } from 'react';
import { IAuthContainer } from '../auth/AuthContainer';

export type TelemetryInitializer = (item: ITelemetryItem) => void | boolean;

export default class TelemetryLogger {

    private internalAppInsights: ApplicationInsights;
    private initializers: TelemetryInitializer[] = [];

    constructor(instrumentationKey: string, authContainer: IAuthContainer) {
        this.internalAppInsights = new ApplicationInsights({
            config: {
                instrumentationKey,
            },
        });

        this.internalAppInsights.loadAppInsights();
        this.trackPageView();

        this.internalAppInsights.addTelemetryInitializer(this.telemetryInitializer);
        this.setAuthUserContextAsync(authContainer);
    }

    registerInitializer(initializer: TelemetryInitializer) {
        this.initializers = [...this.initializers, initializer];
        return () => {
            this.initializers = this.initializers.filter(i => i !== initializer);
        };
    }

    trackEvent(event: IEventTelemetry) {
        this.internalAppInsights.trackEvent(event);
    }

    trackException(exception: IExceptionTelemetry) {
        this.internalAppInsights.trackException(exception);
    }

    trackPageView(pageView?: IPageViewTelemetry) {
        this.internalAppInsights.trackPageView(pageView);
    }

    trackTrace(trace: ITraceTelemetry) {
        this.internalAppInsights.trackTrace(trace);
    }

    trackDependency(dependency: IDependencyTelemetry) {
        this.internalAppInsights.trackDependencyData(dependency);
    }

    private telemetryInitializer = (item: ITelemetryItem) => {
        for (const initializer of this.initializers) {
            if (initializer(item) === false) {
                return false;
            }
        }

        // Run default initializers last to prevent other initializers to override cloud role etc.
        this.runDefaultInitializers(item);
    };

    private async setAuthUserContextAsync(authContainer: IAuthContainer) {
        const currentUser = await authContainer.getCachedUserAsync();

        if (currentUser) {
            this.internalAppInsights.setAuthenticatedUserContext(currentUser.id);
        }
    }

    private runDefaultInitializers(item: ITelemetryItem) {
        this.addCloudRole(item);
    }

    private addCloudRole(item: ITelemetryItem) {
        item.tags = item.tags || [];
        item.tags['ai.cloud.role'] = 'Fusion Frontend';
        item.tags['ai.cloud.roleInstance'] = 'Portal';
    }
}

export const useTelemetryLogger = () => {
    const {
        logging: { telemetry },
    } = useFusionContext();
    return telemetry;
};

export const useTelemetryInitializer = (initializer: TelemetryInitializer) => {
    const telemetryLogger = useTelemetryLogger();

    useEffect(() => {
        return telemetryLogger.registerInitializer(initializer);
    }, [initializer]);
};
