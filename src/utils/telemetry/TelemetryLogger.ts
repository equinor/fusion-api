import {
    ApplicationInsights,
    ITelemetryItem,
    IEventTelemetry,
    IPageViewTelemetry,
    IExceptionTelemetry,
    ITraceTelemetry,
    IDependencyTelemetry,
    IMetricTelemetry,
} from '@microsoft/applicationinsights-web';
import { IAuthContainer } from '../../auth/AuthContainer';

export type TelemetryInitializer = (item: ITelemetryItem) => void | boolean;

export class TelemetryLogger {
    private isInitialized = false;
    private readonly internalAppInsights: ApplicationInsights;

    get telemetry(): ApplicationInsights {
        return this.internalAppInsights;
    }

    private initializers: TelemetryInitializer[] = [];

    constructor(instrumentationKey: string, authContainer: IAuthContainer) {
        this.internalAppInsights = new ApplicationInsights({
            config: {
                instrumentationKey,
            },
        });

        this.initializeAppInsights(instrumentationKey, authContainer);
    }

    registerInitializer(initializer: TelemetryInitializer) {
        this.initializers = [...this.initializers, initializer];
        return () => {
            this.initializers = this.initializers.filter((i) => i !== initializer);
        };
    }

    trackEvent(event: IEventTelemetry) {
        if (!this.isInitialized) {
            return;
        }

        this.internalAppInsights.trackEvent(event);
    }

    trackException(exception: IExceptionTelemetry) {
        if (!this.isInitialized) {
            return;
        }

        this.internalAppInsights.trackException(exception);
    }

    trackPageView(pageView?: IPageViewTelemetry) {
        if (!this.isInitialized) {
            return;
        }

        this.internalAppInsights.trackPageView(pageView);
    }

    trackTrace(trace: ITraceTelemetry) {
        if (!this.isInitialized) {
            return;
        }

        this.internalAppInsights.trackTrace(trace);
    }

    trackMetric(metrics: IMetricTelemetry) {
        if (!this.isInitialized) {
            return;
        }

        this.internalAppInsights.trackMetric(metrics);
    }

    trackDependency(dependency: IDependencyTelemetry) {
        if (!this.isInitialized) {
            return;
        }

        this.internalAppInsights.trackDependencyData(dependency);
    }

    private initializeAppInsights(instrumentationKey: string, authContainer: IAuthContainer) {
        if (!instrumentationKey) {
            return;
        }

        this.internalAppInsights.loadAppInsights();
        this.internalAppInsights.addTelemetryInitializer(this.telemetryInitializer);
        this.setAuthUserContextAsync(authContainer);
        this.trackPageView();
        this.isInitialized = true;
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

export default TelemetryLogger;
