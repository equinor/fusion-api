import BaseResourceCollection from "./BaseResourceCollection";

export default class DataProxyResourceCollection extends BaseResourceCollection {
    protected getBaseUrl(): string {
        return this.serviceResolver.getDataProxyBaseUrl();
    }

    handover(siteCode: string, projectIdentifier: string): string {
        return this.getSiteAndProjectUrl(siteCode, projectIdentifier, "handover");
    }

    handoverMcpkgs(siteCode: string, projectIdentifier: string, commpkgId: string): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/mcpkg/`
        );
    }

    handoverWorkOrders(siteCode: string, projectIdentifier: string, commpkgId: string): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/work-orders/`
        );
    }

    handoverUnsignedTasks(siteCode: string, projectIdentifier: string, commpkgId: string): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/unsigned-tasks/`
        );
    }

    handoverUnsignedActions(
        siteCode: string,
        projectIdentifier: string,
        commpkgId: string
    ): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/unsigned-actions/`
        );
    }

    handoverPunch(siteCode: string, projectIdentifier: string, commpkgId: string): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/punch/`
        );
    }

    handoverSWCR(siteCode: string, projectIdentifier: string, commpkgId: string): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/swcr/`
        );
    }

    handoverDetails(siteCode: string, projectIdentifier: string, commpkgId: string): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/details/`
        );
    }

    handoverNCR(siteCode: string, projectIdentifier: string, commpkgId: string): string {
        return this.getSiteAndProjectUrl(siteCode, projectIdentifier, `handover/${commpkgId}/ncr/`);
    }

    handoverQuery(siteCode: string, projectIdentifier: string, commpkgId: string): string {
        return this.getSiteAndProjectUrl(
            siteCode,
            projectIdentifier,
            `handover/${commpkgId}/query/`
        );
    }
}
