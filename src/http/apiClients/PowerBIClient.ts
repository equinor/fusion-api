import PbiGroup from './models/powerbi/PowerBIGroup';
import PbiDashboard from './models/powerbi/PowerBIDashboard';
import PbiReport from './models/powerbi/PowerBIReport';
import ApiError from './models/powerbi/PowerBIError';
import AuthToken from '../../auth/AuthToken';
import BaseApiClient from './BaseApiClient';

interface IReportItem {
    [groupId: string]: PbiReport[];
}

interface IDashboardItem {
    [groupId: string]: PbiDashboard[];
}

export default class PowerBIClient extends BaseApiClient {
    private groups: PbiGroup[] = [];
    private reports: IReportItem = {};
    private dashboards: IDashboardItem = {};
    private powerBiToken: string = '';

    private async getPowerBITokenAsync(): Promise<string> {
        if (this.powerBiToken && AuthToken.parse(this.powerBiToken).isValid())
            return this.powerBiToken;

        const url = this.resourceCollections.fusion.token(
            'https://analysis.windows.net/powerbi/api'
        );

        const response = await this.httpClient.getAsync<string, any>(url, null, r => r.text());
        this.powerBiToken = response.data;
        return response.data;
    }

    async getGroupsAsync() {
        if (this.groups.length) return this.groups;

        const options = await this.buildRequestOptionsWithToken();
        const response = await fetch(this.resourceCollections.powerBI.groups(), options);
        this.groups = await this.handleResponse(response);
        return this.groups;
    }

    async getReportsAsync(groupId: string) {
        const cached = this.reports[groupId];
        if (cached) return cached;

        const options = await this.buildRequestOptionsWithToken();
        const response = await fetch(this.resourceCollections.powerBI.reports(groupId), options);
        this.reports[groupId] = await this.handleResponse(response);
        return this.reports[groupId];
    }

    async getDashboardsAsync(groupId: string) {
        const cached = this.dashboards[groupId];
        if (cached) return cached;

        const options = await this.buildRequestOptionsWithToken();
        const response = await fetch(this.resourceCollections.powerBI.dashboards(groupId), options);

        this.dashboards[groupId] = await this.handleResponse(response);
        return this.dashboards[groupId];
    }

    private async handleResponse(response: Response) {
        if (response.ok) {
            const json = await response.json();
            return json.value;
        } else if (response.status === 401 || response.status === 403) {
            throw new ApiError(response.status, 'No access');
        } else {
            throw new ApiError(
                response.status,
                `Something unexpected went wrong. ${response.statusText}`
            );
        }
    }

    private async buildRequestOptionsWithToken(bearerToken?: string) {
        if (!bearerToken) {
            bearerToken = await this.getPowerBITokenAsync();
        }

        return {
            headers: {
                Authorization: `Bearer ${bearerToken}`,
            },
        };
    }
}
