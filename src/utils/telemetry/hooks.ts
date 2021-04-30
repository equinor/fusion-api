import { useEffect, useMemo } from 'react';
import { Observable } from 'rxjs';
import { useFusionContext } from '../../core/FusionContext';
import { TelemetryInitializer } from './TelemetryLogger';
import { TelemetryObserver } from './TelemetryObserver';

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

export const useTelemetryObserver = <C>(
    name: string,
    context$: Observable<C>
): TelemetryObserver => {
    const telemetry = useTelemetryLogger();
    return useMemo(() => new TelemetryObserver(name, context$, telemetry), [name, context$]);
};

export default { useTelemetryLogger, useTelemetryInitializer, useTelemetryObserver };
