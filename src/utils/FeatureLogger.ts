import uuid from 'uuid';
import DistributedState from './DistributedState';
import { IEventHub } from './EventHub';
import ApiClients from '../http/apiClients';
import {
    FeatureLogBatch,
    FeatureLogEntryRequest,
} from '../http/apiClients/models/fusion/FeatureLogEntryRequest';
import { useFusionContext } from '../core/FusionContext';
import fusionConsole from './fusionConsole';

type FeatureLogEntryTransformer = (entry: FeatureLogEntry) => FeatureLogEntry;

type FeatureContext = {
    id: string;
    name: string;
};

export type FeatureLogEntry = {
    appKey?: string | null;
    contextId?: string | null;
    contextName?: string | null;
    feature: string;
    featureVersion: string;
    payload?: any;
    metadata: { [key: string]: any };
    dateTimeUtc: Date;
    url: string | null;
};

const getSessionId = () => {
    const FUSION_SESSION_ID = 'FUSION_SESSION_ID';
    const existingSessionId = sessionStorage.getItem(FUSION_SESSION_ID);

    if (existingSessionId) {
        return existingSessionId;
    }

    const newSessionId = uuid.v4();
    sessionStorage.setItem(FUSION_SESSION_ID, newSessionId);
    return newSessionId;
};

export default class FeatureLogger {
    protected sessionId: string = getSessionId();

    protected logEntries: FeatureLogEntry[] = [];
    protected currentAppKey: DistributedState<string | null>;
    protected currentContext: DistributedState<FeatureContext | null>;
    protected transformers: DistributedState<FeatureLogEntryTransformer[]>;

    constructor(protected apiClients: ApiClients, eventHub: IEventHub) {
        this.currentAppKey = new DistributedState<string | null>(
            'FeatureLogger.currentAppKey',
            null,
            eventHub
        );
        this.currentContext = new DistributedState<FeatureContext | null>(
            'FeatureLogger.currentContext',
            null,
            eventHub
        );
        this.transformers = new DistributedState<FeatureLogEntryTransformer[]>(
            'FeatureLogger.transformers',
            [
                entry => this.addAppToLogEntry(entry),
                entry => this.addContextToLogEntry(entry),
                entry => this.addScreenToLogEntry(entry),
            ],
            eventHub
        );
    }

    public log(feature: string, featureVersion: string, payload?: any) {
        const entry: FeatureLogEntry = this.transformLogEntry({
            feature,
            featureVersion,
            payload,
            dateTimeUtc: new Date(),
            metadata: {},
            url: window.location.href,
        });

        this.logEntries = [...this.logEntries, entry];

        this.scheduleBatch();
    }

    public addTransformer(transformer: FeatureLogEntryTransformer) {
        this.transformers.state = [...this.transformers.state, transformer];
    }

    public setCurrentApp(appKey: string | null) {
        this.currentAppKey.state = appKey;
    }

    public setCurrentContext(id: string | null, name: string | null) {
        if (id === null || name === null) {
            this.currentContext.state = null;
        } else {
            this.currentContext.state = { id, name };
        }
    }

    private timer: NodeJS.Timeout | null = null;
    protected scheduleBatch() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (this.logEntries.length >= 10) {
            this.sendBatchAsync();
            return;
        }

        this.timer = setTimeout(() => {
            this.sendBatchAsync();
        }, 5000);
    }

    protected isSendingBatch = false;
    protected async sendBatchAsync() {
        if (this.logEntries.length === 0) {
            return;
        }

        if (this.isSendingBatch) {
            return this.scheduleBatch();
        }

        this.isSendingBatch = true;

        const entries: FeatureLogEntryRequest[] = this.logEntries.map(entry => ({
            ...entry,
            appKey: entry.appKey || null,
            contextId: entry.contextId || null,
            contextName: entry.contextName || null,
            dateTimeUtc: entry.dateTimeUtc.toISOString(),
            payload: JSON.stringify(entry.payload),
            metadata: JSON.stringify(entry.metadata),
        }));

        const batch: FeatureLogBatch = {
            sessionId: this.sessionId,
            entries,
        };

        try {
            await this.apiClients.fusion.logFeaturesAsync(batch);
            this.logEntries = [];
            this.isSendingBatch = false;
            this.scheduleBatch();
        } catch (e) {
            fusionConsole.error(e);
            this.isSendingBatch = false;
        }
    }

    protected transformLogEntry(entry: FeatureLogEntry) {
        return this.transformers.state.reduce((entry, transformer) => transformer(entry), entry);
    }

    protected addAppToLogEntry(entry: FeatureLogEntry) {
        return {
            ...entry,
            appKey: this.currentAppKey.state,
        };
    }

    protected addContextToLogEntry(entry: FeatureLogEntry) {
        return {
            ...entry,
            contextId: this.currentContext.state?.id,
            contextName: this.currentContext.state?.name,
        };
    }

    protected addScreenToLogEntry(entry: FeatureLogEntry) {
        try {
            const screen = {
                availableWidth: window.screen.availWidth,
                availableHeight: window.screen.availHeight,
                width: window.innerWidth,
                height: window.innerHeight,
                orientation:
                    'orientation' in window.screen && window.screen.orientation
                        ? window.screen.orientation.type
                        : 'unknown',
            };

            return {
                ...entry,
                metadata: {
                    ...entry.metadata,
                    screen,
                },
            };
        } catch (e) {
            fusionConsole.error(e);
        }

        return entry;
    }
}

export const useFeatureLogger = () => {
    const {
        logging: { feature },
    } = useFusionContext();
    return feature;
};
