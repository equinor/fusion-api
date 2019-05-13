import React, { useContext, FC } from "react";
import { Route, RouteProps, Link, LinkProps, Switch, SwitchProps } from "react-router-dom";
import { Location, LocationDescriptor } from "history";
import AppContext, { IAppContext } from "./AppContext";
import combineUrls from "../utils/combineUrls";

const createAppPath = (appContext: IAppContext, location: LocationDescriptor<any>): string => {
    return combineUrls("/apps", appContext.appKey, location.toString());
};

const createLocationDescriptorFromContext = (appContext: IAppContext): Location<null> => ({
    pathname: appContext.appPath,
    search: "",
    state: null,
    hash: "",
    key: "",
});

/**
 * Create a route scoped to the current app
 * E.g <AppRoute path="/foo" /> will match the url /apps/current-app/foo
 * @param props 
 */
const AppRoute: FC<RouteProps> = props => {
    const appContext = useContext(AppContext);

    if (!appContext || !appContext.appKey) {
        return null;
    }

    const paths = Array.isArray(props.path) ? props.path : [props.path as string];
    const scopedPaths = paths.map(path => createAppPath(appContext, path));

    return (
        <Route {...props} path={scopedPaths}>
            {props.children}
        </Route>
    );
};

/**
 * Create a link scoped to the current app
 * E.g <AppLink to="/foo" /> will match the url /apps/current-app/foo
 * @param props 
 */
const AppLink: FC<LinkProps> = props => {
    const appContext = useContext(AppContext);

    if (!appContext || !appContext.appKey) {
        return null;
    }

    return (
        <Link {...props} to={createAppPath(appContext, props.to)}>
            {props.children}
        </Link>
    );
};

/**
 * Create a route switch scoped to the current app
 * E.g <AppSwitch><AppRoute path="foo" /></AppSwitch> will scope to the path /apps/current-app/*
 * @param props 
 */
const AppSwitch: FC<SwitchProps> = props => {
    const appContext = useContext(AppContext);

    if (!appContext || !appContext.appKey) {
        return null;
    }

    return (
        <Switch {...props} location={createLocationDescriptorFromContext(appContext)}>
            {props.children}
        </Switch>
    );
};

export { AppRoute, AppLink, AppSwitch };
