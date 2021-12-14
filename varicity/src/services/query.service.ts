export class QueryService {

    /**
     * Returns a query parameter by name.
     * @param name The name of the query parameter.
     */
    public static getQueryParam(name: string): string {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get(name);
    }
}
